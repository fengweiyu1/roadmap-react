import React from 'react'
import { Handle, Position } from 'reactflow'

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

function renderTitleWithAccent(title = '', accent = '') {
  if (!accent || !title.includes(accent)) return title
  const parts = title.split(accent)
  return (
    <>
      {parts.map((part, idx) => (
        <React.Fragment key={`${part}-${idx}`}>
          {part}
          {idx < parts.length - 1 && (
            <span className="milestone-accent">{accent}</span>
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export default function MilestoneNode({ data }) {
  const title = data?.title ?? data?.label ?? ''
  const lines = Array.isArray(data?.lines) ? data.lines : []
  const tone = data?.tone || 'blue'
  const variant = data?.variant || 'solid'
  const pill = data?.pill
  const accent = data?.accent
  const p = data?.progress

  return (
    <div className={`milestone-node milestone-${tone} is-${variant}`}>
      <div className="milestone-title">
        {renderTitleWithAccent(title, accent)}
      </div>

      {pill ? <div className="milestone-pill">{pill}</div> : null}

      {lines.length > 0 ? (
        <ul className="milestone-lines">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      ) : null}

      {p?.total > 0 ? <NodeProgressBar done={p.done} total={p.total} /> : null}

      <Handle type="target" id="top" position={Position.Top} className="rm-handle" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="rm-handle" />
      <Handle type="target" id="left" position={Position.Left} className="rm-handle" />
      <Handle type="source" id="right" position={Position.Right} className="rm-handle" />
    </div>
  )
}
