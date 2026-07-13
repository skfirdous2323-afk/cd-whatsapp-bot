import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const API_URL = `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`;

const headers = {
  Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
  "Content-Type": "application/json",
};

// Send Text Message
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

// Send Button Message
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

// Send PDF Document
export async function sendDocument(to, filePath, fileName) {
  try {
    const form = new FormData();

    form.append("messaging_product", "whatsapp");
    form.append("file", fs.createReadStream(filePath));

    const upload = await axios.post(
      `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/media`,
      form,
      {
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          ...form.getHeaders(),
        },
      }
    );

    await axios.post(
      API_URL,
      {
        messaging_product: "whatsapp",
        to,
        type: "document",
        document: {
          id: upload.data.id,
          filename: fileName,
          caption: "📄 SmileCare Appointment Slip",
        },
      },
      { headers }
    );

    console.log("✅ PDF Sent");

  } catch (error) {
    console.error(
      "PDF Send Error:",
      error.response?.data || error.message
    );
  }
}
