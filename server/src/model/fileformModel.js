const mongoose = require('mongoose')
const schema = mongoose.Schema

const formschema = new schema({
    pdf_name: { type: String },
    pdf: { type: String }, // Rename pdf_file to pdf
});
formschema.add({ extracted_pdf: String });
const form_model = mongoose.model('form_tb',formschema)
module.exports = form_model