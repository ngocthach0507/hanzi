import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const email = 'tuandangaace@gmail.com';

async function findClerkUser() {
  console.log(`--- SEARCHING CLERK FOR ${email} ---`);
  try {
    const response = await axios.get(`https://api.clerk.com/v1/users?email_address=${email}`, {
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.length > 0) {
      const user = response.data[0];
      console.log('CLERK USER FOUND:');
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.first_name} ${user.last_name}`);
      console.log(`Created At: ${new Date(user.created_at).toLocaleString()}`);
    } else {
      console.log('No user found in Clerk with that email.');
    }
  } catch (err) {
    console.error('Clerk API Error:', err.response?.data || err.message);
  }
}

findClerkUser();
