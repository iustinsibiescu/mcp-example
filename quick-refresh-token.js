import { google } from 'googleapis';
import readline from 'readline';
import dotenv from "dotenv";

dotenv.config();


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('client: ',process.env.GOOGLE_CLIENT_ID);
console.log('secret: ',process.env.GOOGLE_CLIENT_SECRET);

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'urn:ietf:wg:oauth:2.0:oob' // no redirect URI; this gives a copy-paste code
);

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

async function main() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent', // always return refresh_token
    scope: SCOPES,
  });

  console.log('\n👉 Open this URL in your browser:\n\n' + authUrl);
  rl.question('\n🔑 Paste the code here: ', async (code) => {
    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n✅ Access Token:', tokens.access_token);
      console.log('🔁 Refresh Token:', tokens.refresh_token);
      console.log('\n💾 Save this refresh token securely — your server can use it forever.');
    } catch (err) {
      console.error('❌ Error retrieving tokens:', err);
    } finally {
      rl.close();
    }
  });
}

main();
