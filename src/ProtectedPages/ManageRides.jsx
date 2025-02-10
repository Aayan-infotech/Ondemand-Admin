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
  TwoWheeler as BikeIcon,
} from "@mui/icons-material";
import { generatePDF } from "../utils/rideDetailsPdf";

const columns = [
  { id: "Driver", label: "Driver", minWidth: 150, align: "center" },
  { id: "User", label: "user Name", minWidth: 100, align: "center" },
  { id: "status", label: " Ride status", minWidth: 150, align: "left" },
  { id: "finalFare", label: "Final Fare", minWidth: 150, align: "left" },
  {
    id: "paymentStatus",
    label: "Payment Status",
    minWidth: 150,
    align: "left",
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
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");

  const handleEditOpen = (ride) => {
    setSelectedride(ride);
    setEditOpen(true);
  };

  const handleViewOpen = (ride) => {
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
      alert("Error updating ride", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      await axios.delete(`http://44.196.64.110:3211/api/ride/${id}`);
      setrides(rides.filter((ride) => ride._id !== id));
    } catch (error) {
      alert("Error deleting ride", error);
    }
  };
  const getRideDetailedInfo = async (id) => {
    setgetInfoLoader(true);
    try {
      const response = await axios.get(
        `http://44.196.64.110:3211/api/admin/details/${id}`
      );
      const ride = response.data.data; // Extract ride data

      setgetInfoLoader(false);

      // Generate PDF once data is available
      generatePDF(ride);
    } catch (error) {
      setgetInfoLoader(false);
      alert("Error fetching ride details", error);
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
      setrides(res.data.data.rides);
    } catch (error) {
      alert(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredRides = rides.filter((ride) => {
    return (
      (statusFilter ? ride.status === statusFilter : true) &&
      (paymentStatusFilter ? ride.paymentStatus === paymentStatusFilter : true)
    );
  });
  return (
    <>
      <Box sx={{ fontSize: "24px", textAlign: "center" }}>Ride Management</Box>
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2 }}>
        {/* Status Filter */}
        <TextField
          select
          label="Filter by Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="arriving">Arriving</option>
          <option value="arrived">Arrived</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="canceled_by_user">Cancelled by User</option>
          <option value="canceled_by_driver">Cancelled by Driver</option>
          <option value="canceled_by_system">Cancelled by System</option>
        </TextField>

        {/* Payment Status Filter */}
        <TextField
          select
          label="Filter by Payment Status"
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          SelectProps={{ native: true }}
        >
          <option value=""></option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </TextField>

        {/* Clear Filters Button */}
        <Button
          variant="outlined"
          onClick={() => {
            setStatusFilter("");
            setPaymentStatusFilter("");
          }}
        >
          Clear Filters
        </Button>
      </Box>
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
              {filteredRides
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((ride) => (
                  <TableRow hover key={ride._id}>
                    <TableCell sx={{ textAlign: "center" }}>
                      {ride?.driverId?.name||"N/A"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {ride?.userId?.name}
                    </TableCell>
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
                      {/* <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(ride)}
                      >
                        <EditIcon />
                      </IconButton> */}

                      {/* <IconButton
                        color="error"
                        onClick={() => handleDelete(ride._id)}
                      >
                        <DeleteIcon />
                      </IconButton> */}
                      {getInfoLoader ? (
                        <CircularProgress size={24} />
                      ) : (
                        <Button
                          color="secondary"
                          onClick={() => getRideDetailedInfo(ride._id)}
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
                      <strong>Driver </strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.driverId.name || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>User</strong>
                    </TableCell>
                    <TableCell>{selectedride?.userId?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Vehicle</strong>
                    </TableCell>
                    <TableCell>{selectedride?.vehicleId?.model || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Pickup Location</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.pickupAddress|| "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Dropoff Location</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.dropoffAddress|| "N/A"}
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
