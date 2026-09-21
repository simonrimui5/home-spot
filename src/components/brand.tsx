import Image from "next/image";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-10 w-10 overflow-hidden rounded-2xl bg-[#e8f3ef] shadow-sm ring-1 ring-[#0f766e]/10">
        <Image src="/assets/homespot-mark.png" alt="HomeSpot" fill className="object-cover" sizes="40px" priority />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="text-xl font-bold tracking-[-0.04em] text-[#123b38]">HomeSpot</div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#a55d3b]">A spot away</div>
        </div>
      )}
    </div>
  );
}
