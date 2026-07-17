import express from "express";
import "dotenv/config";
import {
  isProcessed,
  markProcessed,
} from "./processedMessages.js";
import { askPatientAge } from "./menus/age.js";
import { sendReminders } from "./services/reminder.js";
import { getFAQ } from "./services/faq.js";
import { sendContact } from "./menus/contact.js";
import { sendDoctorsInfo } from "./menus/doctorsInfo.js";
import { sendServices } from "./menus/services.js";
import { askPatientGender } from "./menus/gender.js";
import { askPatientName } from "./menus/name.js";
import { generateAppointmentSlip } from "./pdf/appointmentSlip.js";
import { sendMainMenu } from "./menus/mainMenu.js";
import { sendDoctorMenu } from "./menus/doctor.js";
import { sendDateMenu } from "./menus/date.js";
import { sendTimeMenu } from "./menus/time.js";
import { sendConfirmMenu } from "./menus/confirm.js";
import { sendSummary } from "./menus/summary.js";
import { isClinicOpen } from "./utils/businessHours.js";

import { sendMyAppointmentButtons } from "./menus/myAppointmentButtons.js";
import { sendLocation } from "./menus/location.js";
import supabase from "./supabase.js";
import { getSession, clearSession } from "./sessions.js";
import {
  sendTextMessage,
  sendDocument,
} from "./services/whatsapp.js";


import {
  isValidName,
  isValidAge,
} from "./utils/validators.js";

import {
  getDoctorName,
  getDateName,
  getTimeName,
} from "./utils/formatters.js";
import { generateAppointmentId } from "./utils/appointmentId.js";

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


const messageId = message.id;

if (isProcessed(messageId)) {
  console.log("Duplicate message ignored:", messageId);
  return res.sendStatus(200);
}

markProcessed(messageId);





const session = getSession(from);



    // TEXT MESSAGE
    if (message.type === "text") {
 
     const text = message.text.body.trim();



const lowerText = text.toLowerCase();

if (lowerText === "hi" || lowerText === "hello") {

  clearSession(from);

  await sendMainMenu(from);

  return res.sendStatus(200);

}




if (session.waitingForContact) {


  if (!/^[6-9]\d{9}$/.test(text)) {
    await sendTextMessage(
      from,
`❌ Invalid phone number.

Please enter a valid 10-digit mobile number.

Example:
9876543210`
    );

    return res.sendStatus(200);
  }

  session.waitingForContact = false;

  await sendTextMessage(
    from,
`✅ Thank you!

Your phone number has been received.

📞 ${text}

⏱️ Our support team will contact you within 20 minutes during clinic working hours.`
  );

  return res.sendStatus(200);
}


const faqReply = getFAQ(text);

if (faqReply) {
  await sendTextMessage(from, faqReply);
  return res.sendStatus(200);
}




      if (
        text.toLowerCase() === "hi" ||
        text.toLowerCase() === "hello"
      ) {
        clearSession(from);
        await sendMainMenu(from);

      } else if (!session.name) {

if (!isValidName(text)) {
  await sendTextMessage(
    from,
    "❌ Please enter a valid name."
  );
  return res.sendStatus(200);
}

session.name = text;
await askPatientAge(from);









      } else if (!session.age) {



if (!isValidAge(text)) {
  await sendTextMessage(
    from,
    "❌ Please enter a valid age (1-120)."
  );
  return res.sendStatus(200);
}

session.age = text;
await askPatientGender(from);



      }
    }

    // INTERACTIVE MESSAGE
// INTERACTIVE MESSAGE

if(message.type === "interactive"){


const listId =
message.interactive?.list_reply?.id;


const buttonId =
message.interactive?.button_reply?.id;



// Book Appointment

if (listId === "book") {

  clearSession(from);

  await sendDoctorMenu(from);

}

else if (listId === "my_appointment") {

const { data, error } = await supabase
  .from("appointments")
  .select("*")
  .eq("phone", from)
  .neq("status", "Cancelled")
  .order("id", { ascending: false })
  .limit(1)
  .maybeSingle();




  if (error || !data) {
    await sendTextMessage(
      from,
      "❌ No appointment found."
    );

    return res.sendStatus(200);
  }

  const appointmentId = generateAppointmentId(data.id);

  await sendTextMessage(
    from,
`📄 Your Latest Appointment

🆔 ${appointmentId}
👤 ${data.customer_name}
🩺 ${data.doctor}
📅 ${data.appointment_date}
🕒 ${data.appointment_time}
📌 Status: ${data.status}`
  );

  await sendMyAppointmentButtons(from);

}

else if (listId === "location") {

  await sendLocation(from);

}


else if (listId === "doctors_info") {

  await sendDoctorsInfo(from);

}






// Location

else if(listId === "location"){

await sendLocation(from);

}


// Contact Us

else if (listId === "contact") {

  session.waitingForContact = true;

  await sendTextMessage(
    from,
`📞 Contact Support

Please enter your phone number.

Example:
9876543210

⏱️ Our support team will contact you within 20 minutes during clinic working hours.`
  );

}




else if (listId === "services") {

  await sendServices(from);

}

// Doctor Selection

else if(
listId === "dr_rahul" ||
listId === "dr_priya"
){

session.doctor = listId;

await sendDateMenu(from);

}


// Date Selection

else if(
listId === "today" ||
listId === "tomorrow" ||
listId === "day_after"
){

session.date = listId;

await sendTimeMenu(from);

}


// Time Selection

else if(
listId === "time_9" ||
listId === "time_10" ||
listId === "time_11" ||
listId === "time_2"
){

session.time = listId;

await askPatientName(from);

}



// Gender Male

else if(buttonId === "gender_male"){

session.gender = "Male";


await sendSummary(
from,
session
);


await sendConfirmMenu(from);

}



// Gender Female

else if(buttonId === "gender_female"){

session.gender = "Female";


await sendSummary(
from,
session
);


await sendConfirmMenu(from);

}




// Confirm Booking

else if(buttonId === "confirm_booking"){


const doctorName =
getDoctorName(session.doctor);


const dateName =
getDateName(session.date);


const timeName =
getTimeName(session.time);

if (!isClinicOpen()) {
  await sendTextMessage(
    from,
`🏥 Clinic is currently closed.

🕘 Working Hours:
Monday - Saturday
09:00 AM - 06:00 PM

Please book during working hours.`
  );

  return res.sendStatus(200);
}

// Check Slot

const { data: existingBooking, error: checkError } = await supabase
  .from("appointments")
  .select("id")
  .eq("doctor", doctorName)
  .eq("appointment_date", dateName)
  .eq("appointment_time", timeName);

if (checkError) {
  console.log(checkError);

  await sendTextMessage(
    from,
    "❌ Unable to check slot. Please try again."
  );

  return res.sendStatus(200);
}

if (existingBooking.length > 0) {
  await sendTextMessage(
    from,
    `❌ Slot Already Booked!

🩺 Doctor: ${doctorName}
📅 Date: ${dateName}
🕒 Time: ${timeName}

Please choose another slot.`
  );

  return res.sendStatus(200);
}



// Save Appointment


const {

data,
error

}=await supabase
.from("appointments")
.insert([

{

customer_name: session.name,

phone: from,

age: session.age,

gender: session.gender,

doctor: doctorName,

appointment_date: dateName,

appointment_time: timeName,

status:"Pending"

}

])
.select()
.single();



if(error){


console.log(error);


await sendTextMessage(
from,
"❌ Booking failed. Please try again."
);


return;

}



// Generate ID


const appointmentId =
generateAppointmentId(data.id);




// Create PDF
const pdfPath = await generateAppointmentSlip({
  appointmentId,
  name: session.name,
  phone: `+${from}`,
  doctor: doctorName,
  date: dateName,
  time: timeName,
});

console.log("PDF Created:", pdfPath);


await sendDocument(
  from,
  pdfPath,
  `${appointmentId}.pdf`
);


// Customer Message


await sendTextMessage(
from,

`✅ Appointment Confirmed!

🆔 ID: ${appointmentId}

👤 Name: ${session.name}

📞 Phone: +${from}

🩺 Doctor: ${doctorName}

📅 Date: ${dateName}

🕒 Time: ${timeName}


Status: Pending

Thank you for choosing our clinic.`

);




// Admin Notification


if(process.env.ADMIN_PHONE){


await sendTextMessage(

process.env.ADMIN_PHONE,


`🔔 New Appointment

🆔 ${appointmentId}

👤 ${session.name}

📞 +${from}

🩺 ${doctorName}

📅 ${dateName}

🕒 ${timeName}

Status: Pending`

);


}




clearSession(from);


}

else if (buttonId === "download_slip") {

  const { data } = await supabase
    .from("appointments")
    .select("*")
    .eq("phone", from)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    await sendTextMessage(
      from,
      "❌ No appointment found."
    );
    return res.sendStatus(200);
  }

  const appointmentId = generateAppointmentId(data.id);

  const pdfPath = await generateAppointmentSlip({
    appointmentId,
    name: data.customer_name,
    phone: "+" + data.phone,
    doctor: data.doctor,
    date: data.appointment_date,
    time: data.appointment_time,
  });

  await sendDocument(
    from,
    pdfPath,
    `${appointmentId}.pdf`
  );

  await sendTextMessage(
    from,
    "📄 Your appointment slip has been sent."
  );

}






// Reschedule
// Reschedule
else if (buttonId === "reschedule_booking") {

  clearSession(from);

  await sendTextMessage(
    from,
    "📅 Please select a doctor again to reschedule your appointment."
  );

  await sendDoctorMenu(from);

}

// Cancel Appointment
else if (buttonId === "cancel_booking") {

  const { data, error } = await supabase
    .from("appointments")
    .select("id")
    .eq("phone", from)
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.log(error);

    await sendTextMessage(
      from,
      "❌ Unable to cancel appointment. Please try again."
    );

    return res.sendStatus(200);
  }

  if (!data) {
    await sendTextMessage(
      from,
      "❌ No appointment found."
    );

    return res.sendStatus(200);
  }

  const { error: updateError } = await supabase
    .from("appointments")
    .update({
      status: "Cancelled",
    })
    .eq("id", data.id);

  if (updateError) {
    console.log(updateError);

    await sendTextMessage(
      from,
      "❌ Failed to cancel appointment."
    );

    return res.sendStatus(200);
  }

  clearSession(from);

  await sendTextMessage(
    from,
`❌ Appointment Cancelled

Your appointment has been cancelled successfully.

Status: Cancelled

Thank you for choosing SmileCare Dental Clinic.`
  );

  console.log("Appointment Cancelled");
}





    }

    return res.sendStatus(200);

  } catch (error) {
    console.error("Webhook Error:");
    console.error(error.response?.data || error.message || error);

    return res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

// প্রতি ১ মিনিটে Reminder চেক করবে
setInterval(async () => {
  await sendReminders();
}, 60000);

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
