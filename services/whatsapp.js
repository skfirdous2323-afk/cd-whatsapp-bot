import axios from "axios";

const API_URL = `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`;

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

export async function sendTextMessage(to, body) {
  try {
    await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      },
      { headers }
    );
  } catch (error) {
    console.error(
      "WhatsApp Error:",
      error.response?.data || error.message
    );
  }
}

export async function sendButtonMessage(to, text, buttons) {
  try {
    await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "button",
          body: {
            text,
          },
          action: {
            buttons,
          },
        },
      },
      { headers }
    );
  } catch (error) {
    console.error(
      "WhatsApp Error:",
      error.response?.data || error.message
    );
  }
}
