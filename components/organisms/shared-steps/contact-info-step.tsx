/**
 * SHARED STEP: ContactInfoStep
 *
 * A reusable contact information step used by multiple forms.
 * Collects name, email, phone, and optionally company name.
 * @module contact-info-step
 */

"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { FormInput } from "@/components/atoms/form-input";
import { FormStepContainer } from "@/components/molecules/form-step-container";

const ukPhoneRegex = /^(?:(?:\+44\s?|0)(?:7\d{3}|\d{3,4}))\s?\d{3}\s?\d{3,4}$/;

const contactInfoSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(ukPhoneRegex, "Please enter a valid UK phone number"),
  company: z.string().max(100, "Company name is too long").optional(),
});

export type ContactInfoInput = z.infer<typeof contactInfoSchema>;

interface ContactInfoStepProps {
  defaultValues?: Partial<ContactInfoInput>;
  onSubmit: (data: ContactInfoInput) => void;
  onPrevious?: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  title?: string;
  description?: string;
  showCompany?: boolean;
  showTurnstile?: boolean;
  turnstileSiteKey?: string;
  turnstileToken?: string | null;
  turnstileError?: string | null;
  onTurnstileTokenChange?: (token: string | null) => void;
  onTurnstileErrorChange?: (error: string | null) => void;
}

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

export function ContactInfoStep({
  defaultValues,
  onSubmit,
  onPrevious,
  isFirstStep = true,
  isLastStep = false,
  title = "Contact Information",
  description = "Please provide your contact details",
  showCompany = true,
  showTurnstile = false,
  turnstileSiteKey = "",
  turnstileToken = null,
  turnstileError = null,
  onTurnstileTokenChange,
  onTurnstileErrorChange,
}: ContactInfoStepProps) {
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid: formIsValid },
  } = useForm<ContactInfoInput>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues,
    mode: "onChange",
  });

  const turnstileRequired = showTurnstile;
  const isTurnstileVerified = !turnstileRequired || Boolean(turnstileToken);
  const isValid = formIsValid && isTurnstileVerified;

  const retryVerification = () => {
    onTurnstileTokenChange?.(null);
    onTurnstileErrorChange?.(null);
    turnstileRef.current?.reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormStepContainer
        title={title}
        description={description}
        icon={<User className="h-5 w-5" />}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onPrevious={onPrevious}
        isValid={isValid}
      >
        <div className="grid gap-6">
          {showTurnstile && (
            <div className="space-y-2">
              {turnstileSiteKey ? (
                <Turnstile
                  ref={turnstileRef}
                  siteKey={turnstileSiteKey}
                  options={{ theme: "auto", size: "normal" }}
                  onSuccess={(token) => {
                    onTurnstileTokenChange?.(token);
                    onTurnstileErrorChange?.(null);
                  }}
                  onExpire={() => {
                    onTurnstileTokenChange?.(null);
                    onTurnstileErrorChange?.(
                      "Verification expired. Please try again.",
                    );
                  }}
                  onError={(errorCode) => {
                    onTurnstileTokenChange?.(null);
                    onTurnstileErrorChange?.(
                      mapTurnstileClientError(errorCode),
                    );
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
                    className="h-7 rounded-md border border-border px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          )}

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
            required
            {...register("email")}
          />

          <FormInput
            label="Phone Number"
            type="tel"
            placeholder="07700 900000"
            error={errors.phone?.message}
            required
            {...register("phone")}
          />

          {showCompany && (
            <FormInput
              label="Company Name"
              placeholder="Your Company Ltd (Optional)"
              error={errors.company?.message}
              {...register("company")}
            />
          )}
        </div>
      </FormStepContainer>
    </form>
  );
}
