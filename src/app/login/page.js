
import LoginForm from "./LoginForm";



export const metadata = {
  title: "Login - Retail Store",
  description: "Login to access the Retail Store management system",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <LoginForm />
    </div>
  );
}