export function SectionHeading({
  title,
  accent,
  action,
}: {
  title: string;
  accent?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <h2 className="font-display text-2xl font-extrabold tracking-tight md:text-4xl">
        {title}{" "}
        {accent && <span className="gradient-title">{accent}</span>}
      </h2>
      {action}
    </div>
  );
}
