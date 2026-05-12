"use client";

import type { ReactNode } from "react";

type AppPreviewFrameProps = {
  children: ReactNode;
  routeLabel: string;
  screenLabel: string;
};

export function AppPreviewFrame({
  children,
  routeLabel,
  screenLabel
}: AppPreviewFrameProps) {
  return (
    <div className="app-preview-page">
      <div className="app-preview-device">
        <div className="app-preview-notch" />
        <div className="app-preview-statusbar">
          <span>9:41</span>
          <div className="app-preview-status-icons" aria-hidden="true">
            <span className="app-preview-signal" />
            <span className="app-preview-wifi" />
            <span className="app-preview-battery" />
          </div>
        </div>
        <div className="app-preview-meta">
          <div>
            <p className="app-preview-eyebrow">Mobile Preview</p>
            <strong>{screenLabel}</strong>
          </div>
          <span>{routeLabel}</span>
        </div>
        <div className="app-preview-viewport">{children}</div>
        <div className="app-preview-home-indicator" aria-hidden="true" />
      </div>
    </div>
  );
}
