export default function StateDiagram() {
  const states = [
    { label: 'Active', x: 100, y: 120, color: '#4a9090' },
    { label: 'Released', x: 350, y: 40, color: '#22c55e' },
    { label: 'Disputed', x: 350, y: 120, color: '#c27c5e' },
    { label: 'Refunded', x: 570, y: 80, color: '#eab308' },
    { label: 'Expired', x: 350, y: 210, color: '#71717a' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox="0 0 700 270" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <marker id="sd-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#71717a" />
          </marker>
        </defs>

        {/* Arrows */}
        {/* Active -> Released */}
        <path d="M 170 110 Q 220 60 280 55" stroke="#71717a" strokeWidth="1.5" fill="none" markerEnd="url(#sd-arrow)" />
        <text x="200" y="70" fill="#71717a" fontSize="10">release</text>

        {/* Active -> Disputed */}
        <line x1="170" y1="125" x2="280" y2="125" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#sd-arrow)" />
        <text x="215" y="118" fill="#71717a" fontSize="10">dispute</text>

        {/* Active -> Expired */}
        <path d="M 170 140 Q 220 200 280 215" stroke="#71717a" strokeWidth="1.5" fill="none" markerEnd="url(#sd-arrow)" />
        <text x="190" y="195" fill="#71717a" fontSize="10">deadline</text>

        {/* Disputed -> Released (resolve true) */}
        <path d="M 420 110 Q 460 70 490 60 L 500 55" stroke="#71717a" strokeWidth="1.5" fill="none" markerEnd="url(#sd-arrow)" />
        <text x="455" y="68" fill="#71717a" fontSize="10">resolve (pay)</text>

        {/* Disputed -> Refunded (resolve false) */}
        <line x1="420" y1="125" x2="500" y2="95" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#sd-arrow)" />
        <text x="445" y="120" fill="#71717a" fontSize="10">resolve (refund)</text>

        {/* State pills */}
        {states.map((s) => (
          <g key={s.label}>
            <rect
              x={s.x - 65}
              y={s.y - 18}
              width="130"
              height="36"
              rx="18"
              fill={s.color}
              fillOpacity="0.15"
              stroke={s.color}
              strokeWidth="2"
            />
            <text x={s.x} y={s.y + 5} textAnchor="middle" fill={s.color} fontSize="13" fontWeight="600">
              {s.label}
            </text>
          </g>
        ))}

        {/* Resolved states labels */}
        <text x="570" y="48" textAnchor="middle" fill="#22c55e" fontSize="10" opacity="0.7">(to beneficiary)</text>
        <text x="570" y="118" textAnchor="middle" fill="#eab308" fontSize="10" opacity="0.7">(to depositor)</text>
      </svg>
    </div>
  );
}
