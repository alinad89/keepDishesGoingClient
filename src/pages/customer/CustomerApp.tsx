// CustomerApp.tsx
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';

export default function CustomerApp() {
    return (
        <Container sx={{ py: 3 }}>
            <Outlet />
        </Container>
    );
}
