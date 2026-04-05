export function resolveStepFromFieldPath(fieldPath: string): number {
  if (fieldPath.startsWith("contact.")) return 0;
  if (fieldPath.startsWith("serviceDetails.")) return 1;
  if (fieldPath.startsWith("propertyInfo.")) return 2;
  if (fieldPath.startsWith("turnstileToken")) return 0;
  return 3;
}
