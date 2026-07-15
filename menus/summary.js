import { sendTextMessage } from "../services/whatsapp.js";
import {
  getDoctorName,
  getDateName,
  getTimeName,
} from "../utils/formatters.js";

export async function sendSummary(to, session) {
  const doctorName = getDoctorName(session.doctor);
  const dateName = getDateName(session.date);
  const timeName = getTimeName(session.time);

  await sendTextMessage(
    to,
`📋 Appointment Summary

👤 Name: ${session.name}
🎂 Age: ${session.age}
🚻 Gender: ${session.gender}

🩺 Doctor: ${doctorName}
📅 Date: ${dateName}
🕒 Time: ${timeName}

━━━━━━━━━━━━━━━━━━

📌 Please press *Confirm* to book your appointment.

🏥 SmileCare Dental Clinic
📞 Thank you for choosing us.`
  );
}
