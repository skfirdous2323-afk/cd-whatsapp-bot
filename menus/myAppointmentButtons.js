import { sendButtonMessage } from "../services/whatsapp.js";

export async function sendMyAppointmentButtons(to) {
  await sendButtonMessage(
    to,
    "What would you like to do?",
    [
      {
        type: "reply",
        reply: {
          id: "download_slip",
          title: "📥 Slip",
        },
      },
      {
        type: "reply",
        reply: {
          id: "reschedule_booking",
          title: "🔄 Change",
        },
      },
      {
        type: "reply",
        reply: {
          id: "cancel_booking",
          title: "❌ Cancel",
        },
      },
    ]
  );
}
