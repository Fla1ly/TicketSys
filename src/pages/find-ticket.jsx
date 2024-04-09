import React, { useState } from 'react';
import { Typography, Stack, TextField, Button, Box, Chip, Container } from '@mui/material';
import NavbarContent from '../components/navbar';


/* styling presets */

const boxStyling = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: 500,
    height: 400,
    border: '1px solid #D3D3D3',
    borderRadius: '5px',
    bgcolor: 'background.paper',
    marginTop: 2,
};

const containerStyling = {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    p: 1,
    justifyContent: 'space-evenly',
    height: '100%',
};


function FindTicket() {
    const [ticketDetails, setTicketDetails] = useState(null);
    const [ticketNotFound, setTicketNotFound] = useState(false);

    const handleFindTicket = async () => {
        const ticketId = document.getElementById('ticketId').value;
        const response = await fetch(`http://localhost:5000/apiLayout/ticket/${ticketId}`);
        if (response.ok) {
            const data = await response.json();
            setTicketDetails(data);
            setTicketNotFound(false);
            console.log(data)
        } else {
            setTicketDetails(null);
            setTicketNotFound(true);
        }
    };

    return (
        <NavbarContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Find Ticket</Typography>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                    <TextField
                        id="ticketId"
                        label="Ticket ID"
                        variant="outlined"
                        size="small"
                        sx={{ width: 200 }}
                    />
                    <Button variant="contained" size="medium" sx={{ height: 40 }} onClick={handleFindTicket}>Find</Button>
                </Stack>
            </Stack>
            {ticketDetails && !ticketNotFound && (
                <Box sx={boxStyling}>
                    <Container sx={containerStyling}>
                        <Stack direction="row" spacing={2} sx={{display: 'flex', width: '100%', justifyContent: 'space-between'}}>
                            <Typography variant="h5">Ticket Details</Typography>
                            <Chip label={ticketDetails.ticketStatus} color="primary" variant="outlined" />
                        </Stack>
                        <Stack direction="row" spacing={2} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <TextField
                                id="outlined-read-only-input"
                                label="Name"
                                defaultValue={ticketDetails.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                            <TextField
                                id="outlined-read-only-input"
                                label="Email"
                                defaultValue={ticketDetails.email}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Stack>
                        <TextField
                            id="outlined-read-only-input"
                            label="Subject"
                            defaultValue={ticketDetails.subject}
                            InputProps={{
                                readOnly: true,
                            }}
                            sx={{ width: '100%' }} />
                        <TextField
                            id="outlined-read-only-input"
                            label="Description"
                            defaultValue={ticketDetails.description}
                            InputProps={{
                                readOnly: true,
                            }}
                            multiline
                            rows={5}
                        />
                        
                        <Typography variant="body1">Date Created: {ticketDetails.dateCreated}</Typography>
                    </Container>
                </Box>
            )}
            {ticketNotFound && (
                <Typography variant="body1">Ticket Not Found</Typography>
            )}
        </NavbarContent>
    );
}

export default FindTicket;
