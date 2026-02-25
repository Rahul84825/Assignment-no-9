import emailjs from "@emailjs/browser";

const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

emailjs.init(publicKey);

export async function sendPassEmail(visitorEmail, passCode, validFrom, validTo) {
  try {
    await emailjs.send(serviceId, templateId, {
      to_email: visitorEmail,
      pass_code: passCode,
      valid_from: new Date(validFrom).toLocaleString(),
      valid_to: new Date(validTo).toLocaleString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}

export async function sendAppointmentEmail(visitorEmail, status, purpose, startTime) {
  try {
    await emailjs.send(serviceId, templateId, {
      to_email: visitorEmail,
      status: status,
      purpose: purpose,
      start_time: new Date(startTime).toLocaleString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { success: false, error };
  }
}
