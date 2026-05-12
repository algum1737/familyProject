import {
  createSectorPath,
  formatSectorLabel,
  getReadableTextColor,
  getSectorLabelFontSize,
  getSectorLabelRotation,
  isCurrentPlan,
  minuteToAngle,
  polarToCartesian
} from "@/domains/plans/service/planner";
import type { DailyPlan } from "@/domains/plans/types";

const CENTER = 170;
const RADIUS = 126;
const SECTOR_RADIUS = 132;
const CURRENT_SECTOR_RADIUS = 138;
const CURRENT_SECTOR_HALO_RADIUS = 146;
const INACTIVE_SECTOR_OPACITY = 0.42;

type AppCircularPlannerProps = {
  currentMinute: number | null;
  currentPlanTitle: string | null;
  plans: DailyPlan[];
};

function ClockFace() {
  const ticks = Array.from({ length: 24 }, (_, index) => index);
  const visibleHours = new Set([0, 3, 6, 9, 12, 15, 18, 21]);

  return (
    <>
      {ticks.map((hour) => {
        const angle = minuteToAngle(hour * 60);
        const outer = polarToCartesian(angle, RADIUS + 17);
        const inner = polarToCartesian(angle, RADIUS + 6);
        const labelPoint = polarToCartesian(angle, RADIUS + 34);
        const isMajorHour = visibleHours.has(hour);

        return (
          <g key={hour}>
            <line
              x1={CENTER + inner.x}
              y1={CENTER + inner.y}
              x2={CENTER + outer.x}
              y2={CENTER + outer.y}
              stroke="rgba(88, 90, 102, 0.18)"
              strokeWidth={isMajorHour ? 2.3 : 1.1}
            />
            {isMajorHour ? (
              <text
                x={CENTER + labelPoint.x}
                y={CENTER + labelPoint.y}
                className="app-circular-hour"
                dominantBaseline="middle"
                textAnchor="middle"
              >
                {hour}
              </text>
            ) : null}
          </g>
        );
      })}
    </>
  );
}

function PlanSegment({
  currentMinute,
  plan
}: {
  currentMinute: number;
  plan: DailyPlan;
}) {
  const current = isCurrentPlan(plan, currentMinute);
  const labelMinute = plan.startMinute + (plan.endMinute - plan.startMinute) / 2;
  const sectorRadius = current ? CURRENT_SECTOR_RADIUS : SECTOR_RADIUS;
  const labelPoint = polarToCartesian(minuteToAngle(labelMinute), sectorRadius * 0.63);
  const fontSize = getSectorLabelFontSize(plan);
  const label = formatSectorLabel(plan);
  const rotation = getSectorLabelRotation(labelMinute);

  return (
    <>
      {current ? (
        <path
          d={createSectorPath(
            plan.startMinute,
            plan.endMinute,
            CURRENT_SECTOR_HALO_RADIUS,
            CENTER,
            CENTER
          )}
          fill="#fff3ea"
          opacity="0.96"
        />
      ) : null}
      <path
        d={createSectorPath(plan.startMinute, plan.endMinute, sectorRadius, CENTER, CENTER)}
        fill={plan.color}
        opacity={current ? 1 : INACTIVE_SECTOR_OPACITY}
        stroke={current ? "#fffaf5" : "rgba(255,255,255,0.38)"}
        strokeLinejoin="round"
        strokeWidth={current ? 5 : 2}
      />
      <text
        x={CENTER + labelPoint.x}
        y={CENTER + labelPoint.y}
        className={current ? "app-circular-label app-circular-label-current" : "app-circular-label"}
        dominantBaseline="middle"
        fill={current ? "#ffffff" : getReadableTextColor(plan.color)}
        fontSize={fontSize}
        textAnchor="middle"
        transform={`rotate(${rotation} ${CENTER + labelPoint.x} ${CENTER + labelPoint.y})`}
      >
        {label}
      </text>
    </>
  );
}

function CurrentHand({ currentMinute }: { currentMinute: number }) {
  const hand = polarToCartesian(minuteToAngle(currentMinute), CURRENT_SECTOR_RADIUS * 0.78);

  return (
    <>
      <line
        x1={CENTER}
        y1={CENTER}
        x2={CENTER + hand.x}
        y2={CENTER + hand.y}
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="9"
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        fill="#ffffff"
        r="14"
        stroke="rgba(196, 197, 206, 0.85)"
        strokeWidth="4"
      />
    </>
  );
}

export function AppCircularPlanner({
  currentMinute,
  currentPlanTitle,
  plans
}: AppCircularPlannerProps) {
  return (
    <div className="app-circular-wrap">
      <svg
        aria-label="today-circular-planner"
        className="app-circular-svg"
        viewBox="0 0 340 340"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          fill="rgba(255,255,255,0.94)"
          r={RADIUS - 18}
          stroke="rgba(223, 224, 229, 0.72)"
          strokeWidth="1.5"
        />
        <ClockFace />
        {plans.map((plan) => (
          <PlanSegment
            currentMinute={currentMinute ?? -1}
            key={plan.id}
            plan={plan}
          />
        ))}
        {currentMinute !== null ? <CurrentHand currentMinute={currentMinute} /> : null}
        <text
          x={CENTER}
          y={CENTER - 10}
          className="app-circular-center-label"
          textAnchor="middle"
        >
          {currentMinute === null ? "시간 동기화 중" : "현재 맥락"}
        </text>
        <text
          x={CENTER}
          y={CENTER + 18}
          className="app-circular-center-title"
          textAnchor="middle"
        >
          {currentPlanTitle ?? "비어 있음"}
        </text>
      </svg>
      <div className="app-circular-legend">
        <span>원형 보드는 앱에서도 오늘의 시간 맥락을 한눈에 보여주는 핵심 표현으로 유지합니다.</span>
      </div>
    </div>
  );
}
