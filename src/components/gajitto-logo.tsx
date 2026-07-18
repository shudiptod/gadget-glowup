export function GajittoLogo({ className }: { className?: string }) {
  return (
    <div className={"flex items-center gap-2 " + (className ?? "")}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M13 4L5 13h6l-1 7 8-9h-6l1-7z" fill="currentColor" />
        </svg>
      </div>
      <span className="text-lg font-black tracking-tight text-brand">GAJITTO</span>
    </div>
  );
}
