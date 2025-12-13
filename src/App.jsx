import { ReactFlowProvider } from 'reactflow'
import RoadmapFlow from './RoadmapFlow'
import StageLegend from './StageLegend'

import 'reactflow/dist/style.css'

export default function App() {
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