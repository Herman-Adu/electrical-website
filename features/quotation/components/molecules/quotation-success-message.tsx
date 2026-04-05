/**
 * MOLECULE: QuotationSuccessMessage
 * 
 * Displayed after successful quotation form submission.
 */

"use client"

import { motion } from "framer-motion"
import { CheckCircle, FileText, Clock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface QuotationSuccessMessageProps {
  requestId: string
  onStartNew: () => void
}

export function QuotationSuccessMessage({ requestId, onStartNew }: QuotationSuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center space-y-8 py-12"
    >
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-accent" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center"
          >
            <FileText className="w-4 h-4 text-accent-foreground" />
          </motion.div>
        </div>
      </motion.div>

      {/* Success Message */}
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          Quotation Request Submitted
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thank you for your enquiry. Our team will review your requirements and get back to you with a detailed quotation.
        </p>
      </div>

      {/* Reference ID */}
      <div className="bg-card border border-border rounded-lg p-6 max-w-sm mx-auto">
        <p className="text-sm text-muted-foreground mb-2">Your Reference Number</p>
        <p className="text-2xl font-mono font-bold text-accent">{requestId}</p>
        <p className="text-xs text-muted-foreground mt-2">Please save this for your records</p>
      </div>

      {/* What Happens Next */}
      <div className="max-w-md mx-auto space-y-4">
        <h3 className="text-lg font-semibold text-foreground">What Happens Next?</h3>
        <div className="grid gap-4">
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Confirmation Email</p>
              <p className="text-sm text-muted-foreground">You will receive a confirmation email shortly</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Review Process</p>
              <p className="text-sm text-muted-foreground">Our team will review your requirements within 2-5 business days</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">Detailed Quotation</p>
              <p className="text-sm text-muted-foreground">You will receive a comprehensive quotation via email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <Button
          onClick={onStartNew}
          variant="outline"
          className="gap-2 bg-transparent"
        >
          Submit Another Request
        </Button>
        <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </motion.div>
  )
}
