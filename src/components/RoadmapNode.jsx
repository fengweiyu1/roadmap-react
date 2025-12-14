import React from 'react'
import { Handle, Position } from 'reactflow'

const levelColor = {
  low: '#22c55e',
  mid: '#f59e0b',
  high: '#ef4444',
}

function NodeProgressBar({ done = 0, total = 0 }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <div className="rm-pbar">
      <div className="rm-pbarTrack">
        <div className="rm-pbarFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function RoadmapNode({ data }) {
  const dot = levelColor[data?.level]
  const p = data?.progress // {done,total}

  return (
    <div className="rm-node">
      {dot && <span className="rm-dot" style={{ background: dot }} />}
      <div className="rm-label">{data?.label}</div>

      {/* ✅ 图2那种细横条：有进度项才显示 */}
      {p?.total > 0 && <NodeProgressBar done={p.done} total={p.total} />}

      <Handle type="target" position={Position.Top} className="rm-handle" />
      <Handle type="source" position={Position.Bottom} className="rm-handle" />
    </div>
  )
}