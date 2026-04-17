import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <SignIn 
        routing="path"
        path="/dang-nhap"
        appearance={{
          elements: {
            formButtonPrimary: 'bg-[#D85A30] hover:bg-orange-700 text-sm font-bold',
            card: 'shadow-2xl border-none rounded-3xl overflow-hidden'
          }
        }}
      />
    </div>
  );
}
