import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const googleConfig = {
  clientId: process.env.CLIENT_ID || '',
  clientSecret: process.env.CLIENT_SECRET || '',
};

const oAuth2Client = new google.auth.OAuth2(
  googleConfig.clientId,
  googleConfig.clientSecret,
//   googleConfig.redirectUri,
  "postmessage"
);

export default oAuth2Client;