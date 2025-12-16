import { useEffect } from 'react'
import { ReactFlowProvider } from 'reactflow'
import RoadmapFlow from './RoadmapFlow'
import StageLegend from './StageLegend'

import 'reactflow/dist/style.css'

export default function App() {
  useEffect(() => {
    function onMessage(e) {
      if (e.data?.type === 'SET_USER' && e.data.email) {
        window.__ROADMAP_USER_EMAIL__ = e.data.email
        console.log('[roadmap] user bound:', e.data.email)

        // 通知其他地方「用户准备好了」
        window.dispatchEvent(new Event('roadmap:user-ready'))
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        {/* 左上角：阶段 Legend */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 10,
          }}
        >
          <StageLegend />
        </div>

        {/* 主流程图 */}
        <RoadmapFlow />
      </div>
    </ReactFlowProvider>
  )
}