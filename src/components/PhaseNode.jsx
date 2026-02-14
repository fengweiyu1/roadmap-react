import React from 'react'
import { Handle, Position } from 'reactflow'

export default function PhaseNode({ data }) {
  const lines = Array.isArray(data?.lines)
    ? data.lines
    : [data?.label].filter(Boolean)
  const tone = data?.tone || 'blue'

  return (
    <div className={`phase-node phase-${tone}`}>
      <div className="phase-text">
        {lines.map((line, idx) => (
          <div key={`${line}-${idx}`}>{line}</div>
        ))}
      </div>

      <Handle type="target" id="top" position={Position.Top} className="rm-handle" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="rm-handle" />
      <Handle type="target" id="left" position={Position.Left} className="rm-handle" />
      <Handle type="source" id="right" position={Position.Right} className="rm-handle" />
    </div>
  )
}
