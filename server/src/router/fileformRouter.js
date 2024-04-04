const express = require("express");
const form_model = require("../model/fileformModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { PDFDocument } = require("pdf-lib");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const formRouter = express.Router();

cloudinary.config({
  cloud_name: "ddjp6omvg",
  api_key: "123553778373481",
  api_secret: "KeHv2Fi5dFSVKgqIkoBFDfYnzMY",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdf_files",
  },
});

const upload = multer({ storage: storage });

formRouter.post("/", upload.single("pdf"), async function (req, res) {
  try {
    const { pdf_name } = req.body;

    const pdf_file_path = req.file ? req.file.path : null;

    const data = {
      pdf_name: pdf_name,
      pdf: pdf_file_path,
    };

    const savedEntry = await form_model(data).save();
    if (savedEntry) {
      res.status(200).json({
        success: true,
        message: "Form submitted successfully",
        details: savedEntry,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: true,
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
});

formRouter.get("/data", async function (req, res) {
  try {
    const data = await form_model.find();
    if (data) {
      res.status(200).json({
        success: true,
        message: "data collected successfully",
        details: data,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      error: true,
      message: "Something went wrong",
      errorMessage: error.message,
    });
  }
});

formRouter.post("/extract", async function (req, res) {
  try {
    const selectedpage = req.body.selectedpage;
    console.log("selectedpage", selectedpage);
    const pdf = req.body.pdfdata;
    console.log("pdf", pdf);
    const pdfdata = await form_model.findOne({ pdf: pdf });
    console.log(pdfdata);
    console.log("11");

    const response = await axios.get(pdf, { responseType: "arraybuffer" });
    const pdfbyte = Buffer.from(response.data);

    console.log(pdfbyte);
    console.log("11");
    const pdfDoc = await PDFDocument.load(pdfbyte);
    console.log("Loaded PDF Document:", pdfDoc);
    const newPdfDoc = await PDFDocument.create();

    selectedpage.forEach((element) => {});
    (element) => {};
    (pageIndex) => {
      const pageIndexInt = parseInt(pageIndex, 10); // Convert page index to zero-based
      const [copiedPage] = newPdfDoc.copyPages(pdfDoc, [pageIndexInt]);
      newPdfDoc.addPage(copiedPage);
    };
    const newPdfBytes = await newPdfDoc.save();
    const newPdfBase64 = Buffer.from(newPdfBytes).toString("base64");

    // const newPdfBase64 = newPdfBytes.toString("base64");
    // const outputPath = path.join(__dirname, "output.pdf");
    // fs.writeFileSync(outputPath, newPdfBytes);
    const dataUri = `data:application/pdf;base64,${newPdfBase64}`;

    const updatedFormModel = await form_model.findOneAndUpdate(
      { pdf: pdf }, // Corrected to use pdfUrl
      { 
          extracted_pdf: dataUri // Save the Cloudinary URL of the extracted PDF
      },
      { new: true }
  );
   
   

    // Delete the temporary file
    res.status(200).json({
      success: true,
      message: "data collected successfully",
      details: dataUri,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ success: false, message: "Error processing PDF" });
  }
});
module.exports = formRouter;
