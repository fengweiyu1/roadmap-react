// src/components/RoadmapNode.jsx
import React from 'react'
import { Handle, Position } from 'reactflow'

const levelColor = {
  low: '#22c55e',
  mid: '#f59e0b',
  high: '#ef4444',
}

export default function RoadmapNode({ data }) {
  const dot = levelColor[data?.level]

  return (
    <div className="rm-node">
      {dot && <span className="rm-dot" style={{ background: dot }} />}
      <div className="rm-label">{data?.label}</div>

      <Handle type="target" position={Position.Top} className="rm-handle" />
      <Handle type="source" position={Position.Bottom} className="rm-handle" />
    </div>
  )
}