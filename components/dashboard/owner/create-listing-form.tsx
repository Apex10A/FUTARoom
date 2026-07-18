"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ImagePlus, Loader2, Video, X } from "lucide-react";

import { CreateListingStepper } from "@/components/dashboard/owner/create-listing-stepper";
import { ListingModeCards } from "@/components/dashboard/owner/listing-mode-cards";
import { Badge } from "@/components/ui/badge";
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
import { FUTA_AREAS } from "@/lib/constants/areas";
import { LISTING_VIDEO_ACCEPT } from "@/lib/constants/listing-media";
import {
  AMENITY_OPTIONS,
  LISTABLE_ROOM_TYPES,
} from "@/lib/constants/amenities";
import { LANDING_THEME } from "@/lib/constants/landing";
import {
  CREATE_LISTING_FORM,
  CREATE_LISTING_PAGE,
} from "@/lib/constants/create-listing-layout";
import {
  clearCreateListingDraft,
  CREATE_LISTING_EMPTY_FORM,
  loadCreateListingDraft,
  saveCreateListingDraft,
  type CreateListingMediaHint,
} from "@/lib/listings/create-listing-draft";
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

const FIELD_CLASS =
  "h-12 px-4 text-base lg:h-14 lg:px-5 lg:text-lg border-white/15 bg-white/5 text-white placeholder:text-white/40 focus-visible:border-[#E8B84A]/50 focus-visible:ring-[#E8B84A]/20";
const SELECT_TRIGGER_CLASS = cn(
  FIELD_CLASS,
  "w-full !h-12 data-[size=default]:!h-12 lg:!h-14 data-[size=default]:lg:!h-14"
);
const ACTION_BUTTON_CLASS =
  "h-12 min-h-12 rounded-full px-8 text-base lg:h-14 lg:min-h-14 lg:px-10 lg:text-lg";
const LABEL_CLASS = "text-base font-medium text-white/80 lg:text-lg";

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
  return <p className="text-base text-red-400">{message}</p>;
}

function StepSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-center text-2xl font-semibold text-[#E8B84A] sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-center text-base leading-relaxed text-white/60 lg:text-lg">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

export function CreateListingForm() {
  const [step, setStep] = useState<CreateListingStep>("type");
  const [form, setForm] = useState<CreateListingFormData>(CREATE_LISTING_EMPTY_FORM);
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
  const [hydrated, setHydrated] = useState(false);
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [mediaHint, setMediaHint] = useState<CreateListingMediaHint | undefined>();

  const isExistingOffer = form.listingMode === "existing";
  const selectedProperty = getExistingPropertyTemplate(
    existingProperties,
    form.existingPropertyGroupId
  );

  useEffect(() => {
    const draft = loadCreateListingDraft();
    if (draft) {
      setForm(draft.form);
      setStep(draft.step);
      setMediaHint(draft.mediaHint);
      setRestoredDraft(true);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || submitted) {
      return;
    }

    saveCreateListingDraft({
      form,
      step,
      mediaHint: {
        photoCount: photos.length,
        videoName: video?.file.name,
      },
      savedAt: new Date().toISOString(),
    });
  }, [form, step, photos.length, video?.file.name, hydrated, submitted]);

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
    setForm({ ...CREATE_LISTING_EMPTY_FORM, listingMode: mode });
    setPhotos([]);
    setVideo(null);
    setMediaHint(undefined);
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
    setMediaHint(undefined);
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
    setMediaHint(undefined);
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
    if (step === "type") {
      setStep("basics");
      return;
    }

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
    if (step === "basics") setStep("type");
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

      clearCreateListingDraft();
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
  const modeLabel =
    form.listingMode === "existing" ? "Offer on existing lodge" : "New lodge";

  return (
    <div
      className="min-h-[calc(100vh-4rem)] text-base text-white lg:text-lg"
      style={{ backgroundColor: LANDING_THEME.dark }}
    >
      <div className={cn(CREATE_LISTING_PAGE, "py-4 lg:py-5")}>
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard/owner"
            className="inline-flex items-center gap-2 text-base text-white/70 transition-colors hover:text-white lg:text-lg"
          >
            <ArrowLeft className="size-5" />
            Back to dashboard
          </Link>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40 lg:text-base">
            Add listing
          </p>
        </div>
      </div>

      <CreateListingStepper currentStep={step} />

      <div className={cn(CREATE_LISTING_PAGE, "py-8 sm:py-10 lg:py-12")}>
        {submitted ? (
          <div className="space-y-6 text-center">
            <div className="rounded-2xl border border-[#E8B84A]/30 bg-[#E8B84A]/10 px-6 py-10">
              <p className="text-xl font-semibold text-[#E8B84A] lg:text-2xl">
                Listing submitted for review
              </p>
              <p className="mt-3 text-base leading-relaxed text-white/70 lg:text-lg">
                Your property will appear as <strong>Pending</strong> on your
                dashboard until an admin approves it.
              </p>
            </div>
            <Button
              size="lg"
              className={ACTION_BUTTON_CLASS}
              render={<Link href="/dashboard/owner" />}
            >
              Back to my listings
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {restoredDraft && (
              <div className="rounded-xl border border-[#E8B84A]/30 bg-[#E8B84A]/10 px-4 py-3 text-base text-[#E8B84A]/90 lg:text-lg">
                Draft restored — your progress is saved locally while you
                complete this form.
              </div>
            )}

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 lg:p-10">
              {step === "type" && (
                <StepSection
                  title="Select listing type"
                  description="Choose the type of listing you want to add. The fields in the next steps depend on whether this is a new lodge or an offer on one already listed."
                >
                  <ListingModeCards
                    value={form.listingMode}
                    onChange={setListingMode}
                  />
                </StepSection>
              )}

              {step === "basics" && (
                <StepSection
                  title="Listing information"
                  description="Provide the essential details students need to find and compare your offer."
                >
                  <div className={cn(CREATE_LISTING_FORM, "space-y-6")}>
                    <div className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.16em] text-white/45 lg:text-base">
                          Listing type
                        </p>
                        <p className="mt-1 text-base font-medium text-white lg:text-lg">
                          {modeLabel}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep("type")}
                        className="text-base font-medium text-[#E8B84A] hover:text-[#E8B84A]/80 lg:text-lg"
                      >
                        Change
                      </button>
                    </div>

                    {isExistingOffer ? (
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="existing-property" className={LABEL_CLASS}>
                            Select lodge
                          </Label>
                          <Select
                            value={form.existingPropertyGroupId || undefined}
                            onValueChange={(value) =>
                              value && applyExistingProperty(value)
                            }
                            disabled={loadingProperties}
                          >
                            <SelectTrigger
                              id="existing-property"
                              className={SELECT_TRIGGER_CLASS}
                            >
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
                          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 text-base text-white/65 lg:text-lg">
                            Adding your offer to{" "}
                            <span className="font-medium text-white">
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
                        <Label htmlFor="listing-title" className={LABEL_CLASS}>
                          Property name
                        </Label>
                        <Input
                          id="listing-title"
                          className={FIELD_CLASS}
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
                        <Label htmlFor="listing-area" className={LABEL_CLASS}>
                          Area
                        </Label>
                        <Select
                          value={form.areaId || undefined}
                          onValueChange={(value) =>
                            updateForm("areaId", value ?? "")
                          }
                          disabled={isExistingOffer && Boolean(selectedProperty)}
                        >
                          <SelectTrigger
                            id="listing-area"
                            className={SELECT_TRIGGER_CLASS}
                          >
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
                        <Label htmlFor="listing-room" className={LABEL_CLASS}>
                          Room type
                        </Label>
                        <Select
                          value={form.roomTypeId || undefined}
                          onValueChange={(value) =>
                            updateForm("roomTypeId", value ?? "")
                          }
                          disabled={isExistingOffer && Boolean(selectedProperty)}
                        >
                          <SelectTrigger
                            id="listing-room"
                            className={SELECT_TRIGGER_CLASS}
                          >
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
                      <Label htmlFor="listing-price" className={LABEL_CLASS}>
                        {isExistingOffer
                          ? "Your price per year (₦)"
                          : "Price per year (₦)"}
                      </Label>
                      <Input
                        id="listing-price"
                        className={FIELD_CLASS}
                        type="number"
                        min={10000}
                        step={1000}
                        placeholder="120000"
                        value={form.pricePerYear}
                        onChange={(e) =>
                          updateForm("pricePerYear", e.target.value)
                        }
                        aria-invalid={Boolean(errors.pricePerYear)}
                      />
                      <FieldError message={errors.pricePerYear} />
                    </div>
                  </div>
                </StepSection>
              )}

              {step === "details" && (
                <StepSection
                  title="Property details"
                  description="Describe the lodge, walk time to gate, and amenities so students know what to expect."
                >
                  <div className={cn(CREATE_LISTING_FORM, "space-y-4")}>
                    <div className="space-y-1.5">
                      <Label htmlFor="listing-distance" className={LABEL_CLASS}>
                        Distance to gate (optional)
                      </Label>
                      <Input
                        id="listing-distance"
                        className={FIELD_CLASS}
                        placeholder="e.g. 5 min walk"
                        value={form.distanceToGate}
                        onChange={(e) =>
                          updateForm("distanceToGate", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="listing-description" className={LABEL_CLASS}>
                        Description
                      </Label>
                      <Textarea
                        id="listing-description"
                        className={cn(FIELD_CLASS, "min-h-36 lg:min-h-40")}
                        placeholder="Describe the rooms, compound, and what students should know..."
                        value={form.description}
                        onChange={(e) =>
                          updateForm("description", e.target.value)
                        }
                        aria-invalid={Boolean(errors.description)}
                      />
                      <FieldError message={errors.description} />
                    </div>

                    <div className="space-y-2">
                      <Label className={LABEL_CLASS}>Amenities</Label>
                      <div className="flex flex-wrap gap-2">
                        {AMENITY_OPTIONS.map((amenity) => {
                          const selected = form.amenities.includes(amenity);
                          return (
                            <button
                              key={amenity}
                              type="button"
                              onClick={() => toggleAmenity(amenity)}
                              className={cn(
                                "rounded-lg border px-4 py-2 text-base transition-colors lg:text-lg",
                                selected
                                  ? "border-[#E8B84A]/50 bg-[#E8B84A]/15 text-[#E8B84A]"
                                  : "border-white/15 bg-white/[0.03] text-white/65 hover:border-white/25 hover:bg-white/[0.06]"
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
                </StepSection>
              )}

              {step === "media" && (
                <StepSection
                  title="Photos & video"
                  description="Upload a WhatsApp walkthrough or photos of the lodge. Agents often only have video — that works too."
                >
                  <div className={cn(CREATE_LISTING_FORM, "space-y-6")}>
                    {(mediaHint?.photoCount || mediaHint?.videoName) &&
                      !photos.length &&
                      !video && (
                        <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-5 py-4 text-base text-amber-100/90 lg:text-lg">
                          You had {mediaHint.photoCount} photo
                          {mediaHint.photoCount === 1 ? "" : "s"}
                          {mediaHint.videoName
                            ? ` and "${mediaHint.videoName}"`
                            : ""}{" "}
                          before refreshing. Please re-upload your media files.
                        </div>
                      )}

                    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 lg:p-8">
                      <div className="flex items-start gap-4">
                        <Video className="mt-1 size-6 shrink-0 text-primary lg:size-7" />
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-lg font-medium text-white lg:text-xl">
                              Lodge video
                            </p>
                            <p className="mt-1 text-base text-white/55 lg:text-lg">
                              MP4 or MOV, up to 50 MB.
                            </p>
                          </div>
                          {video ? (
                            <div className="space-y-3">
                              <div className="relative aspect-video overflow-hidden rounded-lg border border-white/10 bg-black">
                                <video
                                  src={video.previewUrl}
                                  controls
                                  className="size-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={removeVideo}
                                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white"
                                  aria-label="Remove video"
                                >
                                  <X className="size-3.5" />
                                </button>
                              </div>
                              <p className="text-sm text-white/50 lg:text-base">
                                {video.file.name} ·{" "}
                                {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                              </p>
                            </div>
                          ) : (
                            <Label
                              htmlFor="listing-video"
                              className="inline-flex cursor-pointer"
                            >
                              <span className="inline-flex h-12 items-center rounded-lg border border-white/15 bg-white/5 px-5 text-base font-medium text-white hover:bg-white/10 lg:h-14 lg:px-6 lg:text-lg">
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

                    <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center lg:p-8">
                      <ImagePlus className="mx-auto size-10 text-white/40 lg:size-12" />
                      <p className="mt-3 text-base text-white/55 lg:text-lg">
                        {isExistingOffer
                          ? "Optional photos — existing lodge images are used if you skip this."
                          : "Optional photos — add up to 6, or use a video only."}
                      </p>
                      <Label
                        htmlFor="listing-photos"
                        className="mt-4 inline-flex cursor-pointer"
                      >
                        <span className="inline-flex h-12 items-center rounded-lg bg-primary px-5 text-base font-medium text-primary-foreground lg:h-14 lg:px-6 lg:text-lg">
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
                            className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10"
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
                              className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"
                              aria-label="Remove photo"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </StepSection>
              )}

              {step === "review" && (
                <StepSection
                  title="Review & submit"
                  description="Confirm everything looks correct before sending your listing for admin review."
                >
                  <div className={cn(CREATE_LISTING_FORM, "space-y-4 rounded-xl border border-white/10 bg-white/[0.03] p-6 lg:p-8")}>
                    <dl className="grid gap-4 text-base sm:grid-cols-2 lg:text-lg">
                      <div>
                        <dt className="text-white/50">Listing type</dt>
                        <dd className="font-medium text-white">{modeLabel}</dd>
                      </div>
                      <div>
                        <dt className="text-white/50">Property</dt>
                        <dd className="font-medium text-white">{summary.title}</dd>
                      </div>
                      <div>
                        <dt className="text-white/50">Area</dt>
                        <dd className="font-medium text-white">{summary.area}</dd>
                      </div>
                      <div>
                        <dt className="text-white/50">Room type</dt>
                        <dd className="font-medium text-white">{summary.roomType}</dd>
                      </div>
                      <div>
                        <dt className="text-white/50">Price / year</dt>
                        <dd className="font-medium text-white">
                          {formatNaira(summary.pricePerYear)}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-white/50">Distance</dt>
                        <dd className="font-medium text-white">
                          {summary.distanceToGate}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-white/50">Description</dt>
                        <dd className="mt-1 text-white/85">{summary.description}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-white/50">Amenities</dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {summary.amenities.map((amenity) => (
                            <Badge
                              key={amenity}
                              variant="secondary"
                              className="border-white/10 bg-white/10 text-white"
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-white/50">Media</dt>
                        <dd className="mt-1 font-medium text-white">
                          {photos.length} photo{photos.length === 1 ? "" : "s"}
                          {video ? " · 1 video" : ""}
                          {!photos.length && !video ? "None" : ""}
                        </dd>
                      </div>
                    </dl>
                    {submitError && (
                      <p className="text-base text-red-400 lg:text-lg">{submitError}</p>
                    )}
                    {videoUploadProgress !== null && (
                      <p className="text-base text-white/60 lg:text-lg">
                        Uploading video… {videoUploadProgress}%
                      </p>
                    )}
                  </div>
                </StepSection>
              )}

              <div className={cn(CREATE_LISTING_FORM, "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between lg:mt-10")}>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={goBack}
                  disabled={step === "type"}
                  className={cn(
                    ACTION_BUTTON_CLASS,
                    "border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white disabled:opacity-40"
                  )}
                >
                  Go back
                </Button>

                {step === "review" ? (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={ACTION_BUTTON_CLASS}
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
                  <Button
                    type="button"
                    size="lg"
                    onClick={goNext}
                    className={ACTION_BUTTON_CLASS}
                  >
                    Save & continue
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
