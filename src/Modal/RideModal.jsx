import { Modal, Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Button } from "@mui/material";

 const RideModal = ({ open, onClose, rides ,type="Rides"}) => (
    <Modal open={open} onClose={onClose}>
        <Box sx={{ width: "80%", margin: "5% auto", padding: 3, bgcolor: "white", borderRadius: 2 }}>
            <Typography variant="h6">Showing All the {type} </Typography>

            {rides.length > 0 ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{textAlign:"center"}}>S. No.</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Fare </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rides.map((ride,index) => (
                            <TableRow key={ride._id}>
                                <TableCell sx={{textAlign:"center"}}>{index+1}</TableCell>
                                <TableCell>{ride.status}</TableCell>
                                <TableCell>{ride.paymentStatus}</TableCell>
                                <TableCell>{new Date(ride.createdAt).toLocaleString()}</TableCell>
                                <TableCell>{ride.finalFare} $</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <Typography variant="body1" sx={{ mt: 2, textAlign: "center" }}>
                    No {type} found for this user.
                </Typography>
            )}

            <Button onClick={onClose} sx={{ mt: 2 }} variant="contained">Close</Button>
        </Box>
    </Modal>
);


export {RideModal}