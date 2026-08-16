import React from "react";

export function XinyxIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Xinyx Design Logo"
    >
      {/* Faceted geometric semiconductor X */}
      <path
        d="M6 8 L16 8 L24 20 L16 32 L6 32 L16 20 Z"
        fill="#005B94"
      />
      <path
        d="M34 8 L24 8 L16 20 L24 32 L34 32 L24 20 Z"
        fill="#0099FF"
      />
      <path
        d="M16 20 L20 14 L24 20 L20 26 Z"
        fill="#00D2FF"
      />
      <circle cx="20" cy="20" r="2" fill="#FFFFFF" />
      {/* IC trace accents */}
      <circle cx="6" cy="8" r="1.5" fill="#005B94" />
      <circle cx="34" cy="8" r="1.5" fill="#0099FF" />
      <circle cx="6" cy="32" r="1.5" fill="#005B94" />
      <circle cx="34" cy="32" r="1.5" fill="#0099FF" />
    </svg>
  );
}

export function XinyxLabsIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Xinyx Labs Logo"
    >
      {/* Hexagonal silicon lab wafer boundary */}
      <path
        d="M20 4 L34 12 L34 28 L20 36 L6 28 L6 12 Z"
        stroke="#0099FF"
        strokeWidth="1.5"
        fill="#0099FF"
        fillOpacity="0.08"
      />
      {/* Stylized X with Lab Beaker / IC core */}
      <path
        d="M12 13 L18 20 L12 27"
        stroke="#005B94"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 13 L22 20 L28 27"
        stroke="#00D2FF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Center Silicon core dot */}
      <circle cx="20" cy="20" r="2.5" fill="#FF8A00" />
      {/* Lab pulse badge */}
      <circle cx="20" cy="10" r="1.5" fill="#00D2FF" />
      <circle cx="20" cy="30" r="1.5" fill="#005B94" />
    </svg>
  );
}

export function ColegioDeMuntinlupaIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Colegio de Muntinlupa Logo"
    >
      {/* Gear teeth outline (Engineering symbol) */}
      <path
        d="M18 4h4l1 3 3 1 2.5-2 3 3-2 2.5 1 3 3 1v4l-3 1-1 3 2 2.5-3 3-2.5-2-3 1-1 3h-4l-1-3-3-1-2.5 2-3-3 2-2.5-1-3-3-1v-4l3-1 1-3-2-2.5 3-3 2.5 2 3-1z"
        fill="#107C41"
      />
      {/* Inner gear circle */}
      <circle cx="20" cy="20" r="12" fill="#F4F3EE" stroke="#A81C1C" strokeWidth="1.5" />
      {/* CdM Building tower & torch flame */}
      <path
        d="M17 26 L17 19 L20 16 L23 19 L23 26 Z"
        fill="#0D0D10"
      />
      {/* Flaming torch / Wisdom spark */}
      <path
        d="M20 11 C18.5 13 18.5 15 20 16 C21.5 15 21.5 13 20 11 Z"
        fill="#E8D90C"
      />
      {/* Tech / Electronics atom orbital */}
      <ellipse
        cx="20"
        cy="21"
        rx="7"
        ry="2.5"
        stroke="#A81C1C"
        strokeWidth="1"
        strokeDasharray="2 1"
      />
    </svg>
  );
}

export function FehuviaIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Fehuvia Logo"
    >
      {/* Morph L2 isometric vault / treasury block */}
      <path
        d="M20 6 L33 13.5 L20 21 L7 13.5 Z"
        fill="#E8D90C"
      />
      <path
        d="M7 15 L20 22.5 L20 34 L7 26.5 Z"
        fill="#17171B"
      />
      <path
        d="M33 15 L20 22.5 L20 34 L33 26.5 Z"
        fill="#3A3A42"
      />
      <circle cx="20" cy="13.5" r="2" fill="#0D0D10" />
    </svg>
  );
}

export function AerovitIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="AeroVit Logo"
    >
      {/* Smartwatch circular bezel */}
      <circle cx="20" cy="20" r="14" stroke="#0D0D10" strokeWidth="2.5" />
      {/* Pulse ECG waveform */}
      <path
        d="M10 20 L15 20 L17 14 L20 26 L23 16 L25 20 L30 20"
        stroke="#E8D90C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Top and bottom watch lugs */}
      <rect x="16" y="3" width="8" height="3" rx="1" fill="#0D0D10" />
      <rect x="16" y="34" width="8" height="3" rx="1" fill="#0D0D10" />
    </svg>
  );
}

export function VariousClientsIcon({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Freelance Clients Logo"
    >
      {/* Terminal prompt / network grid box */}
      <rect x="6" y="8" width="28" height="24" rx="4" fill="#0D0D10" />
      <path
        d="M12 17 L17 20 L12 23"
        stroke="#E8D90C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="19" y1="23" x2="25" y2="23" stroke="#F4F3EE" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
