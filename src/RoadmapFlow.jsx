// src/RoadmapFlow.jsx
import React, { useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import RoadmapNode from './components/RoadmapNode'

// ✅ 组节点：用大写开头（React 组件规范）
function GroupNode({ data }) {
  return (
    <div className="rm-group">
      <div className="rm-group-title">{data?.label}</div>

      {/* 组的 handle（可选） */}
      <Handle type="target" position={Position.Top} className="rm-handle rm-handle--group" />
      <Handle type="source" position={Position.Bottom} className="rm-handle rm-handle--group" />
    </div>
  )
}

// ✅ nodeTypes 的 key 必须和 nodes 里的 type 精确一致
const initialNodeTypes = {
  roadmap: RoadmapNode,
  group: GroupNode,
}

// ===== 初始 Nodes（包含 group + 子节点）=====
const initialNodes = [
  { id: '0', type: 'roadmap', data: { label: 'Road Map', level: 'low' }, position: { x: 420, y: 20 } },

  { id: '1', type: 'roadmap', data: { label: '大数据组件', level: 'low' }, position: { x: 80, y: 140 } },
  { id: '2', type: 'roadmap', data: { label: '数据仓库', level: 'low' }, position: { x: 320, y: 140 } },
  { id: '3', type: 'roadmap', data: { label: 'SQL', level: 'low' }, position: { x: 560, y: 140 } },
  { id: '4', type: 'roadmap', data: { label: '算法', level: 'low' }, position: { x: 800, y: 140 } },

  // Group A
  { id: 'A', type: 'group', position: { x: 40, y: 240 }, data: { label: 'A' }, style: { width: 220, height: 190 } },
  { id: '5', type: 'roadmap', data: { label: 'Hadoop', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'A', extent: 'parent' },
  { id: '6', type: 'roadmap', data: { label: 'Spark', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'A', extent: 'parent' },

  { id: '7', type: 'roadmap', data: { label: '数据仓库八股', level: 'low' }, position: { x: 320, y: 300 } },

  // Group C
  { id: 'C', type: 'group', position: { x: 520, y: 240 }, data: { label: 'C' }, style: { width: 220, height: 190 } },
  { id: '8', type: 'roadmap', data: { label: '基本SQL', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'C', extent: 'parent' },
  { id: '9', type: 'roadmap', data: { label: 'medium', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'C', extent: 'parent' },

  // Group D
  { id: 'D', type: 'group', position: { x: 760, y: 240 }, data: { label: 'D' }, style: { width: 250, height: 250 } },
  { id: '10', type: 'roadmap', data: { label: '数组与字符串', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'D', extent: 'parent' },
  { id: '11', type: 'roadmap', data: { label: '哈希表', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'D', extent: 'parent' },
  { id: '12', type: 'roadmap', data: { label: '栈与队列', level: 'low' }, position: { x: 20, y: 190 }, parentId: 'D', extent: 'parent' },

  { id: '13', type: 'roadmap', data: { label: '简历', level: 'low' }, position: { x: 320, y: 460 } },

  // Group E
  { id: 'E', type: 'group', position: { x: 40, y: 520 }, data: { label: 'E' }, style: { width: 220, height: 190 } },
  { id: '14', type: 'roadmap', data: { label: 'Flink', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'E', extent: 'parent' },
  { id: '15', type: 'roadmap', data: { label: 'Kafka', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'E', extent: 'parent' },

  { id: '16', type: 'roadmap', data: { label: 'hard sql', level: 'mid' }, position: { x: 560, y: 460 } },

  // Group G
  { id: 'G', type: 'group', position: { x: 760, y: 540 }, data: { label: 'G' }, style: { width: 250, height: 250 } },
  { id: '17', type: 'roadmap', data: { label: '链表', level: 'mid' }, position: { x: 20, y: 50 }, parentId: 'G', extent: 'parent' },
  { id: '18', type: 'roadmap', data: { label: 'DFS & BFS', level: 'mid' }, position: { x: 20, y: 120 }, parentId: 'G', extent: 'parent' },
  { id: '19', type: 'roadmap', data: { label: '二叉树', level: 'mid' }, position: { x: 20, y: 190 }, parentId: 'G', extent: 'parent' },

  { id: '20', type: 'roadmap', data: { label: '项目', level: 'mid' }, position: { x: 320, y: 600 } },
  { id: '21', type: 'roadmap', data: { label: '高级场景题', level: 'high' }, position: { x: 320, y: 690 } },
  { id: '22', type: 'roadmap', data: { label: '贪心与动态规划', level: 'high' }, position: { x: 800, y: 840 } },
]

// ===== 初始 Edges =====
const initialEdges = [
  { id: 'edge-01', source: '0', target: '1' },
  { id: 'edge-02', source: '0', target: '2' },
  { id: 'edge-03', source: '0', target: '3' },
  { id: 'edge-04', source: '0', target: '4' },

  { id: 'edge-1A', source: '1', target: 'A' },
  { id: 'edge-27', source: '2', target: '7' },
  { id: 'edge-3C', source: '3', target: 'C' },
  { id: 'edge-4D', source: '4', target: 'D' },

  { id: 'edge-AE', source: 'A', target: 'E' },
  { id: 'edge-A13', source: 'A', target: '13' },

  { id: 'edge-C16', source: 'C', target: '16' },
  { id: 'edge-DG', source: 'D', target: 'G' },

  { id: 'edge-1320', source: '13', target: '20' },
  { id: 'edge-1321', source: '13', target: '21' },

  { id: 'edge-G22', source: 'G', target: '22' },
].map((e) => ({
  ...e,
  type: 'smoothstep',
  animated: false,
  style: { strokeWidth: 2 },
}))

export default function RoadmapFlow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // ✅ 用 memo 避免控制台 nodeTypes 反复创建警告
  const nodeTypes = useMemo(() => initialNodeTypes, [])

  return (
    <div className="rf-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  )
}