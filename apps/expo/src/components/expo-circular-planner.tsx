import { useState } from "react";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import {
  createSectorPath,
  getReadableTextColor,
  isCurrentPlan,
  minuteToAngle,
  polarToCartesian
} from "../../../../src/domains/plans/service/planner";
import type { DailyPlan } from "../../../../src/domains/plans/types";

const CANVAS_WIDTH = 296;
const CANVAS_HEIGHT = 328;
const CENTER_X = CANVAS_WIDTH / 2;
const CENTER_Y = 160;
const RADIUS = 105;
const SECTOR_RADIUS = 113;
const CURRENT_SECTOR_RADIUS = 119;
const CURRENT_SECTOR_HALO_RADIUS = 128;
const INACTIVE_SECTOR_OPACITY = 0.72;

type ExpoCircularPlannerProps = {
  currentMinute: number | null;
  plans: DailyPlan[];
};

function formatBadgeLabel(title: string) {
  return title.length <= 8 ? title : `${title.slice(0, 7)}…`;
}

function withAlpha(hexColor: string, alpha: number) {
  const normalized = hexColor.replace("#", "");
  const safeColor =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized.padEnd(6, "0").slice(0, 6);
  const red = Number.parseInt(safeColor.slice(0, 2), 16);
  const green = Number.parseInt(safeColor.slice(2, 4), 16);
  const blue = Number.parseInt(safeColor.slice(4, 6), 16);

  return `rgba(${red},${green},${blue},${alpha})`;
}

function ClockFace() {
  const visibleHours = new Set([0, 3, 6, 9, 12, 15, 18, 21]);

  return (
    <>
      {Array.from({ length: 24 }, (_, hour) => {
        const angle = minuteToAngle(hour * 60);
        const outer = polarToCartesian(angle, RADIUS + 19);
        const inner = polarToCartesian(angle, RADIUS + 6);
        const labelPoint = polarToCartesian(angle, RADIUS + 34);
        const isMajor = visibleHours.has(hour);

        return (
          <G key={hour}>
            <Line
              stroke="rgba(88,90,102,0.22)"
              strokeWidth={isMajor ? 3 : 1.4}
              x1={CENTER_X + inner.x}
              x2={CENTER_X + outer.x}
              y1={CENTER_Y + inner.y}
              y2={CENTER_Y + outer.y}
            />
            {isMajor ? (
              <SvgText
                fill="#6b6d78"
                fontSize={13}
                fontWeight="800"
                textAnchor="middle"
                x={CENTER_X + labelPoint.x}
                y={CENTER_Y + labelPoint.y + 5}
              >
                {String(hour)}
              </SvgText>
            ) : null}
          </G>
        );
      })}

      <G
        transform={`translate(${CENTER_X + 24} ${CENTER_Y - (RADIUS + 36)})`}
      >
        <Circle cx={0} cy={0} fill="#9aa0ad" r={8.5} />
        <Circle cx={-7.2} cy={-6.4} fill="#d4d8e2" r={1.4} />
        <Circle cx={-4.2} cy={-10} fill="#d4d8e2" r={1.1} />
        <Circle cx={-1.9} cy={-5.6} fill="#d4d8e2" r={0.9} />
      </G>

      <G
        transform={`translate(${CENTER_X + 28} ${CENTER_Y + (RADIUS + 38)})`}
      >
        <Circle cx={0} cy={0} fill="#f7b347" r={6} />
        {Array.from({ length: 8 }, (_, index) => {
          const rayAngle = (Math.PI / 4) * index;
          const innerX = Math.cos(rayAngle) * 9.8;
          const innerY = Math.sin(rayAngle) * 9.8;
          const outerX = Math.cos(rayAngle) * 14.4;
          const outerY = Math.sin(rayAngle) * 14.4;

          return (
            <Line
              key={index}
              stroke="#f7b347"
              strokeLinecap="round"
              strokeWidth={1.8}
              x1={innerX}
              x2={outerX}
              y1={innerY}
              y2={outerY}
            />
          );
        })}
      </G>
    </>
  );
}

export function ExpoCircularPlanner({
  currentMinute,
  plans
}: ExpoCircularPlannerProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  function toggleSelectedPlan(planId: string) {
    setSelectedPlanId((current) => (current === planId ? null : planId));
  }

  const planLabels = plans.map((plan) => {
    const current = currentMinute !== null && isCurrentPlan(plan, currentMinute);
    const selected = selectedPlanId === plan.id;
    const labelMinute = plan.startMinute + (plan.endMinute - plan.startMinute) / 2;
    const point = polarToCartesian(
      minuteToAngle(labelMinute),
      current || selected ? CURRENT_SECTOR_RADIUS * 0.58 : SECTOR_RADIUS * 0.56
    );
    const title = selected ? plan.title : formatBadgeLabel(plan.title);
    const width = selected
      ? Math.min(190, Math.max(72, title.length * 9 + 22))
      : Math.min(120, Math.max(44, title.length * 8 + 16));

    return {
      current,
      id: plan.id,
      labelColor: current ? "#ffffff" : getReadableTextColor(plan.color),
      selected,
      pillFill: current ? withAlpha(plan.color, 0.9) : withAlpha(plan.color, 0.18),
      pillStroke:
        current || selected ? withAlpha(plan.color, 0.62) : withAlpha(plan.color, 0.26),
      title,
      width,
      x: CENTER_X + point.x,
      y: CENTER_Y + point.y
    };
  });

  return (
    <Svg
      height={CANVAS_HEIGHT}
      onPress={() => setSelectedPlanId(null)}
      viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      width="100%"
    >
      <Circle
        cx={CENTER_X}
        cy={CENTER_Y}
        fill="rgba(255,255,255,0.96)"
        r={RADIUS - 18}
        stroke="rgba(223,224,229,0.88)"
        strokeWidth={2}
      />

      <ClockFace />

      {plans.map((plan) => {
        const current = currentMinute !== null && isCurrentPlan(plan, currentMinute);
        const selected = selectedPlanId === plan.id;
        const sectorRadius = current || selected ? CURRENT_SECTOR_RADIUS : SECTOR_RADIUS;

        return (
          <G key={plan.id}>
            {current || selected ? (
              <Path
                d={createSectorPath(
                  plan.startMinute,
                  plan.endMinute,
                  CURRENT_SECTOR_HALO_RADIUS,
                  CENTER_X,
                  CENTER_Y
                )}
                fill={withAlpha(plan.color, selected ? 0.28 : 0.18)}
                onPress={() => toggleSelectedPlan(plan.id)}
                opacity={0.96}
              />
            ) : null}
            <Path
              d={createSectorPath(
                plan.startMinute,
                plan.endMinute,
                sectorRadius,
                CENTER_X,
                CENTER_Y
              )}
              fill={plan.color}
              onPress={() => toggleSelectedPlan(plan.id)}
              opacity={current || selected ? 1 : INACTIVE_SECTOR_OPACITY}
              stroke={current || selected ? "#fffaf5" : "rgba(255,255,255,0.38)"}
              strokeLinejoin="round"
              strokeWidth={current || selected ? 6 : 2.5}
            />
          </G>
        );
      })}

      {planLabels.map((label) => (
        <G
          key={`label-${label.id}`}
          onPress={() => toggleSelectedPlan(label.id)}
          transform={`translate(${label.x} ${label.y})`}
        >
          <Rect
            fill={label.selected ? withAlpha("#ffffff", 0.92) : label.pillFill}
            height={label.selected ? 28 : 24}
            rx={label.selected ? 14 : 12}
            stroke={label.pillStroke}
            strokeWidth={label.current || label.selected ? 1.4 : 0.8}
            width={label.width}
            x={-label.width / 2}
            y={label.selected ? -18 : -16}
          />
          <SvgText
            fill={label.selected ? "#22252c" : label.labelColor}
            fontSize={label.selected ? 12 : 11}
            fontWeight="800"
            textAnchor="middle"
            x={0}
            y={0}
          >
            {label.title}
          </SvgText>
        </G>
      ))}

      {currentMinute !== null ? (
        <>
          {(() => {
            const hand = polarToCartesian(minuteToAngle(currentMinute), CURRENT_SECTOR_RADIUS * 0.75);

            return (
              <>
                <Line
                  stroke="rgba(255,255,255,0.6)"
                  strokeLinecap="round"
                  strokeWidth={9}
                  x1={CENTER_X}
                  x2={CENTER_X + hand.x}
                  y1={CENTER_Y}
                  y2={CENTER_Y + hand.y}
                />
                <Line
                  stroke="rgba(32,36,45,0.72)"
                  strokeLinecap="round"
                  strokeWidth={4.5}
                  x1={CENTER_X}
                  x2={CENTER_X + hand.x}
                  y1={CENTER_Y}
                  y2={CENTER_Y + hand.y}
                />
                <Circle
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  fill="rgba(32,36,45,0.9)"
                  r={12}
                  stroke="#ffffff"
                  strokeWidth={4}
                />
              </>
            );
          })()}
        </>
      ) : null}

    </Svg>
  );
}
