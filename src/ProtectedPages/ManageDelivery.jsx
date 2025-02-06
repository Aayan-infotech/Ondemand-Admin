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
import { deliveryDetailsPdf } from "../utils/deliverydetailsPdf";

const columns = [
  { id: "driverId", label: "Driver Name", minWidth: 150, align: "left" },
  { id: "userId", label: "User Name", minWidth: 100, align: "center" },
  { id: "status", label: "Delivery status", minWidth: 150, align: "left" },
  { id: "finalFare", label: "Final Fare", minWidth: 150, align: "left" },
  {
    id: "paymentStatus",
    label: "Payment Status",
    minWidth: 170,
    align: "center",
  },
  { id: "action", label: "Action", minWidth: 200, align: "center" },
];
const ManageDelivery = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [delivery, setDelivery] = useState([]);
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
    console.log(ride);
    setSelectedride(ride);
    setViewOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setViewOpen(false);
    setSelectedride(null);
  };
  const getRideDetailedInfo = async (id) => {
    setgetInfoLoader(true);
    try {
      const response = await axios.get(
        `http://44.196.64.110:3211/api/deliveryRequest/deliveryStatus/${id}`
      );
      const ride = response.data.data; // Extract ride data

      console.log(ride);
      setgetInfoLoader(false);

      // Generate PDF once data is available
      deliveryDetailsPdf(ride);
    } catch (error) {
      setgetInfoLoader(false);
      console.log("Error fetching ride details", error);
    }
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

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this ride?")) return;

  //   try {
  //     await axios.delete(`http://44.196.64.110:3211/api/ride/${id}`);
  //     setDelivery(delivery.filter((ride) => ride._id !== id));
  //   } catch (error) {
  //     console.log("Error deleting ride", error);
  //   }
  // };

  const handleInputChange = (e) => {
    setSelectedride({ ...selectedride, [e.target.name]: e.target.value });
  };
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://44.196.64.110:3211/api/deliveryRequest/getAll/deliveries"
      );
      console.log(res.data.data)
      setDelivery(res.data.data.deliveries);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const filteredDeliveries = delivery.filter((ride) => {
    return (
      (statusFilter ? ride.status === statusFilter : true) &&
      (paymentStatusFilter ? ride.paymentStatus === paymentStatusFilter : true)
    );
  });

  return (
    <>
      <Box sx={{ fontSize: "24px", textAlign: "center" }}>
        Delivery Management
      </Box>
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
          <option value="completed">Completed</option>
          <option value="canceled_by_system">Canceled by System</option>
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
              {filteredDeliveries.length < 1 ? (
                <Box sx={{ fontSize: "24px", textAlign: "center" }}>
                  No Deliveries Found
                </Box>
              ) : (
                filteredDeliveries
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  ?.map((ride) => (
                    <TableRow hover key={ride._id}>
                      <TableCell>{ride.driverId.name}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>{ride.userId.name}</TableCell>
                      <TableCell>{ride.status}</TableCell>
                      <TableCell>{ride.finalFare}</TableCell>
                      <TableCell sx={{textAlign:"center"}}>{ride.paymentStatus}</TableCell>
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
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={delivery.length}
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
                      <strong>Driver Name</strong>
                    </TableCell>
                    <TableCell>
                      {selectedride?.driverId.name || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>User Name</strong>
                    </TableCell>
                    <TableCell>{selectedride?.userId.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Vehicle Model</strong>
                    </TableCell>
                    <TableCell>{selectedride?.vehicleId.model || "N/A"}</TableCell>
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

                  {/* Canceled Ride Details */}
                  {selectedride?.status === "canceled" && (
                    <>
                      <TableRow>
                        <TableCell>
                          <strong>Canceled By</strong>
                        </TableCell>
                        <TableCell>
                          {selectedride?.canceledBy || "N/A"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Cancellation Time</strong>
                        </TableCell>
                        <TableCell>
                          {selectedride?.cancellationTime
                            ? new Date(
                                selectedride.cancellationTime
                              ).toLocaleString()
                            : "N/A"}
                        </TableCell>
                      </TableRow>
                    </>
                  )}
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

export default ManageDelivery;
