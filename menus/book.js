import axios from "axios";

export async function sendBookMenu(phone) {
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
          text: "📅 Book Appointment"
        },
        body: {
          text: "Please select a doctor."
        },
        footer: {
          text: "SmileCare Clinic"
        },
        action: {
          button: "Select Doctor",
          sections: [
            {
              title: "Doctors",
              rows: [
                {
                  id: "dr_rahul",
                  title: "Dr. Rahul Mehta"
                },
                {
                  id: "dr_priya",
                  title: "Dr. Priya Sharma"
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
