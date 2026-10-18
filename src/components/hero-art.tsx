/**
 * Hero photograph: a brass balance with the hold on one pan and the
 * contract on the other. The left of the frame is left dark on purpose,
 * so the headline sits in that shadow on large screens.
 */
export function HeroArt() {
  const alt =
    "Antique brass balance scale on a green leather desk. A gold coin sits in one pan and a ribbon-tied contract with a wax seal in the other.";

  return (
    <>
      <img
        src="/hero-arbitration.jpg"
        alt={alt}
        className="absolute inset-0 hidden h-full w-full object-cover object-[right_28%] lg:block"
      />
      <div
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, #070b14 0%, rgba(7,11,20,0.92) 34%, rgba(7,11,20,0.55) 48%, rgba(7,11,20,0.05) 68%, transparent 100%)",
        }}
      />
      <div className="relative aspect-[16/9] lg:hidden">
        <img src="/hero-arbitration.jpg" alt={alt} className="absolute inset-0 h-full w-full object-cover object-[64%_center]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#070b14] to-transparent" />
      </div>
    </>
  );
}
