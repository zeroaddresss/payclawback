export default function AgentInteractionDiagram() {
  const colWidth = 160;
  const startX = 30;
  const laneGap = 70;
  const laneStartY = 80;

  const columns = ['AI Agent', 'REST API', 'USDCEscrow', 'USDC Token'];
  const colCenters = columns.map((_, i) => startX + i * colWidth + colWidth / 2);

  const lanes = [
    {
      label: 'Create',
      color: '#4a9090',
      steps: [
        { from: 0, to: 1, label: 'create-escrow.sh' },
        { from: 1, to: 2, label: 'POST /api/escrows' },
        { from: 2, to: 3, label: 'createEscrow()' },
        { from: 3, to: 3, label: 'transferFrom()', self: true },
      ],
    },
    {
      label: 'Release',
      color: '#22c55e',
      steps: [
        { from: 0, to: 1, label: 'release-escrow.sh' },
        { from: 1, to: 2, label: 'POST .../release' },
        { from: 2, to: 3, label: 'release()' },
        { from: 3, to: 3, label: 'transfer()', self: true },
      ],
    },
    {
      label: 'Dispute',
      color: '#c27c5e',
      steps: [
        { from: 0, to: 1, label: 'dispute-escrow.sh' },
        { from: 1, to: 2, label: 'POST .../dispute' },
        { from: 2, to: 2, label: 'dispute()', self: true },
      ],
    },
  ];

  const totalHeight = laneStartY + lanes.length * laneGap + 30;
  const totalWidth = startX + columns.length * colWidth + 10;

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        <defs>
          <marker id="ai-arrow-teal" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#4a9090" />
          </marker>
          <marker id="ai-arrow-green" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#22c55e" />
          </marker>
          <marker id="ai-arrow-warm" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="#c27c5e" />
          </marker>
        </defs>

        {/* Column headers */}
        {columns.map((col, i) => (
          <g key={col}>
            <rect
              x={startX + i * colWidth + 10}
              y="10"
              width={colWidth - 20}
              height="42"
              rx="10"
              fill="#4a9090"
              fillOpacity={i < 2 ? 0.15 : 0.08}
              stroke={i < 2 ? '#4a9090' : '#c27c5e'}
              strokeWidth="2"
            />
            <text
              x={colCenters[i]}
              y="36"
              textAnchor="middle"
              fill={i < 2 ? '#4a9090' : '#c27c5e'}
              fontSize="13"
              fontWeight="600"
            >
              {col}
            </text>
          </g>
        ))}

        {/* Vertical guide lines */}
        {colCenters.map((cx, i) => (
          <line
            key={i}
            x1={cx}
            y1="56"
            x2={cx}
            y2={totalHeight - 10}
            stroke="#71717a"
            strokeWidth="1"
            strokeOpacity="0.12"
            strokeDasharray="4 4"
          />
        ))}

        {/* Flow lanes */}
        {lanes.map((lane, laneIdx) => {
          const y = laneStartY + laneIdx * laneGap;
          const markerId = lane.color === '#4a9090'
            ? 'ai-arrow-teal'
            : lane.color === '#22c55e'
            ? 'ai-arrow-green'
            : 'ai-arrow-warm';

          return (
            <g key={lane.label}>
              {/* Lane label on far left */}
              <text
                x="8"
                y={y + 4}
                fill={lane.color}
                fontSize="11"
                fontWeight="700"
              >
                {lane.label}
              </text>

              {/* Steps */}
              {lane.steps.map((step, stepIdx) => {
                if (step.self) {
                  // Self-referencing: small loop indicator
                  const cx = colCenters[step.from];
                  return (
                    <g key={stepIdx}>
                      <circle cx={cx} cy={y} r="5" fill={lane.color} fillOpacity="0.3" stroke={lane.color} strokeWidth="1.5" />
                      <text
                        x={cx}
                        y={y - 12}
                        textAnchor="middle"
                        fill={lane.color}
                        fontSize="9"
                        fontWeight="500"
                        fontFamily="monospace"
                      >
                        {step.label}
                      </text>
                    </g>
                  );
                }

                const x1 = colCenters[step.from] + 8;
                const x2 = colCenters[step.to] - 12;
                const midX = (x1 + x2) / 2;

                return (
                  <g key={stepIdx}>
                    <line
                      x1={x1}
                      y1={y}
                      x2={x2}
                      y2={y}
                      stroke={lane.color}
                      strokeWidth="2"
                      markerEnd={`url(#${markerId})`}
                    />
                    <text
                      x={midX}
                      y={y - 8}
                      textAnchor="middle"
                      fill={lane.color}
                      fontSize="9"
                      fontWeight="500"
                      fontFamily="monospace"
                    >
                      {step.label}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
