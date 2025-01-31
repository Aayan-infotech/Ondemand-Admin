import jsPDF from "jspdf";
import "jspdf-autotable";



const generatePDF = (ride) => {
  const doc = new jsPDF();

  // **HEADER**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("On-Demand Ride Details", 70, 20);
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Ride ID: ${ride._id}`, 15, 30);
  doc.text(`Date: ${new Date().toLocaleString()}`, 140, 30);

  doc.setLineWidth(0.5);
  doc.line(15, 35, 195, 35); // Horizontal Line

  // **USER DETAILS**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("User Details", 15, 45);
  
  doc.autoTable({
    startY: 50,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Name", ride.userId?.name || "N/A"],
      ["Email", ride.userId?.email || "N/A"],
      ["Mobile", ride.userId?.mobileNumber || "N/A"]
    ]
  });

  // **DRIVER DETAILS**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Driver Details", 15, doc.autoTable.previous.finalY + 10);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Name", ride.driverId?.name || "N/A"],
      ["Email", ride.driverId?.email || "N/A"],
      ["Mobile", ride.driverId?.mobileNumber || "N/A"]
    ]
  });

  // **VEHICLE DETAILS**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Vehicle Details", 15, doc.autoTable.previous.finalY + 10);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Model", ride.vehicleId?.model || "N/A"],
      ["Vehicle Number", ride.vehicleId?.vehicleNumber || "N/A"],
      ["Type", ride.vehicleId?.type || "N/A"]
    ]
  });

  // **RIDE DETAILS**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ride Details", 15, doc.autoTable.previous.finalY + 10);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Pickup Location", `Lat: ${ride.pickupLocation.coordinates[1]}, Long: ${ride.pickupLocation.coordinates[0]}`],
      ["Dropoff Location", `Lat: ${ride.dropoffLocation.coordinates[1]}, Long: ${ride.dropoffLocation.coordinates[0]}`],
      ["Final Fare", `₹${ride.finalFare}`],
      ["Payment Status", ride.paymentStatus],
      ["Ride Status", ride.status],
      ["Created At", new Date(ride.createdAt).toLocaleString()],
      ["Updated At", new Date(ride.updatedAt).toLocaleString()],
      ["OTP", ride.otp || "N/A"]
    ]
  });

  // Save the PDF
  doc.save(`Ride_${ride._id}.pdf`);
};

export {generatePDF}