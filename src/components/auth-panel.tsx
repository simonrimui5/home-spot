"use client";

import Image from "next/image";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { LogOut, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

export function AuthPanel() {
  const { session, loading, signOut } = useAuth();

  if (loading) {
    return <div className="h-80 animate-pulse rounded-[1.8rem] bg-[#edf3f0]" />;
  }

  if (session) {
    return (
      <div className="overflow-hidden rounded-[1.8rem] border border-[#dce7e3] bg-white">
        <div className="relative h-36">
          <Image src="/assets/map-pattern.png" alt="" fill className="object-cover" />
          <div className="absolute inset-0 bg-[#0f766e]/15" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#e7f3ef] text-lg font-bold text-[#0f766e]">{session.user.email?.[0].toUpperCase() || "H"}</div>
            <div><h2 className="font-bold text-[#173f3b]">Welcome to HomeSpot</h2><p className="text-sm text-[#71817d]">{session.user.email || session.user.phone}</p></div>
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#f0faf6] p-4 text-sm text-[#35665d]"><ShieldCheck className="h-5 w-5 shrink-0 text-[#0f766e]" /><p>Your account is secured by Supabase Auth. Roles and profile details will follow the approved identity schema.</p></div>
          <Button onClick={signOut} variant="outline" className="mt-5 rounded-xl border-[#d4e1dd]"><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid overflow-hidden rounded-[1.8rem] border border-[#dce7e3] bg-white lg:grid-cols-[0.8fr_1fr]">
      <div className="relative hidden min-h-[520px] lg:block">
        <Image src="/assets/map-pattern.png" alt="Abstract neighborhood map" fill className="object-cover" />
        <div className="absolute inset-0 bg-[#123b38]/20" />
        <div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-white/90 p-5 backdrop-blur"><h2 className="text-xl font-bold text-[#173f3b]">One account. Every step home.</h2><p className="mt-2 text-sm leading-6 text-[#5f746f]">Save homes, request viewings, message verified providers, and plan your move securely.</p></div>
      </div>
      <div className="p-6 sm:p-9">
        <h1 className="text-2xl font-bold tracking-[-0.03em] text-[#173f3b]">Sign in or create an account</h1>
        <p className="mt-2 text-sm text-[#71817d]">Continue with email or phone.</p>
        <div className="mt-5">
          <Auth
            supabaseClient={supabase}
            providers={[]}
            appearance={{
              theme: ThemeSupa,
              variables: { default: { colors: { brand: "#0f766e", brandAccent: "#0b645e" }, radii: { borderRadiusButton: "12px", inputBorderRadius: "12px" } } },
            }}
            theme="light"
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
}
