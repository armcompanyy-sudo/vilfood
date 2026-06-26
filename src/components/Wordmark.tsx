/**
 * The vilfood wordmark (the brand's logo — leaf-cut lowercase grotesque).
 * Two transparent PNGs extracted from the brand artwork: `dark` for light
 * backgrounds, `white` for the ink footer / dark surfaces.
 */
export function Wordmark({
  variant = "dark",
  className = "",
}: {
  variant?: "dark" | "white";
  className?: string;
}) {
  return (
    <img
      src={`/img/wordmark-${variant}.png`}
      alt="Vilfood"
      width={1400}
      height={317}
      className={className}
      draggable={false}
    />
  );
}
