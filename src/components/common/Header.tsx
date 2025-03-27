import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-neutral-text-white shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Image 
            src="/favicon.png" 
            alt="d:exchange 2025" 
            width={50} 
            height={50} 
            priority
          />
        </div>
        <h1 className="text-primary-main text-2xl md:text-3xl font-bold">
          d:exchange 2025
        </h1>
      </div>
    </header>
  );
}