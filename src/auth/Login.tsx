import axios from 'axios';
import { authenticationResponse, userCredentials } from './auth.models';
import AuthForm from './AuthForm';
import {urlAccounts} from '../endpoints';
import { useContext, useState } from 'react';
import DisplayErrors from './forms/DisplayErrors';
import { getClaims, saveToken } from './handleJWT';
import AuthenticationContext from './AuthenticationContext';
import { useHistory } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mydms.com/">
          DMS
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export default function Login(){

    const [errors, setErrors] = useState<string[]>([]);
    const {update} = useContext(AuthenticationContext);
    const history = useHistory();

    async function login(credentials: userCredentials){
        try {
            setErrors([]);
            const response = await axios
            .post<authenticationResponse>(`${urlAccounts}/login`, credentials);
            saveToken(response.data);
            update(getClaims());
            if(getClaims()[1].value=='admin')
            { history.push('/document');}
            else
            history.push('/');
        }
        catch (error:unknown){
            var errors = error as any
            setErrors(errors.response.data);
        }
    }

    const theme = createTheme()
    return (
        <>
<ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(img/istockphoto.jpg)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box  sx={{ mt: 1 }}>
            <DisplayErrors errors={errors} />
            <AuthForm model={{email: '', password: ''}}
             onSubmit={async values => await login(values)}
            />
            <Grid container>
                <Grid item>
                  <Link href='/register' variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>

        </>
    )
}