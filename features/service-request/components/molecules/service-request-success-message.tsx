"use client";

import { CheckCircle, Clock, Mail, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ServiceRequestSuccessMessageProps {
  requestId: string;
  onStartNew: () => void;
}

export function ServiceRequestSuccessMessage({
  requestId,
  onStartNew,
}: ServiceRequestSuccessMessageProps) {
  return (
    <div className="text-center space-y-8 py-10">
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-accent/15 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-accent" />
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-foreground">
          Service Request Submitted
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Thanks for contacting us. Our team has received your request and will
          respond based on your selected urgency.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-5 max-w-sm mx-auto">
        <p className="text-sm text-muted-foreground mb-2">Reference Number</p>
        <p className="text-2xl font-mono font-bold text-accent">{requestId}</p>
      </div>

      <div className="max-w-md mx-auto grid gap-3 text-left">
        <div className="flex items-start gap-3">
          <Mail className="w-4 h-4 mt-0.5 text-accent" />
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your inbox.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 mt-0.5 text-accent" />
          <p className="text-sm text-muted-foreground">
            We will follow up according to your selected urgency.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Wrench className="w-4 h-4 mt-0.5 text-accent" />
          <p className="text-sm text-muted-foreground">
            Keep your reference ID for any follow-up communication.
          </p>
        </div>
      </div>

      <Button onClick={onStartNew} variant="outline" className="bg-transparent">
        Submit Another Request
      </Button>
    </div>
  );
}
