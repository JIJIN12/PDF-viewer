import React, { useState } from 'react'
import axios from "axios";
export default function Form() {
    const [filedata, set_filedata] = useState({});
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
          console.log(response.data.details);      })
        .catch((error) => {
          console.log(error);
        });
    };
  
  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="border-2 border-slate-300 w-fit p-4">
        <h1 className="text-[2rem] flex justify-center mb-5">FORM</h1>
        <div>
          <label>Name</label>
          <input
            type="text"
            placeholder="NAME"
            name="pdf_name"
            className=" pl-2 ml-2 border-2 border-slate-500"
            onChange={fileinput}
          />
          <br />
          <br />
          {/* <label> PDF FILE</label> */}
          <input
            type="file"
            accept=".pdf"
            name="pdf"
            onChange={(e) => {
              set_filedata({ ...filedata, pdf: e.target.files[0] });
            }}
          />
        </div>
        <br />
        <button onClick={submit}>SUBMIT</button>
      </div>
    </div>
  )
}
