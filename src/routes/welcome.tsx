import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/welcome")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "Welcome to SocialX" },
      {
        name: "description",
        content:
          "Create your SocialX account — a pure-black, premium space for posts, stories and Clips.",
      },
      { property: "og:title", content: "Welcome to SocialX" },
      { property: "og:description", content: "Create your SocialX account in a few quiet steps." },
    ],
  }),
});

function Welcome() {
  useEffect(() => {
    document.body.setAttribute("data-auth-open", "");
    return () => document.body.removeAttribute("data-auth-open");
  }, []);

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-background">
      {/* single, very deep red bloom — the only accent on this page */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 size-[560px] -translate-x-1/2 rounded-full opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.3 0.14 24 / 55%) 0%, oklch(0 0 0 / 0%) 68%)",
        }}
      />

      <div className="page-in relative mx-auto flex w-full max-w-md flex-1 flex-col px-6">
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[oklch(1_0_0_/_45%)]">
            Welcome
          </p>
          <h1 className="font-display mt-5 text-[40px] font-semibold leading-[1.05] tracking-[-0.035em]">
            A quieter place
            <br />
            to be seen.
          </h1>
          <p className="mt-5 max-w-[19rem] text-[15px] leading-relaxed text-[oklch(1_0_0_/_58%)]">
            Posts, stories and Clips on pure black — built for people who care how things look and
            how they feel.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              "Your feed, without the noise",
              "Clips made for full-screen nights",
              "Private by default, social by choice",
            ].map((line) => (
              <li key={line} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ background: "oklch(0.44 0.18 24)" }}
                />
                <span className="text-[14px] text-[oklch(1_0_0_/_72%)]">{line}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3 pb-[max(env(safe-area-inset-bottom),1.75rem)]">
          <Link
            to="/signup"
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-foreground text-[15px] font-semibold text-background transition-transform duration-200 active:scale-[0.985]"
          >
            Create account
          </Link>
          <Link
            to="/signin"
            className="flex h-[52px] w-full items-center justify-center rounded-full border border-[oklch(1_0_0_/_20%)] text-[15px] font-semibold text-foreground transition-all duration-200 active:scale-[0.985] active:border-[oklch(0.44_0.18_24_/_80%)]"
          >
            I already have an account
          </Link>
          <p className="pt-3 text-center text-[12px] leading-relaxed text-[oklch(1_0_0_/_40%)]">
            By continuing you agree to SocialX's Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
