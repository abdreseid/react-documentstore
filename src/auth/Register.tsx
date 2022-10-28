import axios from "axios";
import { authenticationResponse, userCredentials } from "./auth.models";
import {urlAccounts} from '../endpoints';
import { useContext, useState } from "react";
import DisplayErrors from './forms/DisplayErrors'
import AuthForm from "./AuthForm";
import { getClaims, saveToken } from "./handleJWT";
import AuthenticationContext from "./AuthenticationContext";
import { useHistory } from "react-router-dom";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        mydms.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function Register(){

    const [errors, setErrors] = useState<string[]>([]);
    const {update} = useContext(AuthenticationContext);
    const history = useHistory();

    async function register(credentials: userCredentials){
        try{
            setErrors([]);
            const response = await axios
                .post<authenticationResponse>(`${urlAccounts}/create`, credentials);
            saveToken(response.data);
            update(getClaims());
            history.push('/home');
        }
        catch(error:unknown){
            var errors = error as any
            setErrors(errors.response.data);
        }
    }

    return (
        <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box  sx={{ mt: 3 }}>
            <DisplayErrors errors={errors} />
            <AuthForm
            model={{email: '', password: ''}}
            onSubmit={async values => await register(values)}
            />
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
        
    )
}