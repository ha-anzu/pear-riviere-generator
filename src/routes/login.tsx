import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-screen place-items-center bg-background px-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-border bg-card p-8">
        <div className="space-y-1">
          <p className="font-display text-3xl">Rivière</p>
          <p className="text-sm text-muted-foreground">
            Sign in to save named pear rivière patterns.
          </p>
        </div>
        {authEnabled ? (
          <div className="space-y-2">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                Continue with {p.label}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Sign-in is disabled.</p>
        )}
        <Link
          to="/"
          className="block text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Back to the generator
        </Link>
      </div>
    </main>
  );
}
