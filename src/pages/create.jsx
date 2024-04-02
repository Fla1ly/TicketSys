import { TextField, Typography } from '@mui/material'
import '@fontsource/roboto';
import '../assets/style.css'

function Create() {
    return (
        <Stack spacing={0} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h1">Create New Ticket</Typography>
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        </Stack>
    )
}

export default Create