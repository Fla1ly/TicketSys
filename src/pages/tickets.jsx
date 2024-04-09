import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Chip, Typography, Stack } from '@mui/material';
import NavbarContent from '../components/navbar';

function Tickets() {
    const [tickets, setTickets] = useState([]);

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
        }
    ];

    const getRowId = (row) => row.ticketID;
    return (
        <NavbarContent>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Tickets</Typography>
            <div style={{ height: 600, width: '90%' }}>
                <DataGrid
                    rows={tickets}
                    columns={columns}
                    pageSize={5}
                    disableSelectionOnClick
                    getRowId={getRowId}
                />
            </div>
        </NavbarContent>

    );
}

export default Tickets;


