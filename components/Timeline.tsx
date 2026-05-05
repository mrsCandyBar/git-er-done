import React from "react";
import moment from "moment";

const moodEmojis: Record<string, string> = {
  love: "😍",
  happy: "😊",
  "not-sure": "🤔",
  confused: "😕",
  "not-for-me": "😑",
};

export function Timeline({ tasks }: { tasks: any[] }) {
  if (!tasks || tasks.length < 2) return null;
  // Sort tasks by createdDate ascending
  const sorted = [...tasks].sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const start = new Date(first.createdDate).getTime();
  const end = last.completed?.completedDate ? new Date(last.completed.completedDate).getTime() : new Date(last.createdDate).getTime();
  const totalSpan = end - start || 1;

  // Only show tasks that are completed and have a mood
  const milestones = sorted.filter(t => t.completed?.completedDate && t.completed?.mood);

  return (
    <div style={{ position: "relative", height: 80, width: "100%", padding: "2rem 0" }}>
      {/* Timeline bar */}
      <div style={{ position: "absolute", top: 40, left: 0, right: 0, height: 6, background: "#e0e0e0", borderRadius: 3 }} />
      {/* Pins */}
      {milestones.map((task: any, idx: number) => {
        const pinTime = new Date(task.completed.completedDate).getTime();
        const percent = ((pinTime - start) / totalSpan) * 100;
        const emoji = moodEmojis[task.completed.mood] || "❓";
        return (
          <div key={task._id} style={{
            position: "absolute",
            left: `calc(${percent}% - 16px)`,
            top: 10,
            width: 32,
            height: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 2,
          }}>
            <span style={{ fontSize: 28, background: "#fff", borderRadius: "50%", border: "2px solid #bbb", padding: 2 }}>{emoji}</span>
            <span style={{ fontSize: 10, marginTop: 2 }}>{moment(task.completed.completedDate).format("MMM D")}</span>
          </div>
        );
      })}
      {/* Start label */}
      <div style={{ position: "absolute", left: 0, top: 60, fontSize: 12, color: "#888" }}>
        {moment(first.createdDate).format("MMM D, YYYY")}
      </div>
      {/* End label */}
      <div style={{ position: "absolute", right: 0, top: 60, fontSize: 12, color: "#888", textAlign: "right" }}>
        {moment(end).format("MMM D, YYYY")}
      </div>
    </div>
  );
}
