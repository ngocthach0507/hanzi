const fs = require('fs');
const filePath = 'd:/antigravity/bán hàng web học tiếng trung/app/luyen-viet/page.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add React hooks import
content = content.replace("import { useUser } from '@clerk/nextjs';", 
  "import React, { useState, useEffect, useRef } from 'react';\nimport { useUser } from '@clerk/nextjs';\nimport Link from 'next/link';");

// 2. Add HanziWriter declaration safely
content = content.replace("import { supabase } from '@/lib/supabase';", 
  "import { supabase } from '@/lib/supabase';\n\n// @ts-ignore\nconst HanziWriter = typeof window !== 'undefined' ? (window as any).HanziWriter : null;");

// 3. Fix the usage in useEffect
content = content.replace("writerRef.current = HanziWriter.create(writerContainerRef.current, activeChar.char, {",
  "if (HanziWriter) {\n        writerRef.current = HanziWriter.create(writerContainerRef.current, activeChar.char, {");

// Close the if block
content = content.replace("onLoadCharDataError: () => setCharLoadError(true),\n      });",
  "onLoadCharDataError: () => setCharLoadError(true),\n      });\n      }");

fs.writeFileSync(filePath, content, 'utf8');
console.log("luyen-viet fixed properly.");
