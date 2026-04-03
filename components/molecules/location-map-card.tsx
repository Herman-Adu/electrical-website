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
    <div className="rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 overflow-hidden">
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
          <MapPin className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">Our Location</h3>
        </div>

        {/* Address */}
        <div className="space-y-1">
          <p className="text-sm text-foreground">{address.line1}</p>
          {address.line2 && (
            <p className="text-sm text-foreground">{address.line2}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {address.city}, {address.county && `${address.county}, `}
            {address.postcode}
          </p>
          <p className="text-sm text-muted-foreground">{address.country}</p>
        </div>

        {/* Contact Details */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <Phone className="h-4 w-4" />
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            <Mail className="h-4 w-4" />
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
            <ExternalLink className="h-4 w-4 mr-2" />
            Get Directions
          </a>
        </Button>
      </div>
    </div>
  );
}
