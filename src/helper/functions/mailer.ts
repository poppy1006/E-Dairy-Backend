import { forgot_password } from "../email-templates/forgot_password";
import { login_credentials } from "../email-templates/login_credentials";
import nodemail from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

const transporter = nodemail.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
});

const sendEmail = async (mailOptions: Options) => {
  try {
    const result = await transporter.sendMail(mailOptions);
    return { message: `Email has been sent to ${result.envelope.to[0]}` };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const emails = {
  feedback: async (
    student: { name: string; email: string; institution: string },
    feedback: string
  ) => {
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: process.env.MAILER_EMAIL_ID,
      subject: "Student Feedback",
      text: `Student Details: \n\n Name: ${student.name} \n Email: ${student.email} \n Institution: ${student.institution} \n\n Feedback: ${feedback}`,
    };

    const response = await sendEmail(mailOptions);
    return response;
  },

  // TODO: change to swathanthra in html template
  forgotPassword: async (recepient: string, otp: string, name: string) => {
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: recepient,
      subject: "Password reset request for Swathanthra",
      text: `Here is your OTP for reseting your password: ${otp}`,
      html: forgot_password.replace("<$name$>", name).replace("<$OTP$>", otp),
    };

    const response = await sendEmail(mailOptions);
    return response;
  },

  // TODO: change to swathanthra in html template
  loginCredentials: async (
    recepient: string,
    name: string,
    password: string
  ) => {
    const mailOptions = {
      from: process.env.MAILER_EMAIL_ID,
      to: recepient,
      html: login_credentials
        .replace("<$name$>", name)
        .replace("<$email$>", recepient)
        .replace("<$password$>", password),
      text: `Here is your account password: ${password}`,
      subject: "Account credential",
    };
    const response = await sendEmail(mailOptions);
    return response;
  },
};

export default emails;
