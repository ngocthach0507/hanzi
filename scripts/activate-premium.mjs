import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const email = 'hvananh1907@gmail.com';

async function main() {
  console.log(`Checking user: ${email}`);

  // 1. Find user in Clerk
  const clerkResponse = await fetch(`https://api.clerk.com/v1/users?email_address=${email}`, {
    headers: {
      'Authorization': `Bearer ${CLERK_SECRET_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  const clerkUsers = await clerkResponse.json();
  
  if (!clerkUsers || clerkUsers.length === 0) {
    console.error('User not found in Clerk');
    return;
  }

  const user = clerkUsers[0];
  const userId = user.id;
  console.log(`Found Clerk User: ${userId} (${user.first_name} ${user.last_name})`);

  // 2. Update/Insert in Supabase
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const { data: existingSub, error: fetchError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching subscription:', fetchError);
    return;
  }

  const daysToAdd = 30;
  const now = new Date();
  let newExpiry;

  if (existingSub && existingSub.expires_at && new Date(existingSub.expires_at) > now) {
    newExpiry = new Date(new Date(existingSub.expires_at).getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    console.log(`Extending existing subscription from ${existingSub.expires_at}`);
  } else {
    newExpiry = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    console.log(`Creating new 1-month subscription`);
  }

  const subData = {
    user_id: userId,
    plan: 'premium_1_month',
    status: 'active',
    expires_at: newExpiry.toISOString(),
    payment_ref: 'MANUAL_ACTIVATION_' + Date.now()
  };

  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(subData, { onConflict: 'user_id' })
    .select();

  if (error) {
    console.error('Error updating subscription:', error);
  } else {
    console.log('Successfully activated premium for 1 month!');
    console.log('New expiry:', newExpiry.toISOString());
    console.log('Subscription data:', data);
  }
}

main().catch(console.error);
