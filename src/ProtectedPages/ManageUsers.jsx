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
} from "@mui/material";
import {RideModal} from "../Modal/RideModal"
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  TwoWheeler as BikeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

const columns = [
  { id: "imageUrl", label: "Profile Picture", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 170 },
  { id: "E_mail", label: "E-mail", minWidth: 170, align: "left" },
  { id: "ContactNo", label: "Contact No.", minWidth: 170, align: "left" },
  { id: "User_Status", label: "User Status", minWidth: 170, align: "left" },
  { id: "actions", label: "Actions", minWidth: 200, align: "center" },
];

export default function ManageUsers() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); 
  const [viewOpen, setViewOpen] = useState(false);
  const [viewAllRideModal, setViewAllRideModal] = useState({
    isOpen: false,
    rides: [],
});

const filteredUsers = users.filter((user) =>
  user.name.toLowerCase().includes(searchQuery.toLowerCase())
);
const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};


  const handleEditOpen = (user) => {
    setSelectedUser(user);
    setEditOpen(true);
  };

  const handleViewOpen = (user) => {
    setSelectedUser(user);
    setViewOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setViewOpen(false);
    setSelectedUser(null);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://44.196.64.110:3211/api/user/${selectedUser._id}`,
        selectedUser
      );
      fetchData();
      handleClose();
    } catch (error) {
      console.log("Error updating user", error);
    }
  };
  const ViewAllRides = async (userId) => {
    try {
      const res = await axios.get(
        `http://44.196.64.110:3211/api/rideRequest/completed/user/count/${userId}` );
        console.log(res.data.data.completedRides)
        setViewAllRideModal({
          isOpen: true,
          rides: res.data.data.completedRides || [], // Ensure it's an array
      });
    } catch (error) {
      console.log("Error getting data of user", error);
    }
  };

  const handleDelete = async (id) => {

    try {
      await axios.delete(`http://44.196.64.110:3211/api/user/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (error) {
      console.log("Error deleting user", error);
    }
  };

  const handleInputChange = (e) => {
    setSelectedUser({ ...selectedUser, [e.target.name]: e.target.value });
  };
  const handleUserStatus =async (userId) => {
    try {
      await axios.put(`http://44.196.64.110:3211/api/user/updateStatus/${userId}`);
      fetchData();
    } catch (error) {
      console.log("Error updating user status", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://44.196.64.110:3211/api/user");
      setUsers(res?.data.data);
      console.log(res?.data.data);
    } catch (error) {
      console.log(error);
    }
  };

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
            <Box sx={{ fontSize: "24px" }}>user Management</Box>
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
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow hover key={user._id}>
                    <TableCell>
                      <img
                        src={user.images[0]?.url || "/default-avatar.png"}
                        alt="User"
                        style={{ width: 50, height: 50, borderRadius: "50%" }}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.userStatus==="Active"?true:false}
                        onChange={() => handleUserStatus(user._id)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewOpen(user)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleEditOpen(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => ViewAllRides(user._id)}
                      >
                        <BikeIcon />
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
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => setRowsPerPage(+event.target.value)}
        />
      </Paper>

      {/* Edit User Modal */}
      <Dialog open={editOpen} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={selectedUser?.name || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="E-mail"
            name="email"
            value={selectedUser?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Contact No."
            name="mobileNumber"
            value={selectedUser?.mobileNumber || ""}
            onChange={handleInputChange}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View User Modal */}
      <Dialog open={viewOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
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
            <img
              src={selectedUser?.images[0]?.url || "/default-avatar.png"}
              alt="User"
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>{selectedUser?.name || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>
                    <TableCell>{selectedUser?.email || "N/A"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <strong>Contact No.</strong>
                    </TableCell>
                    <TableCell>{selectedUser?.mobileNumber || "N/A"}</TableCell>
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
        onClose={() => setViewAllRideModal({ isOpen: false, rides: [] })} 
        rides={viewAllRideModal.rides} 
      />

    </>
  );
}
