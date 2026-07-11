import axios from "axios";

export async function askPatientGender(phone) {
  await axios.post(
    `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "button",
        body: {
          text: "🚻 Please select your gender."
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "gender_male",
                title: "👨 Male"
              }
            },
            {
              type: "reply",
              reply: {
                id: "gender_female",
                title: "👩 Female"
              }
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
