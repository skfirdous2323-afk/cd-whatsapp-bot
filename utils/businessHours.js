export function isClinicOpen() {
  const now = new Date();

  // India Time
  const indiaTime = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const day = indiaTime.getDay(); // 0 = Sunday
  const hour = indiaTime.getHours();

  // Sunday Closed
  if (day === 0) {
    return false;
  }

  // Open: 9 AM - 6 PM
  return hour >= 9 && hour < 18;
}
