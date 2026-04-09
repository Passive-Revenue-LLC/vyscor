import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-[#252525] bg-[#111111] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Image
            src="/assets/logo-white.svg"
            alt="Vyscor"
            width={120}
            height={24}
            className="h-5 w-auto"
          />
          <p className="font-inter text-[11px] sm:text-[12px] text-[#6B6B6B] text-center">
            &copy; 2026 Vyscor &middot; Todos los derechos reservados &middot; +18
          </p>
          <div className="flex items-center gap-5">
            <a href="#" className="font-syncopate text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-white transition-colors duration-150 py-1">
              Terminos
            </a>
            <a href="#" className="font-syncopate text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-white transition-colors duration-150 py-1">
              Privacidad
            </a>
            <a href="#" className="font-syncopate text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.1em] text-[#6B6B6B] hover:text-white transition-colors duration-150 py-1">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
