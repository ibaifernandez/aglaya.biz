/**
 * CRM AGLAYA dispatch helper.
 *
 * Endpoint contract (negotiated with crm-aglaya thread, 2026-05-25):
 *   POST <CRM_LEADS_CAPTURE_URL>
 *   Header: X-CRM-API-Key
 *   Body:   { email, name, company, phone, title, source, notes,
 *             lead_score (0..100|null), language ('en'|'es'|'pt'|null),
 *             utm_source, utm_medium, utm_campaign, utm_content,
 *             utm_term, fbclid, landing_source,
 *             privacy_policy_version, privacy_policy_displayed_at }
 *             — all but email nullable
 *
 *   privacy_policy_version / privacy_policy_displayed_at are the GDPR
 *   Art. 5(2) accountability record: which privacy-policy version was live
 *   on the form when the user submitted, and the submission timestamp. Basis
 *   is legitimate interest (not consent), so this evidences "what notice was
 *   shown", not consent. Persisted as columns on crm_deals (CRM-side change
 *   landed 2026-05-29).
 *   Resp:   201 with { contact_id, deal_id, deal_path, lead_score, language }
 *
 * Important behaviors:
 *   - The CRM may respond 201 with `excluded: true` (and `deal_id: null`)
 *     when the email matches an exclusion entry server-side (gmail
 *     plus-alias normalization, blocklist, etc.). This is INTENTIONAL —
 *     the sender should not need to know. We surface it as
 *     outcome='excluded' so callers can log it apart from successful
 *     captures.
 *   - 4xx responses (typically 422 = payload validation) → outcome='rejected'.
 *     Means our payload is malformed (our bug). Captured to Sentry.
 *   - 5xx / network errors → outcome='failed'. Means CRM is down or
 *     unreachable (their bug or transient). Captured to Sentry.
 *   - 201 with `excluded: false` AND `deal_id: null` → outcome='anomaly'.
 *     Should never happen (CRM contract violation). Captured to Sentry.
 *   - If `CRM_API_KEY` or `CRM_LEADS_CAPTURE_URL` is unset, dispatch is
 *     skipped silently with outcome='skipped'. Useful for local dev /
 *     deploy-previews without the secret wired up.
 *   - We never throw. The helper always resolves with a CrmDispatchResult.
 *     Callers decide what to do (typically: log + continue, never bounce
 *     the visitor).
 */

type CrmSource =
  | 'aglaya-form-qualified'
  | 'aglaya-form-borderline'
  | 'aglaya-form-open-channel';

type CrmLanguage = 'en' | 'es' | 'pt';

export interface CrmLeadInput {
  email: string;
  source: CrmSource;
  leadScore: number | null;
  name?: string;
  company?: string;
  phone?: string;
  title?: string;
  notes?: string;
  language?: CrmLanguage;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  landing_source?: string;
  privacyPolicyVersion?: string;
  privacyPolicyDisplayedAt?: string;
}

export type CrmDispatchOutcome =
  | 'skipped'
  | 'created'
  | 'excluded'
  | 'anomaly'
  | 'rejected'
  | 'failed';

/** Outcomes that warrant Sentry capture — i.e. require human attention. */
export const CRM_ATTENTION_OUTCOMES: ReadonlySet<CrmDispatchOutcome> = new Set([
  'anomaly',
  'rejected',
  'failed',
]);

export interface CrmDispatchResult {
  outcome: CrmDispatchOutcome;
  status?: number;
  contactId?: string | null;
  dealId?: string | null;
  leadScoreEcho?: number | null;
  languageEcho?: string | null;
  excluded?: boolean | null;
  error?: string;
}

const NOTES_MAX_LEN = 1800;

function clampLeadScore(value: number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (!Number.isFinite(value)) return null;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function truncateNotes(notes: string, max = NOTES_MAX_LEN): string {
  if (notes.length <= max) return notes;
  return `${notes.slice(0, max - 1)}…`;
}

function nullableString(value: string | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value.trim();
  return trimmed.length === 0 ? null : trimmed;
}

/**
 * Map the ICP funnel status into the CRM source taxonomy negotiated with the
 * CRM thread. Returns null if the status does not map to a CRM-bound source
 * (e.g., empty, unknown, or a state we explicitly do not forward).
 */
export function deriveCrmSource(icpStatus?: string): CrmSource | null {
  const normalized = (icpStatus ?? '').trim().toUpperCase();
  if (normalized === 'QUALIFIED') return 'aglaya-form-qualified';
  if (normalized === 'BORDERLINE') return 'aglaya-form-borderline';
  if (normalized === 'OPEN_CHANNEL' || normalized.startsWith('BLOCKED')) {
    return 'aglaya-form-open-channel';
  }
  return null;
}

export function deriveLeadScore(rawIcpSignalScore?: string): number | null {
  if (rawIcpSignalScore === undefined || rawIcpSignalScore === null) return null;
  const trimmed = String(rawIcpSignalScore).trim();
  if (trimmed.length === 0) return null;
  const parsed = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(parsed)) return null;
  return clampLeadScore(parsed);
}

function normalizeLanguage(value: string | undefined): CrmLanguage | null {
  if (value === 'en' || value === 'es' || value === 'pt') return value;
  return null;
}

/**
 * Build the short operator-facing notes string the brief asked for.
 * Format: "[ICP=<state>, score=<n>, data=<x>, investment=<y>, manual=<z>] <user message>"
 * Clamped to NOTES_MAX_LEN.
 */
export function buildCrmNotes(args: {
  message?: string;
  icpStatus?: string;
  icpPrimaryState?: string;
  manualExecution?: string;
  dataInfrastructure?: string;
  growthInvestment?: string;
  leadScore?: number | null;
}): string | null {
  const summaryParts: string[] = [];
  const state = (args.icpPrimaryState ?? args.icpStatus ?? '').trim().toLowerCase();
  if (state) summaryParts.push(`icp=${state}`);
  if (args.leadScore !== null && args.leadScore !== undefined) {
    summaryParts.push(`score=${args.leadScore}`);
  }
  const data = (args.dataInfrastructure ?? '').trim();
  if (data) summaryParts.push(`data=${data}`);
  const investment = (args.growthInvestment ?? '').trim();
  if (investment) summaryParts.push(`investment=${investment}`);
  const manual = (args.manualExecution ?? '').trim();
  if (manual) summaryParts.push(`manual=${manual}`);

  const summary = summaryParts.length > 0 ? `[${summaryParts.join(', ')}]` : '';
  const message = (args.message ?? '').trim();

  const combined = [summary, message].filter(Boolean).join(' ');
  if (!combined) return null;
  return truncateNotes(combined);
}

export async function dispatchLeadToCrm(input: CrmLeadInput): Promise<CrmDispatchResult> {
  const apiKey = (process.env.CRM_API_KEY ?? '').trim();
  const url = (process.env.CRM_LEADS_CAPTURE_URL ?? '').trim();

  if (!apiKey || !url) {
    console.warn(
      '[crm] CRM_API_KEY or CRM_LEADS_CAPTURE_URL not set — skipping CRM dispatch',
    );
    return { outcome: 'skipped' };
  }

  const body = {
    email: input.email,
    name: nullableString(input.name),
    company: nullableString(input.company),
    phone: nullableString(input.phone),
    title: nullableString(input.title),
    source: input.source,
    notes: input.notes ? truncateNotes(input.notes) : null,
    lead_score: clampLeadScore(input.leadScore),
    language: normalizeLanguage(input.language),
    utm_source: nullableString(input.utm_source),
    utm_medium: nullableString(input.utm_medium),
    utm_campaign: nullableString(input.utm_campaign),
    utm_content: nullableString(input.utm_content),
    utm_term: nullableString(input.utm_term),
    fbclid: nullableString(input.fbclid),
    landing_source: nullableString(input.landing_source),
    privacy_policy_version: nullableString(input.privacyPolicyVersion),
    privacy_policy_displayed_at: nullableString(input.privacyPolicyDisplayedAt),
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CRM-API-Key': apiKey,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      const isRejection = response.status >= 400 && response.status < 500;
      const outcome: CrmDispatchOutcome = isRejection ? 'rejected' : 'failed';
      console.error(
        `[crm] dispatch ${outcome} status=${response.status} email=${input.email} body=${errText.slice(0, 240)}`,
      );
      return {
        outcome,
        status: response.status,
        error: errText.slice(0, 500),
      };
    }

    const data = (await response.json().catch(() => ({}))) as {
      contact_id?: string | null;
      deal_id?: string | null;
      lead_score?: number | null;
      language?: string | null;
      excluded?: boolean | null;
    };

    const contactId = data?.contact_id ?? null;
    const dealId = data?.deal_id ?? null;
    const leadScoreEcho = typeof data?.lead_score === 'number' ? data.lead_score : null;
    const languageEcho = typeof data?.language === 'string' ? data.language : null;
    const excluded = data?.excluded === true;

    if (excluded) {
      // CRM-side exclusion filter caught it (gmail plus-alias normalization,
      // blocklist, etc.). Intentional silent drop on their side.
      console.log(
        `[crm] lead excluded status=${response.status} email=${input.email} contact_id=${contactId ?? 'null'}`,
      );
      return {
        outcome: 'excluded',
        status: response.status,
        contactId,
        dealId,
        leadScoreEcho,
        languageEcho,
        excluded: true,
      };
    }

    if (!dealId) {
      // 2xx + excluded:false + no deal_id should never happen per CRM
      // contract. Capture as anomaly for human review.
      console.error(
        `[crm] anomaly status=${response.status} email=${input.email} excluded=false but deal_id=null`,
      );
      return {
        outcome: 'anomaly',
        status: response.status,
        contactId,
        dealId,
        leadScoreEcho,
        languageEcho,
        excluded: false,
      };
    }

    console.log(
      `[crm] lead created status=${response.status} email=${input.email} deal_id=${dealId} lead_score=${leadScoreEcho ?? 'null'} language=${languageEcho ?? 'null'}`,
    );
    return {
      outcome: 'created',
      status: response.status,
      contactId,
      dealId,
      leadScoreEcho,
      languageEcho,
      excluded: false,
    };
  } catch (err) {
    console.error('[crm] dispatch threw:', err);
    return {
      outcome: 'failed',
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
