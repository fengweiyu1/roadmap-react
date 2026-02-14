import React, { useMemo, useState } from 'react'

const STAGES_DE = [
  { key: 'stage1', label: '第一阶段', dot: '#52c41a' },
  { key: 'stage2', label: '第二阶段', dot: '#faad14' },
  { key: 'stage3', label: '第三阶段', dot: '#ff4d4f' },
]

const STAGES_US = [
  {
    key: 'stage1',
    stage: 'Stage 1',
    title: 'Foundation',
    subtitle: '基础构建期',
    note: '（不可投岗）',
    dot: '#52c41a',
  },
  {
    key: 'stage2',
    stage: 'Stage 2',
    title: 'Job-Ready DE',
    subtitle: '可投 Data Engineer',
    dot: '#faad14',
  },
  {
    key: 'stage3',
    stage: 'Stage 3',
    title: 'Production DE',
    subtitle: '中级工程师',
    dot: '#ff4d4f',
  },
  {
    key: 'stage4',
    stage: 'Stage 4',
    title: 'Senior / Big Data',
    subtitle: '高级工程师',
    dot: '#b91c1c',
  },
]

export default function StageLegend({ mode = 'de' }) {
  const isUs = mode === 'us'
  const [active, setActive] = useState('stage1')
  const stages = isUs ? STAGES_US : STAGES_DE

  const cardStyle = useMemo(
    () => ({
      width: isUs ? 190 : 200,
      background: isUs
        ? 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
        : '#ffffff',
      borderRadius: isUs ? 16 : 14,
      padding: isUs ? 12 : 14,
      boxShadow: isUs
        ? '0 14px 30px rgba(15,23,42,0.10), 0 2px 10px rgba(15,23,42,0.06)'
        : '0 10px 30px rgba(0,0,0,0.06), 0 2px 10px rgba(0,0,0,0.04)',
      border: isUs ? '1px solid rgba(148,163,184,0.45)' : '1px solid rgba(0,0,0,0.04)',
      backdropFilter: 'blur(6px)',
      userSelect: 'none',
    }),
    [isUs]
  )

  const titleStyle = useMemo(
    () => ({
      fontSize: isUs ? 13 : 14,
      fontWeight: 700,
      color: '#111827',
      letterSpacing: 0.2,
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }),
    [isUs]
  )

  return (
    <div style={cardStyle}>
      {isUs ? (
        <div
          style={{
            height: 4,
            borderRadius: 999,
            background: 'linear-gradient(90deg, #60a5fa 0%, #f59e0b 50%, #22c55e 100%)',
            marginBottom: 8,
          }}
        />
      ) : null}
      <div style={titleStyle}>
        <span>{isUs ? '职业阶段' : '学习阶段'}</span>
        <span style={{ fontSize: isUs ? 11 : 12, fontWeight: 600, color: '#6b7280' }}>
          {isUs ? 'Career Stage' : 'Stage'}
        </span>
      </div>

      <div style={{ display: 'grid', gap: isUs ? 6 : 8 }}>
        {stages.map((s) => {
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
                padding: isUs ? '8px 10px' : '10px 10px',
                display: 'flex',
                alignItems: isUs ? 'flex-start' : 'center',
                gap: isUs ? 8 : 10,
                background: selected
                  ? 'rgba(255,255,255,0.9)'
                  : isUs
                    ? 'rgba(15,23,42,0.03)'
                    : 'transparent',
                border: selected
                  ? `1px solid ${hexToRgba(s.dot, 0.35)}`
                  : isUs
                    ? '1px solid rgba(148,163,184,0.35)'
                    : '1px solid rgba(0,0,0,0.06)',
                borderLeft: isUs ? `3px solid ${hexToRgba(s.dot, selected ? 0.9 : 0.45)}` : 'none',
                boxShadow: selected ? '0 8px 18px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 160ms ease',
              }}
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 999,
                  background: s.dot,
                  boxShadow: `0 0 0 3px ${hexToRgba(s.dot, 0.16)}`,
                  flex: '0 0 auto',
                  marginTop: isUs ? 2 : 0,
                }}
              />

              {isUs ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, lineHeight: 1.15 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: '#6b7280' }}>
                      {s.stage}
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 650, color: '#111827' }}>
                      {s.title}
                    </span>
                  </div>
                  <span style={{ fontSize: 10, color: '#374151' }}>{s.subtitle}</span>
                  {s.note ? (
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>{s.note}</span>
                  ) : null}
                </div>
              ) : (
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 650,
                    color: '#111827',
                  }}
                >
                  {s.label}
                </span>
              )}

              <span style={{ marginLeft: 'auto', color: '#9ca3af', fontSize: 12 }}>
                {selected ? '已选' : ''}
              </span>
            </button>
          )
        })}
      </div>

      {isUs ? (
          <div
            style={{
              marginTop: 8,
              fontSize: 10,
              color: '#64748b',
              lineHeight: 1.35,
              display: 'grid',
              gap: 6,
            }}
          >
            <div>阶段用于区分职业发展阶段，不代表学习难度或顺序。</div>
            <div
              style={{
                padding: '8px 10px',
                borderRadius: 12,
                background: 'linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)',
                border: '1px solid #dbeafe',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.6)',
                display: 'grid',
                gap: 6,
                color: '#0f172a',
              }}
            >
              <div className="stage-contact-blink" style={{ fontSize: 10, fontWeight: 700 }}>
                账号 / 联系
              </div>
              <div
                className="stage-contact-blink"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  fontSize: 11,
                }}
              >
                <span style={{ fontWeight: 600 }}>微信</span>
                <a
                  href="https://www.xiaohongshu.com/user/profile/660196df000000000b00f5fb"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 700 }}
                >
                  qgm226131
                </a>
              </div>
              <div
                className="stage-contact-blink"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  fontSize: 11,
                }}
              >
                <span style={{ fontWeight: 600 }}>小红书</span>
                <a
                  href="https://www.xiaohongshu.com/user/profile/660196df000000000b00f5fb"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 700 }}
                >
                  小万来咯
                </a>
              </div>
              <div
                className="stage-contact-blink"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  padding: '6px 8px',
                  borderRadius: 10,
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  fontSize: 11,
                }}
              >
                <span style={{ fontWeight: 600 }}>YouTube</span>
                <a
                  href="https://www.youtube.com/@%E5%B0%8F%E4%B8%87%E6%9D%A5%E5%92%AFViki"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontWeight: 700 }}
                >
                  小万来了
                </a>
              </div>
            </div>
          </div>
      ) : (
        <div
          style={{
            marginTop: 10,
            fontSize: 12,
            color: '#6b7280',
            lineHeight: 1.3,
            display: 'grid',
            gap: 6,
          }}
        >
          <div>
            注意这个是按照学习阶段来区分，而不是按照难易程度来区分
            绿色代表的是你必须要掌握的内容，其余的你就可以根据自己的程度来自我调整
          </div>
          <div className="stage-contact-blink">
            微信：qgm226131
            <br />
            小红书：
            <a
              href="https://www.xiaohongshu.com/user/profile/660196df000000000b00f5fb"
              target="_blank"
              rel="noreferrer"
              style={{ marginLeft: 4 }}
            >
              小万来咯
            </a>
          </div>
        </div>
      )}
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
