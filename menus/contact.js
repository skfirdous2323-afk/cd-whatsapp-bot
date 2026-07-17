import { sendTextMessage } from "../services/whatsapp.js";

export async function sendContact(to) {
  await sendTextMessage(
    to,
`📞 SmileCare Dental Clinic Support

Thank you for contacting us.

Please reply with your phone number.

📱 Example:
9876543210

⏱️ Our support team will contact you within 20 minutes during clinic working hours.

Thank you! 😊`
  );
}

