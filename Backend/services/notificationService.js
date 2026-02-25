async function sendEmail({ to, subject, body }) {
  console.log("[email] to:", to, "subject:", subject);
  return { ok: true };
}

async function sendSms({ to, message }) {
  console.log("[sms] to:", to, "message:", message);
  return { ok: true };
}

module.exports = { sendEmail, sendSms };
