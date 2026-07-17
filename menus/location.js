import axios from "axios";

export async function sendLocation(phone) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "location",
      location: {
        latitude: 23.6030,
        longitude: 87.5380,
        name: "SmileCare Dental Clinic",
        address:
          "Near Illambazar Bus Stand, Illambazar, Birbhum, West Bengal 731214"
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );

  // Optional follow-up message
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: {
        body: `🏥 SmileCare Dental Clinic

📍 Near Illambazar Bus Stand
Illambazar, Birbhum, West Bengal

🕘 Monday - Saturday
09:00 AM - 06:00 PM

📞 Call us for any assistance.

We look forward to serving you! 😊`
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
