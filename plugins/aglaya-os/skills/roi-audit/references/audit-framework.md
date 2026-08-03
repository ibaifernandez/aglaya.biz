# ROI Audit Framework — Reference

## Process Inventory Template

For each process discovered in the client's organization:

| Field | Description |
|---|---|
| Process Name | Short identifier (e.g., "Lead qualification", "Monthly reporting") |
| Department | Who owns it |
| Frequency | Daily / Weekly / Monthly / Per-event |
| Time per occurrence | Minutes or hours per instance |
| People involved | Number of team members |
| Tools used | Current software, if any |
| Error/rework rate | % of instances requiring correction |
| Downstream delay | Hours/days of dependent work blocked |

## Cost Calculation Formula

**Monthly time cost:**
```
Monthly hours = (frequency per month) × (time per occurrence in hours) × (number of people)
```

**Monthly salary cost:**
```
Monthly cost = Monthly hours × Fully-loaded hourly rate
```

**Fully-loaded hourly rate by role (reference ranges):**
| Role | LATAM (USD/hr) | Spain (EUR/hr) | US (USD/hr) |
|---|---|---|---|
| Operations staff | $8–$15 | €15–€25 | $25–$40 |
| Marketing coordinator | $10–$18 | €18–€30 | $30–$50 |
| Data/reporting analyst | $12–$20 | €20–€35 | $35–$60 |
| Operations manager | $18–$30 | €30–€50 | $50–$80 |
| Director / C-level | $30–$60 | €50–€100 | $80–$150 |

*Use conservative (lower) estimates in the business case. Surprises upward build trust.*

## Priority Matrix

Score each process 1–5 on two dimensions:

**Automation Feasibility:**
- 5: Fully automatable with existing tools (n8n, Make, APIs) in <4 weeks
- 4: Mostly automatable, some edge cases require human review
- 3: Partially automatable, significant human judgment needed
- 2: Technically complex, requires custom AI/ML
- 1: Not currently automatable or not worth the effort

**Monthly Impact ($):**
- 5: >$10,000/month savings
- 4: $5,000–$10,000/month
- 3: $2,000–$5,000/month
- 2: $500–$2,000/month
- 1: <$500/month

**Priority Score = Feasibility × Impact**
- Score 20–25: Build First (top priority)
- Score 12–19: Build Second
- Score 6–11: Evaluate (may be worth it at lower effort)
- Score 1–5: Deprioritize

## Business Case Template

```
AGLAYA ROI AUDIT — [CLIENT NAME]
Audit Period: [dates]

PROCESSES ANALYZED: [X]
TOTAL MONTHLY COST IDENTIFIED: $[X]

TOP 3 PRIORITY AUTOMATIONS:
1. [Process name] — $[X]/month → saves [Y] hours/month
2. [Process name] — $[X]/month → saves [Y] hours/month
3. [Process name] — $[X]/month → saves [Y] hours/month

PROJECTED YEAR 1 SAVINGS: $[X]

RETAINER INVESTMENT:
- Monthly: $8,000
- 3-month minimum: $24,000
- Year 1 total: $96,000

NET YEAR 1 ROI:
- Savings: $[X]
- Investment: $[Y]
- Net position: $[X-Y]
- ROI: [%]
- Payback period: [weeks/months]

RECOMMENDATION: [Proceed with retainer / Not a fit at this time]
```

## Red Flags During Audit

Stop and reassess if you find:
- Total automatable cost < $15,000/month → do not propose retainer
- Client resistance to sharing actual process data → trust issue, flag to Ibai
- Processes are already automated but poorly (tool sprawl) → different problem, may still qualify
- Decision-maker not engaged in the audit → proposal will not have a champion
