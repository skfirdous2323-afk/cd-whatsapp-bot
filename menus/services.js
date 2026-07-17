import { sendTextMessage } from "../services/whatsapp.js";

export async function sendServices(to) {
  await sendTextMessage(
    to,
`🦷 SmileCare Dental Clinic

━━━━━━━━━━━━━━━━━━

🩺 Our Dental Services

✅ General Dental Checkup
💰 Consultation Fee: ₹300

✅ Teeth Cleaning & Scaling
💰 ₹800

✅ Tooth Filling
💰 ₹1,000

✅ Root Canal Treatment (RCT)
💰 From ₹3,500

✅ Tooth Extraction
💰 From ₹1,200

✅ Wisdom Tooth Removal
💰 From ₹3,000

✅ Dental Crown / Cap
💰 From ₹4,500

✅ Dental Bridge
💰 From ₹8,000

✅ Dental Implant
💰 From ₹25,000

✅ Teeth Whitening
💰 From ₹5,000

✅ Braces & Aligners
💰 Consultation Required

✅ Kids Dental Care
💰 From ₹500

━━━━━━━━━━━━━━━━━━

🕘 Clinic Hours
Monday – Saturday
09:00 AM – 06:00 PM

📞 Book your appointment today!
🏥 SmileCare Dental Clinic`
  );
}
