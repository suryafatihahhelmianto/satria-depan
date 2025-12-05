import Image from "next/image";

export default function QuickManual() {
  return (
    <div className="w-full flex justify-center py-10">
      <Image
        src="/img/manual.png"
        alt="Quick Manual"
        width={1200}
        height={800}
        className="rounded-xl shadow-lg max-w-full"
      />
    </div>
  );
}
