import type { SVGAttributes } from 'react';

export type LogoProps = SVGAttributes<SVGSVGElement>;

// xtend-docs: Xtend wordmark (matches business.xtend.co: heavy Roboto, blue "X").
// textLength pins the width so the wordmark fits the viewBox whichever fallback font renders it.
export const XTEND_BLUE = '#3BADF7';

export const BrandingLogo = ({ ...props }: LogoProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 100" role="img" aria-label="Xtend" {...props}>
      <text
        x="0"
        y="84"
        textLength="338"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="Roboto, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="112"
        fontWeight="900"
        fill="currentColor"
      >
        <tspan fill={XTEND_BLUE}>X</tspan>TEND
      </text>
    </svg>
  );
};
