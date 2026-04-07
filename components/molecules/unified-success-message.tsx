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
  title?: string;
  subtitle?: string;
  details?: DetailItem[];
}

export function UnifiedSuccessMessage({
  formType,
  referenceId,
  onStartNew,
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
            icon: <Mail className="w-4 h-4 text-accent" />,
            title: "Confirmation Email",
            description: "You will receive a confirmation email shortly",
          },
          {
            icon: <Clock className="w-4 h-4 text-accent" />,
            title: "Response Timeline",
            description:
              "Our team will respond within 24-48 hours based on urgency",
          },
          {
            icon: <ArrowRight className="w-4 h-4 text-accent" />,
            title: "Next Steps",
            description:
              "We'll reach out to schedule your service or provide a quote",
          },
        ];
      case "contact":
        return [
          {
            icon: <Mail className="w-4 h-4 text-accent" />,
            title: "Confirmation Email",
            description:
              "You'll receive a confirmation email shortly with your reference number.",
          },
          {
            icon: <Clock className="w-4 h-4 text-accent" />,
            title: "Response Timeline",
            description:
              "Our team will review your inquiry and respond within 24-48 hours.",
          },
        ];
      case "quotation":
        return [
          {
            icon: <Mail className="w-4 h-4 text-accent" />,
            title: "Confirmation Email",
            description: "You will receive a confirmation email shortly",
          },
          {
            icon: <Clock className="w-4 h-4 text-accent" />,
            title: "Review Process",
            description:
              "Our team will review your requirements within 2-5 business days",
          },
          {
            icon: <FileText className="w-4 h-4 text-accent" />,
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
      <div className="mx-auto space-y-8 border-2 border-accent/30 rounded-lg p-8 bg-background/50">
        {/* Header Section with Glassmorphic Effect */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative rounded-xl border border-accent/30 bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-md p-8 text-center"
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            {finalTitle}
          </h2>

          {/* Subtitle */}
          <p className="text-muted-foreground text-sm sm:text-base">
            {finalSubtitle}
          </p>
        </motion.div>

        {/* Reference ID Card */}
        <div className="max-w-sm mx-auto">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-2">
              {formType === "service"
                ? "Service Request Reference"
                : formType === "quotation"
                  ? "Your Reference Number"
                  : "Your Reference Number"}
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-lg font-mono font-bold text-accent break-all">
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
            <p className="text-xs text-muted-foreground mt-2">
              Save this for your records
            </p>
          </div>
        </div>

        {/* What Happens Next Details */}
        {finalDetails && finalDetails.length > 0 && (
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <h3 className="text-lg font-semibold text-foreground text-center mb-4">
                What Happens Next?
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mx-auto">
                {finalDetails.map((detail, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-card/50 border border-border/50"
                  >
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                      {detail.icon}
                    </div>
                    <h4 className="font-medium text-foreground text-sm mb-1">
                      {detail.title}
                    </h4>
                    <p className="text-xs text-muted-foreground text-center">
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
    </motion.div>
  );
}
