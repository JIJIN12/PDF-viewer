import React, { useState } from "react";
import axios from "axios";
import Button from '@mui/material/Button';

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
export default function Form() {
  const [filedata, set_filedata] = useState({});
  const [responseMessage, setResponseMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  console.log(filedata);

  const fileinput = (e) => {
    const { name, value } = e.target;
    set_filedata({ ...filedata, [name]: value });
  };
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("pdf", filedata.pdf); // Use "pdf" as the key
    data.append("pdf_name", filedata.pdf_name);
    for (var pair of data.entries()) {
      console.log(pair[0] + ", " + pair[1]); // Log form data
    }
    axios
      .post("http://localhost:2000/form", data)
      .then((response) => {
        console.log(response.data); // Log the entire response object
        console.log(response.data.details);
        setResponseMessage(response.data.message);
        setShowAlert(true);
      })
      .catch((error) => {
        console.log(error);
        setResponseMessage('An error occurred while fetching data.');
        setShowAlert(true);
      });
  };

  const closebutton=()=>{
    setShowAlert(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
     <Stack sx={{ width: '100%' }} spacing={2}>
        {showAlert && (
          <Alert
          sx={{ backgroundColor: '#519c55',color:'white' }}
            severity="success"
            onClose={() => setShowAlert(false)}
            autoHideDuration={1200}
            action={
              <Button color="inherit" size="small" onClick={closebutton}>
                UNDO
              </Button>
            }
          >
            {responseMessage}
          </Alert>
        )}
      </Stack>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-semibold text-center mb-6">FORM</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            name="pdf_name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={fileinput}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDF File
          </label>
          <input
            type="file"
            accept=".pdf"
            name="pdf"
            onChange={(e) => {
              set_filedata({ ...filedata, pdf: e.target.files[0] });
            }}
          />
        </div>
        <button
          onClick={submit}
          className="w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-400"
        >
          SUBMIT
        </button>
      </div>
      <a href="/" className="mt-4 text-gray-500 hover:text-gray-700">
        Home
      </a>
    </div>
  );
}
