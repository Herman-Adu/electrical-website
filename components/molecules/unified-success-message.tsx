/**
 * MOLECULE: UnifiedSuccessMessage
 *
 * Shared success message component for all form types (contact, quotation, service request).
 * Combines animated success indicator with detailed information cards.
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
  FileText,
  X,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export type FormType = "service" | "contact" | "quotation";

interface DetailItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface UnifiedSuccessMessageProps {
  formType: FormType;
  referenceId: string;
  onStartNew: () => void;
  onDismiss?: () => void;
  title?: string;
  subtitle?: string;
  details?: DetailItem[];
}

export function UnifiedSuccessMessage({
  formType,
  referenceId,
  onStartNew,
  onDismiss,
  title,
  subtitle,
  details,
}: UnifiedSuccessMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDefaultTitle = () => {
    switch (formType) {
      case "service":
        return "Request Submitted!";
      case "contact":
        return "Message Sent Successfully!";
      case "quotation":
        return "Quotation Request Submitted";
      default:
        return "Success!";
    }
  };

  const getDefaultSubtitle = () => {
    switch (formType) {
      case "service":
        return "We've received your electrical service request and will contact you shortly.";
      case "contact":
        return "Thank you for contacting us. We've received your inquiry and will respond as soon as possible.";
      case "quotation":
        return "Thank you for your enquiry. Our team will review your requirements and get back to you with a detailed quotation.";
      default:
        return "Thank you for your submission.";
    }
  };

  const getDefaultDetails = (): DetailItem[] => {
    switch (formType) {
      case "service":
        return [
          {
            icon: <Mail className="w-4 h-4 text-electric-cyan" />,
            title: "Confirmation Email",
            description: "You will receive a confirmation email shortly",
          },
          {
            icon: <Clock className="w-4 h-4 text-electric-cyan" />,
            title: "Response Timeline",
            description:
              "Our team will respond within 24-48 hours based on urgency",
          },
          {
            icon: <ArrowRight className="w-4 h-4 text-electric-cyan" />,
            title: "Next Steps",
            description:
              "We'll reach out to schedule your service or provide a quote",
          },
        ];
      case "contact":
        return [
          {
            icon: <Mail className="w-4 h-4 text-electric-cyan" />,
            title: "Confirmation Email",
            description:
              "You'll receive a confirmation email shortly with your reference number.",
          },
          {
            icon: <Clock className="w-4 h-4 text-electric-cyan" />,
            title: "Response Timeline",
            description:
              "Our team will review your inquiry and respond within 24-48 hours.",
          },
          {
            icon: <ArrowRight className="w-4 h-4 text-electric-cyan" />,
            title: "Next Steps",
            description:
              "A specialist will review your enquiry and contact you with clear next steps.",
          },
        ];
      case "quotation":
        return [
          {
            icon: <Mail className="w-4 h-4 text-electric-cyan" />,
            title: "Confirmation Email",
            description: "You will receive a confirmation email shortly",
          },
          {
            icon: <Clock className="w-4 h-4 text-electric-cyan" />,
            title: "Review Process",
            description:
              "Our team will review your requirements within 2-5 business days",
          },
          {
            icon: <FileText className="w-4 h-4 text-electric-cyan" />,
            title: "Detailed Quotation",
            description: "You will receive a comprehensive quotation via email",
          },
        ];
      default:
        return [];
    }
  };

  const finalTitle = title || getDefaultTitle();
  const finalSubtitle = subtitle || getDefaultSubtitle();
  const finalDetails = details || getDefaultDetails();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
      <div className="relative rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
        {onDismiss && (
          <div className="absolute top-4 right-4 z-10">
            {/* Pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-electric-cyan/40"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Close button */}
            <motion.button
              onClick={onDismiss}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-electric-cyan/10 hover:bg-electric-cyan/20 text-electric-cyan border border-electric-cyan/30 hover:border-electric-cyan/60 transition-colors duration-200"
              aria-label="Close success message"
              type="button"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
        )}
        {/* Header Section with Glassmorphic Effect */}
        <div className="p-4 bg-linear-to-r from-accent/10 to-transparent border-b border-border/50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative text-center justify-center align-middle"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </motion.div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold text-electric-cyan mb-4">
              {finalTitle}
            </h2>

            {/* Subtitle */}
            <p className="text-foreground dark:text-foreground/80 text-sm sm:text-base">
              {finalSubtitle}
            </p>
          </motion.div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Reference ID Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-foreground dark:text-foreground/80 mb-2 text-left">
                {formType === "service"
                  ? "Service Request Reference"
                  : formType === "quotation"
                    ? "Your Reference Number"
                    : "Your Reference Number"}
              </p>
              <div className="flex items-center justify-start gap-2">
                <code className="text-lg font-mono font-bold text-electric-cyan break-all">
                  {referenceId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 w-8 p-0 shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-left">
                Save this for your records
              </p>
            </div>
          </div>

          {/* What Happens Next Details */}
          {finalDetails && finalDetails.length > 0 && (
            <div className="flex justify-center">
              <div className="w-full max-w-2xl justify-center">
                <h3 className="text-lg font-semibold text-foreground dark:text-foreground/80 text-center mb-4">
                  What Happens Next?
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-auto w-fill justify-center">
                  {finalDetails.map((detail, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + idx * 0.1 }}
                      className="flex flex-col items-start text-left p-4 rounded-lg bg-card/50 border border-border/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                        {detail.icon}
                      </div>
                      <h4 className="font-medium text-foreground dark:text-foreground/80 text-sm mb-1 text-left">
                        {detail.title}
                      </h4>
                      <p className="text-xs text-foreground dark:text-foreground/80 text-left">
                        {detail.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto w-full">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={onStartNew}
            >
              {formType === "service"
                ? "Submit Another Request"
                : formType === "quotation"
                  ? "Submit Another Request"
                  : "Submit Another Inquiry"}
            </Button>
            <Button className="flex-1" asChild>
              <Link href="/">
                Return Home
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
