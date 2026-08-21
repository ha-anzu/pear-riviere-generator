import { useId } from "react";
import {
  DEFAULT_PEAR_RATIO,
  METAL_COLOR,
  defaultMetalColor,
  type Metal,
  type MetalColor,
} from "@/lib/necklace/engine";
import {
  DEFAULT_GEM_COLOR,
  GEM_COLORS,
  type GemColorKey,
} from "@/lib/necklace/gem-colors";

const PEAR_PATH =
  "M 0 -1 C .10 -.77 .46 -.43 .58 .02 C .76 .70 .37 1 0 1 C -.37 1 -.76 .70 -.58 .02 C -.46 -.43 -.10 -.77 0 -1 Z";
/** Native path is tip-up: full height 2, max width ~1.52. */
const PATH_HALF_W = 0.76;
const PATH_HALF_H = 1;

/** Real pear silhouette. The point is up until its caller applies orientation. */
export function PearMark({
  r,
  metal,
  metalColor,
  gemColor = DEFAULT_GEM_COLOR,
  aspectRatio = DEFAULT_PEAR_RATIO,
  selected = false,
  callout = null,
  showProngs = true,
}: {
  r: number;
  metal: Metal;
  metalColor?: MetalColor;
  gemColor?: GemColorKey;
  aspectRatio?: number;
  selected?: boolean;
  callout?: "lock" | "conv" | null;
  showProngs?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  const paint = METAL_COLOR[metalColor ?? defaultMetalColor(metal)];
  const fillId = `${uid}-pear`;
  const ratio = Math.max(1.2, aspectRatio);
  const scaleX = r / PATH_HALF_W;
  const scaleY = (r * ratio) / PATH_HALF_H;
  const simple = r < 2.5;
  const gem = GEM_COLORS[gemColor];

  return (
    <g>
      <defs>
        <radialGradient id={fillId} cx="36%" cy="34%" r="72%">
          <stop offset="0%" stopColor={gem.light} />
          <stop offset="38%" stopColor={gem.fill} />
          <stop offset="72%" stopColor={gem.fill} />
          <stop offset="100%" stopColor={gem.edge} />
        </radialGradient>
      </defs>
      <g transform={`scale(${scaleX.toFixed(3)} ${scaleY.toFixed(3)})`}>
        {(selected || callout) && (
          <path
            d={PEAR_PATH}
            transform="scale(1.58)"
            fill="none"
            stroke={
              callout === "lock"
                ? "var(--color-gold)"
                : callout === "conv"
                  ? "var(--color-silver)"
                  : "var(--color-primary)"
            }
            strokeWidth={0.055}
            vectorEffect="non-scaling-stroke"
            opacity={0.9}
          />
        )}
        <path
          d={PEAR_PATH}
          transform="scale(1.08)"
          fill={paint.fill}
          stroke={paint.dark}
          strokeWidth={0.04}
          vectorEffect="non-scaling-stroke"
        />
        <path d={PEAR_PATH} fill={`url(#${fillId})`} />
        {!simple && (
          <>
            <path
              d="M 0 -.79 L .22 -.18 L .36 .48 L 0 .73 L -.36 .48 L -.22 -.18 Z"
              fill={gem.light}
              opacity={0.44}
              stroke={gem.edge}
              strokeWidth={0.025}
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 0 -.79 L .48 .08 M 0 -.79 L -.48 .08 M .22 -.18 L .58 .24 M -.22 -.18 L -.58 .24 M .36 .48 L .48 .73 M -.36 .48 L -.48 .73 M 0 .73 L 0 1"
              fill="none"
              stroke={gem.edge}
              strokeWidth={0.026}
              vectorEffect="non-scaling-stroke"
              opacity={0.82}
            />
            <path
              d="M -.28 -.08 C -.12 -.35 .08 -.47 .24 -.30"
              fill="none"
              stroke={gem.light}
              strokeWidth={0.11}
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              opacity={0.48}
            />
          </>
        )}
        {showProngs && (
          <>
            <circle cx="0" cy="-.99" r=".12" fill={paint.light} stroke={paint.dark} strokeWidth=".025" />
            <circle cx="-.53" cy=".57" r=".12" fill={paint.light} stroke={paint.dark} strokeWidth=".025" />
            <circle cx=".53" cy=".57" r=".12" fill={paint.light} stroke={paint.dark} strokeWidth=".025" />
          </>
        )}
      </g>
    </g>
  );
}

export const DiamondMark = PearMark;

export function VelvetPad() {
  const uid = useId().replace(/:/g, "");
  const id = `${uid}-velvet`;
  return (
    <>
      <defs>
        <radialGradient id={id} cx="50%" cy="48%" r="58%">
          <stop offset="0%" stopColor="var(--color-muted)" />
          <stop offset="70%" stopColor="var(--color-velvet)" />
          <stop offset="100%" stopColor="var(--color-background)" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} rx={8} />
    </>
  );
}

export { METAL_COLOR as METAL_PAINT };
