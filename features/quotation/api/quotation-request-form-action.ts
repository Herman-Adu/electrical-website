import {
  completeQuotationSchema,
  type CompleteQuotationInput,
} from "../schemas/quotation-schemas";
import type {
  QuotationFormActionState,
  QuotationSubmissionResult,
} from "@/lib/actions/action.types";

export function buildFieldErrors(
  issues: Array<{ path: (string | number)[]; message: string }>,
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = [];
    }
    fieldErrors[path].push(issue.message);
  }

  return fieldErrors;
}

function parsePayloadFromFormData(
  formData: FormData,
):
  | { success: true; data: CompleteQuotationInput }
  | { success: false; state: QuotationFormActionState } {
  const payload = formData.get("payload");

  if (typeof payload !== "string" || payload.length === 0) {
    return {
      success: false,
      state: {
        success: false,
        error: "Invalid submission payload. Please review and try again.",
      },
    };
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payload);
  } catch {
    return {
      success: false,
      state: {
        success: false,
        error: "Unable to process form payload. Please try again.",
      },
    };
  }

  const parsedData = completeQuotationSchema.safeParse(parsedPayload);
  if (!parsedData.success) {
    return {
      success: false,
      state: {
        success: false,
        error: "Please correct the highlighted fields and try again.",
        fieldErrors: buildFieldErrors(parsedData.error.issues),
      },
    };
  }

  return { success: true, data: parsedData.data };
}

export async function submitQuotationRequestFormCore(
  _previousState: QuotationFormActionState,
  formData: FormData,
  submitQuotationRequest: (
    data: CompleteQuotationInput,
  ) => Promise<QuotationSubmissionResult>,
): Promise<QuotationFormActionState> {
  const parsed = parsePayloadFromFormData(formData);
  if (!parsed.success) {
    return parsed.state;
  }

  const result = await submitQuotationRequest(parsed.data);
  return {
    success: result.success,
    requestId: result.requestId,
    error: result.error,
    fieldErrors: result.fieldErrors,
  };
}
