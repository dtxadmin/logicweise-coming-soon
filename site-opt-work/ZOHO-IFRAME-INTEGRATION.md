# Zoho Iframe Integration Guide

## Live Form URL (Current)
`https://forms.zohopublic.com/logicweise1/form/B2BLeadCaptureFormforLogicWeise/formperma/lpiWirtj30O9jZctqkoJUdKsLciz_KcY0vGkFSvYduc`

## Pages With The Embedded Form
- `/contact/index.html`
- `/coming-soon/index.html`

## How To Replace The Iframe URL In The Future
1. Publish your new Zoho form and copy the public `formperma` URL.
2. Open the pages listed above.
3. Find the iframe with `title="Logic Weise lead form"`.
4. Replace only the `src` value.
5. Save and deploy.

## Current Embed Pattern Used On Site
```html
<iframe
  title="Logic Weise lead form"
  src="https://forms.zohopublic.com/logicweise1/form/B2BLeadCaptureFormforLogicWeise/formperma/lpiWirtj30O9jZctqkoJUdKsLciz_KcY0vGkFSvYduc"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  aria-label="Lead capture form"
></iframe>
```

## Optional Placeholder Pattern (For New Future Pages)
```html
<iframe
  title="Logic Weise lead form"
  src="https://forms.zohopublic.com/YOUR_ORG/form/YOUR_FORM_NAME/formperma/YOUR_FORM_ID"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  aria-label="Lead capture form"
></iframe>
```

## Validation Checklist
1. Form loads on desktop and mobile.
2. Submission completes and shows confirmation.
3. Submission appears in Zoho (and CRM target if configured).
4. Privacy link and consent copy remain visible near the form.
5. Page speed and accessibility remain acceptable.

## Troubleshooting
- Blank form: confirm the Zoho form is public and not domain-restricted.
- Wrong lead destination: verify Zoho mappings, automation rules, and CRM integration.
- Slow render: keep `loading="lazy"` and avoid stacking multiple third-party embeds.
