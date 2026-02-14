import React from 'react'
import { Handle, Position } from 'reactflow'

export default function CloudPlatformNode({ data }) {
  return (
    <div className="cloud-platform">
      <div className="cloud-platform__header">{data?.label || 'Cloud Platform'}</div>
      <div className="cloud-platform__body" />

      <Handle type="target" position={Position.Top} className="rm-handle" />
      <Handle type="source" position={Position.Bottom} className="rm-handle" />
    </div>
  )
}
