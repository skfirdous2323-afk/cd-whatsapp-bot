import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateAppointmentSlip(data) {
  const pdfDoc = await PDFDocument.create();

  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Load Logo
  try {
    const logoBytes = fs.readFileSync("./assets/logo.png");
    const logoImage = await pdfDoc.embedPng(logoBytes);

    page.drawImage(logoImage, {
      x: 235,
      y: 675,
      width: 130,
      height: 130,
    });
  } catch (err) {
    console.log("Logo not found.");
  }

  // Header
  page.drawText("SmileCare Dental Clinic", {
    x: 145,
    y: 650,
    size: 22,
    font: boldFont,
    color: rgb(0, 0.45, 0.85),
  });

  page.drawText("Professional Dental Care", {
    x: 205,
    y: 628,
    size: 11,
    font,
    color: rgb(0.4, 0.4, 0.4),
  });

  // Line
  page.drawLine({
    start: { x: 40, y: 610 },
    end: { x: 560, y: 610 },
    thickness: 2,
    color: rgb(0, 0.45, 0.85),
  });

  let y = 575;

  const drawRow = (label, value) => {
    page.drawText(label, {
      x: 60,
      y,
      size: 13,
      font: boldFont,
    });

    page.drawText(String(value), {
      x: 220,
      y,
      size: 13,
      font,
    });

    y -= 35;
  };

  drawRow("Appointment ID", data.appointmentId);
  drawRow("Patient Name", data.name);
  drawRow("Phone", data.phone);
  drawRow("Doctor", data.doctor);
  drawRow("Date", data.date);
  drawRow("Time", data.time);
  drawRow("Status", "Pending");

  page.drawLine({
    start: { x: 40, y: 285 },
    end: { x: 560, y: 285 },
    thickness: 1,
    color: rgb(0.7, 0.7, 0.7),
  });

  page.drawText("Clinic Address", {
    x: 60,
    y: 255,
    size: 13,
    font: boldFont,
  });

  page.drawText("123 Main Road, Ilambazar, Birbhum", {
    x: 60,
    y: 235,
    size: 12,
    font,
  });

  page.drawText("Phone: +91XXXXXXXXXX", {
    x: 60,
    y: 215,
    size: 12,
    font,
  });

  page.drawText("Doctor Signature", {
    x: 360,
    y: 170,
    size: 12,
    font: boldFont,
  });

  page.drawText("SEKH FIRDOUS", {
    x: 360,
    y: 145,
    size: 16,
    font: boldFont,
    color: rgb(0, 0.2, 0.8),
  });

  page.drawText("Authorized Signatory", {
    x: 360,
    y: 125,
    size: 10,
    font,
  });

  page.drawText(
    "Thank you for choosing SmileCare Dental Clinic",
    {
      x: 125,
      y: 60,
      size: 12,
      font: boldFont,
      color: rgb(0, 0.45, 0.85),
    }
  );

  const pdfBytes = await pdfDoc.save();

  const filePath = `./pdf/${data.appointmentId}.pdf`;

  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}
