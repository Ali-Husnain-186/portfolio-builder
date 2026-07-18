import { AuthForm } from "@/components/auth-form";
import { SiteHeader } from "@/components/site-header";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <div className="landing-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <SiteHeader />
        <main className="flex justify-center py-16">
          <AuthForm mode="signup" />
        </main>
      </div>
    </div>
  );
}
