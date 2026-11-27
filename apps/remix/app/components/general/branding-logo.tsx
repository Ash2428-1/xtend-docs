import type { SVGAttributes } from 'react';

export type LogoProps = SVGAttributes<SVGSVGElement> & {
  /** "full" adds the "WE UNDERSTAND MOBILITY" tagline, as on business.xtend.co. */
  variant?: 'wordmark' | 'full';
};

export const XTEND_BLUE = '#3BADF7';

const FONT_FAMILY = "Roboto, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif";

// xtend-docs: Xtend logo, measured from business.xtend.co (1 unit = 1px there).
// textLength pins each line's width so the layout holds whichever fallback font renders it.
export const BrandingLogo = ({ variant = 'wordmark', ...props }: LogoProps) => {
  if (variant === 'full') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 188 43" role="img" aria-label="Xtend" {...props}>
        <text
          x="0"
          y="20.5"
          textLength="78.8"
          lengthAdjust="spacingAndGlyphs"
          fontFamily={FONT_FAMILY}
          fontSize="24"
          fontWeight="900"
          fill="currentColor"
        >
          <tspan fill={XTEND_BLUE}>X</tspan>TEND
        </text>
        <text
          x="0"
          y="38.5"
          textLength="184.7"
          lengthAdjust="spacing"
          fontFamily={FONT_FAMILY}
          fontSize="10.5"
          fontWeight="400"
          letterSpacing="2.4"
          fill="currentColor"
          fillOpacity="0.6"
        >
          WE UNDERSTAND MOBILITY
        </text>
      </svg>
    );
  }

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 24" role="img" aria-label="Xtend" {...props}>
      <text
        x="0"
        y="20.5"
        textLength="78.8"
        lengthAdjust="spacingAndGlyphs"
        fontFamily={FONT_FAMILY}
        fontSize="24"
        fontWeight="900"
        fill="currentColor"
      >
        <tspan fill={XTEND_BLUE}>X</tspan>TEND
      </text>
    </svg>
  );
};
