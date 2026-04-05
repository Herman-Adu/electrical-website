/**
 * ORGANISM: ContactInfoStep (Step 1 of 5)
 *
 * Collects basic contact information from the user.
 */

"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { User, Mail } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormInput } from "@/components/atoms/form-input";
import { Button } from "@/components/ui/button";
import { useContactStore } from "../../../hooks/use-contact-store";
import {
  contactInfoSchema,
  type ContactInfoInput,
} from "../../../schemas/contact-schemas";

export function ContactInfoStep() {
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    contactInfo,
    updateContactInfo,
    nextStep,
    turnstileToken,
    turnstileError,
    setTurnstileToken,
    setTurnstileError,
  } = useContactStore();

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const isTurnstileVerified = Boolean(turnstileToken);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: contactInfo,
    mode: "onChange",
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  const onSubmit = (data: ContactInfoInput) => {
    updateContactInfo(data);
    nextStep();
  };

  const retryVerification = () => {
    setTurnstileToken(null);
    setTurnstileError(null);
    turnstileRef.current?.reset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Your Contact Details
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Please provide your contact information so we can respond to your
            inquiry.
          </p>
        </div>

        <div className="space-y-2" data-testid="turnstile-widget">
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
              onError={() => {
                setTurnstileToken(null);
                setTurnstileError("Verification failed. Please retry.");
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
                onClick={retryVerification}
                className="h-7 px-2 text-xs"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="John Smith"
            error={errors.fullName?.message}
            required
            {...register("fullName")}
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="john.smith@example.com"
            error={errors.email?.message}
            helperText="We'll send confirmation to this address"
            required
            {...register("email")}
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="07700 900000"
            error={errors.phone?.message}
            helperText="UK mobile or landline number"
            required
            {...register("phone")}
          />

          <FormInput
            label="Company Name"
            placeholder="Your Company Ltd (Optional)"
            error={errors.company?.message}
            helperText="If contacting on behalf of a business"
            {...register("company")}
          />
        </div>

        {/* Info Card */}
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Privacy Notice
              </p>
              <p className="text-xs text-muted-foreground">
                Your information is secure and will only be used to respond to
                your inquiry. We never share your details with third parties.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="min-w-35"
            disabled={!isValid || isSubmitting || !isTurnstileVerified}
          >
            Continue
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
