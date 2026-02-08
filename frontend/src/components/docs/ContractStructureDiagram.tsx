export default function ContractStructureDiagram() {
  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox="0 0 700 520" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <marker id="cs-arrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#71717a" />
          </marker>
        </defs>

        {/* Title */}
        <text x="350" y="24" textAnchor="middle" fill="#4a9090" fontSize="16" fontWeight="700">USDCEscrow.sol</text>

        {/* ── Top Band: State Variables ── */}
        <text x="20" y="56" fill="#71717a" fontSize="11" fontWeight="600">STATE VARIABLES</text>

        {/* owner */}
        <rect x="20" y="66" width="155" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="97" y="86" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">owner</text>
        <text x="97" y="102" textAnchor="middle" fill="#71717a" fontSize="11">address</text>

        {/* usdcToken */}
        <rect x="190" y="66" width="155" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="267" y="86" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">usdcToken</text>
        <text x="267" y="102" textAnchor="middle" fill="#71717a" fontSize="11">IERC20</text>

        {/* escrowCounter */}
        <rect x="360" y="66" width="155" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="437" y="86" textAnchor="middle" fill="#4a9090" fontSize="14" fontWeight="600">escrowCounter</text>
        <text x="437" y="102" textAnchor="middle" fill="#71717a" fontSize="11">uint256</text>

        {/* escrows */}
        <rect x="530" y="66" width="155" height="46" rx="10" fill="#c27c5e" fillOpacity="0.15" stroke="#c27c5e" strokeWidth="2" />
        <text x="607" y="86" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">escrows</text>
        <text x="607" y="102" textAnchor="middle" fill="#71717a" fontSize="11">mapping</text>

        {/* ── Dashed arrow from escrows mapping to struct ── */}
        <line x1="607" y1="112" x2="607" y2="140" stroke="#c27c5e" strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1="607" y1="140" x2="350" y2="140" stroke="#c27c5e" strokeWidth="1.5" strokeDasharray="5 3" />
        <line x1="350" y1="140" x2="350" y2="158" stroke="#c27c5e" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#cs-arrow)" />

        {/* ── Middle Band: Escrow Struct ── */}
        <text x="20" y="152" fill="#71717a" fontSize="11" fontWeight="600">ESCROW STRUCT</text>
        <rect x="80" y="162" width="540" height="150" rx="10" fill="#c27c5e" fillOpacity="0.08" stroke="#c27c5e" strokeWidth="2" />
        <text x="350" y="184" textAnchor="middle" fill="#c27c5e" fontSize="14" fontWeight="600">Escrow</text>

        {/* Column 1 */}
        <text x="130" y="210" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">id</text>
        <text x="260" y="210" textAnchor="start" fill="#71717a" fontSize="11">uint256</text>

        <text x="130" y="232" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">depositor</text>
        <text x="260" y="232" textAnchor="start" fill="#71717a" fontSize="11">address</text>

        <text x="130" y="254" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">beneficiary</text>
        <text x="260" y="254" textAnchor="start" fill="#71717a" fontSize="11">address</text>

        <text x="130" y="276" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">arbiter</text>
        <text x="260" y="276" textAnchor="start" fill="#71717a" fontSize="11">address</text>

        <text x="130" y="298" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">amount</text>
        <text x="260" y="298" textAnchor="start" fill="#71717a" fontSize="11">uint256</text>

        {/* Column 2 */}
        <text x="390" y="210" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">description</text>
        <text x="520" y="210" textAnchor="start" fill="#71717a" fontSize="11">string</text>

        <text x="390" y="232" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">deadline</text>
        <text x="520" y="232" textAnchor="start" fill="#71717a" fontSize="11">uint256</text>

        <text x="390" y="254" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">state</text>
        <text x="520" y="254" textAnchor="start" fill="#71717a" fontSize="11">EscrowState</text>

        <text x="390" y="276" textAnchor="start" fill="#4a9090" fontSize="12" fontWeight="600">createdAt</text>
        <text x="520" y="276" textAnchor="start" fill="#71717a" fontSize="11">uint256</text>

        {/* Divider line between columns */}
        <line x1="370" y1="195" x2="370" y2="305" stroke="#c27c5e" strokeWidth="1" strokeOpacity="0.3" />

        {/* ── Bottom Band: Functions ── */}
        <text x="20" y="345" fill="#71717a" fontSize="11" fontWeight="600">FUNCTIONS</text>

        {/* Row 1: Write functions (teal) */}
        <rect x="20" y="355" width="125" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="82" y="375" textAnchor="middle" fill="#4a9090" fontSize="12" fontWeight="600">createEscrow</text>
        <text x="82" y="391" textAnchor="middle" fill="#71717a" fontSize="10">write</text>

        <rect x="158" y="355" width="100" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="208" y="375" textAnchor="middle" fill="#4a9090" fontSize="12" fontWeight="600">release</text>
        <text x="208" y="391" textAnchor="middle" fill="#71717a" fontSize="10">write</text>

        <rect x="271" y="355" width="100" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="321" y="375" textAnchor="middle" fill="#4a9090" fontSize="12" fontWeight="600">dispute</text>
        <text x="321" y="391" textAnchor="middle" fill="#71717a" fontSize="10">write</text>

        {/* Row 2: More write + read functions */}
        <rect x="20" y="415" width="135" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="87" y="435" textAnchor="middle" fill="#4a9090" fontSize="12" fontWeight="600">resolveDispute</text>
        <text x="87" y="451" textAnchor="middle" fill="#71717a" fontSize="10">write</text>

        <rect x="168" y="415" width="120" height="46" rx="10" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="2" />
        <text x="228" y="435" textAnchor="middle" fill="#4a9090" fontSize="12" fontWeight="600">claimExpired</text>
        <text x="228" y="451" textAnchor="middle" fill="#71717a" fontSize="10">write</text>

        {/* Read functions (muted gray) */}
        <rect x="384" y="355" width="120" height="46" rx="10" fill="#71717a" fillOpacity="0.15" stroke="#71717a" strokeWidth="2" />
        <text x="444" y="375" textAnchor="middle" fill="#71717a" fontSize="12" fontWeight="600">getEscrow</text>
        <text x="444" y="391" textAnchor="middle" fill="#71717a" fontSize="10">view</text>

        <rect x="517" y="355" width="145" height="46" rx="10" fill="#71717a" fillOpacity="0.15" stroke="#71717a" strokeWidth="2" />
        <text x="589" y="375" textAnchor="middle" fill="#71717a" fontSize="12" fontWeight="600">getEscrowCount</text>
        <text x="589" y="391" textAnchor="middle" fill="#71717a" fontSize="10">view</text>

        {/* Legend */}
        <rect x="384" y="425" width="12" height="12" rx="3" fill="#4a9090" fillOpacity="0.15" stroke="#4a9090" strokeWidth="1.5" />
        <text x="402" y="436" fill="#71717a" fontSize="11">Write functions</text>

        <rect x="510" y="425" width="12" height="12" rx="3" fill="#71717a" fillOpacity="0.15" stroke="#71717a" strokeWidth="1.5" />
        <text x="528" y="436" fill="#71717a" fontSize="11">View functions</text>
      </svg>
    </div>
  );
}
