import express from "express";
import "dotenv/config";
import { askPatientAge } from "./menus/age.js";
import { sendMainMenu } from "./menus/mainMenu.js";
import { sendDoctorMenu } from "./menus/doctor.js";
import { sendDateMenu } from "./menus/date.js";
import { sendTimeMenu } from "./menus/time.js";
import { sendConfirmMenu } from "./menus/confirm.js";
import { askPatientGender } from "./menus/gender.js";
import { askPatientName } from "./menus/name.js";
import { sendSummary } from "./menus/summary.js";
import supabase from "./supabase.js";
import { getSession, clearSession } from "./sessions.js";
import axios from "axios";
const app = express();

app.use(express.json());

// Home
app.get("/", (req, res) => {
  res.send("✅ Clinic WhatsApp Bot Running");
});

// Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {
    console.log("✅ Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive Messages

app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;

    // TEXT MESSAGE
    if (message.type === "text") {
      const text = message.text.body.trim();
      const session = getSession(from);

      if (text.toLowerCase() === "hi" || text.toLowerCase() === "hello") {
        clearSession(from);
        await sendMainMenu(from);

      } else if (!session.name) {
        session.name = text;
        await askPatientAge(from);

      } else if (!session.age) {
        session.age = text;
        await askPatientGender(from);
      }
    }

    // INTERACTIVE MESSAGE
    if (message.type === "interactive") {
      const listId = message.interactive.list_reply?.id;
      const buttonId = message.interactive.button_reply?.id;

      if (listId === "book") {
        clearSession(from);
        await sendDoctorMenu(from);

      } else if (listId === "dr_rahul" || listId === "dr_priya") {
        const session = getSession(from);


const appointmentId = `APT-${Date.now().toString().slice(-4)}`;

const doctorName =
  session.doctor === "dr_rahul" ? "Dr. Rahul" : "Dr. Priya";

const dateName =
  session.date === "today"
    ? "Today"
    : session.date === "tomorrow"
    ? "Tomorrow"
    : "Day After Tomorrow";

const timeName =
  session.time === "time_9"
    ? "09:00 AM"
    : session.time === "time_10"
    ? "10:00 AM"
    : session.time === "time_11"
    ? "11:00 AM"
    : "02:00 PM";




        session.doctor = listId;
        await sendDateMenu(from);

      } else if (
        listId === "today" ||
        listId === "tomorrow" ||
        listId === "day_after"
      ) {
        const session = getSession(from);
        session.date = listId;
        await sendTimeMenu(from);

      } else if (
        listId === "time_9" ||
        listId === "time_10" ||
        listId === "time_11" ||
        listId === "time_2"
      ) {
        const session = getSession(from);
        session.time = listId;
        await askPatientName(from);
      }

      if (buttonId === "gender_male") {
        const session = getSession(from);
        session.gender = "Male";

        await sendSummary(from, session);
        await sendConfirmMenu(from);

      } else if (buttonId === "gender_female") {
        const session = getSession(from);
        session.gender = "Female";

        await sendSummary(from, session);
        await sendConfirmMenu(from);

      } else if (buttonId === "confirm_booking") {
        const session = getSession(from);


const appointmentId = `APT-${Date.now().toString().slice(-4)}`;


        const { error } = await supabase
          .from("appointments")
          .insert([
            {
              customer_name: session.name,
              phone: from,
              age: session.age,
              gender: session.gender,
              doctor: session.doctor,
              appointment_date: session.date,
              appointment_time: session.time,
              status: "Pending",
            },
          ]);

        if (error) {
          console.log(error);
        } else {
          await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
              messaging_product: "whatsapp",
              to: from,
              type: "text",
              text: {

body: `✅ Your appointment has been booked successfully!

🆔 Appointment ID: ${appointmentId}
👤 Name: ${session.name}
📞 Phone: +${from}
🩺 Doctor: ${doctorName}
📅 Date: ${dateName}
🕒 Time: ${timeName}

Thank you for choosing our clinic.`







              }
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
                "Content-Type": "application/json"
              }
            }
          );

          console.log("Appointment Saved");
          clearSession(from);
        }

      } else if (buttonId === "cancel_booking") {
        clearSession(from);
        console.log("Appointment Cancelled");
      }
    }

    res.sendStatus(200);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.sendStatus(500);
  }
});






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
