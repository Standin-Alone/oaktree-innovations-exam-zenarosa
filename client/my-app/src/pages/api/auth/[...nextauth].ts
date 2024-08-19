import NextAuth,{NextAuthOptions} from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Cookies from "js-cookie";
import axios from "axios";

export default NextAuth({
    providers:[
        CredentialsProvider({
            name:'credentials',
            async authorize(credentials:any) {
                const body = credentials;
                let response = await axios.post(`${process.env.api}/signin`, body);
                if(response.data.status == 'success'){
                    return({
                        name:body.username,
                        email:body.username,
                        token:response.data.access_token
                    });                                        
                }
            }

        })
    ],
    callbacks:{
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
     
            return session;
          },
    }

});