import { sendTextMessage } from "../services/whatsapp.js";

export async function sendDoctorsInfo(to) {
  await sendTextMessage(
    to,
`👨‍⚕️ SmileCare Dental Clinic

━━━━━━━━━━━━━━━━━━

🩺 Dr. Rahul Mehta

🎓 Qualification:
BDS, MDS

⭐ Experience:
12+ Years

💰 Consultation Fee:
₹500

🦷 Specialization:
• Root Canal Treatment
• Dental Implant
• Smile Design

🕘 Available:
Monday - Saturday
09:00 AM - 01:00 PM

━━━━━━━━━━━━━━━━━━

👩‍⚕️ Dr. Priya Sharma

🎓 Qualification:
BDS

⭐ Experience:
8+ Years

💰 Consultation Fee:
₹400

🦷 Specialization:
• Teeth Cleaning
• Braces
• Pediatric Dentistry

🕘 Available:
Monday - Saturday
02:00 PM - 06:00 PM

🏥 SmileCare Dental Clinic`
  );
}
