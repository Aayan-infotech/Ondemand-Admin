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
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  TwoWheeler as BikeIcon,
  ShoppingBag as BagIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { RideModal } from "../Modal/RideModal";

const columns = [
  { id: "imageUrl", label: "Profile Picture", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "E_mail", label: "E-mail", minWidth: 170, align: "left" },
  { id: "ContactNo", label: "Contact No.", minWidth: 170, align: "left" },
  { id: "driverStatus", label: "Driver Status", minWidth: 170, align: "left" },
  { id: "Verified", label: "Verified", minWidth: 170, align: "left" },
  { id: "actions", label: "Actions", minWidth: 200, align: "center" },
];

export default function ManageDrivers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [drivers, setdrivers] = useState([]);
  const [selecteddriver, setSelecteddriver] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [viewAllRideModal, setViewAllRideModal] = useState({
    isOpen: false,
    rides: [],
    type:""
  });

  const handleEditOpen = (driver) => {
    setSelecteddriver(driver);
    setEditOpen(true);
  };

  const handleViewOpen = (driver) => {
    // console.log(driver);
    setSelecteddriver(driver);
    setViewOpen(true);
  };
  const handleOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setViewOpen(false);
    setOpen(false);
    setSelecteddriver(null);
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://44.196.64.110:3211/api/driver/${selecteddriver._id}`,
        selecteddriver
      );
      fetchData();
      handleClose();
    } catch (error) {
      console.log("Error updating driver", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this driver?")) return;

    try {
      await axios.delete(`http://44.196.64.110:3211/api/driver/${id}`);
      setdrivers(drivers.filter((driver) => driver._id !== id));
    } catch (error) {
      console.log("Error deleting driver", error);
    }
  };
  const handleDriverVerification = async (driverId) => {
    console.log(driverId);
    try {
      const res = await axios.put(
        `http://44.196.64.110:3211/api/driver/verify/${driverId}`
      );
      console.log(res);
      await fetchData();
    } catch (error) {
      console.log(error);
    }
  };
  const handleDriverStatus = async (driverId) => {
    try {
      console.log(driverId);
      const res = await axios.put(
        `http://44.196.64.110:3211/api/driver/updateStatus/${driverId}`
      );
      console.log(res);
      await fetchData();
    } catch (error) {
      console.error("Error updating driver status:", error);
    }
  };
  const ViewAllRides = async (driverId) => {
    try {
      const res = await axios.get(
        `http://44.196.64.110:3211/api/rideRequest/completed/driver/count/${driverId}`
      );
      console.log(res.data.data);
      setViewAllRideModal({
        isOpen: true,
        type:"Rides",
        rides: res.data.data.completedRides || [], // Ensure it's an array
      });
    } catch (error) {
      console.log("Error getting data of user", error);
    }
  };
  const ViewAllDeliveryBydriver = async (driverId) => {
    try {
      const res = await axios.get(
        `http://44.196.64.110:3211/api/deliveryRequest/completed/deliveries/${driverId}/count`
      );
      console.log(res.data.data?.completedDeliveries);
      setViewAllRideModal({
        isOpen: true,
        type:"Deliveries",
        rides:
          res.data.data.completedRides ||
          res.data.data?.completedDeliveries ||
          [], // Ensure it's an array
      });
    } catch (error) {
      console.log("Error getting data of user", error);
    }
  };

  const handleInputChange = (e) => {
    setSelecteddriver({ ...selecteddriver, [e.target.name]: e.target.value });
  };
  const fetchData = async () => {
    try {
      const res = await axios.get("http://44.196.64.110:3211/api/driver/");
      // console.log(res.data.data);
      setdrivers(res?.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box sx={{ fontSize: "24px" }}>Driver Management</Box>
        <TextField
          label="Search by Name"
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
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
              {filteredDrivers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                ?.map((driver) => (
                  <TableRow hover key={driver._id}>
                    <TableCell>
                      <img
                        src={
                          driver.driverImages[0].url || "/default-avatar.png"
                        }
                        alt="driver"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    </TableCell>

                    <TableCell>{driver.name}</TableCell>
                    <TableCell>{driver.email}</TableCell>
                    <TableCell>{driver.mobileNumber}</TableCell>
                    <TableCell>
                      <Switch
                        checked={
                          driver.driverStatus === "Active" ? true : false
                        }
                        onChange={() => handleDriverStatus(driver._id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={driver.isVerified || false}
                        color={
                          driver.isVerified === "true" ? "error" : "success"
                        }
                        onChange={() =>
                          handleDriverVerification(
                            driver._id,
                            driver.isVerified
                          )
                        }
                      />
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOpen(driver)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(driver)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(driver._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <br />
                      <IconButton
                        color="primary"
                        onClick={() => ViewAllRides(driver._id)}
                      >
                        <BikeIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => ViewAllDeliveryBydriver(driver._id)}
                      >
                        <BagIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={drivers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>

      {/* Edit driver Modal */}
      <Dialog open={editOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Driver</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={selecteddriver?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="E-mail"
            name="email"
            value={selecteddriver?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Contact No."
            name="mobileNumber"
            value={selecteddriver?.mobileNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={selecteddriver?.dateOfBirth?.split("T")[0] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Gender"
            name="gender"
            value={selecteddriver?.gender || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Address"
            name="address"
            value={selecteddriver?.address || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="City"
            name="city"
            value={selecteddriver?.city || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="State"
            name="state"
            value={selecteddriver?.state || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Zip Code"
            name="zipcode"
            value={selecteddriver?.zipcode || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Driving License Number"
            name="drivingLicenseNumber"
            value={selecteddriver?.drivingLicenseNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="License Issue Date"
            name="licenseIssueDate"
            type="date"
            value={selecteddriver?.licenseIssueDate?.split("T")[0] || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="License Expiry Date"
            name="licenseExpiryDate"
            type="date"
            value={selecteddriver?.licenseExpiryDate?.split("T")[0] || ""}
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
              checked={selecteddriver?.isVerified || false}
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
              checked={selecteddriver?.isAvailable || false}
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
              checked={selecteddriver?.isOnDuty || false}
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

      {/* View driver Modal */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: 2,
            }}
          >
            {/* Driver Images */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 2,
              }}
            >
              {/* Driver Image */}
              <Box
                sx={{ textAlign: "center", cursor: "pointer" }}
                onClick={() =>
                  handleOpen(
                    selecteddriver?.driverImages?.[0]?.url ||
                      "/default-avatar.png"
                  )
                }
              >
                <img
                  src={
                    selecteddriver?.driverImages?.[0]?.url ||
                    "/default-avatar.png"
                  }
                  alt="Driver"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Driver Photo
                </Typography>
              </Box>

              {/* Driver's License Image */}
              <Box
                sx={{ textAlign: "center", cursor: "pointer" }}
                onClick={() =>
                  handleOpen(
                    selecteddriver?.docDriverLicense?.[0]?.url ||
                      "/default-avatar.png"
                  )
                }
              >
                <img
                  src={
                    selecteddriver?.docDriverLicense?.[0]?.url ||
                    "/default-avatar.png"
                  }
                  alt="DL"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "10px",
                    objectFit: "cover",
                  }}
                />
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Driver's License
                </Typography>
              </Box>

              {/* Dialog to Show Enlarged Image */}
              <Dialog open={open} onClose={handleClose} maxWidth="md">
                <DialogContent sx={{ textAlign: "center" }}>
                  <img
                    src={selectedImage}
                    alt="Enlarged"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "90vh",
                      borderRadius: "10px",
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>

            {/* Driver Details Table */}
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Contact No.</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.mobileNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Address</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.address || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>City</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.city || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>State</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.state || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Zipcode</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.zipcode || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Date of Birth</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.dateOfBirth?.split("T")[0] || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Gender</strong>
                    </TableCell>
                    <TableCell>{selecteddriver?.gender || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Driving License No.</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.drivingLicenseNumber || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>License Issue Date</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.licenseIssueDate?.split("T")[0] || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>License Expiry Date</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.licenseExpiryDate?.split("T")[0] ||
                        "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Verified</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.isVerified ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Available</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.isAvailable ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>On Duty</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.isOnDuty ? "Yes" : "No"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Created At</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.createdAt?.split("T")[0] || "N/A"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Updated At</strong>
                    </TableCell>
                    <TableCell>
                      {selecteddriver?.updatedAt?.split("T")[0] || "N/A"}
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

      <RideModal
        open={viewAllRideModal.isOpen}
        type={viewAllRideModal.type}
        onClose={() => setViewAllRideModal({ isOpen: false, rides: [],type:"" })}
        rides={viewAllRideModal.rides}
      />
    </>
  );
}
