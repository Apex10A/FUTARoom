"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

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
import {
  AMENITY_OPTIONS,
  LISTABLE_ROOM_TYPES,
} from "@/lib/constants/amenities";
import { createOwnerListing } from "@/lib/listings/create-owner-listing";
import {
  type CreateListingFormData,
  type CreateListingStep,
  summarizeListing,
  validateBasicsStep,
  validateDetailsStep,
  validatePhotosStep,
} from "@/lib/validations/listing-form";
import { formatNaira } from "@/lib/utils/format";
import { cn } from "@/lib/utils";

const STEPS: { id: CreateListingStep; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "photos", label: "Photos" },
  { id: "review", label: "Review" },
];

const EMPTY_FORM: CreateListingFormData = {
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

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function CreateListingForm() {
  const [step, setStep] = useState<CreateListingStep>("basics");
  const [form, setForm] = useState<CreateListingFormData>(EMPTY_FORM);
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const stepIndex = STEPS.findIndex((item) => item.id === step);

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

  function handlePhotosChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    const entries = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    setPhotos((current) => [...current, ...entries].slice(0, 6));
    setErrors((current) => ({ ...current, photos: undefined }));
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
      setStep("photos");
      return;
    }

    if (step === "photos") {
      const nextErrors = validatePhotosStep(photos.length);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }
      setStep("review");
    }
  }

  function goBack() {
    if (step === "details") setStep("basics");
    if (step === "photos") setStep("details");
    if (step === "review") setStep("photos");
  }

  async function handleSubmit() {
    setSubmitError(null);
    setIsSubmitting(true);

    const result = await createOwnerListing({
      form,
      photos: photos.map((entry) => entry.file),
    });

    setIsSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  const summary = summarizeListing(form);

  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-semibold">Add a new listing</CardTitle>
        <CardDescription>
          Submit property details for admin review before it goes live.
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="listing-area">Area</Label>
                    <Select
                      value={form.areaId || undefined}
                      onValueChange={(value) =>
                        updateForm("areaId", value ?? "")
                      }
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
                  <Label htmlFor="listing-price">Price per year (₦)</Label>
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

            {step === "photos" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center">
                  <ImagePlus className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload up to 6 photos. JPG, PNG, or WebP recommended.
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
                <FieldError message={errors.photos} />

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
                    <dt className="text-muted-foreground">Photos</dt>
                    <dd className="mt-1 font-medium text-foreground">
                      {photos.length} selected
                    </dd>
                  </div>
                </dl>
                {submitError && (
                  <p className="text-sm text-destructive">{submitError}</p>
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
                      Submitting...
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
