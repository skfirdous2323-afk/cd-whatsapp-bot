export function getNext10Days() {
  const days = [];

  for (let i = 0; i < 10; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);

    const id = date.toISOString().split("T")[0];

    const title = date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    });

    let description = "Available";

    if (i === 0) description = "Today";
    if (i === 1) description = "Tomorrow";

    days.push({
      id,
      title,
      description
    });
  }

  return days;
}
