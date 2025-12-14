import React, { useMemo, useState, useEffect } from 'react'
import NodeDrawer from './components/NodeDrawer'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  MarkerType,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

import RoadmapNode from './components/RoadmapNode'
import {
  fetchRoadmapProgress,
  markItemDone,
  unmarkItemDone,
} from './api/roadmap'

// ============ Group Node ============
function GroupNode({ data }) {
  return (
    <div className="rm-group">
      <div className="rm-group-badge">{data?.label}</div>
      <Handle type="target" position={Position.Top} className="rm-handle rm-handle--group" />
      <Handle type="source" position={Position.Bottom} className="rm-handle rm-handle--group" />
    </div>
  )
}


function computeNodeProgress(node, progressMap) {
  const nodeId = node.id;
  const tutorials = node.data?.tutorials || [];
  const problems = node.data?.problems || [];
  const items = [...tutorials, ...problems];

  const total = items.length;
  if (total === 0) return { done: 0, total: 0 };

  const checkedMap = progressMap[nodeId] || {};
  const done = items.reduce((acc, it) => {
    const key = it.id || it.title;
    return acc + (checkedMap[key] ? 1 : 0);
  }, 0);

  return { done, total };
}

// ✅ node.type 必须和这里的 key 一一对应
const nodeTypes = {
  roadmap: RoadmapNode,
  group: GroupNode,
}

// ✅ 固定参数（先写死，后面接 Ghost 登录再换）
const ROADMAP_ID = 'china_de_roadmap'
const USER_ID = 'api_test_user'

// ============ Nodes ============
const initialNodes = [
  
  { id: '0', type: 'roadmap', data: { label: 'Road Map', level: 'low' }, position: { x: 420, y: 20 } },
  { id: '1', type: 'roadmap', data: { label: '大数据组件', level: 'low' }, position: { x: 80, y: 140 } },
  { id: '2', type: 'roadmap', data: { label: '数据仓库', level: 'low' }, position: { x: 320, y: 140 } },
  { id: '3', type: 'roadmap', data: { label: 'SQL', level: 'low' }, position: { x: 560, y: 140 } },
  { id: '4', type: 'roadmap', data: { label: '算法', level: 'low' }, position: { x: 800, y: 140 } },

  {
    id: 'A',
    type: 'group',
    position: { x: 40, y: 240 },
    data: { label: 'A' },
    style: { width: 220, height: 190 },
  },
  { id: '5', type: 'roadmap', data: { label: 'Hadoop', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'A', extent: 'parent' },
  { id: '6', type: 'roadmap', data: { label: 'Spark', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'A', extent: 'parent' },

  { id: '7', type: 'roadmap', data: { label: '数据仓库八股', level: 'low' }, position: { x: 320, y: 300 } },

  {
    id: 'C',
    type: 'group',
    position: { x: 520, y: 240 },
    data: { label: 'C' },
    style: { width: 220, height: 190 },
  },
  { id: '8', type: 'roadmap', data: { label: '基本SQL', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'C', extent: 'parent' },
  { id: '9', type: 'roadmap', data: { label: 'medium', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'C', extent: 'parent' },

  {
    id: 'D',
    type: 'group',
    position: { x: 760, y: 240 },
    data: { label: 'D' },
    style: { width: 250, height: 250 },
  },
  { id: '10', type: 'roadmap', data: { label: '数组与字符串', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'D', extent: 'parent' },
  { id: '11', type: 'roadmap', data: { label: '哈希表', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'D', extent: 'parent' },
  { id: '12', type: 'roadmap', data: { label: '栈与队列', level: 'low' }, position: { x: 20, y: 190 }, parentId: 'D', extent: 'parent' },

  { id: '13', type: 'roadmap', data: { label: '简历', level: 'low' }, position: { x: 320, y: 460 } },

  {
    id: 'E',
    type: 'group',
    position: { x: 40, y: 520 },
    data: { label: 'E' },
    style: { width: 220, height: 190 },
  },
  { id: '14', type: 'roadmap', data: { label: 'Flink', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'E', extent: 'parent' },
  { id: '15', type: 'roadmap', data: { label: 'Kafka', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'E', extent: 'parent' },

  { id: '16', type: 'roadmap', data: { label: 'hard sql', level: 'mid' }, position: { x: 560, y: 460 } },

  {
    id: 'G',
    type: 'group',
    position: { x: 760, y: 540 },
    data: { label: 'G' },
    style: { width: 250, height: 250 },
  },
  {
    id: '17',
    type: 'roadmap',
    data: {
      label: '链表',
      level: 'mid',
      description: '链表是一种线性数据结构，适合频繁插入删除。',
      tutorials: [
        { id: 'll-basic', title: '链表基础原理', url: '/blog/linked-list-basic' },
        { id: 'll-ops', title: '链表常见操作', url: '/blog/linked-list-ops' },
      ],
      problems: [
        { id: 'lc-206', title: '206. 反转链表', url: '/leetcode/206' },
        { id: 'lc-707', title: '707. 设计链表', url: '/leetcode/707' },
      ],
    },
    position: { x: 20, y: 50 },
    parentId: 'G',
    extent: 'parent',
  },

  { id: '18', type: 'roadmap', data: { label: 'DFS & BFS', level: 'mid' }, position: { x: 20, y: 120 }, parentId: 'G', extent: 'parent' },
  { id: '19', type: 'roadmap', data: { label: '二叉树', level: 'mid' }, position: { x: 20, y: 190 }, parentId: 'G', extent: 'parent' },

  { id: '20', type: 'roadmap', data: { label: '项目', level: 'mid' }, position: { x: 320, y: 600 } },
  { id: '21', type: 'roadmap', data: { label: '高级场景题', level: 'high' }, position: { x: 320, y: 690 } },
  { id: '22', type: 'roadmap', data: { label: '贪心与动态规划', level: 'high' }, position: { x: 800, y: 840 } },
]

// ============ Edges ============
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
  { id: 'edge-713', source: '7', target: '13' },

  { id: 'edge-C16', source: 'C', target: '16' },
  { id: 'edge-DG', source: 'D', target: 'G' },

  { id: 'edge-1320', source: '13', target: '20' },
  { id: 'edge-1321', source: '13', target: '21' },

  { id: 'edge-G22', source: 'G', target: '22' },
].map((e) => ({
  ...e,
  type: 'bezier',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}))

export default function RoadmapFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)
  const [activeNode, setActiveNode] = useState(null)

  // ✅ 进度：{ [nodeId]: { [itemId]: true } }
  const [progressMap, setProgressMap] = useState({})

  // ✅ 首次加载：从后端拉取进度
  useEffect(() => {
    fetchRoadmapProgress({ roadmapId: ROADMAP_ID, userId: USER_ID })
      .then(setProgressMap)
      .catch((e) => console.error('[progress] fetch failed', e))
  }, [])

  useEffect(() => {
  setNodes((prevNodes) =>
    prevNodes.map((node) => {
      if (node.type !== 'roadmap') return node;

      const tutorials = node.data?.tutorials || [];
      const problems = node.data?.problems || [];
      const items = [...tutorials, ...problems];

      const total = items.length;
      const checkedMap = progressMap[node.id] || {};
      const done = items.reduce((acc, it) => {
        const key = it.id || it.title;
        return acc + (checkedMap[key] ? 1 : 0);
      }, 0);

      return {
        ...node,
        data: {
          ...node.data,
          progress: { done, total },
        },
      };
    })
  );
}, [progressMap]);

  // ✅ 勾选/取消：调用后端 + 本地更新
  async function toggleItem({ nodeId, itemId, checked }) {
    try {
      if (checked) {
        await markItemDone({ roadmapId: ROADMAP_ID, nodeId, itemId, userId: USER_ID })
      } else {
        await unmarkItemDone({ roadmapId: ROADMAP_ID, nodeId, itemId, userId: USER_ID })
      }

      setProgressMap((prev) => {
        const next = { ...prev }
        if (checked) {
          next[nodeId] = { ...(next[nodeId] || {}), [itemId]: true }
        } else {
          if (next[nodeId]) {
            const nodeMap = { ...next[nodeId] }
            delete nodeMap[itemId]
            if (Object.keys(nodeMap).length === 0) delete next[nodeId]
            else next[nodeId] = nodeMap
          }
        }
        return next
      })
    } catch (e) {
      console.error('[toggleItem] failed', e)
      // 这里先不做 UI toast，先保证链路正确
    }
  }

  const defaultEdgeOptions = useMemo(
    () => ({
      type: 'bezier',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { strokeWidth: 2 },
    }),
    []
  )

  return (
    <div className="rf-wrap">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => setActiveNode(node)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.8}
      >
        <Background variant="dots" gap={16} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>

      <NodeDrawer
        node={activeNode}
        onClose={() => setActiveNode(null)}
        progressMap={progressMap}
        onToggleItem={toggleItem}
      />
    </div>
  )
}





