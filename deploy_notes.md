# Deployment Notes for Hanzi.io.vn

This project is built with **Next.js 15 (App Router)** and requires a Node.js environment to run.

## 1. Environment Variables (.env)
Before running the app on the VPS, create a `.env` file in the root directory and fill in the following values (refer to `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `BREVO_API_KEY`
- `SEPAY_BANK_ID` (Optional, defaults to mbbank)
- `SEPAY_ACCOUNT_NO` (Optional)
- `SEPAY_ACCOUNT_NAME` (Optional)
- `PORT` (Defaults to 3000)

## 2. Commands to Run on VPS

### Initial Setup
```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Running with PM2
```bash
# Start the server using PM2
pm2 start npm --name "hanzi-web" -- start -- -p 3000

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 3. Server Configuration
- **Listening Port**: 3000 (configurable via `PORT` env var).
- **Reverse Proxy**: Use Nginx to proxy traffic from port 80/443 to port 3000.
- **Database**: Connects to Supabase (External).
- **Authentication**: Managed by Clerk.
