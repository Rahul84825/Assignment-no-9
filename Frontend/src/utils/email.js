import emailjs from "@emailjs/browser";

export async function sendAppointmentEmail({ toEmail, visitorName, hostName, startTime }) {
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

  if (!publicKey || !serviceId || !templateId) {
    return { ok: false, skipped: true };
  }

  return emailjs.send(
    serviceId,
    templateId,
    {
      to_email: toEmail,
      visitor_name: visitorName,
      host_name: hostName,
      start_time: startTime,
    },
    { publicKey }
  );
}
