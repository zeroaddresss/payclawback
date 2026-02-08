export default function FlowDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox="0 0 700 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* Happy path boxes */}
        <rect x="10" y="80" width="120" height="50" rx="12" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="70" y="110" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">Create</text>

        <rect x="190" y="80" width="120" height="50" rx="12" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="250" y="110" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">Deliver</text>

        <rect x="370" y="80" width="120" height="50" rx="12" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="430" y="110" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">Release</text>

        {/* Happy path arrows */}
        <line x1="130" y1="105" x2="185" y2="105" stroke="#4a9090" strokeWidth="2" markerEnd="url(#arrowAccent)" />
        <line x1="310" y1="105" x2="365" y2="105" stroke="#4a9090" strokeWidth="2" markerEnd="url(#arrowAccent)" />

        {/* Dispute branch */}
        <rect x="370" y="190" width="120" height="50" rx="12" fill="#c27c5e" fillOpacity="0.15" stroke="#c27c5e" strokeWidth="2" />
        <text x="430" y="220" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">Dispute</text>

        <rect x="550" y="190" width="120" height="50" rx="12" fill="#c27c5e" fillOpacity="0.15" stroke="#c27c5e" strokeWidth="2" />
        <text x="610" y="220" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">Resolve</text>

        {/* Expire branch */}
        <rect x="550" y="80" width="120" height="50" rx="12" fill="#71717a" fillOpacity="0.15" stroke="#71717a" strokeWidth="2" />
        <text x="610" y="110" textAnchor="middle" fill="#71717a" fontSize="14" fontWeight="600">Expire</text>

        {/* Dispute arrow from Deliver */}
        <line x1="250" y1="130" x2="250" y2="215" stroke="#c27c5e" strokeWidth="2" strokeDasharray="6 3" />
        <line x1="250" y1="215" x2="365" y2="215" stroke="#c27c5e" strokeWidth="2" markerEnd="url(#arrowWarm)" />

        {/* Resolve arrow */}
        <line x1="490" y1="215" x2="545" y2="215" stroke="#c27c5e" strokeWidth="2" markerEnd="url(#arrowWarm)" />

        {/* Expire arrow from Create */}
        <path d="M 130 95 Q 160 40 430 40 Q 560 40 610 75" stroke="#71717a" strokeWidth="2" strokeDasharray="6 3" fill="none" markerEnd="url(#arrowMuted)" />

        {/* Labels */}
        <text x="430" y="35" textAnchor="middle" fill="#71717a" fontSize="11" fontStyle="italic">deadline passes</text>
        <text x="250" y="170" textAnchor="middle" fill="#c27c5e" fontSize="11" fontStyle="italic">either party</text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowAccent" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#4a9090" />
          </marker>
          <marker id="arrowWarm" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#c27c5e" />
          </marker>
          <marker id="arrowMuted" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#71717a" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
