import axios from "axios";
import { getTimeSlots } from "../utils/timeSlots.js";
import supabase from "../supabase.js";

export async function sendTimeMenu(phone, session) {

  const allSlots = getTimeSlots();

  // Already booked slots check
  const { data: bookedSlots } = await supabase
    .from("appointments")
    .select("appointment_time")
    .eq("doctor", session.doctor)
    .eq("appointment_date", session.date)
    .neq("status", "Cancelled");


  const booked = bookedSlots?.map(
    item => item.appointment_time
  ) || [];


  // Remove booked slots
  const availableSlots = allSlots.filter(
    time => !booked.includes(time)
  );


  const rows = availableSlots.map((time, index) => ({
    id: `time_${index}`,
    title: time,
    description: "Available"
  }));


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
          text: "🕒 Select Appointment Time"
        },
        body: {
          text: "Choose an available 30 minute slot."
        },
        footer: {
          text: "SmileCare Dental Clinic"
        },
        action: {
          button: "Select Time",
          sections: [
            {
              title: "Available Slots",
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
