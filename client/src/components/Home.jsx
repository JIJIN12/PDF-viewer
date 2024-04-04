import axios from "axios";
import React, { useEffect, useState } from "react";
import { Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { Worker } from "@react-pdf-viewer/core";

export default function Home() {
  const [homedata, set_homedata] = useState([]);
  const [pdfdata, set_pdfdata] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedpage, set_selectedpage] = useState([]);
  const [extractedpdf, set_extractedpdf] = useState([]);

  // console.log('totalPages:',totalPages);
  console.log("selectedpage:", selectedpage);
  useEffect(() => {
    axios
      .get("http://localhost:2000/form/data")
      .then((Response) => {
        set_homedata(Response.data.details);
      })
      .catch((error) => {
        console.log("Fething Error Data:", error);
      });
  }, []);

  const viewpdf = (data) => {
    set_pdfdata(data.pdf);
  };
  const closePdfView = () => {
    set_pdfdata(null);
  };

  const handlepagechange = (pageindex) => {
    console.log("current pageindex:", pageindex);
  };
  const handleDocumentLoad = (numPages) => {
    console.log("Number of Pages:", numPages);
    setTotalPages(numPages.doc._pdfInfo.numPages);
  };

  const handleCheckboxChange = (e) => {
    console.log(e.target.checked);
    const { checked, value } = e.target;
    const pageNumber = String(value);
    if (checked) {
      set_selectedpage((prevSelectedpage) => [...prevSelectedpage, pageNumber]);
    } else {
      set_selectedpage((prevSelectedpage) =>
        prevSelectedpage.filter((page) => page !== pageNumber)
      );
    }
  };

  const extractinput = () => {
    axios
      .post(`http://localhost:2000/form/extract`, {
        selectedpage: selectedpage,
        pdfdata: pdfdata,
      })
      .then((Response) => {
        console.log(Response.data);
        set_extractedpdf(Response.data);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                {/* Your logo or brand */}
                <span className="text-white font-semibold text-xl">
                  PDF VIEWER
                </span>
              </div>
            </div>
            <div className="flex items-center">
              {/* Nav links */}
              <div className=" md:block">
                <a
                  href="/form"
                  className="text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Add PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200">
              <h1 className="text-3xl font-bold text-center mb-8">Home</h1>
              <div className="flex flex-wrap justify-center">
                {homedata.map((data, index) => (
                  <div
                    key={index}
                    className="m-4 border-2 border-black rounded-lg w-64 p-3"
                  >
                    <p>{data.pdf_name}</p>
                    <button
                      className="bg-green-500 px-3 py-1 rounded-lg text-white"
                      onClick={() => viewpdf(data)}
                    >
                      View PDF
                    </button>
                  </div>
                ))}
              </div>
              {pdfdata ? (
                <>
                  <button
                    className="bg-red-500 px-3 py-1 rounded-lg text-white"
                    onClick={closePdfView}
                  >
                    Close PDF
                  </button>
                  {Object.keys(selectedpage).length > 0 && (
                    <button
                      className="px-3 py-1 rounded-lg text-white bg-amber-800 mr-2 float-right"
                      onClick={extractinput}
                    >
                      Extract
                    </button>
                  )}
                  <div className="checkbox-container">
                    <p className="mb-2">Select pages to extract from below</p>
                    {[...Array(totalPages).keys()].map((index) => (
                      <div key={index} className="checkbox-item">
                        <label>
                          <input
                            type="checkbox"
                            value={index}
                            name="page"
                            onChange={handleCheckboxChange}
                            checked={selectedpage.hasOwnProperty(String(index))}
                          />
                        </label>
                        {index + 1}
                      </div>
                    ))}
                  </div>
                  <div className="pdf-viewer-container">
                    <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                      <Viewer
                        fileUrl={pdfdata}
                        defaultScale={SpecialZoomLevel.PageFit}
                        onDocumentLoad={handleDocumentLoad}
                        onPageChange={(pageindex) =>
                          handlepagechange(pageindex.currentPage + 1)
                        }
                      />
                    </Worker>
                  </div>
                </>
              ) : (
                <p className="text-center">
                  Click on "View PDF" to view the PDF
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
