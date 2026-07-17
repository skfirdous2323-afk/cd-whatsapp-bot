import axios from "axios";
import { getNext10Days } from "../utils/dateOptions.js";

export async function sendDateMenu(phone) {

  const rows = getNext10Days();

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
          text: "📅 Select Appointment Date"
        },
        body: {
          text: "Please choose your preferred appointment date."
        },
        footer: {
          text: "Next 10 Days Available"
        },
        action: {
          button: "Select Date",
          sections: [
            {
              title: "Available Dates",
              rows
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
