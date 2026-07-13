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
          text: "🏥 Welcome to SmileCare Clinic"
        },
        body: {
          text: "Please choose an option:"
        },
        footer: {
          text: "Clinic WhatsApp Bot"
        },
        action: {
          button: "Menu",
          sections: [
            {
              title: "Main Menu",
              rows: [
                {
                  id: "book",
                  title: "📅 Book Appointment"
                },
                {
                  id: "doctors",
                  title: "👨‍⚕️ Doctors"
                },
                {
                  id: "services",
                  title: "🩺 Services"
                },
                {
                  id: "contact",
                  title: "📞 Contact Us"
                },
                {
                  id: "location",
                  title: "📍 Clinic Location"
                }
              ]
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
