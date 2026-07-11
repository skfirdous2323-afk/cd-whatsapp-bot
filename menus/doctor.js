import axios from "axios";

export async function sendDoctorMenu(phone) {
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
          text: "👨‍⚕️ Select Doctor"
        },
        body: {
          text: "Choose a doctor for your appointment."
        },
        footer: {
          text: "Clinic WhatsApp Bot"
        },
        action: {
          button: "Doctors",
          sections: [
            {
              title: "Available Doctors",
              rows: [
                {
                  id: "dr_rahul",
                  title: "Dr. Rahul Mehta",
                  description: "General Physician"
                },
                {
                  id: "dr_priya",
                  title: "Dr. Priya Sharma",
                  description: "Dental Specialist"
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
