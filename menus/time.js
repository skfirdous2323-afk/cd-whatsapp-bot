import axios from "axios";

export async function sendTimeMenu(phone) {
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
          text: "🕒 Select Time"
        },
        body: {
          text: "Choose your appointment time."
        },
        footer: {
          text: "Clinic WhatsApp Bot"
        },
        action: {
          button: "Select Time",
          sections: [
            {
              title: "Available Time",
              rows: [
                {
                  id: "time_9",
                  title: "09:00 AM"
                },
                {
                  id: "time_10",
                  title: "10:00 AM"
                },
                {
                  id: "time_11",
                  title: "11:00 AM"
                },
                {
                  id: "time_2",
                  title: "02:00 PM"
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
