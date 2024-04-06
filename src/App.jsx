import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Stack, Modal, Typography, Box, TextField, Backdrop } from '@mui/material';
import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid';
import DoneIcon from '@mui/icons-material/Done';
import Create from './pages/create.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </Router>
  );
}

/* styling presets */

const style = {
  display: 'flex',
  flexDirection: 'column',
  width: 500,
  height: 400,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const styleAlert = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 500,
  height: 200,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const styleMS = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: 10,
}

/* main index function */

function Home() {
  const [tickets, setTickets] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleAlertOpen = () => setAlert(true);
  const handleAlertClose = () => setAlert(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      name: name,
      email: email,
      description: description,
    };

    try {
      const response = await fetch('http://localhost:5000/apiLayout/sendTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(ticketData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Show success message
      handleAlertOpen();

      // Close the modal
      setOpen(false);

      // Fetch updated ticket list
      fetchTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  }

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

  const columns = [
    { field: 'ticketID', headerName: 'Ticket ID', width: 200 },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'dateCreated', headerName: 'Date', width: 200 },
  ];

  const getRowId = (row) => row.ticketID;

  return (
    <Stack spacing={0} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h1">Ticket System</Typography>
      <Button variant='contained' onClick={handleOpen}>Create Ticket</Button>
      <h1>Ticket List</h1>
      <div style={{ height: 600, width: '90%' }}>
        <DataGrid
          rows={tickets}
          columns={columns}
          pageSize={5}
          disableSelectionOnClick
          getRowId={getRowId} // Add this line
        />
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}>Create a ticket</Typography>
          <TextField sx={{ marginBottom: 2 }} id="outlined-basic" label="Name" variant="outlined" required onChange={e => setName(e.target.value)} />
          <TextField sx={{ marginBottom: 2 }} id="outlined-basic" label="Email" variant="outlined" required onChange={e => setEmail(e.target.value)} />
          <Stack sx={styleMS}>
            <TextField sx={{ marginBottom: 2 }} id="outlined-multiline-flexible" label="Description" multiline maxRows={5} required onChange={e => setDescription(e.target.value)} />
            <Button variant='contained' onClick={handleSubmit}>Send</Button>
          </Stack>
        </Box>
      </Modal>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={alert}
      >
        <Box sx={styleAlert}>
          <Typography variant="h4" sx={{ marginBottom: 2 }}> Ticket Created! <DoneIcon /></Typography>
          <Button variant='contained' onClick={handleAlertClose}>Close</Button>
        </Box>
      </Backdrop>
    </Stack>
  );
}

export default App
