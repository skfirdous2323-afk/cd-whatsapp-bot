import axios from "axios";

export async function sendDateMenu(phone) {
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
          text: "📅 Select Date"
        },
        body: {
          text: "Please choose your appointment date."
        },
        footer: {
          text: "Clinic WhatsApp Bot"
        },
        action: {
          button: "Select Date",
          sections: [
            {
              title: "Available Dates",
              rows: [
                {
                  id: "today",
                  title: "Today"
                },
                {
                  id: "tomorrow",
                  title: "Tomorrow"
                },
                {
                  id: "day_after",
                  title: "Day After Tomorrow"
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
