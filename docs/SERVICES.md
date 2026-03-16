# AGLAYA v2 — Services Setup Guide

This guide details the third-party services used for the AGLAYA Coming Soon page.

## 1. Resend (Email API)
- **Purpose**: Handles contact capture and automated confirmation emails.
- **Setup**:
  1. Create account on [Resend](https://resend.com).
  2. Verify your domain (`aglaya.biz`) in the Domains tab.
  3. Create an API Key in the API Keys tab.
  4. (Optional) Create an Audience in the Audiences tab and copy the `Audience ID`.
- **Environment Variables**:
  - `RESEND_API_KEY`: Your API key starting with `re_`.
  - `RESEND_AUDIENCE_ID`: (Optional) If provided, contacts will be saved to this list.

## 2. Cloudflare Turnstile (Bot Protection)
- **Purpose**: Invisible bot protection for the signup form.
- **Setup**:
  1. Go to the [Cloudflare Turnstile Dashboard](https://dash.cloudflare.com/?to=/:account/turnstile).
  2. Add a new site for `aglaya.biz`.
  3. Choose "Invisible" or "Managed" widget type.
  4. Copy the `Site Key` and `Secret Key`.
- **Environment Variables**:
  - `PUBLIC_TURNSTILE_SITE_KEY`: The public site key.
  - `TURNSTILE_SECRET`: The private secret key.

## 3. Sentry (Error Tracking)
- **Purpose**: Real-time frontend error monitoring.
- **Setup**:
  1. Create a "Browser JavaScript" project in [Sentry](https://sentry.io).
  2. Copy the `DSN`.
- **Environment Variables**:
  - `PUBLIC_SENTRY_DSN`: The Sentry project DSN.

## 4. UptimeRobot (Availability Monitoring)
- **Purpose**: Alerts you if the site goes down or the serverless function fails.
- **Setup**:
  1. Add a new Monitor in [UptimeRobot](https://uptimerobot.com).
  2. Type: `HTTP(s)`.
  3. URL: `https://aglaya.biz`.
  4. Friendly Name: `AGLAYA Main`.
  5. Repeat for `/es/`.
