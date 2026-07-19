import Image from "next/image";

function PromoCard({ image, to }: { image: string; to: string }) {
  return (
    <a
      href={to}
      className="w-full group relative flex justify-center align-center overflow-hidden rounded-2xl aspect-875/481 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex-1"
    >
      <Image
        fill
        priority
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </a>
  );
}

export default PromoCard;
