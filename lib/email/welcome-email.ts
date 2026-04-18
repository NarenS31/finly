// Note: The transactional `from` address is set in `app/api/email/welcome/route.ts` (Resend).
// TODO: Replace onboarding@resend.dev with your verified sender domain before production
// e.g. from: 'FinPath <hello@yourverifieddomain.com>'

export function welcomeEmailHtml(params: { name: string; ctaUrl: string }) {
  const { name, ctaUrl } = params;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;background:#f7f8fc;font-family:system-ui,-apple-system,sans-serif;color:#1a1a2e;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f7f8fc;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;padding:28px 24px;border:1px solid #e8eaf0;">
        <tr><td>
          <p style="margin:0 0 12px;font-size:22px;font-weight:800;color:#3949ab;">You just took the first step 🎉</p>
          <p style="margin:0 0 16px;line-height:1.6;color:#546e7a;">Hi ${name}, welcome to FinPath — free financial lessons built for students ages 8–17, anywhere in the world.</p>
          <p style="margin:0 0 20px;line-height:1.6;color:#546e7a;">Jump back in when you have five minutes. Small lessons stack into real confidence.</p>
          <a href="${ctaUrl}" style="display:inline-block;background:#5c6bc0;color:#fff;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:700;">Start a lesson</a>
          <p style="margin:24px 0 0;font-size:12px;color:#90a4ae;">We will never spam you. Streak reminders are optional and can be turned off in your profile.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText(params: { name: string; ctaUrl: string }) {
  return `Hi ${params.name},\n\nWelcome to FinPath — free financial lessons for ages 8–17.\n\nStart here: ${params.ctaUrl}\n\nWe will never spam you.\n`;
}
