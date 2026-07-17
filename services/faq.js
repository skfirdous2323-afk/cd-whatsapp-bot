export function getFAQ(question) {
  const q = question.toLowerCase();

  if (q.includes("fee") || q.includes("price")) {
    return "💰 Consultation Fee starts from ₹300.";
  }

  if (q.includes("time") || q.includes("open")) {
    return "🕘 Clinic Hours: Monday - Saturday, 09:00 AM - 06:00 PM.";
  }

  if (q.includes("location") || q.includes("address")) {
    return "📍 We are located near Illambazar Bus Stand, Birbhum.";
  }

  if (q.includes("appointment")) {
    return "📅 Type 'Hi' and choose Book Appointment from the menu.";
  }

  if (q.includes("doctor")) {
    return "👨‍⚕️ We have Dr. Rahul Mehta and Dr. Priya Sharma.";
  }

  return null;
}
