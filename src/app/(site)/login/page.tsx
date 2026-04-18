import { LoginForm } from "./login-form";

export const metadata = {
  title: "Sign in | EasyRent",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg py-8">
      <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sign in to EasyRent</h1>
      <p className="mb-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
        Use a one-time email link or your Nigerian phone number.
      </p>
      <LoginForm />
    </div>
  );
}
