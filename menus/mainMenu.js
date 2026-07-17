import axios from "axios";

export async function sendMainMenu(phone) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "🏥 SmileCare Dental Clinic",
        },
        body: {
          text:
            "Welcome!\n\nPlease choose an option from the menu below.",
        },
        footer: {
          text: "Powered by SmileCare WhatsApp Bot",
        },
        action: {
          button: "📋 Open Menu",
          sections: [
            {
              title: "Patient Services",
              rows: [
                {
                  id: "book",
                  title: "📅 Book Appointment",
                  description: "Book a new appointment",
                },
                {
                  id: "my_appointment",
                  title: "📄 My Appointment",
                  description: "View your latest appointment",
                },
                {
                  id: "doctors_info",
                  title: "👨‍⚕️ Doctors",
                  description: "Doctor profiles & consultation fee",
                },
                {
                  id: "services",
                  title: "🩺 Services",
                  description: "View all clinic services",
                },
                {
                  id: "location",
                  title: "📍 Clinic Location",
                  description: "Find our clinic on Google Maps",
                },
                {
                  id: "contact",
                  title: "📞 Contact Us",
                  description: "Phone number & support",
                },
              ],
            },
          ],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
}
