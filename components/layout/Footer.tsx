export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-secondary mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-2">
            <span className="font-orbitron font-black text-sm text-cyber-cyan">VYS</span>
            <span className="font-orbitron font-black text-sm text-cyber-purple2">COR</span>
          </div>
          <p className="font-mono text-xs text-muted text-center">
            &copy; 2026 VYSCOR &middot; Todos los derechos reservados &middot; +18
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="font-mono text-xs text-muted hover:text-cyber-cyan transition-colors duration-150">
              Terminos
            </a>
            <a href="#" className="font-mono text-xs text-muted hover:text-cyber-cyan transition-colors duration-150">
              Privacidad
            </a>
            <a href="#" className="font-mono text-xs text-muted hover:text-cyber-cyan transition-colors duration-150">
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
