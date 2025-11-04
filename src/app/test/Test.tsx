"use client";

// react
import { useEffect, useState } from "react";

export default function Test() {
  const [note, setNote] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      // const res = await fetch("/api/notes/0184e854-9b5a-48ec-a335-a2d4d27d352c", { credentials: "include", signal: controller.signal });
      const res = await fetch("/api/notes/03078c3d-420b-402e-a533-19cf55cbb494", { credentials: "include", signal: controller.signal });
      if (res.ok) setNote(await res.json());
    })();

    return () => controller.abort();
  }, []);

  return <pre>{JSON.stringify(note, null, 2)}</pre>;
}
