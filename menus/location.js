import axios from "axios";

export async function sendLocation(phone) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: {
        body: `📍 SmileCare Dental Clinic

🏥 Address:
123 Main Road, Ilambazar, Birbhum

🗺️ Google Maps:
https://maps.google.com/?q=23.6030,87.5380`
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
