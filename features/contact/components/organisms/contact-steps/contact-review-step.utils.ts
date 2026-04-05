export function resolveStepFromFieldPath(fieldPath: string): number {
  if (fieldPath.startsWith("contactInfo.")) return 1;
  if (fieldPath.startsWith("inquiryType.")) return 2;
  if (fieldPath.startsWith("referenceLinking.")) return 3;
  if (fieldPath.startsWith("messageDetails.")) return 4;
  if (fieldPath.startsWith("turnstileToken")) return 1;
  return 5;
}
