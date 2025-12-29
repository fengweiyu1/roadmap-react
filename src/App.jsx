// import React, { useEffect } from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import { ReactFlowProvider } from 'reactflow'

// import StageLegend from './StageLegend'
// import RoadmapFlow from './RoadmapFlow'

// function RoadmapPage() {
//   useEffect(() => {
//     function onMessage(e) {
//       if (e.data?.type === 'SET_USER' && e.data.email) {
//         window.__ROADMAP_USER_EMAIL__ = e.data.email
//         console.log('[roadmap] user bound:', e.data.email)
//         window.dispatchEvent(new Event('roadmap:user-ready'))
//       }
//     }
//     window.addEventListener('message', onMessage)
//     return () => window.removeEventListener('message', onMessage)
//   }, [])

//   return (
//     <ReactFlowProvider>
//       <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
//         <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
//           <StageLegend />
//         </div>
//         <RoadmapFlow />
//       </div>
//     </ReactFlowProvider>
//   )
// }

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Navigate to="/de" replace />} />
//       <Route path="/de" element={<RoadmapPage />} />
//       <Route path="/us" element={<RoadmapPage />} />
//     </Routes>
//   )
// }



import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ReactFlowProvider } from 'reactflow'

import StageLegend from './StageLegend'
import RoadmapFlow from './RoadmapFlow'

// 通用页面壳：DE / US 先复用同一套 UI
function RoadmapShell({ mode }) {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
        <StageLegend mode={mode} />
      </div>

      {/* 现在先一样，后面你要 US 不同，就在 RoadmapFlow 里根据 mode 切数据 */}
      <RoadmapFlow mode={mode} />
    </div>
  )
}

export default function App() {
  // ✅ 只在 App 顶层绑定一次 message，不会重复绑
  useEffect(() => {
    function onMessage(e) {
      console.log('[roadmap] message received:', e.origin, e.data)
      if (e.data?.type === 'SET_USER' && e.data.email) {
        window.__ROADMAP_USER_EMAIL__ = e.data.email
        console.log('[roadmap] user bound:', e.data.email)
        window.dispatchEvent(new Event('roadmap:user-ready'))
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <ReactFlowProvider>
      <Routes>
        {/* 默认进 DE */}
        <Route path="/" element={<Navigate to="/de" replace />} />

        {/* DE / US */}
        <Route path="/de" element={<RoadmapShell mode="de" />} />
        <Route path="/us" element={<RoadmapShell mode="us" />} />

        {/* 兜底 */}
        <Route path="*" element={<Navigate to="/de" replace />} />
      </Routes>
    </ReactFlowProvider>
  )
}