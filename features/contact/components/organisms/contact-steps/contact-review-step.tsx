/**
 * ORGANISM: ContactReviewStep (Step 5 of 5)
 *
 * Reviews all entered information before submission
 */

"use client";

import React, { useRef } from "react";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  CheckCircle2,
  User,
  MessageSquare,
  Link2,
  FileText,
  Edit2,
  Send,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useContactStore } from "../../../hooks/use-contact-store";
import { submitContactRequestForm } from "../../../api/contact-request";
import type { ContactFormActionState } from "@/lib/actions/action.types";
import { resolveStepFromFieldPath } from "./contact-review-step.utils";

const inquiryTypeLabels: Record<string, string> = {
  "general-inquiry": "General Inquiry",
  "service-follow-up": "Service Follow-up",
  "quote-follow-up": "Quote Follow-up",
  complaint: "Complaint",
  feedback: "Feedback",
  partnership: "Partnership",
  "media-press": "Media & Press",
  careers: "Careers",
};

const sectorLabels: Record<string, string> = {
  residential: "Residential",
  commercial: "Commercial",
  industrial: "Industrial",
  "not-applicable": "Not Applicable",
};

const priorityLabels: Record<string, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

const contactMethodLabels: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  either: "Either",
};

const timeLabels: Record<string, string> = {
  morning: "Morning (9am - 12pm)",
  afternoon: "Afternoon (12pm - 5pm)",
  evening: "Evening (5pm - 8pm)",
  anytime: "Anytime",
};

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, onEdit, children }: SectionProps) {
  return (
    <div className="p-4 rounded-lg bg-card/50 border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium text-foreground">{title}</h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-8 px-2 text-muted-foreground hover:text-foreground"
        >
          <Edit2 className="h-3.5 w-3.5 mr-1" />
          Edit
        </Button>
      </div>
      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

function ReviewItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
      <span className="text-muted-foreground">{label}:</span>
      <span className="text-foreground font-medium sm:text-right">{value}</span>
    </div>
  );
}

const initialActionState: ContactFormActionState = {
  success: false,
};

function mapTurnstileClientError(errorCode?: string | number): string {
  const code = String(errorCode ?? "");

  if (code === "110200") {
    return "Verification unavailable for this domain. Please retry shortly.";
  }

  if (code === "400020" || code === "110100" || code === "110110") {
    return "Verification configuration is invalid. Please retry shortly.";
  }

  return "Verification failed. Please retry.";
}

function SubmitInquiryButton({ tokenMissing }: { tokenMissing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending || tokenMissing}
      className="min-w-40"
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Submit Inquiry
        </>
      )}
    </Button>
  );
}

export function ContactReviewStep() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [error, setError] = useState<string | null>(null);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

  const {
    contactInfo,
    inquiryType,
    referenceLinking,
    messageDetails,
    turnstileToken,
    turnstileError,
    setTurnstileToken,
    setTurnstileError,
    setCurrentStep,
    setSubmitted,
    getCompleteFormData,
    prevStep,
  } = useContactStore();

  const [actionState, formAction, isPending] = useActionState(
    submitContactRequestForm,
    initialActionState,
  );

  const payload = useMemo(() => {
    return JSON.stringify(getCompleteFormData());
  }, [
    getCompleteFormData,
    contactInfo,
    inquiryType,
    referenceLinking,
    messageDetails,
    turnstileToken,
  ]);

  useEffect(() => {
    if (actionState.success) {
      setSubmitted(true, actionState.referenceId);
      return;
    }

    if (actionState.error) {
      setError(actionState.error);
    }

    const fieldPaths = Object.keys(actionState.fieldErrors ?? {});
    if (fieldPaths.length > 0) {
      setCurrentStep(resolveStepFromFieldPath(fieldPaths[0]));
    }
  }, [actionState, setCurrentStep, setSubmitted]);

  const handleBeforeSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!turnstileSiteKey) {
      event.preventDefault();
      setError("Verification is unavailable. Please try again shortly.");
      return;
    }

    if (!turnstileToken) {
      event.preventDefault();
      setError("Please complete verification before submitting.");
      return;
    }

    if (error) {
      setError(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form
        className="space-y-6"
        action={formAction}
        onSubmit={handleBeforeSubmit}
      >
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Review Your Inquiry
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Please review the information below before submitting.
          </p>
        </div>

        {/* Review Sections */}
        <div className="space-y-4">
          {/* Contact Information */}
          <ReviewSection
            title="Contact Information"
            icon={<User className="h-4 w-4 text-accent" />}
            onEdit={() => setCurrentStep(1)}
          >
            <ReviewItem label="Name" value={contactInfo.fullName} />
            <ReviewItem label="Email" value={contactInfo.email} />
            <ReviewItem label="Phone" value={contactInfo.phone} />
            {contactInfo.company && (
              <ReviewItem label="Company" value={contactInfo.company} />
            )}
          </ReviewSection>

          {/* Inquiry Type */}
          <ReviewSection
            title="Inquiry Details"
            icon={<MessageSquare className="h-4 w-4 text-accent" />}
            onEdit={() => setCurrentStep(2)}
          >
            <ReviewItem
              label="Type"
              value={
                inquiryType.inquiryType
                  ? inquiryTypeLabels[inquiryType.inquiryType]
                  : undefined
              }
            />
            <ReviewItem
              label="Sector"
              value={
                inquiryType.sector
                  ? sectorLabels[inquiryType.sector]
                  : undefined
              }
            />
            <ReviewItem
              label="Priority"
              value={
                inquiryType.priority
                  ? priorityLabels[inquiryType.priority]
                  : undefined
              }
            />
          </ReviewSection>

          {/* Reference Linking */}
          {referenceLinking.hasExistingReference &&
            referenceLinking.referenceId && (
              <ReviewSection
                title="Reference Linking"
                icon={<Link2 className="h-4 w-4 text-accent" />}
                onEdit={() => setCurrentStep(3)}
              >
                <ReviewItem
                  label="Reference ID"
                  value={referenceLinking.referenceId}
                />
                {referenceLinking.referenceDescription && (
                  <ReviewItem
                    label="Description"
                    value={referenceLinking.referenceDescription}
                  />
                )}
              </ReviewSection>
            )}

          {/* Message */}
          <ReviewSection
            title="Message"
            icon={<FileText className="h-4 w-4 text-accent" />}
            onEdit={() => setCurrentStep(4)}
          >
            <ReviewItem label="Subject" value={messageDetails.subject} />
            <div className="pt-2 border-t border-border mt-2">
              <p className="text-muted-foreground mb-1">Message:</p>
              <p className="text-foreground text-sm whitespace-pre-wrap bg-background/50 p-3 rounded-md border border-border">
                {messageDetails.message}
              </p>
            </div>
            <div className="pt-2 border-t border-border mt-2">
              <ReviewItem
                label="Contact Method"
                value={
                  messageDetails.preferredContactMethod
                    ? contactMethodLabels[messageDetails.preferredContactMethod]
                    : undefined
                }
              />
              <ReviewItem
                label="Best Time"
                value={
                  messageDetails.bestTimeToContact
                    ? timeLabels[messageDetails.bestTimeToContact]
                    : undefined
                }
              />
              {messageDetails.newsletterOptIn && (
                <ReviewItem label="Newsletter" value="Subscribed" />
              )}
            </div>
          </ReviewSection>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        <div className="space-y-2" data-testid="contact-turnstile-widget">
          {turnstileSiteKey ? (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              options={{ theme: "auto", size: "normal" }}
              onSuccess={(token) => {
                setTurnstileToken(token);
                setTurnstileError(null);
              }}
              onExpire={() => {
                setTurnstileToken(null);
                setTurnstileError("Verification expired. Please try again.");
              }}
              onError={(errorCode) => {
                setTurnstileToken(null);
                setTurnstileError(mapTurnstileClientError(errorCode));
              }}
            />
          ) : (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              Turnstile key missing. Verification cannot be completed.
            </div>
          )}

          {turnstileError && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-muted/20 p-3">
              <p className="text-xs text-muted-foreground" role="status">
                {turnstileError}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setTurnstileToken(null);
                  setTurnstileError(null);
                  turnstileRef.current?.reset();
                }}
                className="h-7 px-2 text-xs"
              >
                Retry
              </Button>
            </div>
          )}
        </div>
        <input type="hidden" name="payload" value={payload} />

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isPending}
          >
            Back
          </Button>
          <SubmitInquiryButton tokenMissing={!turnstileToken} />
        </div>
      </form>
    </motion.div>
  );
}
