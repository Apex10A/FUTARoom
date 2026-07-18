"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Video, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FUTA_AREAS } from "@/lib/constants/areas";
import { LISTING_VIDEO_ACCEPT } from "@/lib/constants/listing-media";
import {
  AMENITY_OPTIONS,
  LISTABLE_ROOM_TYPES,
} from "@/lib/constants/amenities";
import { createOwnerListing } from "@/lib/listings/create-owner-listing";
import {
  fetchExistingProperties,
  getExistingPropertyTemplate,
  type ExistingPropertyOption,
} from "@/lib/listings/existing-properties";
import {
  type CreateListingFormData,
  type CreateListingStep,
  summarizeListing,
  validateBasicsStep,
  validateDetailsStep,
  validateMediaStep,
} from "@/lib/validations/listing-form";
import { formatNaira } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const STEPS: { id: CreateListingStep; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "media", label: "Media" },
  { id: "review", label: "Review" },
];

const EMPTY_FORM: CreateListingFormData = {
  listingMode: "new",
  existingPropertyGroupId: "",
  title: "",
  areaId: "",
  roomTypeId: "",
  pricePerYear: "",
  distanceToGate: "",
  description: "",
  amenities: [],
};

type PhotoEntry = {
  file: File;
  previewUrl: string;
};

type VideoEntry = {
  file: File;
  previewUrl: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function CreateListingForm() {
  const [step, setStep] = useState<CreateListingStep>("basics");
  const [form, setForm] = useState<CreateListingFormData>(EMPTY_FORM);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [video, setVideo] = useState<VideoEntry | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existingProperties, setExistingProperties] = useState<
    ExistingPropertyOption[]
  >([]);
  const [loadingProperties, setLoadingProperties] = useState(true);

  const stepIndex = STEPS.findIndex((item) => item.id === step);
  const isExistingOffer = form.listingMode === "existing";
  const selectedProperty = getExistingPropertyTemplate(
    existingProperties,
    form.existingPropertyGroupId
  );

  useEffect(() => {
    let cancelled = false;

    async function loadProperties() {
      const properties = await fetchExistingProperties();
      if (!cancelled) {
        setExistingProperties(properties);
        setLoadingProperties(false);
      }
    }

    void loadProperties();

    return () => {
      cancelled = true;
    };
  }, []);

  function setListingMode(mode: CreateListingFormData["listingMode"]) {
    setForm({ ...EMPTY_FORM, listingMode: mode });
    setPhotos([]);
    setVideo(null);
    setErrors({});
    setSubmitError(null);
  }

  function applyExistingProperty(propertyGroupId: string) {
    const property = getExistingPropertyTemplate(
      existingProperties,
      propertyGroupId
    );
    if (!property) return;

    setForm((current) => ({
      ...current,
      listingMode: "existing",
      existingPropertyGroupId: property.propertyGroupId,
      title: property.title,
      areaId: property.areaId,
      roomTypeId: property.roomTypeId,
      description: property.description,
      amenities: property.amenities,
      distanceToGate: property.distanceToGate ?? "",
    }));
    setErrors((current) => ({
      ...current,
      existingPropertyGroupId: undefined,
      title: undefined,
      areaId: undefined,
      roomTypeId: undefined,
    }));
  }

  function updateForm<K extends keyof CreateListingFormData>(
    key: K,
    value: CreateListingFormData[K]
  ) {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setSubmitted(false);
  }

  function toggleAmenity(amenity: string) {
    setForm((current) => {
      const exists = current.amenities.includes(amenity);
      return {
        ...current,
        amenities: exists
          ? current.amenities.filter((item) => item !== amenity)
          : [...current.amenities, amenity],
      };
    });
    setErrors((current) => ({ ...current, amenities: undefined }));
  }

  function handleVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setVideo((current) => {
      if (current) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return {
        file,
        previewUrl: URL.createObjectURL(file),
      };
    });
    setErrors((current) => ({ ...current, media: undefined }));
    setSubmitError(null);
    event.target.value = "";
  }

  function removeVideo() {
    setVideo((current) => {
      if (current) {
        URL.revokeObjectURL(current.previewUrl);
      }
      return null;
    });
  }

  function handlePhotosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const entries = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotos((current) => [...current, ...entries].slice(0, 6));
    setErrors((current) => ({ ...current, media: undefined }));
    setSubmitError(null);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((current) => {
      const next = [...current];
      const [removed] = next.splice(index, 1);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }
      return next;
    });
  }

  function goNext() {
    if (step === "basics") {
      const nextErrors = validateBasicsStep(form);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors as Record<string, string>);
        return;
      }
      setStep("details");
      return;
    }

    if (step === "details") {
      const nextErrors = validateDetailsStep(form);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors as Record<string, string>);
        return;
      }
      setStep("media");
      return;
    }

    if (step === "media") {
      const nextErrors = validateMediaStep(
        photos.length,
        Boolean(video),
        form.listingMode
      );
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors as Record<string, string>);
        return;
      }
      setStep("review");
    }
  }

  function goBack() {
    if (step === "details") setStep("basics");
    if (step === "media") setStep("details");
    if (step === "review") setStep("media");
  }

  async function handleSubmit() {
    setSubmitError(null);
    setIsSubmitting(true);
    setVideoUploadProgress(video ? 0 : null);

    try {
      const result = await createOwnerListing({
        form,
        photos: photos.map((entry) => entry.file),
        video: video?.file ?? null,
        fallbackImageUrl: selectedProperty?.imageUrl,
        onVideoUploadProgress: setVideoUploadProgress,
      });

      if (result.error) {
        setSubmitError(result.error);
        return;
      }

      setSubmitted(true);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not submit listing.";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setVideoUploadProgress(null);
    }
  }

  const summary = summarizeListing(form);

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Add a new listing</CardTitle>
        <CardDescription>
          List a new lodge or add your price offer to an existing property.
        </CardDescription>

        <div className="mt-4 flex flex-wrap gap-2">
          {STEPS.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium",
                index <= stepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}. {item.label}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {submitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-6">
              <p className="font-medium text-foreground">Listing submitted for review</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Your property will appear as <strong>Pending</strong> on your
                dashboard until an admin approves it.
              </p>
            </div>
            <Button render={<Link href="/dashboard/owner" />}>
              Back to my listings
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {step === "basics" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>What are you listing?</Label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setListingMode("new")}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                        form.listingMode === "new"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      New lodge
                    </button>
                    <button
                      type="button"
                      onClick={() => setListingMode("existing")}
                      className={cn(
                        "rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                        form.listingMode === "existing"
                          ? "border-primary bg-primary/10 text-foreground"
                          : "border-border text-muted-foreground hover:bg-muted"
                      )}
                    >
                      Offer on existing lodge
                    </button>
                  </div>
                </div>

                {isExistingOffer ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="existing-property">Select lodge</Label>
                      <Select
                        value={form.existingPropertyGroupId || undefined}
                        onValueChange={(value) =>
                          value && applyExistingProperty(value)
                        }
                        disabled={loadingProperties}
                      >
                        <SelectTrigger id="existing-property" className="w-full">
                          <SelectValue
                            placeholder={
                              loadingProperties
                                ? "Loading lodges..."
                                : "Choose an approved lodge"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {existingProperties.map((property) => (
                            <SelectItem
                              key={property.propertyGroupId}
                              value={property.propertyGroupId}
                            >
                              {property.title} · {property.areaLabel} · from{" "}
                              {formatNaira(property.minPrice)}
                              {property.offerCount > 1
                                ? ` · ${property.offerCount} offers`
                                : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError message={errors.existingPropertyGroupId} />
                    </div>

                    {selectedProperty && (
                      <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                        Adding your offer to{" "}
                        <span className="font-medium text-foreground">
                          {selectedProperty.title}
                        </span>{" "}
                        in {selectedProperty.areaLabel}. Students will compare
                        your price with {selectedProperty.offerCount} existing{" "}
                        {selectedProperty.offerCount === 1 ? "offer" : "offers"}.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Label htmlFor="listing-title">Property name</Label>
                    <Input
                      id="listing-title"
                      placeholder="e.g. Green View Lodge"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      aria-invalid={Boolean(errors.title)}
                    />
                    <FieldError message={errors.title} />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="listing-area">Area</Label>
                    <Select
                      value={form.areaId || undefined}
                      onValueChange={(value) =>
                        updateForm("areaId", value ?? "")
                      }
                      disabled={isExistingOffer && Boolean(selectedProperty)}
                    >
                      <SelectTrigger id="listing-area" className="w-full">
                        <SelectValue placeholder="Select area" />
                      </SelectTrigger>
                      <SelectContent>
                        {FUTA_AREAS.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.areaId} />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="listing-room">Room type</Label>
                    <Select
                      value={form.roomTypeId || undefined}
                      onValueChange={(value) =>
                        updateForm("roomTypeId", value ?? "")
                      }
                      disabled={isExistingOffer && Boolean(selectedProperty)}
                    >
                      <SelectTrigger id="listing-room" className="w-full">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LISTABLE_ROOM_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.roomTypeId} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="listing-price">
                    {isExistingOffer ? "Your price per year (₦)" : "Price per year (₦)"}
                  </Label>
                  <Input
                    id="listing-price"
                    type="number"
                    min={10000}
                    step={1000}
                    placeholder="120000"
                    value={form.pricePerYear}
                    onChange={(e) => updateForm("pricePerYear", e.target.value)}
                    aria-invalid={Boolean(errors.pricePerYear)}
                  />
                  <FieldError message={errors.pricePerYear} />
                </div>
              </div>
            )}

            {step === "details" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="listing-distance">Distance to gate (optional)</Label>
                  <Input
                    id="listing-distance"
                    placeholder="e.g. 5 min walk"
                    value={form.distanceToGate}
                    onChange={(e) =>
                      updateForm("distanceToGate", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="listing-description">Description</Label>
                  <Textarea
                    id="listing-description"
                    placeholder="Describe the rooms, compound, and what students should know..."
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    aria-invalid={Boolean(errors.description)}
                  />
                  <FieldError message={errors.description} />
                </div>

                <div className="space-y-2">
                  <Label>Amenities</Label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const selected = form.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={cn(
                            "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                            selected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-muted-foreground hover:bg-muted"
                          )}
                        >
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError message={errors.amenities} />
                </div>
              </div>
            )}

            {step === "media" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6">
                  <div className="flex items-start gap-3">
                    <Video className="mt-0.5 size-5 shrink-0 text-primary" />
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="font-medium text-foreground">Lodge video</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Upload a WhatsApp walkthrough if you don&apos;t have photos.
                          MP4 or MOV, up to 50 MB.
                        </p>
                      </div>
                      {video ? (
                        <div className="space-y-3">
                          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-black">
                            <video
                              src={video.previewUrl}
                              controls
                              className="size-full object-contain"
                            />
                            <button
                              type="button"
                              onClick={removeVideo}
                              className="absolute right-2 top-2 rounded-full bg-background/90 p-1.5 shadow-sm"
                              aria-label="Remove video"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {video.file.name} ·{" "}
                            {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                          </p>
                        </div>
                      ) : (
                        <Label
                          htmlFor="listing-video"
                          className="inline-flex cursor-pointer"
                        >
                          <span className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
                            Choose video
                          </span>
                          <input
                            id="listing-video"
                            type="file"
                            accept={LISTING_VIDEO_ACCEPT}
                            className="hidden"
                            onChange={handleVideoChange}
                          />
                        </Label>
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                  <ImagePlus className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {isExistingOffer
                      ? "Optional photos — existing lodge images are used if you skip this."
                      : "Optional photos — add up to 6, or use a video only."}
                  </p>
                  <Label
                    htmlFor="listing-photos"
                    className="mt-4 inline-flex cursor-pointer"
                  >
                    <span className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                      Choose photos
                    </span>
                    <input
                      id="listing-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handlePhotosChange}
                    />
                  </Label>
                </div>
                <FieldError message={errors.media} />

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {photos.map((entry, index) => (
                      <div
                        key={entry.previewUrl}
                        className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border"
                      >
                        <Image
                          src={entry.previewUrl}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute right-2 top-2 rounded-full bg-background/90 p-1 shadow-sm"
                          aria-label="Remove photo"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === "review" && (
              <div className="space-y-4 rounded-xl border border-border bg-muted/20 p-5">
                <h3 className="font-semibold text-foreground">Review your listing</h3>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">Listing type</dt>
                    <dd className="font-medium text-foreground">
                      {summary.listingMode === "existing"
                        ? "Offer on existing lodge"
                        : "New lodge"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Property</dt>
                    <dd className="font-medium text-foreground">{summary.title}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Area</dt>
                    <dd className="font-medium text-foreground">{summary.area}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Room type</dt>
                    <dd className="font-medium text-foreground">{summary.roomType}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Price / year</dt>
                    <dd className="font-medium text-foreground">
                      {formatNaira(summary.pricePerYear)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Distance</dt>
                    <dd className="font-medium text-foreground">
                      {summary.distanceToGate}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Description</dt>
                    <dd className="mt-1 text-foreground">{summary.description}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Amenities</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {summary.amenities.map((amenity) => (
                        <Badge key={amenity} variant="secondary">{amenity}</Badge>
                      ))}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-muted-foreground">Media</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {photos.length} photo{photos.length === 1 ? "" : "s"}
                      {video ? " · 1 video" : ""}
                      {!photos.length && !video ? "None" : ""}
                    </dd>
                  </div>
                </dl>
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
                )}
                {videoUploadProgress !== null && (
                  <p className="text-sm text-muted-foreground">
                    Uploading video… {videoUploadProgress}%
                  </p>
                )}
              </div>
            )}

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goBack}
                disabled={step === "basics"}
              >
                Back
              </Button>

              {step === "review" ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      {videoUploadProgress !== null
                        ? `Uploading video (${videoUploadProgress}%)…`
                        : "Submitting..."}
                    </>
                  ) : (
                    "Submit for review"
                  )}
                </Button>
              ) : (
                <Button type="button" onClick={goNext}>
                  Continue
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
