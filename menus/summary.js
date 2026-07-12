import axios from "axios";

export async function sendSummary(phone, session) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: {
        body:
`📋 Appointment Summary

👤 Name: ${session.name}
🎂 Age: ${session.age}
🚻 Gender: ${session.gender}
👨‍⚕️ Doctor: ${session.doctor}
📅 Date: ${session.date}
🕒 Time: ${session.time}

Please press Confirm to book your appointment.`
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
