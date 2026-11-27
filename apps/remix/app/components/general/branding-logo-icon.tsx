import type { SVGAttributes } from 'react';

import { XTEND_BLUE } from './branding-logo';

export type LogoProps = SVGAttributes<SVGSVGElement>;

// xtend-docs: compact mark for small screens, the blue "X" from the Xtend wordmark.
export const BrandingLogoIcon = ({ ...props }: LogoProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 84 84" role="img" aria-label="Xtend" {...props}>
      <text
        x="42"
        y="72"
        textAnchor="middle"
        fontFamily="Roboto, Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="96"
        fontWeight="900"
        fill={XTEND_BLUE}
      >
        X
      </text>
    </svg>
  );
};
