import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom'
import * as React from 'react'
import { Button, Stack, Modal, Typography, Box, TextField } from '@mui/material'
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

const styleMS = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: 10,
}


function Home() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ticketData = {
      name: name,
      email: email,
      description: description
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
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Stack spacing={0} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Typography variant="h1">Ticket System</Typography>
      <Button variant='contained' onClick={handleOpen}>Create Ticket</Button>
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
    </Stack>
  )
}

export default App
