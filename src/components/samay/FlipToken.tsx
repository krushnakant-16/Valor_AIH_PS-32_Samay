import { useEffect, useRef, useState } from "react";

export function FlipToken({
  token,
  size = "md",
  tone = "ink",
}: {
  token: string;
  size?: "sm" | "md" | "lg";
  tone?: "ink" | "coral";
}) {
  const prevRef = useRef(token);
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (prevRef.current !== token) {
      setFlipping(true);
      prevRef.current = token;
      const t = setTimeout(() => setFlipping(false), 550);
      return () => clearTimeout(t);
    }
    return;
  }, [token]);

  const dims =
    size === "lg"
      ? "h-14 w-11 text-3xl"
      : size === "sm"
        ? "h-8 w-6 text-base"
        : "h-11 w-8 text-xl";

  return (
    <div className="flex gap-1" aria-label={`Token ${token}`}>
      {token.split("").map((c, i) => (
        <span
          key={`${c}-${i}`}
          className={`${dims} ${flipping ? "cell-flipping" : ""} flex items-center justify-center rounded-md font-mono font-semibold tabular-nums ${
            tone === "coral" ? "bg-coral text-ink" : "bg-ink text-paper"
          }`}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
