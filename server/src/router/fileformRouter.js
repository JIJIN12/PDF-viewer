const express = require("express");
const form_model = require("../model/fileformModel");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const PDFExtract = require("pdf.js-extract").PDFExtract;
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
    console.log(req.body);
    const selectedPages = req.body.selectedpage;
    console.log("Selected Pages:", selectedPages);

    const pdfPath = req.body.pdfdata; // Assuming pdfdata contains the URL to the PDF file on Cloudinary
console.log('ll');
    // Extract the public ID from the Cloudinary URL
    const publicIdStartIndex = pdfPath.lastIndexOf('/') + 1;
    const publicIdEndIndex = pdfPath.lastIndexOf('.');
    const publicId = pdfPath.substring(publicIdStartIndex, publicIdEndIndex);
    
    // Construct the local file path where the PDF will be saved temporarily
    const tempFilePath = path.join(__dirname, `temp_${publicId}.pdf`);
    const pdfExtract = new PDFExtract();
    console.log('kk');

    // Extract the selected pages from the PDF using pdf.js-extract
    pdfExtract.extract(pdfPath, {}, async (err, data) => {
      if (err) {
        console.error("Error extracting PDF:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error extracting PDF" });
      }

      // Create a new PDF document to copy selected pages into
      const newPdfDoc = await PDFDocument.create();
      console.log("ll");
      // Iterate over the selected pages and copy them to the new PDF document
      selectedPages.forEach((pageIndex) => {
        const pageIndexInt = parseInt(pageIndex, 10) - 1; // Convert page index to zero-based
        const pageContent = data.pages[pageIndexInt].content; // Get the content of the selected page
        // Add the page content to the new PDF document (you may need to adjust this based on the content structure)
        newPdfDoc.addPage([pageContent]);
      });

      // Serialize the new PDF document to bytes
      const newPdfBytes = await newPdfDoc.save();

      // Define the file path where the new PDF will be saved
      const outputPath = path.join(__dirname, "output.pdf");

      // Write the new PDF bytes to the file
      fs.writeFileSync(outputPath, newPdfBytes);

      res.status(200).json({
        success: true,
        message: "Selected pages copied successfully and new PDF saved to file",
        filePath: outputPath, // Include the file path in the response
      });
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ success: false, message: "Error processing PDF" });
  }
});
module.exports = formRouter;
