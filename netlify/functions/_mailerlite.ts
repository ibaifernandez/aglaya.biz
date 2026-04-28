interface MailerLiteSubscriberInput {
  email: string;
  groups: string[];
  ip?: string;
  name?: string;
  company?: string;
  language?: 'en' | 'es' | 'pt';
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

export function getContactGroupIds(icpStatus?: string, icpPrimaryState?: string): string[] {
  const normalizedStatus = (icpStatus ?? '').trim().toUpperCase();
  const normalizedPrimaryState = (icpPrimaryState ?? '').trim().toLowerCase();

  const fallbackGroup =
    (process.env.MAILERLITE_NO_CUALIFICADOS_GROUP_ID ??
      process.env.MAILERLITE_CONTACTO_GROUP_ID ??
      '').trim();

  const blockedGroup =
    (process.env.MAILERLITE_NO_CUALIFICADOS_GROUP_ID ??
      process.env.MAILERLITE_CONTACTO_BLOCKED_GROUP_ID ??
      '').trim() || fallbackGroup;
  const borderlineGroup =
    (process.env.MAILERLITE_BORDERLINE_GROUP_ID ??
      process.env.MAILERLITE_CONTACTO_BORDERLINE_GROUP_ID ??
      '').trim() || fallbackGroup;
  const qualifiedGroup =
    (process.env.MAILERLITE_CUALIFICADOS_GROUP_ID ??
      process.env.MAILERLITE_CONTACTO_QUALIFIED_GROUP_ID ??
      '').trim() || fallbackGroup;

  if (normalizedStatus === 'QUALIFIED') return uniqueGroups([qualifiedGroup]);
  if (normalizedStatus === 'BORDERLINE') return uniqueGroups([borderlineGroup]);

  if (
    normalizedStatus === 'OPEN_CHANNEL' ||
    normalizedStatus.startsWith('BLOCKED') ||
    normalizedPrimaryState.startsWith('blocked')
  ) {
    return uniqueGroups([blockedGroup]);
  }

  return uniqueGroups([fallbackGroup]);
}

export async function upsertMailerLiteSubscriber({
  email,
  groups,
  ip,
  name,
  company,
  language,
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
      resubscribe: true,
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
