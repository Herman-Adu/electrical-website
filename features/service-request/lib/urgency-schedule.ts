export type ServiceUrgency = "routine" | "urgent" | "emergency";

interface UrgencyScheduleValidationInput {
  urgency: ServiceUrgency;
  preferredDate: string;
  now?: Date;
}

function startOfDay(date: Date): Date {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

export function getUrgencyScheduleValidationError({
  urgency,
  preferredDate,
  now = new Date(),
}: UrgencyScheduleValidationInput): string | null {
  if (!preferredDate) {
    return null;
  }

  const selectedDate = startOfDay(new Date(preferredDate));
  const today = startOfDay(now);

  if (Number.isNaN(selectedDate.getTime())) {
    return "Please select a valid preferred date.";
  }

  if (urgency === "emergency") {
    const emergencyLimit = addDays(today, 1);
    if (selectedDate > emergencyLimit) {
      return "Emergency services must be scheduled within 24 hours.";
    }
  }

  if (urgency === "urgent") {
    const urgentLimit = addDays(today, 2);
    if (selectedDate > urgentLimit) {
      return "Urgent services must be scheduled within 48 hours.";
    }
  }

  return null;
}
