// Decorative SVG thumbs ported verbatim from the design source so the cards-mode
// visuals stay pixel-identical. IDs are scoped per-thumb to avoid linearGradient collisions.

export function ProjectThumb({ id, label }: { id: number; label: string }) {
  const gradId = `proj-grad-${id}`;
  switch (id) {
    case 1:
      return (
        <div className="proj-thumb">
          <span className="pt-label">{label}</span>
          <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.65 0.18 180)" />
                <stop offset="100%" stopColor="oklch(0.4 0.18 200)" />
              </linearGradient>
            </defs>
            <rect width="400" height="140" fill={`url(#${gradId})`} />
            <circle cx="80" cy="70" r="30" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" data-draw />
            <circle cx="80" cy="70" r="18" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" data-draw />
            <line x1="80" y1="40" x2="80" y2="100" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" data-draw />
            <line x1="50" y1="70" x2="110" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" data-draw />
            <text data-fade x="140" y="58" fontFamily="monospace" fontSize="11" fill="rgba(255,255,255,0.5)" letterSpacing="2">SIGN ↔ SPEECH</text>
            <text data-fade x="140" y="80" fontFamily="monospace" fontSize="18" fill="rgba(255,255,255,0.9)" letterSpacing="-1">SignSync</text>
            <text data-fade x="140" y="98" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.4)">sub-200ms · MediaPipe · TFLite</text>
            <rect x="340" y="20" width="40" height="8" rx="2" fill="rgba(255,255,255,0.15)" />
            <rect x="340" y="34" width="28" height="8" rx="2" fill="rgba(255,255,255,0.1)" />
          </svg>
        </div>
      );
    case 2:
      return (
        <div className="proj-thumb">
          <span className="pt-label">{label}</span>
          <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.5 0.18 300)" />
                <stop offset="100%" stopColor="oklch(0.3 0.15 280)" />
              </linearGradient>
            </defs>
            <rect width="400" height="140" fill={`url(#${gradId})`} />
            <circle cx="80" cy="70" r="16" fill="rgba(255,255,255,0.2)" />
            <circle cx="130" cy="40" r="10" fill="rgba(255,255,255,0.15)" />
            <circle cx="50" cy="100" r="12" fill="rgba(255,255,255,0.15)" />
            <circle cx="120" cy="100" r="8" fill="rgba(255,255,255,0.12)" />
            <line x1="80" y1="70" x2="130" y2="40" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" data-draw />
            <line x1="80" y1="70" x2="50" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" data-draw />
            <line x1="80" y1="70" x2="120" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" data-draw />
            <text data-fade x="160" y="56" fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="2">KNOWLEDGE GRAPH</text>
            <text data-fade x="160" y="78" fontFamily="monospace" fontSize="15" fill="rgba(255,255,255,0.9)">AI Studio</text>
            <text data-fade x="160" y="96" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.4)">spaCy · Neo4j · Pinecone · 92% precision</text>
          </svg>
        </div>
      );
    case 3:
      return (
        <div className="proj-thumb">
          <span className="pt-label">{label}</span>
          <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.65 0.18 80)" />
                <stop offset="100%" stopColor="oklch(0.4 0.15 55)" />
              </linearGradient>
            </defs>
            <rect width="400" height="140" fill={`url(#${gradId})`} />
            <polyline
              points="20,110 60,80 90,95 120,55 160,70 200,40 240,60 280,35 320,50"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="2.5"
              strokeLinejoin="round"
              data-draw
            />
            <circle cx="280" cy="35" r="4" fill="rgba(255,255,255,0.8)" />
            <text data-fade x="290" y="30" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.7)">▲ +18%</text>
            <text data-fade x="340" y="65" fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="1">MARKET</text>
            <text data-fade x="340" y="82" fontFamily="monospace" fontSize="14" fill="rgba(255,255,255,0.9)">Analytics</text>
            <text data-fade x="340" y="98" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.4)">500+ articles/day</text>
          </svg>
        </div>
      );
    case 4:
      return (
        <div className="proj-thumb">
          <span className="pt-label">{label}</span>
          <svg viewBox="0 0 400 140" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="oklch(0.55 0.18 240)" />
                <stop offset="100%" stopColor="oklch(0.32 0.15 220)" />
              </linearGradient>
            </defs>
            <rect width="400" height="140" fill={`url(#${gradId})`} />
            <rect x="20" y="30" width="70" height="80" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" data-draw />
            <line x1="30" y1="50" x2="80" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
            <line x1="30" y1="60" x2="80" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="1" data-draw />
            <line x1="30" y1="70" x2="65" y2="70" stroke="rgba(255,255,255,0.2)" strokeWidth="1" data-draw />
            <line x1="90" y1="70" x2="130" y2="50" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" data-draw />
            <circle cx="140" cy="45" r="8" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" data-draw />
            <circle cx="140" cy="75" r="8" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" data-draw />
            <line x1="90" y1="80" x2="132" y2="75" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" data-draw />
            <text data-fade x="170" y="55" fontFamily="monospace" fontSize="10" fill="rgba(255,255,255,0.5)" letterSpacing="1">IIT PATNA · RESEARCH</text>
            <text data-fade x="170" y="76" fontFamily="monospace" fontSize="16" fill="rgba(255,255,255,0.9)">CitationEdge</text>
            <text data-fade x="170" y="95" fontFamily="monospace" fontSize="9" fill="rgba(255,255,255,0.4)">95% extraction · 85% recall · Docling</text>
          </svg>
        </div>
      );
  }
  return null;
}
