import axios from "axios";

export async function sendConfirmMenu(phone) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "✅ Confirm Appointment"
        },
        body: {
          text: "Do you want to confirm this appointment?"
        },
        footer: {
          text: "Clinic WhatsApp Bot"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "confirm_booking",
                title: "✅ Confirm"
              }
            },
            {
              type: "reply",
              reply: {
                id: "cancel_booking",
                title: "❌ Cancel"
              }
            }
          ]
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}
