import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Typography, Stack, Modal, TextField, Button, Box, Container } from '@mui/material';
import NavbarContent from '../components/navbar';
import { Navigate } from 'react-router-dom';




/* styling presets */

const containerStyling = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    p: 1,
    justifyContent: 'space-evenly',
    height: '100%',
};

function AdminPanel() {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [reply, setReply] = useState('');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const fetchTickets = async () => {
        try {
            const response = await fetch('http://localhost:5000/apiLayout/tickets');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTickets(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleEditClick = (ticket) => {
        setSelectedTicket(ticket);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const body = {
        Name: selectedTicket.name,
        Email: selectedTicket.email,
        Subject: selectedTicket.subject,
        Description: selectedTicket.description,
        TicketID: selectedTicket.ticketID,
        TicketStatus: selectedTicket.ticketStatus,
        NewStatus: newStatus,
        Reply: reply
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/apiLayout/updateTicketAndAddReply/${selectedTicket.ticketID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                console.error('Response Error:', response);
                throw new Error('Network response was not ok');
            }
            console.log('Ticket status updated and reply added successfully');
            fetchTickets();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating ticket status and adding reply:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:5000/apiLayout/deleteTicket/${selectedTicket.ticketID}`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Ticket deleted successfully');
            fetchTickets();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error deleting ticket:', error);
        }
    };

    const columns = [
        { field: 'subject', headerName: 'Subject', width: 150 },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'dateCreated', headerName: 'Date Created', width: 100 },
        {
            field: 'ticketStatus',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => (
                <Chip label={params.value} color={params.value === 'Open' ? 'primary' : 'default'} variant="outlined" />
            )
        },
        {
            field: 'editTicket',
            headerName: 'Edit',
            width: 150,
            renderCell: (params) => (
                <Chip label="Edit" color="default" variant="outlined" onClick={() => handleEditClick(params.row)} />
            )
        }
    ];

    return (
        <NavbarContent>
            {isAuthenticated !== 'true' && <Navigate to="/login" />}
            <h1>Admin Panel</h1>
            <div style={{ height: 600, width: '90%' }}>
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                    getRowId={(row) => row.ticketID || row.id}
                />
            </div>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        height: 800,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 4,
                    }}
                >
                    <Container sx={containerStyling}>
                        <Stack direction="row" spacing={2} sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                            <Typography variant="h5">Ticket Details</Typography>
                            <Chip label={selectedTicket?.ticketStatus} color="primary" variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Name"
                                defaultValue={selectedTicket?.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                id="outlined-read-only-input"
                                label="Email"
                                defaultValue={selectedTicket?.email}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Stack>
                        <TextField
                            id="outlined-read-only-input"
                            label="Subject"
                            defaultValue={selectedTicket?.subject}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: '100%' }} />
                        <TextField
                            id="outlined-read-only-input"
                            label="Description"
                            defaultValue={selectedTicket?.description}
                            InputProps={{
                                readOnly: true,
                            }}
                            multiline
                            rows={5}
                        />

                        <Typography variant="body1">Date Created: {selectedTicket?.dateCreated}</Typography>
                        <TextField
                            id="newStatus"
                            label="New Status"
                            variant="outlined"
                            onChange={(e) => setNewStatus(e.target.value)}
                        />
                        <TextField
                            id="reply"
                            label="Write a Reply"
                            multiline
                            rows={4}
                            variant="outlined"
                            onChange={(e) => setReply(e.target.value)}
                        />
                        <Stack direction="row" spacing={2}>
                            <Button variant="contained" color="primary" onClick={handleSave}>Save Ticket</Button>
                            <Button variant="contained" color="primary" onClick={handleDelete}>Delete Ticket</Button>
                        </Stack>
                    </Container>
                </Box>
            </Modal>
        </NavbarContent>
    );
}

export default AdminPanel;
