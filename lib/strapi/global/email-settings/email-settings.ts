export interface EmailSettings {
  fromEmail?: string | null;
  contactFromEmail?: string | null;
  quotationFromEmail?: string | null;
  replyToEmail?: string | null;
  slaResponseHours?: number | null;
  slaUrgentHours?: number | null;
  footerDisclaimer?: string | null;
  emailSignatureTemplate?: string | null;
  slaJson?: string | null;
  urgencyColorsJson?: string | null;
}

export async function getEmailSettings(): Promise<EmailSettings | null> {
  return null;
}
