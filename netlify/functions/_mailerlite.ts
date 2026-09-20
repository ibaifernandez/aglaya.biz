interface MailerLiteSubscriberInput {
  email: string;
  groups: string[];
  ip?: string;
  name?: string;
  company?: string;
  language?: 'en' | 'es' | 'pt';
  entry_point?: string;
  service_interest?: string;
}

function getTimestamp(): string {
  return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function uniqueGroups(groups: string[]): string[] {
  return Array.from(new Set(groups.map((group) => group.trim()).filter(Boolean)));
}

export function getDispatchGroupId(): string {
  return (
    process.env.MAILERLITE_SUSCRIPCIONES_GROUP_ID ??
    process.env.MAILERLITE_GROUP_ID ??
    ''
  ).trim();
}

/**
 * Group for the **simple /contact form** (general inbound, no ICP
 * qualification). The only contact-side group left: the funnel's
 * Cualificados / No cualificados / Borderline groups were deleted from
 * MailerLite on 2026-09-01 and their routing was retired with them, so ICP
 * funnel leads no longer reach MailerLite at all (CRM + Resend still get them).
 */
export function getGeneralContactGroupId(): string {
  return (process.env.MAILERLITE_CONTACTO_GROUP_ID ?? '').trim();
}

export async function upsertMailerLiteSubscriber({
  email,
  groups,
  ip,
  name,
  company,
  language,
  entry_point,
  service_interest,
}: MailerLiteSubscriberInput): Promise<boolean> {
  const apiKey = process.env.MAILERLITE_API_KEY ?? '';
  const normalizedGroups = uniqueGroups(groups);

  if (!apiKey || normalizedGroups.length === 0) {
    return false;
  }

  const fields: Record<string, string> = {};
  if (name?.trim()) fields.name = name.trim();
  if (company?.trim()) fields.company = company.trim();
  if (language) fields.language = language;
  if (entry_point?.trim()) fields.entry_point = entry_point.trim();
  if (service_interest?.trim()) fields.service_interest = service_interest.trim();

  const now = getTimestamp();
  const response = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      fields: Object.keys(fields).length > 0 ? fields : undefined,
      groups: normalizedGroups,
      resubscribe: false,
      ip_address: ip || undefined,
      optin_ip: ip || undefined,
      opted_in_at: now,
      subscribed_at: now,
    }),
  });

  if (!response.ok) {
    console.error('[mailerlite] API error:', response.status, await response.text());
    return false;
  }

  return true;
}
