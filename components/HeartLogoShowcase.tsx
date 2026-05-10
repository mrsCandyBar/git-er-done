"use client";
import React from "react";
import { Logo } from "./Logo";

export default function HeartLogoShowcase() {
  return (
    <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
      <div>
        <Logo version="brioh-card" alt="Brioh Card Logo" style={{ width: 64, height: 64 }} />
      </div>
      <div>
        <Logo version="brioh-heart" alt="Brioh Heart Logo" style={{ width: 64, height: 64 }} />
      </div>
      <div>
        <Logo version="brioh-star" alt="Brioh Star Logo" style={{ width: 64, height: 64 }} />
      </div>
    </div>
  );
}
