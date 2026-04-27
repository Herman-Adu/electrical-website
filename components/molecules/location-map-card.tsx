/**
 * MOLECULE: LocationMapCard
 *
 * Displays office location with embedded map and contact details
 */

"use client";

import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationMapCardProps {
  address?: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  mapEmbedUrl?: string;
}

const defaultAddress = {
  line1: "46 Nursery Road",
  city: "Taplow",
  county: "England",
  postcode: "SL6 0JZ",
  country: "United Kingdom",
};

const defaultMapUrl =
  "https://www.openstreetmap.org/export/embed.html?bbox=-0.706%2C51.514%2C-0.666%2C51.534&layer=mapnik&marker=51.524%2C-0.686";

export function LocationMapCard({
  address = defaultAddress,
  phone = "+44 1628 600 123",
  email = "info@nexgen-electrical-innovations.co.uk",
  mapEmbedUrl = defaultMapUrl,
}: LocationMapCardProps) {
  const fullAddress = [
    address.line1,
    address.line2,
    address.city,
    address.county,
    address.postcode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <div className="rounded-xl bg-gradient-to-br from-white/95 dark:from-background/90 to-[hsl(174_100%_35%)]/5 dark:to-background/70 backdrop-blur-sm border border-[hsl(174_100%_35%)]/20 dark:border-electric-cyan/20 shadow-[0_20px_60px_-40px_hsl(174_100%_35%_/_0.15)] dark:shadow-[0_20px_60px_-40px_rgba(0,243,189,0.2)] overflow-hidden">
      {/* Map */}
      <div className="relative h-48 bg-muted">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Office Location"
          className="absolute inset-0"
        />
        {/* Overlay for styling */}
        <div className="absolute inset-0 pointer-events-none border-b border-border/50" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-electric-cyan" />
          <h3 className="font-semibold text-foreground dark:text-foreground/80">
            Our Location
          </h3>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <p className="text-sm text-foreground dark:text-foreground/80">
            {address.line1}
          </p>
          {address.line2 && (
            <p className="text-sm text-foreground dark:text-foreground/80">
              {address.line2}
            </p>
          )}
          <p className="text-sm text-foreground dark:text-foreground/80">
            {address.city}, {address.county && `${address.county}, `}
            {address.postcode}
          </p>
          <p className="text-sm text-foreground dark:text-foreground/80">
            {address.country}
          </p>
        </div>

        {/* Contact Details */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm text-foreground dark:text-foreground/80 hover:text-electric-cyan dark:hover:text-electric-cyan transition-colors"
          >
            <Phone className="h-4 w-4 text-electric-cyan" />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-foreground dark:text-foreground/80 hover:text-electric-cyan dark:hover:text-electric-cyan transition-colors"
          >
            <Mail className="h-4 w-4 text-electric-cyan" />
            {email}
          </a>
        </div>

        {/* Get Directions Button */}
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-transparent"
          asChild
        >
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4 mr-2 text-electric-cyan" />
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
