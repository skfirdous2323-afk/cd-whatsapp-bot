export function getDoctorName(doctor) {
  return doctor === "dr_rahul"
    ? "Dr. Rahul Mehta"
    : "Dr. Priya Sharma";
}

export function getDateName(date) {
  switch (date) {
    case "today":
      return "Today";
    case "tomorrow":
      return "Tomorrow";
    case "day_after":
      return "Day After Tomorrow";
    default:
      return date;
  }
}

export function getTimeName(time) {
  const times = {
    time_9: "09:00 AM",
    time_10: "10:00 AM",
    time_11: "11:00 AM",
    time_2: "02:00 PM",
  };

  return times[time] || time;
}
