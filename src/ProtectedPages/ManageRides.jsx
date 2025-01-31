import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Switch,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { generatePDF } from "../utils/rideDetailsPdf";

const columns = [
  { id: "driverId", label: " Driver Id", minWidth: 170, align: "center" },
  { id: "userId", label: "userId", minWidth: 100, align: "center" },
  { id: "vehicleId", label: "E-vehicle Id", minWidth: 170, align: "center" },
  { id: "status", label: "status", minWidth: 170, align: "center" },
  { id: "finalFare", label: "finalFare", minWidth: 170, align: "center" },
  {
    id: "paymentStatus",
    label: "Payment Status",
    minWidth: 170,
    align: "center",
  },
  { id: "action", label: "Action", minWidth: 200, align: "center" },
];
const ManageRides = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rides, setrides] = useState([]);
  const [selectedride, setSelectedride] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [getInfoLoader, setgetInfoLoader] = useState(false);

  const handleEditOpen = (ride) => {
    setSelectedride(ride);
    setEditOpen(true);
  };

  const handleViewOpen = (ride) => {
    // console.log(ride);
    setSelectedride(ride);
    setViewOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setViewOpen(false);
    setSelectedride(null);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://44.196.64.110:3211/api/ride/${selectedride._id}`,
        selectedride
      );
      fetchData();
      handleClose();
    } catch (error) {
      console.log("Error updating ride", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      await axios.delete(`http://44.196.64.110:3211/api/ride/${id}`);
      setrides(rides.filter((ride) => ride._id !== id));
    } catch (error) {
      console.log("Error deleting ride", error);
    }
  };
 const getRideDetailedInfo = async (id) => {
   setgetInfoLoader(true);
   try {
     const response = await axios.get(`http://localhost:3211/api/admin/details/${id}`);
     const ride = response.data.data; // Extract ride data
 
     console.log(ride);
     setgetInfoLoader(false);
 
     // Generate PDF once data is available
     generatePDF(ride);
 
   } catch (error) {
     setgetInfoLoader(false);
     console.log("Error fetching ride details", error);
   }
 };

  const handleInputChange = (e) => {
    setSelectedride({ ...selectedride, [e.target.name]: e.target.value });
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://44.196.64.110:3211/api/rideRequest/getAll/rides"
      );
      console.log(res.data.data.rides);
      setrides(res.data.data.rides);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <Box sx={{ fontSize: "24px", textAlign: "center" }}>Ride Management</Box>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rides
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((ride) => (
                  <TableRow hover key={ride._id}>
                    <TableCell>{ride.driverId}</TableCell>
                    <TableCell>{ride.userId}</TableCell>
                    <TableCell>{ride.vehicleId}</TableCell>
                    <TableCell>{ride.status}</TableCell>
                    <TableCell>{ride.finalFare}</TableCell>
                    <TableCell>{ride.paymentStatus}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOpen(ride)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(ride)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(ride._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      {getInfoLoader ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Button
                          color="secondary"
                            onClick={()=>getRideDetailedInfo(ride._id)}
                        >
                          <DownloadIcon />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rides.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>

      {/* Edit ride Modal */}
      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit ride</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={selectedride?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="E-mail"
            name="email"
            value={selectedride?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Contact No."
            name="mobileNumber"
            value={selectedride?.mobileNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={selectedride?.dateOfBirth?.split("T")[0] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Gender"
            name="gender"
            value={selectedride?.gender || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address"
            name="address"
            value={selectedride?.address || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            name="city"
            value={selectedride?.city || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="State"
            name="state"
            value={selectedride?.state || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Zip Code"
            name="zipcode"
            value={selectedride?.zipcode || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Driving License Number"
            name="drivingLicenseNumber"
            value={selectedride?.drivingLicenseNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="License Issue Date"
            name="licenseIssueDate"
            type="date"
            value={selectedride?.licenseIssueDate?.split("T")[0] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="License Expiry Date"
            name="licenseExpiryDate"
            type="date"
            value={selectedride?.licenseExpiryDate?.split("T")[0] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />

          <Box
            sx={{ display: "flex", gap: 2, alignItems: "center", marginTop: 2 }}
          >
            <label>Verified:</label>
            <Switch
              checked={selectedride?.isVerified || false}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "isVerified", value: e.target.checked },
                })
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <label>Available:</label>
            <Switch
              checked={selectedride?.isAvailable || false}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "isAvailable", value: e.target.checked },
                })
              }
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <label>On Duty:</label>
            <Switch
              checked={selectedride?.isOnDuty || false}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "isOnDuty", value: e.target.checked },
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View ride Modal */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Ride Details</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 2,
            }}
          >
            {/* Ride Details Table */}
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Driver ID</strong>
                    </TableCell>
                    <TableCell>{selectedride?.driverId || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>User ID</strong>
                    </TableCell>
                    <TableCell>{selectedride?.userId || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Vehicle ID</strong>
                    </TableCell>
                    <TableCell>{selectedride?.vehicleId || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Pickup Location</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.pickupLocation
                        ? `Lat: ${selectedride.pickupLocation.coordinates[1]}, Long: ${selectedride.pickupLocation.coordinates[0]}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Dropoff Location</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.dropoffLocation
                        ? `Lat: ${selectedride.dropoffLocation.coordinates[1]}, Long: ${selectedride.dropoffLocation.coordinates[0]}`
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Final Fare</strong>
                    </TableCell>
                    <TableCell>{selectedride?.finalFare || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>OTP</strong>
                    </TableCell>
                    <TableCell>{selectedride?.otp || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>OTP Expiry Time</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.otpExpiryTime
                        ? new Date(selectedride.otpExpiryTime).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Payment Status</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.paymentStatus || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Ride Status</strong>
                    </TableCell>
                    <TableCell>{selectedride?.status || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Created At</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.createdAt
                        ? new Date(selectedride.createdAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Updated At</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.updatedAt
                        ? new Date(selectedride.updatedAt).toLocaleString()
                        : "N/A"}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageRides;
