"use client";

/**
 * SERVER COMPONENT: ReviewStepDisplay
 *
 * Pure display component for the review sections.
 * This doesn't need client-side JS - it's just data presentation.
 */

import type { FormData } from "../../../hooks/use-form-store";

interface ReviewStepDisplayProps {
  data: FormData;
  onEdit: (step: number) => void;
}

export function ReviewStepDisplay({ data, onEdit }: ReviewStepDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Personal Information
          </h3>
          <button
            onClick={() => onEdit(1)}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="text-foreground font-medium">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="text-foreground font-medium">
              {data.personalInfo.email}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Phone</dt>
            <dd className="text-foreground font-medium">
              {data.personalInfo.phone}
            </dd>
          </div>
        </dl>
      </div>

      {/* Service Details */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Service Details
          </h3>
          <button
            onClick={() => onEdit(2)}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Service Type</dt>
            <dd className="text-foreground font-medium">
              {data.serviceDetails.serviceType}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Urgency</dt>
            <dd className="text-foreground font-medium capitalize">
              {data.serviceDetails.urgency}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Description</dt>
            <dd className="text-foreground font-medium">
              {data.serviceDetails.description}
            </dd>
          </div>
        </dl>
      </div>

      {/* Property Information */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Property Information
          </h3>
          <button
            onClick={() => onEdit(3)}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Property Type</dt>
            <dd className="text-foreground font-medium capitalize">
              {data.propertyInfo.propertyType}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-muted-foreground">Address</dt>
            <dd className="text-foreground font-medium">
              {data.propertyInfo.address}
              <br />
              {data.propertyInfo.city}
              {data.propertyInfo.county
                ? `, ${data.propertyInfo.county}`
                : ""}{" "}
              {data.propertyInfo.postcode}
            </dd>
          </div>
          {data.propertyInfo.accessInstructions && (
            <div className="col-span-2">
              <dt className="text-muted-foreground">Access Instructions</dt>
              <dd className="text-foreground font-medium">
                {data.propertyInfo.accessInstructions}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Schedule Preferences */}
      <div className="bg-muted/30 border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Schedule Preferences
          </h3>
          <button
            onClick={() => onEdit(4)}
            className="text-sm text-accent hover:text-accent/80 transition-colors"
          >
            Edit
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Preferred Date</dt>
            <dd className="text-foreground font-medium">
              {new Date(
                data.schedulePreferences.preferredDate,
              ).toLocaleDateString()}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Time Slot</dt>
            <dd className="text-foreground font-medium capitalize">
              {data.schedulePreferences.preferredTimeSlot}
            </dd>
          </div>
          {data.schedulePreferences.alternativeDate && (
            <div>
              <dt className="text-muted-foreground">Alternative Date</dt>
              <dd className="text-foreground font-medium">
                {new Date(
                  data.schedulePreferences.alternativeDate,
                ).toLocaleDateString()}
              </dd>
            </div>
          )}
          <div>
            <dt className="text-muted-foreground">Flexible Scheduling</dt>
            <dd className="text-foreground font-medium">
              {data.schedulePreferences.flexibleScheduling ? "Yes" : "No"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
