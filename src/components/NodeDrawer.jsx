// src/components/NodeDrawer.jsx
import React, { useMemo } from 'react'
import './NodeDrawer.css'

const LEVEL_COLOR = {
  low: '#22c55e', // green
  mid: '#f59e0b', // amber
  high: '#ef4444', // red
}

function getLevelColor(title = '', nodeLevel) {
  if (title.includes('高级')) return LEVEL_COLOR.high
  if (title.includes('中级')) return LEVEL_COLOR.mid
  if (title.includes('初级')) return LEVEL_COLOR.low
  if (nodeLevel && LEVEL_COLOR[nodeLevel]) return LEVEL_COLOR[nodeLevel]
  return '#9ca3af' // default gray
}

function safeKey(it) {
  // ✅ 只允许稳定 id；不要用 title 兜底（会和后端 item_id 不一致）
  return it?.id
}

function ProgressBar({ done, total }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="nd-progress">
      <div className="nd-progressTop">
        <span className="nd-pill">进度</span>
        <div className="nd-track">
          <div className="nd-fill" style={{ width: `${pct}%` }} />
        </div>
        <div className="nd-count">{done}/{total}</div>
      </div>
    </div>
  )
}

function ChecklistTable({ nodeId, nodeLevel, items = [], checkedMap = {}, onToggleItem }) {
  const scroll = items.length > 5

  return (
    <div className={`nd-tableWrap ${scroll ? 'is-scroll' : ''}`}>
      <table className="nd-table">
        <tbody>
          {items
            .filter((it) => !!it?.id) // ✅ 没有 id 的项直接不显示，避免写入脏数据
            .map((it) => {
              const itemId = safeKey(it) // = it.id
              const checked = !!checkedMap?.[itemId]
              const levelColor = getLevelColor(it?.title, nodeLevel)

              return (
                <tr key={itemId} className={`nd-row ${checked ? 'is-checked' : ''}`}>
                  <td className="nd-td nd-tdCheck">
                    <input
                      className="nd-check"
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        onToggleItem?.({
                          nodeId,
                          itemId,
                          checked: e.target.checked,
                        })
                      }
                    />
                  </td>

                  <td className="nd-td nd-tdTitle">
                    <span className="nd-dot" style={{ background: levelColor }} aria-hidden="true" />
                    <a className="nd-link" href={it.url} target="_blank" rel="noreferrer">
                      {it.title}
                    </a>
                  </td>

                  <td className="nd-td nd-tdGo">
                    <a className="nd-go" href={it.url} target="_blank" rel="noreferrer">
                      ↗
                    </a>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      {scroll ? <div className="nd-fade" aria-hidden="true" /> : null}

      {/* ✅ 如果有 items 但缺 id，给你个提示（开发期很重要） */}
      {items.length > 0 && items.some((it) => !it?.id) ? (
        <div className="nd-empty" style={{ marginTop: 8 }}>
          有部分条目缺少 id（无法记录进度），请给每条 tutorials/problems 补上 id。
        </div>
      ) : null}
    </div>
  )
}

function Divider() {
  return <div className="nd-divider" />
}

export default function NodeDrawer({ node, onClose, progressMap = {}, onToggleItem }) {
  if (!node) return null

  const nodeId = node.id
  const title = node?.data?.label ?? node?.id
  const desc = node?.data?.description ?? '暂无描述'
  const tutorials = node?.data?.tutorials ?? []
  const problems = node?.data?.problems ?? []

  // 仅展示带 id 的条目（避免空行）
  const tutorialsItems = useMemo(() => tutorials.filter((it) => !!it?.id), [tutorials])
  const problemsItems = useMemo(() => problems.filter((it) => !!it?.id), [problems])

  const nodeCheckedMap = progressMap?.[nodeId] || {}

  // ✅ 计算进度：done/total（按 it.id）
  const { done, total } = useMemo(() => {
    const all = [...tutorialsItems, ...problemsItems]
    const keys = all.map((it) => it.id)
    const total = keys.length
    const done = keys.reduce((acc, k) => acc + (nodeCheckedMap?.[k] ? 1 : 0), 0)
    return { done, total }
  }, [tutorialsItems, problemsItems, nodeCheckedMap])

  return (
    <div className="nd-overlay" onClick={onClose}>
      <aside className="nd-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="nd-header">
          <h1 className="nd-title">{title}</h1>
          <button className="nd-close" onClick={onClose} aria-label="close">
            ×
          </button>
        </div>

        <div className="nd-body">
          <ProgressBar done={done} total={total} />

          <section className="nd-section">
            <h2 className="nd-h2">描述</h2>
            <p className="nd-desc">{desc}</p>
          </section>

          <Divider />

          <section className="nd-section nd-section--tutorial">
            <div className="nd-h2Row">
              <h2 className="nd-h2">教程</h2>
              <span className="nd-countBadge">共 {tutorialsItems.length} 条</span>
            </div>
            {tutorialsItems.length ? (
              <ChecklistTable
                nodeId={nodeId}
                nodeLevel={node?.data?.level}
                items={tutorialsItems}
                checkedMap={nodeCheckedMap}
                onToggleItem={onToggleItem}
              />
            ) : (
              <div className="nd-empty">暂无教程</div>
            )}
          </section>

          <Divider />

          <section className="nd-section nd-section--problem">
            <div className="nd-h2Row">
              <h2 className="nd-h2">习题-检测学习成果</h2>
              <span className="nd-countBadge">共 {problemsItems.length} 条</span>
            </div>
            {problemsItems.length ? (
              <ChecklistTable
                nodeId={nodeId}
                nodeLevel={node?.data?.level}
                items={problemsItems}
                checkedMap={nodeCheckedMap}
                onToggleItem={onToggleItem}
              />
            ) : (
              <div className="nd-empty">暂无习题</div>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}
