export function HeroMachineAnimation() {
  return (
    <div className="relative h-[420px] w-full overflow-hidden" aria-hidden>
      <div className="absolute inset-x-8 bottom-8 h-7 rounded-full bg-orange-950/20 blur-md" />
      <svg
        viewBox="0 0 720 460"
        className="absolute inset-0 h-full w-full hero-machine"
      >
        <defs>
          <linearGradient id="machineBody" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
            <stop offset="100%" stopColor="#fff7ed" stopOpacity="0.86" />
          </linearGradient>
          <linearGradient id="machineGlass" x1="0" x2="1">
            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.78" />
            <stop offset="100%" stopColor="#475569" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <g className="hero-machine-float">
          <g className="hero-machine-arm">
            <path
              d="M325 214 L450 112 L484 138 L366 245 Z"
              fill="#fff7ed"
              stroke="#fff"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <path
              d="M467 126 L592 76 L614 100 L493 149 Z"
              fill="#fff7ed"
              stroke="#fff"
              strokeWidth="8"
              strokeLinejoin="round"
            />
            <g className="hero-machine-bucket">
              <path
                d="M601 80 L667 75 L650 128 L604 112 Z"
                fill="#111827"
                stroke="#fff"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path d="M633 122 L641 146 M648 119 L659 141" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
            </g>
          </g>

          <path
            d="M160 268 C185 224 250 206 314 218 L398 235 C428 242 445 264 444 294 L439 337 L138 337 L126 300 C121 283 134 269 160 268 Z"
            fill="url(#machineBody)"
            stroke="#fff"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M270 213 L306 151 L360 160 L389 232 Z"
            fill="url(#machineGlass)"
            stroke="#fff"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M300 162 L321 225 M333 157 L356 231"
            stroke="#fff"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M137 337 H452 C471 337 486 352 486 371 C486 390 471 405 452 405 H137 C118 405 103 390 103 371 C103 352 118 337 137 337 Z"
            fill="#111827"
            stroke="#fff"
            strokeWidth="7"
          />
          <g className="hero-machine-track">
            {Array.from({ length: 11 }).map((_, index) => (
              <rect
                key={index}
                x={126 + index * 30}
                y="352"
                width="22"
                height="38"
                rx="8"
                fill="#374151"
                stroke="#fff"
                strokeWidth="3"
              />
            ))}
          </g>
          <circle cx="178" cy="371" r="28" fill="#f97316" stroke="#fff" strokeWidth="7" />
          <circle cx="411" cy="371" r="28" fill="#f97316" stroke="#fff" strokeWidth="7" />
          <circle cx="178" cy="371" r="10" fill="#111827" />
          <circle cx="411" cy="371" r="10" fill="#111827" />

          <path
            d="M130 272 L62 305 L84 327 L156 296 Z"
            fill="#111827"
            stroke="#fff"
            strokeWidth="7"
            strokeLinejoin="round"
          />
          <path d="M197 245 H250 M207 267 H282" stroke="#f97316" strokeWidth="9" strokeLinecap="round" />
        </g>

        <g className="hero-machine-dust" fill="#fff7ed" opacity="0.75">
          <circle cx="92" cy="392" r="7" />
          <circle cx="65" cy="378" r="5" />
          <circle cx="520" cy="390" r="6" />
          <circle cx="550" cy="374" r="4" />
        </g>
      </svg>
    </div>
  );
}
