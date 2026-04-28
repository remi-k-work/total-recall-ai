/* eslint-disable @next/next/no-img-element */

// react
import { Suspense } from "react";

// services, features, and other libraries
import { Effect } from "effect";
import { runComponentMain } from "@/lib/helpersEffect";
import { Auth } from "@/features/auth/lib/auth";

// components
import { ConfirmModalRoot } from "@/atoms";
import { DemoModeModalRoot } from "@/atoms";
import { NotesAssistantModalRoot } from "@/atoms";

const main = Effect.gen(function* () {
  // Access the user session data from the server side or fail with an unauthorized access error
  const auth = yield* Auth;
  const { user, session } = yield* auth.getUserSessionData.pipe(Effect.orElse(() => Effect.succeed({ user: null, session: null })));

  return { user, session };
});

// Component remains the fast, static shell
export default function Footer() {
  return (
    <Suspense fallback={<FooterSkeleton />}>
      <FooterContent />
    </Suspense>
  );
}

// This new async component contains the dynamic logic
async function FooterContent() {
  // Execute the main effect for the component, handle known errors, and return the payload
  const { user, session } = await runComponentMain(main);

  return (
    <footer className="[grid-area:footer]">
      <ConfirmModalRoot />
      <DemoModeModalRoot />
      {user && session && <NotesAssistantModalRoot user={user} session={session} />}
      <a
        href="https://www.remiforge.dev"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit RemiForge Portfolio (opens in a new tab)"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          maxWidth: "36rem",
          width: "100%",
          margin: "2rem auto",
          padding: "1rem",
          textDecoration: "none",
          border: "1px solid #444",
          borderRadius: "0.75rem",
          backgroundColor: "#1a1a1a",
          color: "#e5e5e5",
        }}
      >
        <img
          src="https://www.remiforge.dev/opengraph-image.jpg"
          width="1200"
          height="630"
          alt=""
          loading="lazy"
          style={{
            flex: "none",
            width: "8rem",
            height: "auto",
            aspectRatio: "1200 / 630",
            objectFit: "cover",
            borderRadius: "0.5rem",
          }}
        />
        <div style={{ flex: "1", minWidth: "14rem" }}>
          <div style={{ color: "#a3a3a3", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
            <span aria-hidden="true">👨‍💻</span> Built By
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            RemiForge
            <span aria-hidden="true" style={{ color: "#888", fontSize: "1.25rem", fontWeight: 400 }}>
              ↗
            </span>
          </div>
          <div style={{ color: "#a3a3a3", fontSize: "0.95rem", marginTop: "0.25rem" }}>Portfolio of Projects, Experiments & Contact</div>
        </div>
      </a>
    </footer>
  );
}

export function FooterSkeleton() {
  return (
    <footer className="[grid-area:footer]">
      <a
        href="https://www.remiforge.dev"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visit RemiForge Portfolio (opens in a new tab)"
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.25rem",
          maxWidth: "36rem",
          width: "100%",
          margin: "2rem auto",
          padding: "1rem",
          textDecoration: "none",
          border: "1px solid #444",
          borderRadius: "0.75rem",
          backgroundColor: "#1a1a1a",
          color: "#e5e5e5",
        }}
      >
        <img
          src="https://www.remiforge.dev/opengraph-image.jpg"
          width="1200"
          height="630"
          alt=""
          loading="lazy"
          style={{
            flex: "none",
            width: "8rem",
            height: "auto",
            aspectRatio: "1200 / 630",
            objectFit: "cover",
            borderRadius: "0.5rem",
          }}
        />
        <div style={{ flex: "1", minWidth: "14rem" }}>
          <div style={{ color: "#a3a3a3", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>
            <span aria-hidden="true">👨‍💻</span> Built By
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#ffffff", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            RemiForge
            <span aria-hidden="true" style={{ color: "#888", fontSize: "1.25rem", fontWeight: 400 }}>
              ↗
            </span>
          </div>
          <div style={{ color: "#a3a3a3", fontSize: "0.95rem", marginTop: "0.25rem" }}>Portfolio of Projects, Experiments & Contact</div>
        </div>
      </a>
    </footer>
  );
}
