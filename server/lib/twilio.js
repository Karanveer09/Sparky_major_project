import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH || process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppMessage(to, message) {
  try {
    return await client.messages.create({
      from: process.env.TWILIO_PHONE || process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });
  } catch (error) {
    console.error("Twilio sendWhatsAppMessage error:", error.message);
    throw error;
  }
}

export default { sendWhatsAppMessage };
