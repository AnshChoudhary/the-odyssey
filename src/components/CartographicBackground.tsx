// Shared cartographic background component for consistent styling
export function CartographicBackground({ children, title, subtitle }: { 
  children: React.ReactNode; 
  title?: string; 
  subtitle?: string;
}) {
  return (
    <div className="relative w-full h-screen overflow-auto bg-[#e8dcc7]">
      {/* Parchment texture filter */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Decorative border */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <rect
          x="20"
          y="20"
          width="calc(100% - 40px)"
          height="calc(100% - 40px)"
          fill="none"
          stroke="#8b7355"
          strokeWidth="2"
          strokeDasharray="10,5"
          opacity="0.5"
        />
        <rect
          x="28"
          y="28"
          width="calc(100% - 56px)"
          height="calc(100% - 56px)"
          fill="none"
          stroke="#8b7355"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      {/* Title cartouche */}
      {title && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-[#f4efe6]/95 backdrop-blur-sm px-8 py-4 rounded border-2 border-[#8b7355]/60 shadow-lg">
            <h1 className="text-3xl font-display font-bold text-[#2d2419] text-center">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-[#5a4a3a] text-center mt-1 font-serif italic">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-0">
        {children}
      </div>

      {/* Vignette */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, transparent 60%, rgba(45, 36, 25, 0.15) 100%)',
          zIndex: 2
        }}
      />
    </div>
  );
}
