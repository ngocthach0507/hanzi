const fs = require('fs');
const path = require('path');

const filePath = 'd:/antigravity/bán hàng web học tiếng trung/components/AppNavbar.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Add imports
if (!content.includes("import { supabase }")) {
  content = content.replace("import { UserButton, SignInButton, useUser } from '@clerk/nextjs';", 
    "import { UserButton, SignInButton, useUser } from '@clerk/nextjs';\nimport { supabase } from '@/lib/supabase';\nimport { Crown } from 'lucide-react';");
}

// Add state and effect
if (!content.includes("const [isPro, setIsPro]")) {
  content = content.replace("const { user, isLoaded } = useUser();", 
    `const { user, isLoaded } = useUser();
  const [isPro, setIsPro] = useState(false);

  React.useEffect(() => {
    if (isLoaded && user) {
      const checkSub = async () => {
        const { data } = await supabase
          .from('subscriptions')
          .select('plan, status, expires_at')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data && data.plan !== 'free' && data.status === 'active' && 
            (data.expires_at ? new Date(data.expires_at) > new Date() : false)) {
          setIsPro(true);
        }
      };
      checkSub();
    }
  }, [user, isLoaded]);`);
}

// Update button
const oldBtn = `<Link href="/nang-cap" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg shadow-orange-100 hover:scale-105 transition-all animate-shimmer bg-[length:200%_100%]">
              <Zap className="w-4 h-4 fill-white" />
              NÂNG CẤP PREMIUM
            </Link>`;

const newBtn = `{isPro ? (
              <div className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg">
                <Crown size={14} className="text-yellow-400" />
                PREMIUM
              </div>
            ) : (
              <Link href="/nang-cap" className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-2 rounded-xl text-sm font-black shadow-lg shadow-orange-100 hover:scale-105 transition-all animate-shimmer bg-[length:200%_100%]">
                <Zap className="w-4 h-4 fill-white" />
                NÂNG CẤP PREMIUM
              </Link>
            )}`;

if (content.includes("NÂNG CẤP PREMIUM")) {
  // Use a more flexible replace for the button
  content = content.replace(/<Link href="\/nang-cap"[\s\S]+?<\/Link>/, newBtn);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log("Navbar fixed safely.");
