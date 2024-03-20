import config from "../../config/config.js";
import nodemailer from 'nodemailer';
import { welcomeTemplate } from "../mailtemplates/welcome.js";

interface MailingDetails {
     name: string;
     email: string;
     subject: string;
     text: string;
     otp: string;
}
export async function sendMail({ name, email, subject, text, otp }: MailingDetails) {
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

     const mailOptions = {
          from: config.hostEmail,
          to: email,
          subject: subject,
          html: welcomeTemplate(name,otp)
     }
     //3. send email
     await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (err: any, info: any) => {
               if (err) {
                    console.log('Error in :', email, err);
                    reject(err);
               } else {
                    console.log('Email sent to:', email, info.response);
                    resolve(info);
               }
          });
     });
}