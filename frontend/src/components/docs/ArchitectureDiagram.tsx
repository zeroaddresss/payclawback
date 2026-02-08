export default function ArchitectureDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox="0 0 700 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <marker id="ad-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#71717a" />
          </marker>
        </defs>

        {/* AI Agents box */}
        <rect x="240" y="10" width="220" height="55" rx="10" fill="#4a9090" fillOpacity="0.12" stroke="#4a9090" strokeWidth="2" />
        <text x="350" y="33" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">AI Agents</text>
        <text x="350" y="52" textAnchor="middle" fill="#71717a" fontSize="11">OpenClaw Skill</text>

        {/* Arrow: Agents -> Backend */}
        <line x1="350" y1="65" x2="350" y2="95" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#ad-arrow)" />

        {/* Backend API box */}
        <rect x="240" y="100" width="220" height="55" rx="10" fill="#4a9090" fillOpacity="0.12" stroke="#4a9090" strokeWidth="2" />
        <text x="350" y="123" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">Backend API</text>
        <text x="350" y="142" textAnchor="middle" fill="#71717a" fontSize="11">Bun + Hono + ethers.js</text>

        {/* Arrow: Backend -> Contract */}
        <line x1="350" y1="155" x2="350" y2="185" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#ad-arrow)" />

        {/* Smart Contract box */}
        <rect x="240" y="190" width="220" height="55" rx="10" fill="#c27c5e" fillOpacity="0.12" stroke="#c27c5e" strokeWidth="2" />
        <text x="350" y="213" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">Smart Contract</text>
        <text x="350" y="232" textAnchor="middle" fill="#71717a" fontSize="11">USDCEscrow.sol</text>

        {/* Arrow: Contract -> USDC */}
        <line x1="350" y1="245" x2="350" y2="275" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#ad-arrow)" />

        {/* USDC Token box */}
        <rect x="240" y="280" width="220" height="50" rx="10" fill="#c27c5e" fillOpacity="0.12" stroke="#c27c5e" strokeWidth="2" />
        <text x="350" y="303" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">USDC Token</text>
        <text x="350" y="320" textAnchor="middle" fill="#71717a" fontSize="11">Base Sepolia</text>

        {/* Frontend box (left side) */}
        <rect x="10" y="100" width="180" height="55" rx="10" fill="#4a9090" fillOpacity="0.12" stroke="#4a9090" strokeWidth="2" />
        <text x="100" y="123" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">Frontend</text>
        <text x="100" y="142" textAnchor="middle" fill="#71717a" fontSize="11">React + Vite</text>

        {/* Arrow: Frontend -> Backend */}
        <line x1="190" y1="127" x2="235" y2="127" stroke="#71717a" strokeWidth="1.5" markerEnd="url(#ad-arrow)" />

        {/* WebSocket indicator (right side) */}
        <rect x="510" y="100" width="180" height="55" rx="10" fill="#242830" stroke="#242830" strokeWidth="2" />
        <text x="600" y="123" textAnchor="middle" fill="#71717a" fontSize="14" fontWeight="600">WebSocket</text>
        <text x="600" y="142" textAnchor="middle" fill="#71717a" fontSize="11">Real-time events</text>

        {/* Arrow: Backend -> WebSocket */}
        <line x1="460" y1="127" x2="505" y2="127" stroke="#71717a" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#ad-arrow)" />
      </svg>
    </div>
  );
}
