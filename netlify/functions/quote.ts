import type { Handler } from '@netlify/functions';
import path from 'path';
// @ts-expect-error — standalone build has no separate .d.ts; API is identical to main
import PDFDocument from 'pdfkit/js/pdfkit.standalone.js';
import { tokens } from '@aglaya/design-tokens';
import { upsertMailerLiteSubscriber } from './_mailerlite';
import { captureFunctionException, initFunctionSentry } from './_sentry';

// ---------------------------------------------------------------------------
// Pricing constants (source of truth — mirrors QuoteCalculator.astro)
// ---------------------------------------------------------------------------
const BASE_PRICES: Record<string, number> = {
  landing: 2900,
  corporate: 4500,
  product: 7500,
  ecommerce: 9500,
};

const ADDON_PRICES: Record<string, number> = {
  language: 600,
  blog: 500,
  cms: 900,
  copywriting: 200,
  animations: 800,
  integration: 400,
  analytics: 500,
  extra_pages: 250,
  infra_setup: 300,
  infra_monthly: 80,
  revisions: 200,
};

const RUSH_MULTIPLIERS: Record<string, number> = {
  normal: 0,
  fast: 0.80,
  urgent: 1.50,
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface QuotePayload {
  base_product?: string;
  addons?: Record<string, number | boolean>;
  delivery?: string;
  name?: string;
  company?: string;
  email?: string;
  lang?: string;
  privacy_consent?: boolean | string;
}

interface LineItem {
  label: string;
  qty: number;
  unit: number;
  total: number;
}

interface QuoteResult {
  base: number;
  lines: LineItem[];
  rush: number;
  grand_total: number;
}

// ---------------------------------------------------------------------------
// Price calculation
// ---------------------------------------------------------------------------
function calcQuote(payload: QuotePayload): QuoteResult | null {
  const baseKey = (payload.base_product ?? '').trim().toLowerCase();
  const basePrice = BASE_PRICES[baseKey];
  if (!basePrice) return null;

  const lines: LineItem[] = [];
  let addonsTotal = 0;

  const addons = payload.addons ?? {};
  for (const [key, val] of Object.entries(addons)) {
    const unitPrice = ADDON_PRICES[key];
    if (!unitPrice) continue;

    const qty = typeof val === 'boolean' ? (val ? 1 : 0) : Math.max(0, Math.floor(Number(val) || 0));
    if (qty === 0) continue;

    const total = unitPrice * qty;
    addonsTotal += total;
    lines.push({ label: key, qty, unit: unitPrice, total });
  }

  const deliveryKey = (payload.delivery ?? 'normal').trim().toLowerCase();
  const rushMultiplier = RUSH_MULTIPLIERS[deliveryKey] ?? 0;
  const subtotal = basePrice + addonsTotal;
  const rush = Math.round(subtotal * rushMultiplier);
  const grand_total = subtotal + rush;

  return { base: basePrice, lines, rush, grand_total };
}

// ---------------------------------------------------------------------------
// Label maps for PDF (trilingual)
// ---------------------------------------------------------------------------
type Lang = 'en' | 'es' | 'pt';

const PRODUCT_LABELS: Record<string, Record<Lang, string>> = {
  landing:    { en: 'Landing Page', es: 'Landing Page', pt: 'Landing Page' },
  corporate:  { en: 'Corporate Site', es: 'Sitio Corporativo', pt: 'Site Corporativo' },
  product:    { en: 'Product Marketing Site', es: 'Product Marketing Site', pt: 'Product Marketing Site' },
  ecommerce:  { en: 'E-commerce', es: 'E-commerce', pt: 'E-commerce' },
};

const ADDON_LABELS: Record<string, Record<Lang, string>> = {
  language:      { en: 'Additional Language', es: 'Idioma adicional', pt: 'Idioma adicional' },
  blog:          { en: 'Blog / Content Section', es: 'Blog / Sección de contenido', pt: 'Blog / Seção de conteúdo' },
  cms:           { en: 'Client-Editable CMS', es: 'CMS editable por el cliente', pt: 'CMS editável pelo cliente' },
  copywriting:   { en: 'Copywriting', es: 'Copywriting', pt: 'Copywriting' },
  animations:    { en: 'Custom Animations', es: 'Animaciones custom', pt: 'Animações customizadas' },
  integration:   { en: 'Additional Integration', es: 'Integración adicional', pt: 'Integração adicional' },
  analytics:     { en: 'Advanced Analytics', es: 'Analytics avanzado', pt: 'Analytics avançado' },
  extra_pages:   { en: 'Additional Pages', es: 'Páginas adicionales', pt: 'Páginas adicionais' },
  infra_setup:   { en: 'Hosting + Domain Setup', es: 'Setup hosting + dominio', pt: 'Setup hosting + domínio' },
  infra_monthly: { en: 'Monthly Hosting Management', es: 'Gestión hosting mensual', pt: 'Gestão mensal de hosting' },
  revisions:     { en: 'Extra Revision Round', es: 'Ronda extra de revisiones', pt: 'Rodada extra de revisões' },
};

const UI: Record<Lang, {
  quote_title: string;
  prepared_for: string;
  company: string;
  date: string;
  project_config: string;
  base_product: string;
  addons: string;
  qty: string;
  unit_price: string;
  total: string;
  subtotal: string;
  rush: string;
  grand_total: string;
  always_included: string;
  included_items: string[];
  delivery_normal: string;
  delivery_fast: string;
  delivery_urgent: string;
  footer: string;
  validity: string;
}> = {
  en: {
    quote_title: 'PROJECT QUOTE',
    prepared_for: 'Prepared for',
    company: 'Company',
    date: 'Date',
    project_config: 'PROJECT CONFIGURATION',
    base_product: 'Base Product',
    addons: 'Add-ons',
    qty: 'Qty',
    unit_price: 'Unit Price',
    total: 'Total',
    subtotal: 'Subtotal',
    rush: 'Rush Surcharge',
    grand_total: 'PROJECT TOTAL',
    always_included: 'ALWAYS INCLUDED — NO EXCEPTIONS',
    included_items: [
      'Technical SEO (meta tags, structured data, sitemap, robots.txt)',
      'Basic Analytics (GA4 connected and verified)',
      '1 ESP integration (MailerLite by default)',
      'Responsive design (mobile-first)',
      'WCAG 2AA basic accessibility',
      'Git repository delivery',
      '2 rounds of revisions',
    ],
    delivery_normal: 'Standard delivery (4–6 weeks)',
    delivery_fast: 'Rush delivery (< 3 weeks) — +80%',
    delivery_urgent: 'Urgent delivery (< 2 weeks) — +150%',
    footer: 'aglaya.biz — The Uncomfortable AI·gency',
    validity: 'Quote valid for 30 days from date of issue.',
  },
  es: {
    quote_title: 'COTIZACIÓN DE PROYECTO',
    prepared_for: 'Preparado para',
    company: 'Empresa',
    date: 'Fecha',
    project_config: 'CONFIGURACIÓN DEL PROYECTO',
    base_product: 'Producto Base',
    addons: 'Módulos',
    qty: 'Cant.',
    unit_price: 'Precio unitario',
    total: 'Total',
    subtotal: 'Subtotal',
    rush: 'Recargo por urgencia',
    grand_total: 'TOTAL DEL PROYECTO',
    always_included: 'SIEMPRE INCLUIDO — SIN EXCEPCIONES',
    included_items: [
      'SEO técnico (meta tags, structured data, sitemap, robots.txt)',
      'Analytics básico (GA4 conectado y verificado)',
      '1 integración ESP (MailerLite por defecto)',
      'Diseño responsive (mobile-first)',
      'Accesibilidad básica WCAG 2AA',
      'Entrega en repositorio Git',
      '2 rondas de revisiones',
    ],
    delivery_normal: 'Entrega normal (4–6 semanas)',
    delivery_fast: 'Entrega rápida (< 3 semanas) — +80%',
    delivery_urgent: 'Entrega urgente (< 2 semanas) — +150%',
    footer: 'aglaya.biz — La Agenc·IA Incómoda',
    validity: 'Cotización válida por 30 días desde la fecha de emisión.',
  },
  pt: {
    quote_title: 'ORÇAMENTO DE PROJETO',
    prepared_for: 'Preparado para',
    company: 'Empresa',
    date: 'Data',
    project_config: 'CONFIGURAÇÃO DO PROJETO',
    base_product: 'Produto Base',
    addons: 'Módulos',
    qty: 'Qtd.',
    unit_price: 'Preço unitário',
    total: 'Total',
    subtotal: 'Subtotal',
    rush: 'Acréscimo por urgência',
    grand_total: 'TOTAL DO PROJETO',
    always_included: 'SEMPRE INCLUÍDO — SEM EXCEÇÕES',
    included_items: [
      'SEO técnico (meta tags, dados estruturados, sitemap, robots.txt)',
      'Analytics básico (GA4 conectado e verificado)',
      '1 integração ESP (MailerLite por padrão)',
      'Design responsivo (mobile-first)',
      'Acessibilidade básica WCAG 2AA',
      'Entrega em repositório Git',
      '2 rodadas de revisões',
    ],
    delivery_normal: 'Entrega normal (4–6 semanas)',
    delivery_fast: 'Entrega rápida (< 3 semanas) — +80%',
    delivery_urgent: 'Entrega urgente (< 2 semanas) — +150%',
    footer: 'aglaya.biz — The Uncomfortable AI·gency',
    validity: 'Orçamento válido por 30 dias a partir da data de emissão.',
  },
};

// ---------------------------------------------------------------------------
// PDF generation
// ---------------------------------------------------------------------------
// A PDF has no stylesheet, so pdfkit needs literal values. They are still read
// from the package at build time — the quote PDF is a brand surface too, and a
// red frozen in this file is the same copy the rest of this repo just stopped
// making. The greys below are not canon tokens and stay local (see the PR).
const BRAND_RED = tokens['--color-brand'];
const NEAR_BLACK = tokens['--color-surface'];
const WHITE = '#ffffff';
const LIGHT_GRAY = '#cccccc';
const MID_GRAY = '#888888';
const BORDER_GRAY = '#333333';

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}

function normalizeLang(raw?: string): Lang {
  if (raw === 'es' || raw === 'pt') return raw;
  return 'en';
}

async function generatePDF(
  payload: QuotePayload,
  quote: QuoteResult,
  lang: Lang,
): Promise<Buffer> {
  const ui = UI[lang];

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 0,
      info: {
        Title: ui.quote_title,
        Author: 'AGLAYA',
        Subject: 'Project Quote',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const W = doc.page.width;   // 595
    const H = doc.page.height;  // 842
    const MARGIN = 50;
    const CONTENT_W = W - MARGIN * 2;

    // ── Header band ──────────────────────────────────────────────────────
    doc.rect(0, 0, W, 120).fill(NEAR_BLACK);
    doc.rect(0, 120, W, 4).fill(BRAND_RED);

    // Logo (white PNG)
    const logoPath = path.join(process.cwd(), 'src/assets/images/aglaya-logo-blanco.png');
    try {
      doc.image(logoPath, MARGIN, 36, { height: 48 });
    } catch {
      // If logo not found, render text fallback
      doc.fillColor(WHITE).fontSize(20).font('Helvetica-Bold').text('AGLAYA', MARGIN, 48);
    }

    // Quote title top-right
    doc.fillColor(BRAND_RED).fontSize(9).font('Helvetica-Bold')
      .text(ui.quote_title, 0, 42, { align: 'right', width: W - MARGIN });

    // ── Client info block ────────────────────────────────────────────────
    let y = 148;

    const clientName = (payload.name ?? '').trim() || '—';
    const clientCompany = (payload.company ?? '').trim();
    const dateStr = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(`${ui.prepared_for}:`, MARGIN, y);
    doc.fillColor(WHITE).fontSize(14).font('Helvetica-Bold')
      .text(clientName, MARGIN, y + 14);
    y += 38;

    if (clientCompany) {
      doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
        .text(`${ui.company}:`, MARGIN, y);
      doc.fillColor(LIGHT_GRAY).fontSize(11).font('Helvetica')
        .text(clientCompany, MARGIN, y + 12);
      y += 32;
    }

    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(`${ui.date}:`, MARGIN, y);
    doc.fillColor(LIGHT_GRAY).fontSize(10).font('Helvetica')
      .text(dateStr, MARGIN, y + 12);
    y += 40;

    // ── Section: Project Configuration ──────────────────────────────────
    doc.rect(0, y, W, 28).fill('#111111');
    doc.fillColor(BRAND_RED).fontSize(8).font('Helvetica-Bold')
      .text(ui.project_config, MARGIN, y + 10);
    y += 42;

    // Base product row
    const baseKey = (payload.base_product ?? '').toLowerCase();
    const baseLabelMap = PRODUCT_LABELS[baseKey];
    const baseLabel = baseLabelMap ? baseLabelMap[lang] : baseKey;

    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(ui.base_product, MARGIN, y);
    y += 14;

    // Table header
    const COL = {
      label: MARGIN,
      qty: MARGIN + CONTENT_W * 0.55,
      unit: MARGIN + CONTENT_W * 0.70,
      total: MARGIN + CONTENT_W * 0.85,
    };

    doc.fillColor(BORDER_GRAY).fontSize(7).font('Helvetica')
      .text('', COL.label, y)
      .text(ui.qty, COL.qty, y)
      .text(ui.unit_price, COL.unit, y)
      .text(ui.total, COL.total, y);
    y += 14;
    doc.rect(MARGIN, y, CONTENT_W, 0.5).fill(BORDER_GRAY);
    y += 8;

    // Base product line
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
      .text(baseLabel, COL.label, y, { width: COL.qty - COL.label - 8 });
    doc.fillColor(LIGHT_GRAY).fontSize(10).font('Helvetica')
      .text('1', COL.qty, y)
      .text(formatUSD(quote.base), COL.unit, y)
      .text(formatUSD(quote.base), COL.total, y);
    y += 22;

    // Addons
    if (quote.lines.length > 0) {
      doc.rect(MARGIN, y, CONTENT_W, 0.5).fill(BORDER_GRAY);
      y += 12;
      doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
        .text(ui.addons, MARGIN, y);
      y += 14;

      for (const line of quote.lines) {
        const addonLabelMap = ADDON_LABELS[line.label];
        const addonLabel = addonLabelMap ? addonLabelMap[lang] : line.label;
        doc.fillColor(LIGHT_GRAY).fontSize(9).font('Helvetica')
          .text(addonLabel, COL.label, y, { width: COL.qty - COL.label - 8 });
        doc.fillColor(LIGHT_GRAY).fontSize(9)
          .text(String(line.qty), COL.qty, y)
          .text(formatUSD(line.unit), COL.unit, y)
          .text(formatUSD(line.total), COL.total, y);
        y += 18;
      }
    }

    y += 10;
    doc.rect(MARGIN, y, CONTENT_W, 0.5).fill(BORDER_GRAY);
    y += 16;

    // Subtotal
    const subtotal = quote.base + quote.lines.reduce((s, l) => s + l.total, 0);
    doc.fillColor(MID_GRAY).fontSize(9).font('Helvetica')
      .text(ui.subtotal, MARGIN, y)
      .text(formatUSD(subtotal), COL.total, y);
    y += 18;

    // Rush surcharge (if any)
    if (quote.rush > 0) {
      const deliveryKey = (payload.delivery ?? 'normal').toLowerCase();
      const rushLabel = deliveryKey === 'urgent' ? ui.delivery_urgent : ui.delivery_fast;
      doc.fillColor(BRAND_RED).fontSize(9).font('Helvetica')
        .text(rushLabel, MARGIN, y)
        .text(`+${formatUSD(quote.rush)}`, COL.total, y);
      y += 18;
    }

    // Grand total band
    y += 8;
    doc.rect(0, y, W, 56).fill(BRAND_RED);
    doc.fillColor(WHITE).fontSize(10).font('Helvetica-Bold')
      .text(ui.grand_total, MARGIN, y + 12);
    doc.fillColor(WHITE).fontSize(24).font('Helvetica-Bold')
      .text(formatUSD(quote.grand_total), 0, y + 10, { align: 'right', width: W - MARGIN });
    y += 72;

    // Delivery note
    const deliveryKey = (payload.delivery ?? 'normal').toLowerCase();
    const deliveryLabel =
      deliveryKey === 'fast' ? ui.delivery_fast :
      deliveryKey === 'urgent' ? ui.delivery_urgent :
      ui.delivery_normal;
    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(deliveryLabel, MARGIN, y);
    y += 24;

    // ── Always Included ──────────────────────────────────────────────────
    doc.rect(0, y, W, 28).fill('#111111');
    doc.fillColor(BRAND_RED).fontSize(8).font('Helvetica-Bold')
      .text(ui.always_included, MARGIN, y + 10);
    y += 40;

    for (const item of ui.included_items) {
      doc.fillColor(LIGHT_GRAY).fontSize(9).font('Helvetica')
        .text(`✓  ${item}`, MARGIN, y);
      y += 16;
    }

    y += 16;

    // ── Validity note ────────────────────────────────────────────────────
    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(ui.validity, MARGIN, y);

    // ── Footer ───────────────────────────────────────────────────────────
    doc.rect(0, H - 40, W, 40).fill(NEAR_BLACK);
    doc.rect(0, H - 44, W, 4).fill(BRAND_RED);
    doc.fillColor(MID_GRAY).fontSize(8).font('Helvetica')
      .text(ui.footer, 0, H - 26, { align: 'center', width: W });

    doc.end();
  });
}

// ---------------------------------------------------------------------------
// Send PDF internally via Resend (human review before forwarding to client)
// ---------------------------------------------------------------------------
async function sendQuoteNotification(
  leadEmail: string,
  name: string,
  pdfBuffer: Buffer,
  lang: Lang,
  total: number,
  baseProduct: string,
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY ?? '';
  const notifyTo = process.env.NOTIFY_EMAIL ?? 'info@aglaya.biz';

  if (!apiKey) {
    console.warn('[quote] RESEND_API_KEY not set — skipping notification');
    return false;
  }

  const pdfBase64 = pdfBuffer.toString('base64');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'AGLAYA <info@aglaya.biz>',
      to: [notifyTo],
      subject: `📊 Quote Request [${lang.toUpperCase()}]: ${name || leadEmail} — ${formatUSD(total)} (${baseProduct})`,
      html: `
        <h2>New quote request — aglaya.biz</h2>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${leadEmail}</p>
        <p><strong>Language:</strong> ${lang.toUpperCase()}</p>
        <p><strong>Base Product:</strong> ${baseProduct}</p>
        <p><strong>Total:</strong> ${formatUSD(total)}</p>
        <p style="color:#c00;"><strong>Review PDF before forwarding to client.</strong></p>
      `,
      attachments: [{ filename: 'aglaya-quote.pdf', content: pdfBase64 }],
    }),
  });

  if (!response.ok) {
    console.error('[quote] Resend error:', response.status, await response.text());
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Capture lead in MailerLite — automation handles acknowledgment email to client
// ---------------------------------------------------------------------------
async function captureQuoteLead(
  email: string,
  name: string,
  company: string,
  lang: Lang,
  ip: string,
  baseProduct: string,
): Promise<void> {
  const groupId = (process.env.MAILERLITE_COTIZACIONES_GROUP_ID ?? '186446693070276318').trim();

  await upsertMailerLiteSubscriber({
    email,
    ip,
    name: name || undefined,
    company: company || undefined,
    language: lang,
    groups: [groupId],
    entry_point: 'quote_calculator',
    service_interest: baseProduct || undefined,
  });
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hasConsent(value?: boolean | string): boolean {
  return value === true || value === 'true' || value === 'on';
}

function extractIp(event: Parameters<Handler>[0]): string {
  const raw = event.headers['x-forwarded-for'] ?? event.headers['x-nf-client-connection-ip'] ?? '';
  return raw.split(',')[0].trim();
}

export const handler: Handler = async (event) => {
  initFunctionSentry();

  const headers = {
    'Access-Control-Allow-Origin': 'https://aglaya.biz',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let payload: QuotePayload;
  try {
    payload = JSON.parse(event.body ?? '{}') as QuotePayload;
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email = (payload.email ?? '').trim().toLowerCase();
  const name = (payload.name ?? '').trim();
  const company = (payload.company ?? '').trim();
  const lang = normalizeLang(payload.lang);

  if (!email || !isValidEmail(email)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Invalid email' }) };
  }
  if (!hasConsent(payload.privacy_consent)) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Consent required' }) };
  }
  if (!payload.base_product || !BASE_PRICES[(payload.base_product ?? '').toLowerCase()]) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Invalid base product' }) };
  }

  const quote = calcQuote(payload);
  if (!quote) {
    return { statusCode: 422, headers, body: JSON.stringify({ error: 'Could not calculate quote' }) };
  }

  const ip = extractIp(event);

  try {
    const pdfBuffer = await generatePDF(payload, quote, lang);

    const [emailSent] = await Promise.allSettled([
      sendQuoteNotification(email, name, pdfBuffer, lang, quote.grand_total, payload.base_product ?? ''),
      captureQuoteLead(email, name, company, lang, ip, payload.base_product ?? ''),
    ]);

    const emailOk = emailSent.status === 'fulfilled' && emailSent.value;
    if (!emailOk) {
      console.warn('[quote] Email delivery failed but continuing');
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        total: quote.grand_total,
        breakdown: {
          base: quote.base,
          addons: quote.lines,
          rush: quote.rush,
        },
      }),
    };
  } catch (error) {
    console.error('[quote] Unexpected error:', error);
    await captureFunctionException(error, {
      functionName: 'quote',
      tags: { stage: 'quote-generation' },
      extra: { lang, base_product: payload.base_product },
    });
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate quote' }),
    };
  }
};
