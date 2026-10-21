import type { ReactNode } from "react";

/** Line icons drawn on a 24-unit grid; they inherit color from the surrounding text. */
function Icon({ children, size = 32 }: { children: ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

type IconProps = { size?: number };

export const ApiIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5M13.5 5l-3 14" />
  </Icon>
);

export const CloudIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M7 18h10.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.3 9.2 4.5 4.5 0 0 0 7 18z" />
  </Icon>
);

export const AutomationIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M20 12a8 8 0 0 1-14.3 4.9M4 12a8 8 0 0 1 14.3-4.9" />
    <path d="M18.5 3v4.2h-4.2M5.5 21v-4.2h4.2" />
  </Icon>
);

export const AnalyticsIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M4 20h16M7 16v-5M12 16V7M17 16v-8" />
  </Icon>
);

export const DocumentIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h4" />
  </Icon>
);

export const ShieldIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z" />
    <path d="M8.5 12l2.5 2.5 4.5-5" />
  </Icon>
);

export const HubIcon = ({ size }: IconProps) => (
  <Icon size={size}>
    <circle cx="12" cy="12" r="3.5" />
    <circle cx="12" cy="3.5" r="1.5" />
    <circle cx="19.5" cy="16.5" r="1.5" />
    <circle cx="4.5" cy="16.5" r="1.5" />
    <path d="M12 8.5V5M15 13.8l3.2 1.9M9 13.8l-3.2 1.9" />
  </Icon>
);

export const ArrowRight = ({ size = 28 }: IconProps) => (
  <Icon size={size}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowDown = ({ size = 28 }: IconProps) => (
  <Icon size={size}>
    <path d="M12 4v15M6 13l6 6 6-6" />
  </Icon>
);

export const CheckIcon = ({ size = 24 }: IconProps) => (
  <Icon size={size}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
