"use client";
import RootLayout from "@/app/layout";
import { Button, CardHeader, Grid, TextField } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ArrowCircleLeft, RemoveCircleOutline } from "@mui/icons-material";
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

export default function EditItem() {
  const router = useRouter();
  const { id } = router.query
  const [itemForm, setItemForm] = useState({    
    name: "",
    description: "",
    price: 0,
  });



  const handleRemoveItem = async ()=>{    
    try {
      let token = Cookies.get("token");
 
      let headers = {
        headers: {
          Authorization: `Bearer ${token}`      
        },
      };
      
      let response = await axios.delete(`${process.env.api}/items/${id}`, headers);


        if(response){                    
          alert('Successfully removed the data.')       
          router.replace("/home");
        }    
    } catch (error: any) {
      if (error?.response?.data.msg == "Token has expired") {
        alert('Token expired.');
        Cookies.remove("token");
        router.replace("/login");
      }
    }    
  }



  const getItemDetails = async () => {
    try {
      let token = Cookies.get("token");
        
      let headers = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      let response = await axios.get(`${process.env.api}/items/${id}`, headers);

      if(response.data){        
        setItemForm(response.data[0])
      }

    } catch (error: any) {
      if (error?.response?.data?.msg == "Token has expired") {
        alert("Token expired.");
        Cookies.remove("token");
        router.replace("/login");
      }
    }
  };    


  useEffect(()=>{
    getItemDetails()
  },[]);


  const handleGoBackToHome = () => {
    router.replace("/home");
  };

  const handleUpdateItem = async (value: any) => {
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

      let response = await axios.put(
        `${process.env.api}/items/${id}`,
        body,
        headers
      );

      if(response.data){
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
          title="Item Details"
          subheader="This page is for viewing of item details."
          action={
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<RemoveCircleOutline />}
                  color="error"
                  onClick={handleRemoveItem}
                >
                  Remove Item
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<ArrowCircleLeft />}
                  color="info"
                  onClick={handleGoBackToHome}
                >
                  Go Back to Home
                </Button>
              </Grid>
            </Grid>
          }
        />
        <CardContent>
          <Formik
            initialValues={itemForm}
            validationSchema={ItemSchema}
            onSubmit={handleUpdateItem}
            enableReinitialize={true}
          >
            {({ handleSubmit, touched, errors, setFieldValue, values}: any) => (
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
                    value={values.name}
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
                    value={values.description}
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
                    value={values.price}
                  />
                </Grid>
                <Grid item style={{ width: "100%" }}>
                  <Button
                    variant="contained"
                    startIcon={<ArrowCircleLeft />}
                    color="warning"
                    fullWidth
                    onClick={handleSubmit}
                  >
                    Update Item
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
