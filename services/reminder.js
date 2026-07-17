import supabase from "../supabase.js";
import { sendTextMessage } from "./whatsapp.js";

export async function sendReminders() {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("status", "Pending")
    .eq("reminder_sent", false);

  if (error) return console.log(error);

  for (const item of data) {
    await sendTextMessage(
      item.phone,
`⏰ Appointment Reminder

Hello ${item.customer_name},

🩺 Doctor: ${item.doctor}
📅 Date: ${item.appointment_date}
🕒 Time: ${item.appointment_time}

Please arrive 15 minutes early.

SmileCare Dental Clinic 🦷`
    );

    await supabase
      .from("appointments")
      .update({ reminder_sent: true })
      .eq("id", item.id);
  }
}
