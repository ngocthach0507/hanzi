import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const clerkSecretKey = process.env.CLERK_SECRET_KEY;
const email = 'tuandangaace@gmail.com';

async function findClerkUser() {
  console.log(`--- SEARCHING CLERK FOR ${email} ---`);
  try {
    const response = await fetch(`https://api.clerk.com/v1/users?email_address=${email}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${clerkSecretKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const user = data[0];
      console.log('CLERK USER FOUND:');
      console.log(`ID: ${user.id}`);
      console.log(`Name: ${user.first_name} ${user.last_name}`);
      console.log(`Created At: ${new Date(user.created_at).toLocaleString()}`);
    } else {
      console.log('No user found in Clerk with that email.');
      console.log('Full Response:', JSON.stringify(data));
    }
  } catch (err) {
    console.error('Clerk API Error:', err.message);
  }
}

findClerkUser();
