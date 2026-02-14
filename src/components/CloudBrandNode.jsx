import React from 'react'
import { Handle, Position } from 'reactflow'
import snowflakeLogo from '../assets/brands/snowflake-logo.svg'
import databricksLogo from '../assets/brands/databricks-logo-black.png'
import dbtLogo from '../assets/brands/dbt-logo.svg'

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

function AwsMark() {
  return (
    <div className="cloud-aws-mark">
      <span className="cloud-aws-text">aws</span>
      <span className="cloud-aws-smile" aria-hidden="true" />
    </div>
  )
}

export default function CloudBrandNode({ data }) {
  const brand = data?.brand || 'aws'
  const label = data?.label || brand
  const showSep = data?.showSep
  const p = data?.progress

  return (
    <div
      className={`cloud-brand-node cloud-brand-node--${brand} ${showSep ? 'has-sep' : ''}`}
    >
      <div className="cloud-brand-node__inner">
        {brand === 'aws' ? <AwsMark /> : null}
        {brand === 'snowflake' ? (
          <img className="cloud-logo cloud-logo--snowflake" src={snowflakeLogo} alt="snowflake" />
        ) : null}
        {brand === 'databricks' ? (
          <img className="cloud-logo cloud-logo--databricks" src={databricksLogo} alt="databricks" />
        ) : null}
        {brand === 'dbt' ? (
          <img className="cloud-logo cloud-logo--dbt" src={dbtLogo} alt="dbt" />
        ) : null}
        {brand === 'aws' ? null : (
          <span className="cloud-brand-node__text cloud-brand-node__text--hidden">
            {label}
          </span>
        )}
      </div>

      {p?.total > 0 ? <NodeProgressBar done={p.done} total={p.total} /> : null}

      <Handle type="target" position={Position.Top} className="rm-handle" />
      <Handle type="source" position={Position.Bottom} className="rm-handle" />
    </div>
  )
}
