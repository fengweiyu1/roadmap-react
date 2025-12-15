import React, { useMemo, useState } from 'react'

const STAGES = [
  { key: 'stage1', label: '第一阶段', dot: '#52c41a' },
  { key: 'stage2', label: '第二阶段', dot: '#faad14' },
  { key: 'stage3', label: '第三阶段', dot: '#ff4d4f' },
]

export default function StageLegend() {
  const [active, setActive] = useState('stage1')

  const cardStyle = useMemo(
    () => ({
      width: 200,
      background: '#ffffff',
      borderRadius: 14,
      padding: 14,
      boxShadow: '0 10px 30px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04)',
      border: '1px solid rgba(0,0,0,0.04)',
      backdropFilter: 'blur(6px)',
      userSelect: 'none',
    }),
    []
  )

  const titleStyle = useMemo(
    () => ({
      fontSize: 14,
      fontWeight: 700,
      color: '#111827',
      letterSpacing: 0.2,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }),
    []
  )

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>
        <span>学习阶段</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>
          Stage
        </span>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {STAGES.map((s) => {
          const selected = active === s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setActive(s.key)}
              style={{
                all: 'unset',
                cursor: 'pointer',
                borderRadius: 12,
                padding: '10px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                background: selected ? 'rgba(59,130,246,0.08)' : 'transparent',
                border: selected
                  ? '1px solid rgba(59,130,246,0.25)'
                  : '1px solid rgba(0,0,0,0.06)',
                boxShadow: selected ? '0 6px 16px rgba(59,130,246,0.10)' : 'none',
                transition: 'all 160ms ease',
              }}
            >
              {/* dot */}
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: s.dot,
                  boxShadow: `0 0 0 4px ${hexToRgba(s.dot, 0.16)}`,
                  flex: '0 0 auto',
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 650,
                  color: '#111827',
                }}
              >
                {s.label}
              </span>

              <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 12 }}>
                {selected ? '已选' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {/* 可选：小提示（想更干净就删掉这一段） */}
      <div
        style={{
          marginTop: 10,
          fontSize: 12,
          color: '#6b7280',
          lineHeight: 1.3,
        }}
      >
        注意这个是按照学习阶段来区分，而不是按照难易程度来区分
        绿色代表的是你必须要掌握的内容，其余的你就可以根据自己的程度来自我调整
      </div>
    </div>
  )
}

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}