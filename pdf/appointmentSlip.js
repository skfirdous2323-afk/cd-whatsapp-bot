import fs from "fs";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function generateAppointmentSlip(data) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText("SmileCare Dental Clinic", {
    x: 180,
    y: 760,
    size: 20,
    font,
    color: rgb(0, 0.5, 0.8),
  });

  page.drawText(`Appointment ID: ${data.appointmentId}`, {
    x: 50,
    y: 700,
    size: 14,
    font,
  });

  page.drawText(`Patient Name: ${data.name}`, {
    x: 50,
    y: 670,
    size: 14,
    font,
  });

  page.drawText(`Phone: ${data.phone}`, {
    x: 50,
    y: 640,
    size: 14,
    font,
  });

  page.drawText(`Doctor: ${data.doctor}`, {
    x: 50,
    y: 610,
    size: 14,
    font,
  });

  page.drawText(`Date: ${data.date}`, {
    x: 50,
    y: 580,
    size: 14,
    font,
  });

  page.drawText(`Time: ${data.time}`, {
    x: 50,
    y: 550,
    size: 14,
    font,
  });

  page.drawText("Status: Pending", {
    x: 50,
    y: 520,
    size: 14,
    font,
  });

  const pdfBytes = await pdfDoc.save();

  const filePath = `./pdf/${data.appointmentId}.pdf`;
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
}
