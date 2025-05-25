import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';

function App() {
  const {
    loginWithRedirect,
    logout,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiData, setApiData] = useState(null); // To hold email and image

  const callAPI = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios.get('http://localhost:8000/api/protected/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // const data = res.json
      setApiData(res.data); // Set response data to state
      console.log(res.data)
    } catch (error) {
      alert('Error calling API');
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" height="100vh" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Login
        </Typography>

        {!isAuthenticated ? (
          <>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, textTransform: 'none' }}
            >
              Login
            </Button>
            <br /><br />
            <Button
              variant="outlined"
              startIcon={<FcGoogle size={24} />}
              onClick={() =>
                loginWithRedirect({
                  connection: 'google-oauth2',
                })
              }
              fullWidth
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 1.5,
              }}
            >
              Continue with Google
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              Welcome, {user.name}
            </Typography>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={callAPI}
            >
              Get the details
            </Button>

            {apiData && (
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant="subtitle1">Email: {apiData.email}</Typography>
                <img
                  src={apiData.image}
                  alt="Profile"
                  style={{ width: 100,height:100, borderRadius: '50%', marginTop: '1rem' }}
                />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
}

export default App;
