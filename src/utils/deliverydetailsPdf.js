import jsPDF from "jspdf";
import "jspdf-autotable";

const deliveryDetailsPdf = (ride) => {
  const doc = new jsPDF();

  // **HEADER**
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Delivery Details Report", 70, 20);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Ride ID: ${ride._id || "N/A"}`, 15, 30);
  doc.text(`Date: ${new Date().toLocaleString()}`, 140, 30);

  doc.setLineWidth(0.5);
  doc.line(15, 35, 195, 35); // Horizontal Line

  // **RIDE DETAILS**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Delivery Information", 15, 45);

  doc.autoTable({
    startY: 50,
    theme: "grid",
    head: [["Field", "Details"]],
    body: [
      ["Status", ride.status || "N/A"],
      ["Final Fare", `₹${ride.finalFare || "0.00"}`],
      ["Payment Status", ride.paymentStatus || "N/A"],
      ["Created At", new Date(ride.createdAt).toLocaleString() || "N/A"],
      ["Updated At", new Date(ride.updatedAt).toLocaleString() || "N/A"]
    ]
  });

  // **USER & DRIVER DETAILS (Condensed)**
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("User & Driver Details", 15, doc.autoTable.previous.finalY + 10);

  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    theme: "grid",
    head: [["Field", "User", "Driver"]],
    body: [
      ["Name", ride.userId?.name || "N/A", ride.driverId?.name || "N/A"],
      ["Mobile", ride.userId?.mobileNumber || "N/A", ride.driverId?.mobileNumber || "N/A"]
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
      ["Type", ride.vehicleId?.type || "N/A"],
      ["Vehicle Number", ride.vehicleId?.vehicleNumber || "N/A"]
    ]
  });

  // **Save the PDF**
  doc.save(`Ride_${ride._id || "Unknown"}.pdf`);
};

export { deliveryDetailsPdf };
