import { resend } from "./config.js";

export const sendVerificationEmail=async(email, verificationToken)=>{
    try{
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: [email],
            subject: 'Hello World',
            html: `verify your email address with this token:${verificationToken}`,
          });
    }catch(err){
        console.log("error sending verfication email", err);
        throw new Error("Error sending verification Email");

    }
}
