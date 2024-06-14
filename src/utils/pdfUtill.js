const fs = require("fs");
const html_to_pdf = require("html-pdf-node");
const path = require("path");
const ejs = require("ejs");

const filePath = path.resolve(__dirname, "../documents/KycPdf.html");
const generateKycPdf = async (data = {}) => {
  try {
    const template = await fs.promises.readFile(filePath, "utf8");
    const htmlContent = ejs.render(template, data);
    let file = { content: htmlContent };
    let options = { format: "A4" };
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    return pdfBuffer;
  } catch (err) {
    throw new Error("Error generating PDF: " + err.message);
  }
};

module.exports = { generateKycPdf };
