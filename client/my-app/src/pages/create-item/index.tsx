"use client";
import RootLayout from "@/app/layout";
import { Button, CardHeader, Grid, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ArrowCircleLeft } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";

const ItemSchema = Yup.object().shape({
  name: Yup.string().required("Please input this required field"),
  description: Yup.string().required("Please input this required field"),
  price: Yup.number()
    .typeError("Price must be a number")
    .integer("Please enter a valid number.")
    .required("Please input this required field"),
});

export default function ItemCreation() {
  const router = useRouter();

  const handleGoBackToHome = () => {
    router.replace("/home");
  };

  const handleAddItem = async (value: any) => {
    try {
      let body = {
        ...value,
        price: parseFloat(value.price),
      };
      let token = Cookies.get("token");
      let headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios.post(
        `${process.env.api}/items`,
        body,
        headers
      );

      if (response.data) {
        alert(response.data);
      }
    } catch (error: any) {
      if (error?.response?.data?.msg == "Token has expired") {
        alert("Token expired.");
        Cookies.remove("token");
        router.replace("/login");
      }
    }
  };

  return (
    <RootLayout>
      <Card sx={{ width: 1200 }}>
        <CardHeader
          title="Create item"
          subheader="This page is for creating items."
          action={
            <Button
              variant="contained"
              startIcon={<ArrowCircleLeft />}
              color="info"
              onClick={handleGoBackToHome}
            >
              Go Back to Home
            </Button>
          }
        />
        <CardContent>
          <Formik
            initialValues={{
              name: "",
              description: "",
              price: "",
            }}
            validationSchema={ItemSchema}
            onSubmit={handleAddItem}
          >
            {({ handleSubmit, touched, errors, setFieldValue }: any) => (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setFieldValue("name", e.target.value)}
                    error={errors.name && touched.name ? true : false}
                    helperText={errors.name && touched.name ? errors.name : ""}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    fullWidth
                    onChange={(e) =>
                      setFieldValue("description", e.target.value)
                    }
                    error={
                      errors.description && touched.description ? true : false
                    }
                    helperText={
                      errors.description && touched.description
                        ? errors.description
                        : ""
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-basic"
                    label="Price"
                    variant="outlined"
                    fullWidth
                    onChange={(e) => setFieldValue("price", e.target.value)}
                    error={errors.price && touched.price ? true : false}
                    helperText={
                      errors.price && touched.price ? errors.price : ""
                    }
                  />
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Button
                    variant="contained"
                    startIcon={<ArrowCircleLeft />}
                    color="success"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Save Item
                  </Button>
                </Grid>
              </Grid>
            )}
          </Formik>
        </CardContent>
      </Card>
    </RootLayout>
  );
}
