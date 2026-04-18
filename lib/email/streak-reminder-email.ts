export function streakReminderHtml(params: { name: string; streak: number; ctaUrl: string }) {
  return `<p>Hi ${params.name},</p><p>Your ${params.streak}-day streak is at risk. Open a quick lesson today.</p><p><a href="${params.ctaUrl}">Continue learning</a></p>`;
}

export function streakReminderText(params: { name: string; streak: number; ctaUrl: string }) {
  return `Hi ${params.name}, your ${params.streak}-day streak is at risk. Continue: ${params.ctaUrl}`;
}
