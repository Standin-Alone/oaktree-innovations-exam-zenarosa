"use client";
import RootLayout from "@/app/layout";
import { Button, CardHeader, Grid } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { DataGrid, GridRowsProp, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import {AddCircleOutline, EditOutlined, RemoveCircleOutline} from "@mui/icons-material";



export default function Home() {
  const router = useRouter();

  const loadData = async () => {
    try {
      let token = Cookies.get("token");
 
      let headers = {
        headers: {
          Authorization: `Bearer ${token}`      
        },
      };
      
      let response = await axios.get(`${process.env.api}/items`, headers);   
      if(response.data){          
          setRows(response.data);
      }
      
    } catch (error: any) {
      if (error.response.data?.msg == "Token has expired") {
        alert('Token expired.');
        Cookies.remove("token");
        router.replace("/login");
      }
    }
  };



  const handleRemoveItem = async (data:any)=>{
    
    try {
      let token = Cookies.get("token");
 
      let headers = {
        headers: {
          Authorization: `Bearer ${token}`      
        },
      };
      
      let response = await axios.delete(`${process.env.api}/items/${data.id}`, headers);


        if(response){          
          loadData();
          alert('Successfully removed the data.')       
        }    
    } catch (error: any) {
      if (error?.response?.data.msg == "Token has expired") {
        alert('Token expired.');
        Cookies.remove("token");
        router.replace("/login");
      }
    }    
  }

  const handleGoToItemDetails = (data:any)=>{
    router.push(`/item/${data.id}`);
  }
  
  const renderActionColumn = (params:any)=>{

    return(
      <Grid container spacing={2}>
        <Grid item>
            <Button variant="contained" startIcon={ <EditOutlined />} color="warning" onClick={()=>handleGoToItemDetails(params.row)} >
              Edit
            </Button>
        </Grid>
        <Grid item>
            <Button variant="contained" startIcon={ <RemoveCircleOutline />} color="error" onClick={()=>handleRemoveItem(params.row)}>
              Remove
            </Button>
        </Grid>
      </Grid>
    )
  }

  const columns :any = [
    { field:'id',headerName: " ", flex:1},
    { field:'name',headerName: "Name" ,flex:1},
    { field:'description', headerName: "Description",flex:1},
    { field:'price',headerName: "Price",renderCell: (params:any)=>(<div>${params.row.price}</div>)},
    { field:'created_at',headerName: "Date Created",flex:1},
    { field:'action',headerName: "Action", renderCell: renderActionColumn, flex:1},
  ];

  const [rows, setRows] = useState([]);


  const initialState = {
    columns: {
      columnVisibilityModel: {     
        id: false,        
      },
    },
  }


  useEffect(() => {
    loadData();
  }, []);


  const handleGoToItemCreation = ()=>{
      router.replace('/create-item')
  }
  
  return (
    <RootLayout>
      <Card sx={{ width: 1200 }}>
        <CardHeader title="Home" subheader="Items List Retrieved" 
          action={
            <Button variant="contained" startIcon={ <AddCircleOutline />} color="success" onClick={handleGoToItemCreation}>
                Add Item
            </Button>
          }
        />
        <CardContent>
          <DataGrid initialState={initialState} rows={rows} columns={columns} />
        </CardContent>
      </Card>
    </RootLayout>
  );
}
