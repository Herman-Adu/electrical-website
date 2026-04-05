/**
 * ORGANISM: MessageDetailsStep (Step 4 of 5)
 *
 * Collects the actual message and communication preferences
 */

"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { MessageCircle, Mail, Phone, Clock } from "lucide-react";
import { FormInput } from "@/components/atoms/form-input";
import { FormTextarea } from "@/components/atoms/form-textarea";
import { FormCheckbox } from "@/components/atoms/form-checkbox";
import { RadioGroup } from "@/components/atoms/radio-group";
import { Button } from "@/components/ui/button";
import { useContactStore } from "../../../hooks/use-contact-store";
import {
  messageDetailsSchema,
  type MessageDetailsInput,
} from "../../../schemas/contact-schemas";

const contactMethodOptions = [
  { value: "email", label: "Email", description: "Respond via email" },
  { value: "phone", label: "Phone", description: "Call me back" },
  { value: "either", label: "Either", description: "No preference" },
];

const bestTimeOptions = [
  { value: "morning", label: "Morning", description: "9am - 12pm" },
  { value: "afternoon", label: "Afternoon", description: "12pm - 5pm" },
  { value: "evening", label: "Evening", description: "5pm - 8pm" },
  { value: "anytime", label: "Anytime", description: "No preference" },
];

export function MessageDetailsStep() {
  const { messageDetails, updateMessageDetails, nextStep, prevStep } =
    useContactStore();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<MessageDetailsInput>({
    resolver: zodResolver(messageDetailsSchema),
    defaultValues: messageDetails,
    mode: "onChange",
  });

  const messageText = watch("message") || "";
  const characterCount = messageText.length;
  const maxCharacters = 2000;

  const onSubmit = (data: MessageDetailsInput) => {
    updateMessageDetails(data);
    nextStep();
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
            <MessageCircle className="h-5 w-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">
              Your Message
            </h2>
          </div>
          <p className="text-muted-foreground text-sm">
            Tell us how we can help you. The more detail you provide, the better
            we can assist.
          </p>
        </div>

        {/* Subject */}
        <FormInput
          label="Subject"
          placeholder="Brief summary of your inquiry"
          error={errors.subject?.message}
          required
          {...register("subject")}
        />

        {/* Message */}
        <div className="space-y-2">
          <FormTextarea
            label="Message"
            placeholder="Please describe your inquiry in detail..."
            rows={6}
            error={errors.message?.message}
            required
            {...register("message")}
          />
          <div className="flex justify-end">
            <span
              className={`text-xs ${
                characterCount > maxCharacters
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}
            >
              {characterCount} / {maxCharacters} characters
            </span>
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="space-y-4 p-4 rounded-lg bg-card/50 border border-border">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Phone className="h-4 w-4 text-accent" />
            Contact Preferences
          </h3>

          <Controller
            name="preferredContactMethod"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="preferredContactMethod"
                label="Preferred contact method"
                options={contactMethodOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.preferredContactMethod?.message}
              />
            )}
          />

          <Controller
            name="bestTimeToContact"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="bestTimeToContact"
                label="Best time to contact"
                options={bestTimeOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.bestTimeToContact?.message}
              />
            )}
          />
        </div>

        {/* Newsletter Opt-in */}
        <Controller
          name="newsletterOptIn"
          control={control}
          render={({ field }) => (
            <FormCheckbox
              label="Subscribe to our newsletter"
              description="Receive updates about our services, tips, and special offers"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
            />
          )}
        />

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            type="submit"
            className="min-w-[140px]"
            disabled={!isValid || isSubmitting}
          >
            Review
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
