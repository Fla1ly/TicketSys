import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Stack, Modal, Typography, Box, TextField, Backdrop, Chip } from '@mui/material';
import * as React from 'react'
import NavbarContent from './components/navbar';
import Login from './pages/login.jsx'
// import AdminPanel from './pages/admin-panel.jsx'

/* icons */
import DoneIcon from '@mui/icons-material/Done';
import Create from './pages/create.jsx'

/* pages */
import Tickets from './pages/tickets.jsx'
import FindTicket from './pages/find-ticket.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/find-ticket" element={<FindTicket />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/admin-panel" element={<AdminPanel />} /> */}
      </Routes>
    </Router>
  );
}

/* styling presets */

const style = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
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
  height: 250,
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

const styleNE = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

/* main index function */

function Home() {
  const [ticketID, setTicketID] = useState([]);
  const [open, setOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
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
      subject: subject,
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

      const responseData = await response.json();
      const ticketID = responseData.ticketID;
      setTicketID(ticketID);

      handleAlertOpen();

      setOpen(false);

      fetchTickets();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated) {
      console.log('Logged in as admin')
    } else if (!isAuthenticated) {
      console.log('logged in as normal user')
    }
  }, []);

  return (
    <NavbarContent>
      <Stack spacing={0} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant='contained' onClick={handleOpen}>Create Ticket</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Create a ticket</Typography>
            <Stack sx={styleNE}>
              <TextField sx={{ marginBottom: 2 }} id="outlined-basic" label="Name" variant="outlined" required onChange={e => setName(e.target.value)} />
              <TextField sx={{ marginBottom: 2 }} id="outlined-basic" label="Email" variant="outlined" required onChange={e => setEmail(e.target.value)} />
            </Stack>
            <TextField sx={{ marginBottom: 2 }} id="outlined-basic" label="Subject" variant="outlined" required onChange={e => setSubject(e.target.value)} />
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
            <Typography variant='h6'> This is your case id. Make sure to save it!</Typography>
            <Chip label={ticketID} color="primary" variant="outlined" sx={{ marginBottom: 4 }} />
            <Button variant='contained' onClick={handleAlertClose}>Close</Button>
          </Box>
        </Backdrop>
      </Stack>
    </NavbarContent>
  );
}

export default App
