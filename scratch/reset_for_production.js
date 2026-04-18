const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function resetSubscriptions() {
  console.log('Resetting subscriptions for production switch...');
  
  // Lấy danh sách trước khi xóa để log lại (phòng hờ)
  const { data: before } = await supabase.from('subscriptions').select('*');
  console.log('Current subscriptions count:', before ? before.length : 0);

  const { error } = await supabase
    .from('subscriptions')
    .delete()
    .neq('user_id', 'FORCE_DELETE_ALL'); // Một cách để xóa tất cả các dòng
  
  if (error) {
    console.error('Error deleting subscriptions:', error);
    return;
  }
  
  console.log('SUCCESS: All test subscriptions have been cleared.');
}

resetSubscriptions();
