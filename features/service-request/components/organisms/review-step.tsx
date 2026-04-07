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
import { motion } from "framer-motion";
import { useFormStore } from "../../hooks/use-form-store";
import { PulseCircle } from "@/components/animations/pulse-circle";
import { scrollToElementWithOffset } from "@/lib/scroll-to-section";
import { submitServiceRequest } from "../../api/service-request";
import { ReviewStepDisplay } from "./review-step-display";

const SUCCESS_VISIBILITY_MS = 5000;
const SERVICE_PROGRESS_ANCHOR_ID = "service-form-progress-anchor";
const SERVICE_SCROLL_TOP_GAP = 28;

export function ReviewStep() {
  const { data, prevStep, goToStep, resetForm, updateGdprConsent } =
    useFormStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }

    successTimerRef.current = window.setTimeout(() => {
      resetForm();
      setIsSubmitted(false);
      setRequestId(null);
      setError(null);

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
    if (!data.gdprConsent) {
      setError("Please confirm GDPR consent before submitting your request.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitServiceRequest(data);

      if (result.success) {
        setRequestId(result.data.requestId);
        setIsSubmitted(true);
      } else {
        setError(result.error);
      }
    } catch (err) {
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

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="mb-6 relative">
          <motion.div
            className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center electric-glow relative"
            animate={{
              boxShadow: [
                "0 0 20px rgba(var(--accent), 0.3)",
                "0 0 40px rgba(var(--accent), 0.5)",
                "0 0 20px rgba(var(--accent), 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <PulseCircle size={64} />
            <motion.svg
              className="w-8 h-8 text-accent relative z-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-2">
          Request Submitted!
        </h2>
        <p className="text-muted-foreground mb-2">
          We've received your electrical service request and will contact you
          shortly.
        </p>
        {requestId && (
          <p className="text-sm text-muted-foreground mb-8">
            Reference:{" "}
            <span className="font-mono font-semibold text-foreground">
              {requestId}
            </span>
          </p>
        )}

        <button
          onClick={handleStartOver}
          className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-lg font-medium transition-all duration-200 hover:bg-secondary/80"
        >
          Submit Another Request
        </button>
      </motion.div>
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
                className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
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

        <div className="rounded-lg border border-border bg-muted/30 p-4">
          <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
            <input
              type="checkbox"
              checked={data.gdprConsent}
              onChange={(event) => {
                updateGdprConsent(event.target.checked);
                if (
                  event.target.checked &&
                  error?.toLowerCase().includes("gdpr")
                ) {
                  setError(null);
                }
              }}
              className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
            />
            <span>
              I consent to the processing of my personal data for handling this
              service request in line with the Privacy Policy.
            </span>
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
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-accent text-accent-foreground rounded-lg font-medium transition-all duration-200 hover:bg-accent/90 disabled:opacity-50 electric-glow-sm"
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
