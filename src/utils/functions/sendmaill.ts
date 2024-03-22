import config from "../../config/config.js";
import nodemailer from 'nodemailer';
import { welcomeTemplate } from "../mailtemplates/welcome.js";
import resendOtp from "../mailtemplates/resendotp.js";
import emailVerification from "../mailtemplates/emailverification.js";

type EmailType = 'welcome' | 'reset' | 'verify' ;
interface MailProps{
     name:string;
     email:string;
     subject:string;
     type:EmailType;
     otp?:string;
}

export async function sendMail({ name, email, subject, type, otp }:MailProps) {
     try {
          const transporter = nodemailer.createTransport({
               service: 'gmail',
               host: 'smtp.gmail.com',
               port: 587,
               secure: false,
               auth: {
                    user: config.hostEmail,
                    pass: config.hostPassword
               }
          })
          function createMailTemplate(){
               switch(type){
                    case 'welcome':
                         return welcomeTemplate({name,otp});
                    case 'reset':
                         return resendOtp({name,otp});
                    case 'verify':
                         return emailVerification({name});
                    default:
                         throw new Error("Invalid mailing template used");
               }
          }
          const mailOptions = {
               from: config.hostEmail,
               to: email,
               subject: subject,
               html: createMailTemplate()
          }
          //3. send email
          await new Promise((resolve, reject) => {
               transporter.sendMail(mailOptions, (err: any, info: any) => {
                    if (err) {
                         console.log('Error in emailing :', email, err);
                         reject(err);
                    } else {
                         console.log('Email sent to:', email, info.response);
                         resolve(info);
                    }
               });
          });
     } catch (error) {
          console.log("Error in Nodemailer Mail Handler: " + error)
     }
}