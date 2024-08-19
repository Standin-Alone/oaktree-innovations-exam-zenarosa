import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Cookies from "js-cookie";


const SignInSchema = Yup.object().shape({
  username: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
});

export default function SignIn() {
  const router = useRouter();

  // check auth
  useEffect(() => {
    let access_token = Cookies.get("token");

    if (access_token) {
      router.replace("/home");
    }
  }, []);

  const signIn = async (value: any) => {
    let body = value;
    let response = await axios.post(`${process.env.api}/signin`, body);

    if (response.data.status == "success") {
      document.cookie = `token=${response.data.access_token}`;
      router.replace("/home");
    } else {
      alert(response.data.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Welcome to My-App
        </Typography>
        <Formik
          validationSchema={SignInSchema}
          initialValues={{ username: "", password: "" }}
          onSubmit={signIn}
        >
          {({ setFieldValue, errors, touched, handleSubmit }: any) => (
            <Box sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={(e) => setFieldValue("username", e.target.value)}
                error={errors.username && touched.username ? true : false}
                helperText={
                  errors.username && touched.username ? errors.username : ""
                }
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setFieldValue("password", e.target.value)}
                error={errors.password && touched.password ? true : false}
                helperText={
                  errors.password && touched.password ? errors.password : ""
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Sign In
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
