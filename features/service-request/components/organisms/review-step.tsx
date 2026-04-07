/**
 * ORGANISM: ReviewStep (Step 5 of 5)
 *
 * Final review step that displays all collected data.
 * Allows users to review and edit before submission.
 *
 * REFACTORED: Now uses a hybrid approach with server-rendered display
 * and client-only interactive elements
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useFormStore } from "../../hooks/use-form-store";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { submitServiceRequest } from "../../api/service-request";
import { ReviewStepDisplay } from "./review-step-display";
import { UnifiedSuccessMessage } from "@/components/molecules/unified-success-message";
import { completeFormSchema } from "../../schemas/schemas";

const SUCCESS_VISIBILITY_MS = 5000;
const SERVICE_PROGRESS_ANCHOR_ID = "service-form-progress-anchor";
const SERVICE_SCROLL_TOP_GAP = 28;
const SERVICE_SUCCESS_ANCHOR_ID = "service-success-anchor";
const SERVICE_SUCCESS_SCROLL_TOP_GAP = 8;

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

export function ReviewStep() {
  const {
    data,
    prevStep,
    goToStep,
    resetForm,
    updateGdprConsent,
    updatePrivacyTermsAccepted,
    turnstileToken,
    turnstileError,
    setTurnstileToken,
    setTurnstileError,
  } = useFormStore();
  const turnstileRef = useRef<TurnstileInstance | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const successTimerRef = useRef<number | null>(null);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const isTurnstileVerified = Boolean(turnstileToken);
  const isSubmissionReady = completeFormSchema.safeParse(data).success;

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    const successAnchor = document.getElementById(SERVICE_SUCCESS_ANCHOR_ID);
    if (successAnchor) {
      requestAnimationFrame(() => {
        scrollToElementWithOffset(successAnchor, {
          baseGap: SERVICE_SUCCESS_SCROLL_TOP_GAP,
          extraOffset: 0,
        });
      });
    }

    successTimerRef.current = window.setTimeout(() => {
      setIsSubmitted(false);
      setRequestId(null);
      setError(null);
      resetForm();
      useFormStore.persist.clearStorage();

      const progressAnchor = document.getElementById(
        SERVICE_PROGRESS_ANCHOR_ID,
      );
      if (progressAnchor) {
        requestAnimationFrame(() => {
          scrollToElementWithOffset(progressAnchor, {
            baseGap: SERVICE_SCROLL_TOP_GAP,
            extraOffset: 0,
          });
        });
      }
    }, SUCCESS_VISIBILITY_MS);

    return () => {
      if (successTimerRef.current !== null) {
        window.clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
    };
  }, [isSubmitted, resetForm]);

  const handleSubmit = async () => {
    if (!turnstileSiteKey) {
      setError("Verification is unavailable. Please try again shortly.");
      return;
    }

    if (!isTurnstileVerified) {
      setError("Please complete verification before submitting.");
      return;
    }

    if (!isSubmissionReady) {
      setError(
        "Please complete all required fields and accept GDPR, Privacy Policy, and Terms before submitting.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitServiceRequest({
        ...data,
        turnstileToken: turnstileToken ?? "",
      });

      if (result.success) {
        setRequestId(result.data.requestId);
        setIsSubmitted(true);
      } else {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartOver = () => {
    if (successTimerRef.current !== null) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }

    resetForm();
    useFormStore.persist.clearStorage();
    turnstileRef.current?.reset();
    setIsSubmitted(false);
    setRequestId(null);
    setError(null);

    const progressAnchor = document.getElementById(SERVICE_PROGRESS_ANCHOR_ID);
    if (progressAnchor) {
      requestAnimationFrame(() => {
        scrollToElementWithOffset(progressAnchor, {
          baseGap: SERVICE_SCROLL_TOP_GAP,
          extraOffset: 0,
        });
      });
    }
  };

  const retryVerification = () => {
    setTurnstileToken(null);
    setTurnstileError(null);
    turnstileRef.current?.reset();
  };

  if (isSubmitted) {
    return (
      <div id={SERVICE_SUCCESS_ANCHOR_ID}>
        <UnifiedSuccessMessage
          referenceId={requestId || ""}
          formType="service"
          onStartNew={handleStartOver}
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-foreground">
            Review Your Request
          </h2>
          <p className="text-muted-foreground">
            Please review your information before submitting
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-500 mb-1">
                  Submission Error
                </h3>
                <p className="text-sm text-red-400">{error}</p>
              </div>
            </div>
          </div>
        )}

        <ReviewStepDisplay data={data} onEdit={goToStep} />

        <div className="space-y-2" data-testid="service-turnstile-widget">
          {turnstileSiteKey ? (
            <Turnstile
              ref={turnstileRef}
              siteKey={turnstileSiteKey}
              options={{ theme: "auto", size: "normal" }}
              onSuccess={setTurnstileToken}
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
              <button
                type="button"
                onClick={retryVerification}
                className="h-7 rounded-md border border-border px-2 text-xs text-foreground hover:bg-muted/40"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        <div
          className={cn(
            "rounded-lg border bg-muted/30 p-4 transition-colors",
            data.gdprConsent ? "border-accent/40" : "border-destructive/50",
          )}
        >
          <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={data.gdprConsent}
              onChange={(event) => {
                updateGdprConsent(event.target.checked);
                if (event.target.checked && error) {
                  setError(null);
                }
              }}
              className="mt-0.5 h-4 w-4 rounded accent-accent"
            />
            <span>
              I consent to the processing of my personal data for handling this
              service request in line with the Privacy Policy.
            </span>
          </label>
        </div>

        <div
          className={cn(
            "rounded-lg border bg-muted/30 p-4 transition-colors",
            data.privacyTermsAccepted
              ? "border-accent/40"
              : "border-destructive/50",
          )}
        >
          <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={data.privacyTermsAccepted}
              onChange={(event) => {
                updatePrivacyTermsAccepted(event.target.checked);
                if (event.target.checked && error) {
                  setError(null);
                }
              }}
              className="mt-0.5 h-4 w-4 rounded accent-accent"
            />
            <span>I have read the Privacy Policy and Terms.</span>
          </label>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-secondary/80 disabled:opacity-50"
          >
            <svg
              className="inline-block mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !isSubmissionReady ||
              !isTurnstileVerified ||
              !turnstileSiteKey
            }
            className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-200 hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed electric-glow-sm"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  className="inline-block mr-2 h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                Submitting...
              </>
            ) : (
              <>
                Submit Request
                <svg
                  className="inline-block ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
