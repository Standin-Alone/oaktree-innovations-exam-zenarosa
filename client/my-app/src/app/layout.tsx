'use client'
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./header";
import { Grid } from "@mui/material";
import Cookies from 'js-cookie'
import { useEffect } from "react";
import { useRouter } from "next/navigation"




export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const router = useRouter()

  // check auth
  useEffect(()=>{         
      let access_token = Cookies.get('token')

      if(!access_token){
          router.replace('/login')               
      }
  },[])

  return (    
      <div>
        <Header />
        <Grid       
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          marginTop={10}
        >        
        <Grid item xs={4}>
            {children}
          </Grid>
        </Grid>
      </div>
  
  );
}
