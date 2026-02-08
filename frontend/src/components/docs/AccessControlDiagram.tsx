export default function AccessControlDiagram() {
  const actors = [
    { label: 'Depositor', color: '#4a9090' },
    { label: 'Beneficiary', color: '#c27c5e' },
    { label: 'Arbiter', color: '#eab308' },
    { label: 'Anyone', color: '#71717a' },
  ];

  const functions = [
    'createEscrow',
    'release',
    'dispute',
    'resolveDispute',
    'claimExpired',
    'getEscrow',
    'getEscrowCount',
  ];

  // Access matrix: [actor][function] = true if allowed
  const access: boolean[][] = [
    // Depositor:    create, release, dispute, resolve, claim, get, count
    [true, true, true, false, false, true, true],
    // Beneficiary:  create, dispute, but NOT release or resolve
    [true, false, true, false, false, true, true],
    // Arbiter:      release, resolveDispute
    [false, true, false, true, false, true, true],
    // Anyone:       claimExpired, getEscrow, getEscrowCount
    [false, false, false, false, true, true, true],
  ];

  const rowLabelWidth = 110;
  const colWidth = 80;
  const rowHeight = 44;
  const headerHeight = 100;
  const startX = rowLabelWidth + 10;
  const startY = headerHeight + 10;
  const totalWidth = startX + functions.length * colWidth + 10;
  const totalHeight = startY + actors.length * rowHeight + 20;

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <svg viewBox={`0 0 ${totalWidth} ${totalHeight}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
        {/* Column headers (angled) */}
        {functions.map((fn, i) => (
          <g key={fn} transform={`translate(${startX + i * colWidth + colWidth / 2}, ${headerHeight - 5})`}>
            <text
              transform="rotate(-40)"
              textAnchor="end"
              fill="#71717a"
              fontSize="11"
              fontWeight="600"
              fontFamily="monospace"
            >
              {fn}
            </text>
          </g>
        ))}

        {/* Header separator line */}
        <line
          x1="0"
          y1={startY - 4}
          x2={totalWidth}
          y2={startY - 4}
          stroke="#71717a"
          strokeWidth="1"
          strokeOpacity="0.3"
        />

        {/* Rows */}
        {actors.map((actor, row) => {
          const y = startY + row * rowHeight + rowHeight / 2;

          return (
            <g key={actor.label}>
              {/* Row background (alternating) */}
              {row % 2 === 0 && (
                <rect
                  x="0"
                  y={startY + row * rowHeight}
                  width={totalWidth}
                  height={rowHeight}
                  fill={actor.color}
                  fillOpacity="0.04"
                />
              )}

              {/* Row label */}
              <text
                x="10"
                y={y + 4}
                fill={actor.color}
                fontSize="13"
                fontWeight="600"
              >
                {actor.label}
              </text>

              {/* Access dots */}
              {functions.map((fn, col) => {
                const cx = startX + col * colWidth + colWidth / 2;
                return access[row][col] ? (
                  <circle
                    key={fn}
                    cx={cx}
                    cy={y}
                    r="8"
                    fill={actor.color}
                    fillOpacity="0.85"
                  />
                ) : (
                  <line
                    key={fn}
                    x1={cx - 4}
                    y1={y}
                    x2={cx + 4}
                    y2={y}
                    stroke="#71717a"
                    strokeWidth="1.5"
                    strokeOpacity="0.25"
                  />
                );
              })}

              {/* Row separator */}
              <line
                x1="0"
                y1={startY + (row + 1) * rowHeight}
                x2={totalWidth}
                y2={startY + (row + 1) * rowHeight}
                stroke="#71717a"
                strokeWidth="1"
                strokeOpacity="0.15"
              />
            </g>
          );
        })}

        {/* Column separator lines */}
        {functions.map((_fn, i) => (
          <line
            key={i}
            x1={startX + i * colWidth}
            y1={startY - 4}
            x2={startX + i * colWidth}
            y2={startY + actors.length * rowHeight}
            stroke="#71717a"
            strokeWidth="1"
            strokeOpacity="0.1"
          />
        ))}
      </svg>
    </div>
  );
}
