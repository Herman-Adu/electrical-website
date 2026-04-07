/**
 * MOLECULE: ContactSuccessMessage
 *
 * Displayed after successful contact form submission
 */

"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Mail,
  Clock,
  ArrowRight,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useContactStore } from "../../hooks/use-contact-store";

interface ContactSuccessMessageProps {
  referenceId?: string | null;
}

export function ContactSuccessMessage({
  referenceId,
}: ContactSuccessMessageProps) {
  const [copied, setCopied] = useState(false);
  const { resetForm } = useContactStore();

  const handleCopy = async () => {
    if (referenceId) {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNewInquiry = () => {
    resetForm();
    useContactStore.persist.clearStorage();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-lg mx-auto"
    >
      <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-8 text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20 flex items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </motion.div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Message Sent Successfully!
        </h2>
        <p className="text-muted-foreground mb-6">
          Thank you for contacting us. We&apos;ve received your inquiry and will
          respond as soon as possible.
        </p>

        {/* Reference ID */}
        {referenceId && (
          <div className="mb-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">
              Your Reference Number
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono font-bold text-accent">
                {referenceId}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="h-8 w-8 p-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Save this for your records
            </p>
          </div>
        )}

        {/* What Happens Next */}
        <div className="mb-6 p-4 rounded-lg bg-muted/50 text-left space-y-3">
          <h3 className="font-medium text-foreground text-sm">
            What happens next?
          </h3>
          <div className="flex items-start gap-3">
            <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              You&apos;ll receive a confirmation email shortly with your
              reference number.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Our team will review your inquiry and respond within 24-48 hours.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-transparent"
            onClick={handleNewInquiry}
          >
            Submit Another Inquiry
          </Button>
          <Button className="flex-1" asChild>
            <Link href="/">
              Return Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
