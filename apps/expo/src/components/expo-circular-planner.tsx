import { useState } from "react";
import { View } from "react-native";
import Svg, { Circle, G, Line, Path, Rect, Text as SvgText } from "react-native-svg";

import { normalizePlanColor } from "../../../../src/domains/plans/service/plan-color";
import {
  createSectorPath,
  getReadableTextColor,
  isCurrentPlan,
  minuteToAngle,
  polarToCartesian
} from "../../../../src/domains/plans/service/planner";
import type { DailyPlan } from "../../../../src/domains/plans/types";
import {
  EXPO_CIRCULAR_PLANNER_CANVAS,
  formatExpoCircularBadgeLabel,
  getExpoCircularPlannerCanvas,
  getExpoCircularPlannerCenterLabel,
  getExpoCircularPlannerCenterTitle,
  getExpoCircularPlannerLabelRadius,
  getExpoCircularPlannerLabelWidth
} from "./expo-circular-planner-layout";
const INACTIVE_SECTOR_OPACITY = 0.72;

type ExpoCircularPlannerProps = {
  currentMinute: number | null;
  currentPlanTitle: string | null;
  plans: DailyPlan[];
};

function withAlpha(hexColor: string, alpha: number) {
  const normalized = normalizePlanColor(hexColor).replace("#", "");
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

function ClockFace({
  centerX,
  centerY,
  radius
}: {
  centerX: number;
  centerY: number;
  radius: number;
}) {
  const visibleHours = new Set([0, 3, 6, 9, 12, 15, 18, 21]);

  return (
    <>
      {Array.from({ length: 24 }, (_, hour) => {
        const angle = minuteToAngle(hour * 60);
        const outer = polarToCartesian(angle, radius + 19);
        const inner = polarToCartesian(angle, radius + 6);
        const labelPoint = polarToCartesian(angle, radius + 34);
        const isMajor = visibleHours.has(hour);

        return (
          <G key={hour}>
            <Line
              stroke="rgba(88,90,102,0.22)"
              strokeWidth={isMajor ? 3 : 1.4}
              x1={centerX + inner.x}
              x2={centerX + outer.x}
              y1={centerY + inner.y}
              y2={centerY + outer.y}
            />
            {isMajor ? (
              <SvgText
                fill="#6b6d78"
                fontSize={13}
                fontWeight="800"
                textAnchor="middle"
                x={centerX + labelPoint.x}
                y={centerY + labelPoint.y + 5}
              >
                {String(hour)}
              </SvgText>
            ) : null}
          </G>
        );
      })}

      <G
        transform={`translate(${centerX + 24} ${centerY - (radius + 36)})`}
      >
        <Circle cx={0} cy={0} fill="#9aa0ad" r={8.5} />
        <Circle cx={-7.2} cy={-6.4} fill="#d4d8e2" r={1.4} />
        <Circle cx={-4.2} cy={-10} fill="#d4d8e2" r={1.1} />
        <Circle cx={-1.9} cy={-5.6} fill="#d4d8e2" r={0.9} />
      </G>

      <G
        transform={`translate(${centerX + 28} ${centerY + (radius + 38)})`}
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
  currentPlanTitle,
  plans
}: ExpoCircularPlannerProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const canvas = getExpoCircularPlannerCanvas(containerWidth ?? EXPO_CIRCULAR_PLANNER_CANVAS.width);
  const centerX = canvas.centerX;
  const centerY = canvas.centerY;
  const radius = canvas.radius;
  const sectorRadius = canvas.sectorRadius;
  const currentSectorRadius = canvas.currentSectorRadius;
  const currentSectorHaloRadius = canvas.currentSectorHaloRadius;

  function toggleSelectedPlan(planId: string) {
    setSelectedPlanId((current) => (current === planId ? null : planId));
  }

  const planLabels = plans.map((plan) => {
    const planColor = normalizePlanColor(plan.color);
    const current = currentMinute !== null && isCurrentPlan(plan, currentMinute);
    const selected = selectedPlanId === plan.id;
    const labelMinute = plan.startMinute + (plan.endMinute - plan.startMinute) / 2;
    const labelRadius = getExpoCircularPlannerLabelRadius(canvas, current || selected);
    const point = polarToCartesian(
      minuteToAngle(labelMinute),
      labelRadius
    );
    const title = selected ? plan.title : formatExpoCircularBadgeLabel(plan.title);
    const width = getExpoCircularPlannerLabelWidth(title, selected);

    return {
      current,
      id: plan.id,
      labelColor: current ? "#ffffff" : getReadableTextColor(planColor),
      selected,
      pillFill: current ? withAlpha(planColor, 0.9) : withAlpha(planColor, 0.18),
      pillStroke:
        current || selected ? withAlpha(planColor, 0.62) : withAlpha(planColor, 0.26),
      title,
      width,
      x: centerX + point.x,
      y: centerY + point.y
    };
  });

  return (
    <View
      onLayout={(event) => {
        const nextWidth = event.nativeEvent.layout.width;

        if (nextWidth > 0 && Math.abs(nextWidth - (containerWidth ?? 0)) > 1) {
          setContainerWidth(nextWidth);
        }
      }}
      style={{ width: "100%" }}
    >
      <Svg
        height={canvas.height}
        onPress={() => setSelectedPlanId(null)}
        viewBox={`0 0 ${canvas.width} ${canvas.height}`}
        width="100%"
      >
        <Circle
          cx={centerX}
          cy={centerY}
          fill="rgba(255,255,255,0.96)"
          r={canvas.innerDiscRadius}
          stroke="rgba(223,224,229,0.88)"
          strokeWidth={2}
        />

        <ClockFace centerX={centerX} centerY={centerY} radius={radius} />

        {plans.map((plan) => {
          const planColor = normalizePlanColor(plan.color);
          const current = currentMinute !== null && isCurrentPlan(plan, currentMinute);
          const selected = selectedPlanId === plan.id;
          const planSectorRadius = current || selected ? currentSectorRadius : sectorRadius;

          return (
            <G key={plan.id}>
              {current || selected ? (
                <Path
                  d={createSectorPath(
                    plan.startMinute,
                    plan.endMinute,
                    currentSectorHaloRadius,
                    centerX,
                    centerY
                  )}
                  fill={withAlpha(planColor, selected ? 0.28 : 0.18)}
                  onPress={() => toggleSelectedPlan(plan.id)}
                  opacity={0.96}
                />
              ) : null}
              <Path
                d={createSectorPath(
                  plan.startMinute,
                  plan.endMinute,
                  planSectorRadius,
                  centerX,
                  centerY
                )}
                fill={planColor}
                onPress={() => toggleSelectedPlan(plan.id)}
                opacity={current || selected ? 1 : INACTIVE_SECTOR_OPACITY}
                stroke={current || selected ? "#fffaf5" : "rgba(255,255,255,0.38)"}
                strokeLinejoin="round"
                strokeWidth={current || selected ? 6 : 2.5}
              />
            </G>
          );
        })}

        {currentMinute !== null
          ? (() => {
              const hand = polarToCartesian(
                minuteToAngle(currentMinute),
                currentSectorRadius * 0.75
              );

              return (
                <>
                  <Line
                    stroke="rgba(255,255,255,0.6)"
                    strokeLinecap="round"
                    strokeWidth={9}
                    x1={centerX}
                    x2={centerX + hand.x}
                    y1={centerY}
                    y2={centerY + hand.y}
                  />
                <Line
                  stroke="rgba(32,36,45,0.72)"
                  strokeLinecap="round"
                  strokeWidth={4.5}
                  x1={centerX}
                    x2={centerX + hand.x}
                  y1={centerY}
                  y2={centerY + hand.y}
                />
                <Circle
                  cx={centerX}
                  cy={centerY}
                  fill="rgba(32,36,45,0.9)"
                  r={11}
                  stroke="#ffffff"
                  strokeWidth={3.5}
                />
                </>
              );
            })()
          : null}

        {planLabels.map((label) => (
          <G
            key={`label-${label.id}`}
            onPress={() => toggleSelectedPlan(label.id)}
            transform={`translate(${label.x} ${label.y})`}
          >
            <Rect
              fill={label.selected ? withAlpha("#ffffff", 0.92) : label.pillFill}
              height={label.selected ? 28 : 22}
              rx={label.selected ? 14 : 11}
              stroke={label.pillStroke}
              strokeWidth={label.current || label.selected ? 1.4 : 0.8}
              width={label.width}
              x={-label.width / 2}
              y={label.selected ? -18 : -15}
            />
            <SvgText
              fill={label.selected ? "#22252c" : label.labelColor}
              fontSize={label.selected ? 12 : 10}
              fontWeight="800"
              textAnchor="middle"
              x={0}
              y={0}
            >
              {label.title}
            </SvgText>
          </G>
        ))}

        <SvgText
          fill="#8a8e98"
          fontSize={12}
          fontWeight="800"
          textAnchor="middle"
          x={centerX}
          y={centerY - 18}
        >
          {getExpoCircularPlannerCenterLabel(currentMinute)}
        </SvgText>
        <SvgText
          fill="#22252c"
          fontSize={16}
          fontWeight="900"
          textAnchor="middle"
          x={centerX}
          y={centerY + 14}
        >
          {getExpoCircularPlannerCenterTitle(currentPlanTitle)}
        </SvgText>
      </Svg>
    </View>
  );
}
