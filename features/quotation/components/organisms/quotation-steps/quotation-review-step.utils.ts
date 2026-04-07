export function resolveStepFromFieldPath(fieldPath: string): number {
  if (fieldPath.startsWith("contact.")) return 0;
  if (fieldPath.startsWith("projectType.")) return 1;
  if (fieldPath.startsWith("scope.")) return 2;
  if (fieldPath.startsWith("site.")) return 3;
  if (fieldPath.startsWith("budget.")) return 4;
  if (fieldPath.startsWith("additional.")) return 5;
  if (fieldPath.startsWith("turnstileToken")) return 6;
  return 6;
}
