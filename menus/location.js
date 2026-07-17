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

🏥 Clinic Address
Near Illambazar Bus Stand
Illambazar
Birbhum, West Bengal - 731214

🕘 Working Hours
Monday - Saturday
09:00 AM - 06:00 PM

📞 Phone
+91 XXXXXXXXXX

🗺️ Google Maps
https://maps.google.com/?q=Illambazar+Bus+Stand+Birbhum

🙏 We look forward to serving you.
Have a great day! 😊`
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
