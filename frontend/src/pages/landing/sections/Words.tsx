/** Splits text into masked words for the line reveal. Words stay real text (SEO/a11y); only transforms animate. */
export function Words({ text, from = 0, className }: { text: string; from?: number; className?: string }) {
  const parts = text.split(/(\s+)/);
  let i = from;
  return (
    <>
      {parts.map((part, idx) =>
        /^\s+$/.test(part) || part === '' ? (
          part
        ) : (
          <span key={idx} className={`lx-w ${className ?? ''}`}>
            <span style={{ ['--i' as string]: i++ }}>{part}</span>
          </span>
        ),
      )}
    </>
  );
}
