// src/components/NodeDrawer.jsx
import React, { useMemo } from 'react'
import './NodeDrawer.css'

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

function ChecklistTable({ nodeId, items = [], checkedMap = {}, onToggleItem }) {
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

  const nodeCheckedMap = progressMap?.[nodeId] || {}

  // ✅ 计算进度：done/total（按 it.id）
  const { done, total } = useMemo(() => {
    const all = [...tutorials, ...problems].filter((it) => !!it?.id)
    const keys = all.map((it) => it.id)
    const total = keys.length
    const done = keys.reduce((acc, k) => acc + (nodeCheckedMap?.[k] ? 1 : 0), 0)
    return { done, total }
  }, [tutorials, problems, nodeCheckedMap])

  return (
    <div className="nd-overlay" onClick={onClose}>
      <aside className="nd-drawer" onClick={(e) => e.stopPropagation()}>
        <button className="nd-close" onClick={onClose} aria-label="close">
          ×
        </button>

        <h1 className="nd-title">{title}</h1>

        <ProgressBar done={done} total={total} />

        <section className="nd-section">
          <h2 className="nd-h2">描述</h2>
          <p className="nd-desc">{desc}</p>
        </section>

        <Divider />

        <section className="nd-section nd-section--tutorial">
          <h2 className="nd-h2">教程</h2>
          {tutorials.length ? (
            <ChecklistTable
              nodeId={nodeId}
              items={tutorials}
              checkedMap={nodeCheckedMap}
              onToggleItem={onToggleItem}
            />
          ) : (
            <div className="nd-empty">暂无教程</div>
          )}
        </section>

        <Divider />

        <section className="nd-section nd-section--problem">
          <h2 className="nd-h2">习题</h2>
          {problems.length ? (
            <ChecklistTable
              nodeId={nodeId}
              items={problems}
              checkedMap={nodeCheckedMap}
              onToggleItem={onToggleItem}
            />
          ) : (
            <div className="nd-empty">暂无习题</div>
          )}
        </section>
      </aside>
    </div>
  )
}