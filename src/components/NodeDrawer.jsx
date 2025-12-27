// // src/components/NodeDrawer.jsx
// // import React, { useMemo } from 'react'
// import React, { useMemo, useState } from 'react'
// import './NodeDrawer.css'

// // const [activeTab, setActiveTab] = React.useState('problems')
// // const [activeTab, setActiveTab] = useState('problems')

// const LEVEL_COLOR = {
//   low: '#22c55e', // green
//   mid: '#f59e0b', // amber
//   high: '#ef4444', // red
// }

// function getLevelColor(title = '', nodeLevel) {
//   if (title.includes('高级')) return LEVEL_COLOR.high
//   if (title.includes('中级')) return LEVEL_COLOR.mid
//   if (title.includes('初级')) return LEVEL_COLOR.low
//   if (nodeLevel && LEVEL_COLOR[nodeLevel]) return LEVEL_COLOR[nodeLevel]
//   return '#9ca3af' // default gray
// }

// function safeKey(it) {
//   // ✅ 只允许稳定 id；不要用 title 兜底（会和后端 item_id 不一致）
//   return it?.id
// }

// function ProgressBar({ done, total }) {
//   const pct = total === 0 ? 0 : Math.round((done / total) * 100)

//   return (
//     <div className="nd-progress">
//       <div className="nd-progressTop">
//         <span className="nd-pill">进度</span>
//         <div className="nd-track">
//           <div className="nd-fill" style={{ width: `${pct}%` }} />
//         </div>
//         <div className="nd-count">{done}/{total}</div>
//       </div>
//     </div>
//   )
// }

// function ChecklistTable({ nodeId, nodeLevel, items = [], checkedMap = {}, onToggleItem }) {
//   const scroll = items.length > 5

//   return (
//     <div className={`nd-tableWrap ${scroll ? 'is-scroll' : ''}`}>
//       <table className="nd-table">
//         <tbody>
//           {items
//             .filter((it) => !!it?.id) // ✅ 没有 id 的项直接不显示，避免写入脏数据
//             .map((it) => {
//               const itemId = safeKey(it) // = it.id
//               const checked = !!checkedMap?.[itemId]
//               const levelColor = getLevelColor(it?.title, nodeLevel)

//               return (
//                 <tr key={itemId} className={`nd-row ${checked ? 'is-checked' : ''}`}>
//                   <td className="nd-td nd-tdCheck">
//                     <input
//                       className="nd-check"
//                       type="checkbox"
//                       checked={checked}
//                       onChange={(e) =>
//                         onToggleItem?.({
//                           nodeId,
//                           itemId,
//                           checked: e.target.checked,
//                         })
//                       }
//                     />
//                   </td>

//                   <td className="nd-td nd-tdTitle">
//                     <span className="nd-dot" style={{ background: levelColor }} aria-hidden="true" />
//                     <a className="nd-link" href={it.url} target="_blank" rel="noreferrer">
//                       {it.title}
//                     </a>
//                   </td>

//                   <td className="nd-td nd-tdGo">
//                     <a className="nd-go" href={it.url} target="_blank" rel="noreferrer">
//                       ↗
//                     </a>
//                   </td>
//                 </tr>
//               )
//             })}
//         </tbody>
//       </table>

//       {scroll ? <div className="nd-fade" aria-hidden="true" /> : null}

//       {/* ✅ 如果有 items 但缺 id，给你个提示（开发期很重要） */}
//       {items.length > 0 && items.some((it) => !it?.id) ? (
//         <div className="nd-empty" style={{ marginTop: 8 }}>
//           有部分条目缺少 id（无法记录进度），请给每条 tutorials/problems 补上 id。
//         </div>
//       ) : null}
//     </div>
//   )
// }

// function Divider() {
//   return <div className="nd-divider" />
// }

// export default function NodeDrawer({ mode = 'de', node, onClose, progressMap = {}, onToggleItem }) {
//   if (!node) return null

//   const [activeTab, setActiveTab] = useState('problems')              // 习题区
//   const [activeTutorialTab, setActiveTutorialTab] = useState('tutorials') // 教程区

//   const nodeId = node.id
//   const title = node?.data?.label ?? node?.id
//   const desc = node?.data?.description ?? '暂无描述'
//   // const tutorials = node?.data?.tutorials ?? []
//   // const problems = node?.data?.problems ?? []

//   const tutorials = node?.data?.tutorials ?? []
//   const tutorialsNotion = node?.data?.tutorialsNotion ?? tutorials

//   const problems = node?.data?.problems ?? []
//   const problemsNotion = node?.data?.problemsNotion ?? problems

//   // 仅展示带 id 的条目（避免空行）
//   const tutorialsItems = useMemo(() => tutorials.filter((it) => !!it?.id), [tutorials])
//   const problemsItems = useMemo(() => problems.filter((it) => !!it?.id), [problems])

//   const nodeCheckedMap = progressMap?.[nodeId] || {}

//   // ✅ 计算进度：done/total（按 it.id）
//   const { done, total } = useMemo(() => {
//     const all = [...tutorialsItems, ...problemsItems]
//     const keys = all.map((it) => it.id)
//     const total = keys.length
//     const done = keys.reduce((acc, k) => acc + (nodeCheckedMap?.[k] ? 1 : 0), 0)
//     return { done, total }
//   }, [tutorialsItems, problemsItems, nodeCheckedMap])

//   return (
//     <div className="nd-overlay" onClick={onClose}>
//       <aside className="nd-drawer" onClick={(e) => e.stopPropagation()}>
//         <div className="nd-header">
//           <h1 className="nd-title">{title}</h1>
//           <button className="nd-close" onClick={onClose} aria-label="close">
//             ×
//           </button>
//         </div>

//         <div className="nd-body">
//           <ProgressBar done={done} total={total} />

//           <section className="nd-section">
//             <h2 className="nd-h2">描述</h2>
//             <p className="nd-desc">{desc}</p>
//           </section>

//           <Divider />

//           <section className="nd-section nd-section--tutorial">
//             {mode !== 'us' ? (
//               <>
//                 <div className="nd-h2Row">
//                   <h2 className="nd-h2">教程</h2>
//                   <span className="nd-countBadge">共 {tutorialsItems.length} 条</span>
//                 </div>

//                 {tutorialsItems.length ? (
//                   <ChecklistTable
//                     nodeId={nodeId}
//                     nodeLevel={node?.data?.level}
//                     items={tutorialsItems}
//                     checkedMap={nodeCheckedMap}
//                     onToggleItem={onToggleItem}
//                   />
//                 ) : (
//                   <div className="nd-empty">暂无教程</div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <div className="nd-h2Row">
//                   <h2 className="nd-h2">教程</h2>
//                 </div>

//                 <div className="nd-tabs">
//                   <div className="nd-tabBar">
//                     <button
//                       className={`nd-tab ${activeTutorialTab === 'tutorials' ? 'is-active' : ''}`}
//                       onClick={() => setActiveTutorialTab('tutorials')}
//                       type="button"
//                     >
//                       教程（{tutorialsItems.length}）
//                     </button>

//                     <button
//                       className={`nd-tab ${activeTutorialTab === 'notion' ? 'is-active' : ''}`}
//                       onClick={() => setActiveTutorialTab('notion')}
//                       type="button"
//                     >
//                       Notion
//                     </button>
//                   </div>

//                   {activeTutorialTab === 'tutorials' ? (
//                     tutorialsItems.length ? (
//                       <ChecklistTable
//                         nodeId={nodeId}
//                         nodeLevel={node?.data?.level}
//                         items={tutorialsItems}
//                         checkedMap={nodeCheckedMap}
//                         onToggleItem={onToggleItem}
//                       />
//                     ) : (
//                       <div className="nd-empty">暂无教程</div>
//                     )
//                   ) : node?.data?.tutorialNotionUrl ? (
//                     <div
//                       style={{
//                         height: 520,
//                         borderRadius: 12,
//                         overflow: 'hidden',
//                         border: '1px solid rgba(15,23,42,0.08)',
//                         background: '#fff',
//                       }}
//                     >
//                       <iframe
//                         title="tutorial-notion"
//                         src={node.data.tutorialNotionUrl}
//                         style={{ width: '100%', height: '100%', border: 0 }}
//                         allow="fullscreen"
//                       />
//                     </div>
//                   ) : (
//                     <div className="nd-empty">
//                       该节点未配置教程 Notion（请在 US 节点 data.tutorialNotionUrl 填写）。
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </section>

//           <Divider />

//           <section className="nd-section nd-section--problem">
//             {/* ✅ DE：保持原样；US：显示 Tabs */}
//             {mode !== 'us' ? (
//               <>
//                 <div className="nd-h2Row">
//                   <h2 className="nd-h2">习题-检测学习成果</h2>
//                   <span className="nd-countBadge">共 {problemsItems.length} 条</span>
//                 </div>

//                 {problemsItems.length ? (
//                   <ChecklistTable
//                     nodeId={nodeId}
//                     nodeLevel={node?.data?.level}
//                     items={problemsItems}
//                     checkedMap={nodeCheckedMap}
//                     onToggleItem={onToggleItem}
//                   />
//                 ) : (
//                   <div className="nd-empty">暂无习题</div>
//                 )}
//               </>
//             ) : (
//               <>
//                 <div className="nd-h2Row">
//                   <h2 className="nd-h2">学习内容</h2>
//                 </div>

//                 <div className="nd-tabs">
//                   <div className="nd-tabBar">
//                     <button
//                       className={`nd-tab ${activeTab === 'problems' ? 'is-active' : ''}`}
//                       onClick={() => setActiveTab('problems')}
//                       type="button"
//                     >
//                       习题（{problemsItems.length}）
//                     </button>
//                     <button
//                       className={`nd-tab ${activeTab === 'notion' ? 'is-active' : ''}`}
//                       onClick={() => setActiveTab('notion')}
//                       type="button"
//                     >
//                       Notion
//                     </button>
//                   </div>

//                   {activeTab === 'problems' ? (
//                     problemsItems.length ? (
//                       <ChecklistTable
//                         nodeId={nodeId}
//                         nodeLevel={node?.data?.level}
//                         items={problemsItems}
//                         checkedMap={nodeCheckedMap}
//                         onToggleItem={onToggleItem}
//                       />
//                     ) : (
//                       <div className="nd-empty">暂无习题</div>
//                     )
//                   ) : node?.data?.notionUrl ? (
//                     <div
//                       style={{
//                         height: 520,
//                         borderRadius: 12,
//                         overflow: 'hidden',
//                         border: '1px solid rgba(15,23,42,0.08)',
//                         background: '#fff',
//                       }}
//                     >
//                       <iframe
//                         title="notion"
//                         src={node.data.notionUrl}
//                         style={{ width: '100%', height: '100%', border: 0 }}
//                         allow="fullscreen"
//                       />
//                     </div>
//                   ) : (
//                     <div className="nd-empty">
//                       该节点未配置 Notion 页面（请在 US 节点 data.notionUrl 填写）。
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </section>
//         </div>
//       </aside>
//     </div>
//   )
// }





// src/components/NodeDrawer.jsx
import React, { useMemo, useState, useEffect } from 'react'
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
        <div className="nd-count">
          {done}/{total}
        </div>
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
            .filter((it) => !!it?.id)
            .map((it) => {
              const itemId = safeKey(it)
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

/** 轻量 Tabs（不用 element-plus） */
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="nd-tabs">
      <div className="nd-tabBar">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`nd-tab ${active === t.key ? 'is-active' : ''}`}
            onClick={() => onChange(t.key)}
            type="button"
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function NodeDrawer({ mode = 'de', node, onClose, progressMap = {}, onToggleItem }) {
  if (!node) return null

  const nodeId = node.id
  const title = node?.data?.label ?? node?.id
  const desc = node?.data?.description ?? '暂无描述'

  // ✅ 原始数据（US Notion tab 用你 data 里 tutorialsNotion / problemsNotion）
  const tutorials = node?.data?.tutorials ?? []
  const tutorialsNotion = node?.data?.tutorialsNotion ?? []
  const problems = node?.data?.problems ?? []
  const problemsNotion = node?.data?.problemsNotion ?? []

  // ✅ 过滤（只展示有 id 的）
  const tutorialsItems = useMemo(() => tutorials.filter((it) => !!it?.id), [tutorials])
  const tutorialsNotionItems = useMemo(
    () => tutorialsNotion.filter((it) => !!it?.id),
    [tutorialsNotion]
  )
  const problemsItems = useMemo(() => problems.filter((it) => !!it?.id), [problems])
  const problemsNotionItems = useMemo(
    () => problemsNotion.filter((it) => !!it?.id),
    [problemsNotion]
  )

  const nodeCheckedMap = progressMap?.[nodeId] || {}

  // ✅ 进度：只按「普通」tutorials + problems 统计（你也可以改成包含 notionItems）
  const { done, total } = useMemo(() => {
    const all = [...tutorialsItems, ...problemsItems]
    const keys = all.map((it) => it.id)
    const total = keys.length
    const done = keys.reduce((acc, k) => acc + (nodeCheckedMap?.[k] ? 1 : 0), 0)
    return { done, total }
  }, [tutorialsItems, problemsItems, nodeCheckedMap])

  // ✅ Tabs 状态（必须在组件内部）
  const [tutorialTab, setTutorialTab] = useState('tutorials')
  const [problemTab, setProblemTab] = useState('problems')

  // ✅ 切换节点时，tab 复位（避免上个节点停留在 Notion）
  useEffect(() => {
    setTutorialTab('tutorials')
    setProblemTab('problems')
  }, [nodeId])

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

          {/* ===================== 教程 ===================== */}
          <section className="nd-section nd-section--tutorial">
            {mode !== 'us' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="nd-h2Row">
                  <h2 className="nd-h2">教程</h2>
                </div>

                <Tabs
                  active={tutorialTab}
                  onChange={setTutorialTab}
                  tabs={[
                    { key: 'tutorials', label: `教程（${tutorialsItems.length}）` },
                    { key: 'notion', label: 'Notion' },
                  ]}
                />

                {tutorialTab === 'tutorials' ? (
                  tutorialsItems.length ? (
                    <ChecklistTable
                      nodeId={nodeId}
                      nodeLevel={node?.data?.level}
                      items={tutorialsItems}
                      checkedMap={nodeCheckedMap}
                      onToggleItem={onToggleItem}
                    />
                  ) : (
                    <div className="nd-empty">暂无教程</div>
                  )
                ) : tutorialsNotionItems.length ? (
                  <ChecklistTable
                    nodeId={nodeId}
                    nodeLevel={node?.data?.level}
                    items={tutorialsNotionItems}
                    checkedMap={nodeCheckedMap}
                    onToggleItem={onToggleItem}
                  />
                ) : (
                  <div className="nd-empty">暂无 Notion 教程（请在 data.tutorialsNotion 填）</div>
                )}
              </>
            )}
          </section>

          <Divider />

          {/* ===================== 习题/学习内容 ===================== */}
          <section className="nd-section nd-section--problem">
            {mode !== 'us' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="nd-h2Row">
                  <h2 className="nd-h2">学习内容</h2>
                </div>

                <Tabs
                  active={problemTab}
                  onChange={setProblemTab}
                  tabs={[
                    { key: 'problems', label: `习题（${problemsItems.length}）` },
                    { key: 'notion', label: 'Notion' },
                  ]}
                />

                {problemTab === 'problems' ? (
                  problemsItems.length ? (
                    <ChecklistTable
                      nodeId={nodeId}
                      nodeLevel={node?.data?.level}
                      items={problemsItems}
                      checkedMap={nodeCheckedMap}
                      onToggleItem={onToggleItem}
                    />
                  ) : (
                    <div className="nd-empty">暂无习题</div>
                  )
                ) : problemsNotionItems.length ? (
                  <ChecklistTable
                    nodeId={nodeId}
                    nodeLevel={node?.data?.level}
                    items={problemsNotionItems}
                    checkedMap={nodeCheckedMap}
                    onToggleItem={onToggleItem}
                  />
                ) : (
                  <div className="nd-empty">暂无 Notion 习题（请在 data.problemsNotion 填）</div>
                )}
              </>
            )}
          </section>
        </div>
      </aside>
    </div>
  )
}