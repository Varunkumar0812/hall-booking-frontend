import { useEffect, useState } from "react";
import { usePDF } from "react-to-pdf";

function StudentDashboardPendingRequests(props) {
  const [bookingData, setBookingData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [bookingPDFData, setBookingPDFData] = useState([{}]);
  const { toPDF, targetRef } = usePDF({ filename: "page.pdf" });

  var style = {
    display: "none",
  };

  //STUDENT ODA DETAILS
  const userData = JSON.parse(localStorage.getItem("authToken"));
  //

  const bookingDate = new Date();
  bookingDate.setDate(bookingDate.getDate() - 1);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(
        "http://localhost:8800/api/booking/userBookings",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      const hallData = await data.json();

      setBookingData(hallData);
    };
    fetchData();
  }, []);

  const filteredBookings =
    selectedStatus === "all"
      ? bookingData
      : bookingData.filter((booking) => booking.Status === selectedStatus);

  const getStatusClassName = (status) => {
    switch (status) {
      case "rejected":
        return "block w-full p-4 bg-[#fe3233] rounded-lg shadow-lg hover:bg-[#f0292a] hover:cursor-default";
      case "approved":
        return "block w-full p-4 bg-[#37b317] rounded-lg shadow-lg hover:bg-[#31a314] hover:cursor-default"; // cursor-pointer for clickable
      case "pending":
        return "block w-full p-4 bg-[#fea501] rounded-lg shadow-lg hover:bg-[#f09c02] hover:cursor-default";
      default:
        return "bg-white cursor-default";
    }
  };

  const handleDivClick = (status, id, booking) => {
    if (status === "approved") {
      // Implement logic to print the approval PDF
      console.log(`Printing PDF for booking with ID: ${id}`);
      setBookingPDFData([booking]);
      setTimeout(() => {
        document.getElementById("pdf").style.display = "block";
        toPDF();
        document.getElementById("pdf").style.display = "none";
      }, 1000);
    }
  };

  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }; //DATE OPTIONS
  const timeOptions = { hour: "numeric", minute: "numeric" }; //TIME OPTIONS

  return (
    <div className="bg-neutral-100 w-full">
      <nav className="bg-white border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div className="flex items-center flex-wrap">
            <span className="self-center mr-4 text-md md:text-2xl font-bold whitespace-nowrap">
              REQUESTS :{" "}
            </span>
            <ul className="font-medium mt-2 sm:mt-0 flex flex-wrap rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 bg-white">
              <li className="flex items-center mr-2 text-sm sm:text-md">
                <div className="h-4 w-6 bg-[#fe3233] mr-2"></div>
                <div>Rejected</div>
              </li>
              <li className="flex items-center mr-2 text-sm sm:text-md">
                <div className="h-4 w-6 bg-[#37b317] mr-2"></div>
                <div>Approved</div>
              </li>
              <li className="flex items-center mr-2 text-sm sm:text-md">
                <div className="h-4 w-6 bg-[#fea501] mr-2"></div>
                <div>Pending</div>
              </li>
            </ul>
          </div>

          <div
            className="mt-2 lg:mt-0 w-full md:block md:w-auto"
            id="navbar-default"
          >
            <select
              id="email"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#f8fafa] border border-gray-300 text-gray-900 text-md rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
              required
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </nav>

      <div className="p-4 sm:p-10 max-h-[550px] overflow-y-auto">
        <ul>
          {filteredBookings.map((booking) => (
            <li className="p-2">
              <div
                className={`${getStatusClassName(booking.Status)}`}
                onClick={() =>
                  handleDivClick(booking.Status, booking._id, booking)
                }
              >
                <h5 className="mb-2 text-xl font-bold tracking-tight">
                  {booking.Hall_Name} |{" "}
                  {new Date(booking.Date).toLocaleDateString("en-US", options)}{" "}
                  |{" "}
                  {new Date(booking.Time_From).toLocaleTimeString(
                    "en-US",
                    timeOptions
                  )}{" "}
                  TO{" "}
                  {new Date(booking.Time_To).toLocaleTimeString(
                    "en-US",
                    timeOptions
                  )}{" "}
                </h5>
                <div className="flex justify-between items-end">
                  <div className="font-normal text-black text-sm">
                    <div>Affiliated Department/Club: {booking.Affiliated}</div>
                    <div>Reason : {booking.Reason}</div>
                  </div>
                  <div className="text-sm">
                    <div>Submitted On :</div>
                    <div>Timestamp to be added</div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {bookingPDFData.map((data) => (
        <div ref={targetRef}>
          <div className="hidden" id="pdf">
            <div className="p-10">
              <div className="text-[96px] text-center">
                Booking Approval Form
              </div>
              <div className="text-3xl">
                <div>
                  This form is proof of approval for the following booking :
                </div>
                <div>Student Roll No : {data.Student_ID}</div>
                <div>Department : {data.Department}</div>
                <div>Affiliated Department : {data.Affiliated}</div>
                <div>Date : {data.Date}</div>
                <div>Time From : {data.Time_From}</div>
                <div>Time TO : {data.Time_To}</div>
                <div>Reason : {data.Reason}</div>
                <br></br>
                <br></br>
                <div>Remarks from the Hall Incharge : {data.Remark}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StudentDashboardPendingRequests;
