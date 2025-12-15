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
// const initialNodes = [
  
//   { id: '0', type: 'roadmap', data: { label: 'Road Map', level: 'low' }, position: { x: 420, y: 20 } },
//   // { id: '1', type: 'roadmap', data: { label: '大数据组件', level: 'low' }, position: { x: 80, y: 140 } },
//   // { id: '2', type: 'roadmap', data: { label: '数据仓库', level: 'low' }, position: { x: 320, y: 140 } },
//   // { id: '3', type: 'roadmap', data: { label: 'SQL', level: 'low' }, position: { x: 560, y: 140 } },
//   // { id: '4', type: 'roadmap', data: { label: '算法', level: 'low' }, position: { x: 800, y: 140 } },

//   {
//     id: 'A',
//     type: 'group',
//     position: { x: 40, y: 180 },
//     data: { label: '大数据组件' },
//     style: { width: 220, height: 190 },
//   },
//   { id: '5', type: 'roadmap', data: { label: 'Hadoop', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'A', extent: 'parent' },
//   { id: '6', type: 'roadmap', data: { label: 'Spark', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'A', extent: 'parent' },
//   // { id: '25', type: 'roadmap', data: { label: 'Hive', level: 'low' }, position: { x: 20, y: 180 }, parentId: 'A', extent: 'parent' },
//   { id: '7', type: 'roadmap', data: { label: '数据仓库八股', level: 'low' }, position: { x: 320, y: 300 } },

//   {
//     id: 'C',
//     type: 'group',
//     position: { x: 520, y: 240 },
//     data: { label: 'SQL练习' },
//     style: { width: 220, height: 190 },
//   },
//   { id: '8', type: 'roadmap', data: { label: '基本SQL', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'C', extent: 'parent' },
//   { id: '9', type: 'roadmap', data: { label: 'medium', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'C', extent: 'parent' },

//   {
//     id: 'D',
//     type: 'group',
//     position: { x: 760, y: 240 },
//     data: { label: '算法练习' },
//     style: { width: 250, height: 250 },
//   },
//   { id: '10', type: 'roadmap', data: { label: '数组与字符串', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'D', extent: 'parent' },
//   { id: '11', type: 'roadmap', data: { label: '哈希表', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'D', extent: 'parent' },
//   { id: '12', type: 'roadmap', data: { label: '栈与队列', level: 'low' }, position: { x: 20, y: 190 }, parentId: 'D', extent: 'parent' },

//   { id: '13', type: 'roadmap', data: { label: '简历', level: 'low' }, position: { x: 320, y: 460 } },

//   {
//     id: 'E',
//     type: 'group',
//     position: { x: 40, y: 520 },
//     data: { label: 'E' },
//     style: { width: 220, height: 190 },
//   },
//   { id: '14', type: 'roadmap', data: { label: 'Flink', level: 'low' }, position: { x: 20, y: 50 }, parentId: 'E', extent: 'parent' },
//   { id: '15', type: 'roadmap', data: { label: 'Kafka', level: 'low' }, position: { x: 20, y: 120 }, parentId: 'E', extent: 'parent' },

//   { id: '16', type: 'roadmap', data: { label: 'hard sql', level: 'mid' }, position: { x: 560, y: 460 } },

//   {
//     id: 'G',
//     type: 'group',
//     position: { x: 760, y: 540 },
//     data: { label: 'G' },
//     style: { width: 250, height: 250 },
//   },
//   {
//     id: '17',
//     type: 'roadmap',
//     data: {
//       label: '链表',
//       level: 'mid',
//       description: '链表是一种线性数据结构，适合频繁插入删除。',
//       tutorials: [
//         { id: 'll-basic', title: '链表基础原理', url: '/blog/linked-list-basic' },
//         { id: 'll-ops', title: '链表常见操作', url: '/blog/linked-list-ops' },
//       ],
//       problems: [
//         { id: 'lc-206', title: '206. 反转链表', url: '/leetcode/206' },
//         { id: 'lc-707', title: '707. 设计链表', url: '/leetcode/707' },
//       ],
//     },
//     position: { x: 20, y: 50 },
//     parentId: 'G',
//     extent: 'parent',
//   },

//   { id: '18', type: 'roadmap', data: { label: 'DFS & BFS', level: 'mid' }, position: { x: 20, y: 120 }, parentId: 'G', extent: 'parent' },
//   { id: '19', type: 'roadmap', data: { label: '二叉树', level: 'mid' }, position: { x: 20, y: 190 }, parentId: 'G', extent: 'parent' },

//   { id: '20', type: 'roadmap', data: { label: '项目', level: 'mid' }, position: { x: 320, y: 600 } },
//   { id: '21', type: 'roadmap', data: { label: '高级场景题', level: 'high' }, position: { x: 320, y: 690 } },
//   { id: '22', type: 'roadmap', data: { label: '贪心与动态规划', level: 'high' }, position: { x: 800, y: 840 } },
// ]

const initialNodes = [
  {
    id: '0',
    type: 'roadmap',
    position: { x: 420, y: 20 },
    data: {
      label: 'Road Map',
      level: 'low',
      description: '整体学习路线总览。',
      plan: '1天',
      tutorials: [
        { id: 'websit-turtorial', title: '网站使用教程', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  // ===================== Group A =====================
  {
    id: 'A',
    type: 'group',
    position: { x: 40, y: 140 },
    data: { label: '大数据组件' },
    style: { width: 220, height: 270 },
  },

  {
    id: '5',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Hadoop',
      level: 'low',
      description: 'HDFS / MapReduce / YARN 基础。',
      plan: '1天',
      tutorials: [
        { id: 'Hadoop-1', title: 'Hadoop-1', url: '/blog/linked-list-basic' },
        { id: 'Hadoop-2', title: 'Hadoop-2', url: '/blog/linked-list-basic' },
        { id: 'Hadoop-3', title: 'Hadoop-3', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  {
    id: '6',
    type: 'roadmap',
    position: { x: 20, y: 190 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Spark',
      level: 'low',
      description: 'Spark Core / SQL / Streaming。',
      plan: '1天',
      tutorials: [
        { id: 'Spark-1', title: 'Spark-1', url: '/blog/linked-list-basic' },
        { id: 'Spark-2', title: 'Spark-2', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  {
    id: '25',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Hive',
      level: 'low',
      description: '',
      plan: '1天',
      tutorials: [
        { id: 'Hive-1', title: 'Hive-1', url: '/blog/linked-list-basic' },
        { id: 'Hive-2', title: 'Hive-2', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  // ===================== Data Warehouse 八股 =====================

  {
    id: 'I',
    type: 'group',
    position: { x: 280, y: 200 },
    data: { label: '数据仓库' },
    style: { width: 220, height: 220 },
  },

  {
    id: '7',
    type: 'roadmap',
    position: { x: 300, y: 250 },
    data: {
      label: '数据仓库八股',
      level: 'low',
      description: '常见面试八股文。',
      plan: '1天',
      tutorials: [
        { id: 'dw-1', title: 'dw-1', url: '/blog/linked-list-basic' },
        { id: 'dw-2', title: 'dw-2', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  {
    id: '77',
    type: 'roadmap',
    position: { x: 300, y: 330 },
    data: {
      label: '常见难题',
      level: 'low',
      description: '常见面试难题',
      plan: '1天',
      tutorials: [
        { id: 'dataskew', title: '数据倾斜', url: '/blog/linked-list-basic' },
        { id: 'small files', title: '小文件问题', url: '/blog/linked-list-basic' },
        { id: 'scd', title: '缓慢变化维度', url: '/blog/linked-list-basic' },
   
      ],
      problems: [],
    },
  },

  // ===================== Group C =====================
  {
    id: 'C',
    type: 'group',
    position: { x: 520, y: 240 },
    data: { label: 'SQL练习' },
    style: { width: 220, height: 190 },
  },

  {
    id: '8',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'C',
    extent: 'parent',
    data: {
      label: '基本SQL',
      level: 'low',
      description: 'SELECT / JOIN / GROUP BY。',
      plan: '1天',
      tutorials: [
        { id: 'sql-1', title: 'sql-1', url: '/blog/linked-list-basic' },
        { id: 'sql-2', title: 'sql-2', url: '/blog/linked-list-basic' },
      ],
      problems: [],
    },
  },

  {
    id: '9',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'C',
    extent: 'parent',
    data: {
      label: 'medium',
      level: 'low',
      description: '中等难度 SQL 练习。',
      plan: '1天',
      tutorials: [
        { id: 'sql-mid-1', title: '窗口函数基础', url: '/blog/sql-window-basic' },
        { id: 'sql-mid-2', title: '复杂子查询', url: '/blog/sql-subquery' },
      ],
      problems: [
        { id: 'sql-mid-p1', title: 'SQL 练习-1（中等）', url: '/leetcode/sql-mid-1' },
        { id: 'sql-mid-p2', title: 'SQL 练习-2（中等）', url: '/leetcode/sql-mid-2' },
      ],
    },
  },

  // ===================== Group D =====================
  {
    id: 'D',
    type: 'group',
    position: { x: 760, y: 240 },
    data: { label: '算法练习' },
    style: { width: 250, height: 250 },
  },

  {
    id: '10',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'D',
    extent: 'parent',
    data: {
      label: '数组与字符串',
      level: 'low',
      description: '数组与字符串基础题型。',
      plan: '1天',
      tutorials: [
        { id: 'arr-1', title: '双指针技巧', url: '/blog/array-two-pointers' },
        { id: 'arr-2', title: '滑动窗口模板', url: '/blog/array-sliding-window' },
      ],
      problems: [
        { id: 'arr-p1', title: '数组题-1', url: '/leetcode/array-1' },
        { id: 'arr-p2', title: '字符串题-1', url: '/leetcode/string-1' },
      ],
    },
  },

  {
    id: '11',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'D',
    extent: 'parent',
    data: {
      label: '哈希表',
      level: 'low',
      description: '哈希表相关题型与套路。',
      plan: '1天',
      tutorials: [
        { id: 'hash-1', title: '哈希表设计思路', url: '/blog/hashmap-design' },
        { id: 'hash-2', title: '计数型哈希技巧', url: '/blog/hashmap-count' },
      ],
      problems: [
        { id: 'hash-p1', title: '哈希题-1', url: '/leetcode/hash-1' },
        { id: 'hash-p2', title: '哈希题-2', url: '/leetcode/hash-2' },
      ],
    },
  },

  {
    id: '12',
    type: 'roadmap',
    position: { x: 20, y: 190 },
    parentId: 'D',
    extent: 'parent',
    data: {
      label: '栈与队列',
      level: 'low',
      description: '栈与队列典型题型。',
      plan: '1天',
      tutorials: [
        { id: 'stack-1', title: '单调栈模板', url: '/blog/monotonic-stack' },
        { id: 'queue-1', title: '队列与 BFS', url: '/blog/queue-bfs' },
      ],
      problems: [
        { id: 'stack-p1', title: '栈题-1', url: '/leetcode/stack-1' },
        { id: 'queue-p1', title: '队列题-1', url: '/leetcode/queue-1' },
      ],
    },
  },

  // ===================== 简历 =====================
  
  {
    id: 'H',
    type: 'group',
    position: { x: 280, y: 460 },
    data: { label: '简历与冲刺阶段' },
    style: { width: 220, height: 320 },
  },
  
  {
    id: '13',
    type: 'roadmap',
    position: { x: 300, y: 500 },
    data: {
      label: '简历',
      level: 'low',
      description: '简历与项目表达模块。',
      plan: '1天',
      tutorials: [
        { id: 'cv-1', title: '数据工程简历结构', url: '/blog/de-resume-structure' },
        { id: 'cv-2', title: '项目描述写法', url: '/blog/project-description' },
      ],
      problems: [
        { id: 'cv-p1', title: '简历自检清单', url: '/blog/resume-checklist' },
        { id: 'cv-p2', title: 'STAR/XYZ 写法练习', url: '/blog/star-xyz-practice' },
      ],
    },
  },

  // ===================== Group E =====================
  {
    id: 'E',
    type: 'group',
    position: { x: 40, y: 520 },
    data: { label: '流处理部分' },
    style: { width: 220, height: 190 },
  },

  {
    id: '14',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: 'Flink',
      level: 'mid',
      description: 'Flink 流处理基础。',
      plan: '1天',
      tutorials: [
        { id: 'flink-1', title: 'Flink 基础概念', url: '/blog/flink-basics' },
        { id: 'flink-2', title: 'Watermark 与窗口', url: '/blog/flink-watermark' },
      ],
      problems: [
        { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },

  {
    id: '15',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: 'Kafka',
      level: 'low',
      description: 'Kafka 消息队列基础。',
      plan: '1天',
      tutorials: [
        { id: 'kafka-1', title: 'Kafka 基础概念', url: '/blog/kafka-basics' },
        { id: 'kafka-2', title: '消费者组与 Offset', url: '/blog/kafka-offset' },
      ],
      problems: [
        { id: 'kafka-p1', title: 'Kafka 练习-1', url: '/leetcode/kafka-1' },
        { id: 'kafka-p2', title: 'Kafka 练习-2', url: '/leetcode/kafka-2' },
      ],
    },
  },

  // ===================== hard sql =====================
  {
    id: '16',
    type: 'roadmap',
    position: { x: 530, y: 500 },
    data: {
      label: 'hard sql',
      level: 'mid',
      description: '高难度 SQL 练习与面试题。',
      plan: '2天',
      tutorials: [
        { id: 'sql-hard-1', title: '复杂 Join 与性能', url: '/blog/sql-join-performance' },
        { id: 'sql-hard-2', title: '面试常见 SQL 大题', url: '/blog/sql-interview-hard' },
      ],
      problems: [
        { id: 'sql-hard-p1', title: 'SQL 练习-1（高难）', url: '/leetcode/sql-hard-1' },
        { id: 'sql-hard-p2', title: 'SQL 练习-2（高难）', url: '/leetcode/sql-hard-2' },
      ],
    },
  },

  // ===================== Group G =====================
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
    position: { x: 20, y: 50 },
    parentId: 'G',
    extent: 'parent',
    data: {
      label: '链表',
      level: 'mid',
      description: '链表是一种线性数据结构，适合频繁插入删除。',
      plan: '1天',
      tutorials: [
        { id: 'll-basic', title: '链表基础原理', url: '/blog/linked-list-basic' },
        { id: 'll-ops', title: '链表常见操作', url: '/blog/linked-list-ops' },
      ],
      problems: [
        { id: 'lc-206', title: '206. 反转链表', url: '/leetcode/206' },
        { id: 'lc-707', title: '707. 设计链表', url: '/leetcode/707' },
      ],
    },
  },

  {
    id: '18',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'G',
    extent: 'parent',
    data: {
      label: 'DFS & BFS',
      level: 'mid',
      description: '深搜与广搜，图/树遍历核心。',
      plan: '2天',
      tutorials: [
        { id: 'graph-1', title: 'DFS 基础模板', url: '/blog/dfs-basic' },
        { id: 'graph-2', title: 'BFS 与最短路', url: '/blog/bfs-shortest-path' },
      ],
      problems: [
        { id: 'lc-200', title: '200. 岛屿数量', url: '/leetcode/200' },
        { id: 'lc-994', title: '994. 腐烂的橘子', url: '/leetcode/994' },
      ],
    },
  },

  {
    id: '19',
    type: 'roadmap',
    position: { x: 20, y: 190 },
    parentId: 'G',
    extent: 'parent',
    data: {
      label: '二叉树',
      level: 'mid',
      description: '二叉树遍历与递归套路。',
      plan: '2天',
      tutorials: [
        { id: 'bt-1', title: '二叉树遍历', url: '/blog/binary-tree-traverse' },
        { id: 'bt-2', title: '递归思维与树', url: '/blog/tree-recursion' },
      ],
      problems: [
        { id: 'lc-104', title: '104. 二叉树最大深度', url: '/leetcode/104' },
        { id: 'lc-102', title: '102. 层序遍历', url: '/leetcode/102' },
      ],
    },
  },

  // ===================== 底部三块 =====================
  {
    id: '20',
    type: 'roadmap',
    position: { x: 300, y: 570 },
    data: {
      label: '项目',
      level: 'high',
      description: '这一部分可有可无，如果你有项目的话你就可以忽略这一部分',
      plan: '3天',
      tutorials: [
        { id: 'proj-1', title: '项目选题与拆解', url: '/blog/project-scope' },
        { id: 'proj-2', title: '项目复盘与表达', url: '/blog/project-storytelling' },
      ],
      problems: [
        { id: 'proj-p1', title: '项目需求清单模板', url: '/blog/project-checklist' },
        { id: 'proj-p2', title: '项目指标写法练习', url: '/blog/project-metrics' },
      ],
    },
  },

  {
    id: '21',
    type: 'roadmap',
    position: { x: 300, y: 640 },
    data: {
      label: '高级场景题',
      level: 'high',
      description: '系统设计/业务场景综合题。',
      plan: '3天',
      tutorials: [
        { id: 'scene-1', title: '场景题回答框架', url: '/blog/scenario-framework' },
        { id: 'scene-2', title: '数据链路设计思路', url: '/blog/pipeline-design' },
      ],
      problems: [
        { id: 'scene-p1', title: '场景题练习-1', url: '/blog/scenario-practice-1' },
        { id: 'scene-p2', title: '场景题练习-2', url: '/blog/scenario-practice-2' },
      ],
    },
  },

  {
    id: '55',
    type: 'roadmap',
    position: { x: 300, y:  710},
    data: {
      label: '面经',
      level: 'high',
      description: '系统设计/业务场景综合题。',
      plan: '3天',
      tutorials: [
        { id: 'scene-1', title: '场景题回答框架', url: '/blog/scenario-framework' },
        { id: 'scene-2', title: '数据链路设计思路', url: '/blog/pipeline-design' },
      ],
      problems: [
        { id: 'scene-p1', title: '场景题练习-1', url: '/blog/scenario-practice-1' },
        { id: 'scene-p2', title: '场景题练习-2', url: '/blog/scenario-practice-2' },
      ],
    },
  },

  {
    id: '22',
    type: 'roadmap',
    position: { x: 800, y: 840 },
    data: {
      label: '贪心与动态规划',
      level: 'high',
      description: '高阶算法模块：贪心与 DP。',
      plan: '4天',
      tutorials: [
        { id: 'dp-1', title: '动态规划入门', url: '/blog/dp-basic' },
        { id: 'greedy-1', title: '贪心算法入门', url: '/blog/greedy-basic' },
      ],
      problems: [
        { id: 'lc-70', title: '70. 爬楼梯', url: '/leetcode/70' },
        { id: 'lc-322', title: '322. 零钱兑换', url: '/leetcode/322' },
      ],
    },
  },
]

// ============ Edges ============
const initialEdges = [
  { id: 'edge-01', source: '0', target: 'A' },
  { id: 'edge-02', source: '0', target: 'I' },
  { id: 'edge-03', source: '0', target: 'C' },
  { id: 'edge-04', source: '0', target: 'D' },
  { id: 'edge-IH', source: 'I', target: 'H' },

  // { id: 'edge-1A', source: '1', target: 'A' },
  // { id: 'edge-27', source: '2', target: '7' },
  // { id: 'edge-3C', source: '3', target: 'C' },
  // { id: 'edge-4D', source: '4', target: 'D' },

  { id: 'edge-AE', source: 'A', target: 'E' },
  { id: 'edge-AH', source: 'A', target: 'H' },
  // { id: 'edge-713', source: '7', target: '13' },

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





