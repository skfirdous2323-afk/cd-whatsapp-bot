import express from "express";
import "dotenv/config";

import { askPatientAge } from "./menus/age.js";
import { askPatientGender } from "./menus/gender.js";
import { askPatientName } from "./menus/name.js";
import { generateAppointmentSlip } from "./pdf/appointmentSlip.js";
import { sendMainMenu } from "./menus/mainMenu.js";
import { sendDoctorMenu } from "./menus/doctor.js";
import { sendDateMenu } from "./menus/date.js";
import { sendTimeMenu } from "./menus/time.js";
import { sendConfirmMenu } from "./menus/confirm.js";
import { sendSummary } from "./menus/summary.js";
import { sendLocation } from "./menus/location.js";
import supabase from "./supabase.js";
import { getSession, clearSession } from "./sessions.js";

import { sendTextMessage } from "./services/whatsapp.js";
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

const session = getSession(from);



    // TEXT MESSAGE
    if (message.type === "text") {
      const text = message.text.body.trim();

      if (
        text.toLowerCase() === "hi" ||
        text.toLowerCase() === "hello"
      ) {
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
// INTERACTIVE MESSAGE

if(message.type === "interactive"){


const listId =
message.interactive?.list_reply?.id;


const buttonId =
message.interactive?.button_reply?.id;



// Book Appointment

if(listId === "book"){

clearSession(from);

await sendDoctorMenu(from);

}


// Location

else if(listId === "location"){

await sendLocation(from);

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



// Check Slot

const {
data: existingBooking,
error: checkError

}= await supabase
.from("appointments")
.select("id")
.eq("doctor",doctorName)
.eq("appointment_date",dateName)
.eq("appointment_time",timeName)
.maybeSingle();



if(checkError){

console.log(checkError);

await sendTextMessage(
from,
"❌ Unable to check slot. Please try again."
);

return;

}



if(existingBooking){


await sendTextMessage(
from,

`❌ Slot Already Booked!

🩺 Doctor: ${doctorName}
📅 Date: ${dateName}
🕒 Time: ${timeName}

Please choose another slot.`
);


return;

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


await generateAppointmentSlip({

appointmentId,

name:session.name,

phone:`+${from}`,

doctor:doctorName,

date:dateName,

time:timeName

});




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




// Reschedule


else if(buttonId==="reschedule_booking"){


clearSession(from);


await sendTextMessage(
from,
"📅 Select doctor again for reschedule."
);


await sendDoctorMenu(from);

      } else if (buttonId === "cancel_booking") {
        clearSession(from);

        await sendTextMessage(
          from,
          "❌ Your appointment has been cancelled."
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

app.listen(PORT, () => {
  console.log(`🚀 Server Running on Port ${PORT}`);
});
