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
  whoami,
  fetchRoadmapProgress,
  markItemDone,
  unmarkItemDone,
} from './api/roadmap'



function cloneNodes(nodes) {
  return JSON.parse(JSON.stringify(nodes))
}

function cloneEdges(edges) {
  return JSON.parse(JSON.stringify(edges))
}



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

// ✅ node.type 必须和这里的 key 一一对应
const nodeTypes = {
  roadmap: RoadmapNode,
  group: GroupNode,
}

// ✅ 固定参数（roadmapId 可以先写死）
const ROADMAP_ID = 'china_de_roadmap'



const usNodes = [
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
    data: { label: 'Data modeling 数据建模' },
    style: { width: 220, height: 330 },
  },

  {
    id: '5',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Fact table',
      level: 'low',
      description: '事实表的建模 --- 你需要注意的事',
      plan: '1天',
      tutorials: [
        { id: 'fact-table1', title: 'fact-table-1', url: 'https://xiaowantree.com/hadoop-ru-men-yu-he-xin-gai-nian-wan-zheng-zhi-nan/' },
        // { id: 'Hadoop-2', title: 'Hadoop 教程（二）HDFS 架构解析（详解版）', url: 'https://xiaowantree.com/hadoop-jiao-cheng-er-hdfs-jia-gou-jie-xi-xiang-jie-ban/' },
        // { id: 'Hadoop-3', title: 'Hadoop 教程（三）mapreduce介绍', url: 'https://xiaowantree.com/hadoop-jiao-cheng-san-mapreducejie-shao/' },
        // { id: 'Hadoop-4', title: 'Hadoop 教程（四）mapreduce架构解析', url: 'https://xiaowantree.com/xiang-jie-yarnji-chu-jia-gou-ji-qi-she-ji-si-xiang' },
        // { id: 'Hadoop-5', title: 'Hadoop 教程（五）yarn-架构解析', url: 'https://xiaowantree.com/xiang-jie-yarnji-chu-jia-gou-ji-qi-she-ji-si-xiang' },
      ],
      problems: [
        // { id: 'Hadoop-p1', title: '『问题集锦』Hadoop 相关问题', url: 'https://xiaowantree.com/hadoop-xiangg' },
        // { id: 'Hadoop-p2', title: 'Hadoop 数据仓库知识点整理', url: 'https://xiaowantree.com/zhe-shi-yi-ge-ce-shi-de-sqlti-mu' },
      ],
    },
  },

  {
    id: 'Dim Table',
    type: 'roadmap',
    position: { x: 20, y: 120 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'dim table',
      level: 'low',
      description: '维度建模 --- 你需要注意的事',
      plan: '1天',
      tutorials: [
        { id: 'Dim-table-1', title: 'dim-table-1', url: 'https://xiaowantree.com/hbase-ji-chu-gai-nian-lie-shi-cun-chu-yu-biao-she-ji' },
        // { id: 'Hbase-2', title: 'HBase 架构解析：RegionServer、Master 与 ZooKeeper', url: 'https://xiaowantree.com/hbasehe-xin-zhi-shi-ti-xi-xiang-jie-cong-ji-chu-dao-jia-gou-de-ba-gu-wen' },
        // { id: 'Hbase-3', title: 'HBase 的读写流程：从 RowKey 到 MemStore 与 HFile', url: 'https://xiaowantree.com/hbase-de-du-xie-liu-cheng-cong-rowkey-dao-memstore-yu-hfile' },
      ],
      problems: [],
    },
  },

  {
    id: '25',
    type: 'roadmap',
    position: { x: 20, y: 190 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Database modeling',
      level: 'low',
      description: '仅仅有维度表和事实表是没有办法组成database的',
      plan: '1天',
      tutorials: [
        { id: 'database-1', title: 'database-1', url: 'https://xiaowantree.com/hivemian-shi-bao-dian-cong-he-xin-gai-gou-dao-diao-you-shi-zhan1' },
        // { id: 'Hive-2', title: 'Hive 元数据 Metastore 详解:表、分区与 Schema 管理', url: 'https://xiaowantree.com/hive-yuan-shu-ju-metastore-xiang-jie-biao-fen-qu-yu-schema-guan-li' },
        // { id: 'Hive-3', title: '如何用 Hive 优化查询：分区、分桶与索引', url: 'https://xiaowantree.com/ru-he-yong-hive-you-hua-cha-xun-fen-qu-fen-tong-yu-suo-yin' },
        // { id: 'Hive-4', title: 'Hive 与传统数据库的对比：适用场景与局限', url: 'https://xiaowantree.com/hive-yu-chuan-tong-shu-ju-ku-de-dui-bi-gua-yong-chang-jing-ju-xian-yu-mian-shi-zhi-nan' },
        // { id: 'Hive-5', title: '实战：<在 Hadoop 集群上部署与调优 Hive', url: 'https://xiaowantree.com/zai-hadoop-ji-qun-diao-you-hive' },
      ],
      problems: [],
    },
  },

  // {
  //   id: '6',
  //   type: 'roadmap',
  //   position: { x: 20, y: 260 },
  //   parentId: 'A',
  //   extent: 'parent',
  //   data: {
  //     label: 'Spark',
  //     level: 'low',
  //     description: 'Spark 是一种 通用的分布式计算引擎，用于对大规模数据进行高效的批处理与流式计算。学习时应重点理解 计算模型与执行流程，而不仅仅是 API 的使用方式。',
  //     plan: '1天',
  //     tutorials: [
  //       { id: 'Spark-1', title: 'RDD 到 DataFrame：理解 Spark 的演进', url: 'https://xiaowantree.com/rdd-dao-dataframe-li-jie-spark-de-yan-jin' },
  //       { id: 'Spark-2', title: 'Spark SQL 实战：大规模数据分析', url: 'https://xiaowantree.com/spark-sql-shi-zhan-da-gui-mo-shu-ju-fen-xi' },
  //       { id: 'Spark-3', title: 'Spark Streaming：流式计算的经典应用', url: 'https://xiaowantree.com/spark-streaming-liu-shi-ji-suan-de-jing-dian-ying-yong-yu-shen-du-shi-jian' },
  //       { id: 'Spark-4', title: '性能优化技巧：缓存、Shuffle 与资源调度', url: 'https://xiaowantree.com/spark-ji-zhi-xing-neng-diao-you-nei-he-aqeyu-shi-zhan-shou-ce' },
  //     ],
  //     problems: [],
  //   },
  // },

  // ===================== Data Warehouse =====================
  {
    id: 'I',
    type: 'group',
    position: { x: 280, y: 200 },
    data: { label: 'Data Warehouse 数据仓库' },
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
        { id: 'dw-1', title: '数据仓库八股文', url: 'https://xiaowantree.com/shu-ju-cang-ku-ba-gu/' },
        { id: 'dw-2', title: '新手如何快速入门《大数据之路》选读', url: 'https://xiaowantree.com/xin-shou-ru-he-xue-xi-a-li-da-shu-ju-zhi-lu/' },
      ],
      tutorialsNotion: [
        { id: 't1-notion', title: '数据仓库八股文', url: '...' },
        { id: 't2-notion', title: '新手如何快速入门', url: '...' },
  ],
      problems: [],
      problemsNotion:[],
    },
  },

  // {
  //   id: '77',
  //   type: 'roadmap',
  //   position: { x: 300, y: 330 },
  //   data: {
  //     label: '常见难题',
  //     level: 'low',
  //     description: '常见面试难题',
  //     plan: '1天',
  //     tutorials: [
  //       { id: 'dw-layering', title: '《数据仓库为什么要分层》', url: 'https://xiaowantree.com/shu-ju-cang-ku-wei-shi-yao-yao-fen-ceng/' },
  //       { id: 'dw-interview-plus', title: '《数据仓库面试题精炼和增强》', url: 'https://xiaowantree.com/demo-post-title-1/' },
  //       { id: 'dw-wide-table', title: '数据仓库大宽表详细教程', url: 'https://xiaowantree.com/shu-ju-cang-ku-da-kuan-biao-xiang-xi-jiao-cheng/' },
  //       { id: 'dw-hive-distinct', title: '《大数据八股｜Hive 的 count(distinct) 为什么慢》', url: 'https://xiaowantree.com/da-shu-ju-ba-gu-hivede-count-distinct-wei-shi-yao-man/' },
  //       { id: 'dw-intern-summary', title: '如何总结实习工作：数据倾斜处理与经验复盘', url: 'https://xiaowantree.com/shi-xi-gong-zuo-zong-jie-su-cheng-zhi-nan-2zhou-gao-ding-shi-xi-mian-shi/' },
  //     ],
  //     problems: [],
  //   },
  // },

  // ===================== Group C =====================
  {
    id: 'C',
    type: 'group',
    position: { x: 520, y: 240 },
    data: { label: 'Lakehouse' },
    style: { width: 220, height: 190 },
  },

  {
    id: '8',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'C',
    extent: 'parent',
    data: {
      label: 'delta lake',
      level: 'low',
      description: '什么是delta lake',
      plan: '1天',
      tutorials: [
        { id: 'delta-lake-1', title: 'delta lake', url: 'https://xiaowantree.com/sql-ji-chu-ru-men-yu-shu-ju-ku-ji-chu-zhi-shi-zong-jie/' },
        // { id: 'sql-basic-2', title: '校招必备！SQL连续登录问题完全攻略', url: 'https://xiaowantree.com/sql1/' },
        // { id: 'sql-basic-3', title: '行转列与列转行完全攻略', url: 'https://xiaowantree.com/sql-xing-zhuan-lie-yu-lie-zhuan-xing-wan-quan-gong-lue/' },
        // { id: 'sql-basic-4', title: '三道经典SQL题解析，助你掌握复杂数据分析技巧', url: 'https://xiaowantree.com/biao-ti-san-dao-jing-dian-sqlti-jie-xi-zhu-ni-zhang-wo-fu-za-shu-ju-fen-xi-ji-qiao/' },
      ],
      problems: [
        // { id: 'sql-175', title: '「初级」175. 组合两个表', url: 'https://leetcode.cn/problems/combine-two-tables/' },
        // { id: 'sql-181', title: '「初级」181. 超过经理收入的员工', url: 'https://leetcode.cn/problems/employees-earning-more-than-their-managers/' },
        // { id: 'sql-182', title: '「初级」182. 查找重复的电子邮件', url: 'https://leetcode.cn/problems/duplicate-emails/' },
        // { id: 'sql-183', title: '「初级」183. 从不订购的客户', url: 'https://leetcode.cn/problems/customers-who-never-order/' },
        // { id: 'sql-196', title: '「初级」196. 删除重复的电子邮件', url: 'https://leetcode.cn/problems/delete-duplicate-emails/' },
        // { id: 'sql-197', title: '「初级」197. 上升的温度', url: 'https://leetcode.cn/problems/rising-temperature/' },
        // { id: 'sql-511', title: '「初级」511. 游戏玩法分析 I', url: 'https://leetcode.cn/problems/game-play-analysis-i/' },
        // { id: 'sql-512', title: '「初级」512. 游戏玩法分析 II', url: 'https://leetcode.cn/problems/game-play-analysis-ii/' },
        // { id: 'sql-577', title: '「初级」577. 员工奖金', url: 'https://leetcode.cn/problems/employee-bonus/' },
        // { id: 'sql-584', title: '「初级」584. 找到客户推荐者', url: 'https://leetcode.cn/problems/find-customer-referee/' },
        // { id: 'sql-595', title: '「初级」595. 大的国家', url: 'https://leetcode.cn/problems/big-countries/' },
        // { id: 'sql-596', title: '「初级」596. 超过 5 名学生的课', url: 'https://leetcode.cn/problems/classes-more-than-5-students/' },
        // { id: 'sql-620', title: '「初级」620. 有趣的电影', url: 'https://leetcode.cn/problems/not-boring-movies/' },
        // { id: 'sql-627', title: '「初级」627. 交换工资', url: 'https://leetcode.cn/problems/swap-salary/' },
        // { id: 'sql-1148', title: '「初级」1148. 文章浏览 I', url: 'https://leetcode.cn/problems/article-views-i/' },
        // { id: 'sql-1251', title: '「初级」1251. 平均售价', url: 'https://leetcode.cn/problems/average-selling-price/' },
      ],
    },
  },

  // {
  //   id: '9',
  //   type: 'roadmap',
  //   position: { x: 20, y: 120 },
  //   parentId: 'C',
  //   extent: 'parent',
  //   data: {
  //     label: 'medium',
  //     level: 'low',
  //     description: '中等难度 SQL 练习。',
  //     plan: '1天',
  //     tutorials: [],
  //     problems: [
  //       { id: 'sql-176', title: '「中级」176. 第二高的薪水', url: 'https://leetcode.cn/problems/second-highest-salary/' },
  //       { id: 'sql-177', title: '「中级」177. 第 N 高的薪水', url: 'https://leetcode.cn/problems/nth-highest-salary/' },
  //       { id: 'sql-178', title: '「中级」178. 分数排名', url: 'https://leetcode.cn/problems/rank-scores/' },
  //       { id: 'sql-180', title: '「中级」180. 连续出现的数字', url: 'https://leetcode.cn/problems/consecutive-numbers/' },
  //       { id: 'sql-184', title: '「中级」184. 部门工资最高的员工', url: 'https://leetcode.cn/problems/department-highest-salary/' },
  //       { id: 'sql-534', title: '「中级」534. 游戏玩法分析 III', url: 'https://leetcode.cn/problems/game-play-analysis-iii/' },
  //       { id: 'sql-550', title: '「中级」550. 游戏玩法分析 IV', url: 'https://leetcode.cn/problems/game-play-analysis-iv/' },
  //       { id: 'sql-570', title: '「中级」570. 拥有至少 5 名直接下属的经理', url: 'https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/' },
  //       { id: 'sql-574', title: '「中级」574. 获胜候选人', url: 'https://leetcode.cn/problems/winning-candidate/' },
  //       { id: 'sql-578', title: '「中级」578. 回复率最高的问题', url: 'https://leetcode.cn/problems/get-highest-answer-rate-question/' },
  //       { id: 'sql-580', title: '「中级」580. 统计各学院学生人数', url: 'https://leetcode.cn/problems/count-student-number-in-departments/' },
  //       { id: 'sql-585', title: '「中级」585. 2016 年的投资', url: 'https://leetcode.cn/problems/investments-in-2016/' },
  //       { id: 'sql-602', title: '「中级」602. 好友请求 II：最多的好友', url: 'https://leetcode.cn/problems/friend-requests-ii-who-has-the-most-friends/' },
  //     ],
  //   },
  // },

  // ===================== Group D =====================
  {
    id: 'D',
    type: 'group',
    position: { x: 760, y: 240 },
    data: { label: 'System Design' },
    style: { width: 250, height: 260 },
  },

  {
    id: '10',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'D',
    extent: 'parent',
    data: {
      label: '存储Storage -- S3',
      level: 'low',
      notionUrl: 'https://www.notion.so/embed/xxxxxx', 
      practiceNotionUrl: 'https://xxxx', // 习题 Notion（你原来 notionUrl 建议改成这个
      description: '纯属',
      plan: '1天',
      tutorials: [
        { id: 'storage-1', title: 'delta lake', url: 'https://xiaowantree.com/sql-ji-chu-ru-men-yu-shu-ju-ku-ji-chu-zhi-shi-zong-jie/' },
     
      ],
      problems: [
        // { id: 'arr-80', title: '「中级」80. 删除有序数组中的重复项 II', url: 'https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii' },
        // { id: 'arr-125', title: '「初级」125. 验证回文串', url: 'https://leetcode.cn/problems/valid-palindrome' },
        // { id: 'arr-75', title: '「中级」75. 颜色分类', url: 'https://leetcode.cn/problems/sort-colors' },
        // { id: 'arr-88', title: '「初级」88. 合并两个有序数组', url: 'https://leetcode.cn/problems/merge-sorted-array' },
        // { id: 'arr-977', title: '「初级」977. 有序数组的平方', url: 'https://leetcode.cn/problems/squares-of-a-sorted-array' },
        // { id: 'arr-1329', title: '「中级」1329. 将矩阵按对角线排序', url: 'https://leetcode.cn/problems/sort-the-matrix-diagonally' },
        // { id: 'arr-1260', title: '「初级」1260. 二维网格迁移', url: 'https://leetcode.cn/problems/shift-2d-grid' },
        // { id: 'arr-867', title: '「初级」867. 转置矩阵', url: 'https://leetcode.cn/problems/transpose-matrix' },
        // { id: 'arr-14', title: '「初级」14. 最长公共前缀', url: 'https://leetcode.cn/problems/longest-common-prefix' },
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
      label: '计算计算 Compute',
      level: 'low',
      description: '关于计算',
      plan: '1天',
      tutorials: [
        { id: 'compute-1', title: '计算资源', url: '/blog/hashmap-design' },
        // { id: 'hash-2', title: '计数型哈希技巧', url: '/blog/hashmap-count' },
      ],
      problems: [
        // { id: 'hash-1-two-sum', title: '「初级」1. 两数之和', url: 'https://leetcode.cn/problems/two-sum' },
        // { id: 'hash-128-longest-seq', title: '「中级」128. 最长连续序列', url: 'https://leetcode.cn/problems/longest-consecutive-sequence' },
        // { id: 'hash-290-word-pattern', title: '「初级」290. 单词规律', url: 'https://leetcode.cn/problems/word-pattern' },
        // { id: 'hash-519-random-flip', title: '「中级」519. 随机翻转矩阵', url: 'https://leetcode.cn/problems/random-flip-matrix' },
        // { id: 'hash-138-copy-random-list', title: '「中级」138. 复制带随机指针的链表', url: 'https://leetcode.cn/problems/copy-list-with-random-pointer' },
        // { id: 'hash-133-clone-graph', title: '「中级」133. 克隆图', url: 'https://leetcode.cn/problems/clone-graph' },
        // { id: 'hash-242-valid-anagram', title: '「初级」242. 有效的字母异位词', url: 'https://leetcode.cn/problems/valid-anagram' },
        // { id: 'hash-49-group-anagrams', title: '「中级」49. 字母异位词分组', url: 'https://leetcode.cn/problems/group-anagrams' },
        // { id: 'hash-387-first-unique', title: '「初级」387. 字符串中的第一个唯一字符', url: 'https://leetcode.cn/problems/first-unique-character-in-a-string' },
        // { id: 'hash-169-majority', title: '「初级」169. 多数元素', url: 'https://leetcode.cn/problems/majority-element' },
        // { id: 'hash-389-find-diff', title: '「初级」389. 找不同', url: 'https://leetcode.cn/problems/find-the-difference' },
        // { id: 'hash-442-dup-array', title: '「中级」442. 数组中重复的数据', url: 'https://leetcode.cn/problems/find-all-duplicates-in-an-array' },
        // { id: 'hash-448-missing-numbers', title: '「初级」448. 找到所有数组中消失的数字', url: 'https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array' },
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
      label: '系统设计',
      level: 'low',
      description: '系统设计问题',
      plan: '1天',
      tutorials: [
 
      ],
      problems: [
        // 队列练习（来自“队列的经典习题”）
        // { id: 'queue-933', title: '「初级」933. 最近的请求次数（队列）', url: 'https://leetcode.cn/problems/number-of-recent-calls' },
        // { id: 'queue-622', title: '「初级」622. 设计循环队列（队列）', url: 'https://leetcode.cn/problems/design-circular-queue' },
        // { id: 'queue-641', title: '「中级」641. 设计循环双端队列（队列）', url: 'https://leetcode.cn/problems/design-circular-deque' },
        // { id: 'queue-1670', title: '「中级」1670. 设计前中后队列（队列）', url: 'https://leetcode.cn/problems/design-front-middle-back-queue' },
        // { id: 'queue-2073', title: '「初级」2073. 买票需要的时间（队列）', url: 'https://leetcode.cn/problems/time-needed-to-buy-tickets' },

        // 栈练习（来自“栈的经典习题”）
        // { id: 'stack-71', title: '「中级」71. 简化路径（栈）', url: 'https://leetcode.cn/problems/simplify-path' },
        // { id: 'stack-143', title: '「中级」143. 重排链表（栈）', url: 'https://leetcode.cn/problems/reorder-list' },
        // { id: 'stack-20', title: '「初级」20. 有效的括号（栈）', url: 'https://leetcode.cn/problems/valid-parentheses' },
        // { id: 'stack-150', title: '「中级」150. 逆波兰表达式求值（栈）', url: 'https://leetcode.cn/problems/evaluate-reverse-polish-notation' },
        // { id: 'stack-225', title: '「初级」225. 用队列实现栈（栈）', url: 'https://leetcode.cn/problems/implement-stack-using-queues' },
        // { id: 'stack-388', title: '「中级」388. 文件的最长绝对路径（栈）', url: 'https://leetcode.cn/problems/longest-absolute-file-path' },
        // { id: 'stack-155', title: '「初级」155. 最小栈（栈）', url: 'https://leetcode.cn/problems/min-stack' },
        // { id: 'stack-895', title: '「高级」895. 最大频率栈（栈）', url: 'https://leetcode.cn/problems/maximum-frequency-stack' },
      ],
    },
  },

  // ===================== 简历与冲刺阶段 =====================
  {
    id: 'H',
    type: 'group',
    position: { x: 280, y: 560 },
    data: { label: 'SQL' },
    style: { width: 220, height: 320 },
  },

  {
    id: '13',
    type: 'roadmap',
    position: { x: 300, y: 600 },
    data: {
      label: '通过sql计算指标',
      level: 'low',
      description: '通过sql计算指标',
      plan: '1天',
      tutorials: [
        // { id: 'cv-1', title: '数据工程简历结构', url: '/blog/de-resume-structure' },
        // { id: 'cv-2', title: '项目描述写法', url: '/blog/project-description' },
      ],
      problems: [
        // { id: 'cv-p1', title: '简历自检清单', url: '/blog/resume-checklist' },
        // { id: 'cv-p2', title: 'STAR/XYZ 写法练习', url: '/blog/star-xyz-practice' },
      ],
    },
  },
// ===================== Group N =====================

  {
    id: 'E',
    type: 'group',
    position: { x: 40, y: 620 },
    data: { label: '大数据组件' },
    style: { width: 220, height: 190 },
  },

  {
    id: '43',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: 'Spark',
      level: 'mid',
      description: '理解关于Spark的东西, 包括basic and advanced',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
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
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },

  {
    id: '50',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: 'kafka',
      level: 'mid',
      description: 'kafka 你需要知道的的事情',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },



  // ===================== Group M =====================

  {
    id: 'M',
    type: 'group',
    position: { x: 80, y: 620 },
    data: { label: 'Data Pipeline' },
    style: { width: 220, height: 190 },
  },

  {
    id: 'orchestration',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'M',
    extent: 'parent',
    data: {
      label: 'orchestration',
      level: 'mid',
      description: '',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },
  

  {
    id: 'pipeline',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'M',
    extent: 'parent',
    data: {
      label: 'pipeline的维护',
      level: 'mid',
      description: 'pipeline的维护',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },

  {
    id: 'backfill',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: '回填',
      level: 'mid',
      description: '什么事回填，data piplien中如何实现',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },

  // ===================== Group O =====================
  {
    id: 'O',
    type: 'group',
    position: { x: 40, y: 620 },
    data: { label: 'Data Quality' },
    style: { width: 220, height: 190 },
  },

  {
    id: 'data quality',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'E',
    extent: 'parent',
    data: {
      label: 'data quality',
      level: 'mid',
      description: 'data quality',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },

  // {
  //   id: '15',
  //   type: 'roadmap',
  //   position: { x: 20, y: 120 },
  //   parentId: 'E',
  //   extent: 'parent',
  //   data: {
  //     label: 'Kafka',
  //     level: 'mid',
  //     description: 'Kafka 消息队列基础。',
  //     plan: '1天',
  //     tutorials: [
  //       { id: 'kafka-1', title: 'Kafka 基础概念', url: 'https://xiaowantree.com/kafka-ji-chu-jia-gou-yu-yuan-li-xiang-jie/' },
  //       { id: 'kafka-2', title: 'Topic,Partition与存储机制', url: 'https://xiaowantree.com/topic-partitionyu-cun-chu-ji-zhi/' },
  //       { id: 'kafka-3', title: '生产者（Producer）机制', url: 'https://xiaowantree.com/sheng-chan-zhe-producer-ji-zhi/' },
  //       { id: 'kafka-4', title: '消费者（Consumer）机制', url: 'https://xiaowantree.com/xiao-fei-zhe-consumer-ji-zhi/' },
  //       { id: 'kafka-5', title: '高级特性与性能优化', url: 'https://xiaowantree.com/gao-ji-te-xing-yu-xing-neng-you-hua/' },

  //     ],
  //     problems: [
  //       { id: 'kafka-p1', title: 'Kafka常见问题', url: 'https://xiaowantree.com/kafkachang-jian-wen-ti/' },
  //     ],
  //   },
  // },




  // ===================== Group O =====================
  {
    id: 'CLOUD',
    type: 'group',
    position: { x: 40, y: 620 },
    data: { label: 'Cloud' },
    style: { width: 220, height: 190 },
  },

  {
    id: 'databrikcs',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'CLOUD',
    extent: 'parent',
    data: {
      label: 'databrikcs',
      level: 'mid',
      description: '',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },
  {
    id: 'AWS',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'CLOUD',
    extent: 'parent',
    data: {
      label: 'AWS',
      level: 'mid',
      description: '',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },
  {
    id: 'snowflake',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'CLOUD',
    extent: 'parent',
    data: {
      label: 'snowflake',
      level: 'mid',
      description: '',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
      ],
    },
  },
  {
    id: 'dbt',
    type: 'roadmap',
    position: { x: 20, y: 50 },
    parentId: 'CLOUD',
    extent: 'parent',
    data: {
      label: 'dbt',
      level: 'mid',
      description: '',
      plan: '1天',
      tutorials: [
        // { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        // { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        // { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        // { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
      ],
      problems: [
        // { id: 'flink-p1', title: 'Flink 练习-1', url: '/leetcode/flink-1' },
        // { id: 'flink-p2', title: 'Flink 练习-2', url: '/leetcode/flink-2' },
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
      tutorials: [],
      problems: [
        { id: 'sql-185', title: '「高级」185. 部门工资前三高的所有员工', url: 'https://leetcode.cn/problems/department-top-three-salaries/' },
        { id: 'sql-262', title: '「高级」262. 行程和用户', url: 'https://leetcode.cn/problems/trips-and-users/' },
        { id: 'sql-571', title: '「高级」571. 根据频次求中位数', url: 'https://leetcode.cn/problems/find-median-given-frequency-of-numbers/' },
        { id: 'sql-579', title: '「高级」579. 员工累计薪水', url: 'https://leetcode.cn/problems/find-cumulative-salary-of-an-employee/' },
      ],
    },
  },

  // ===================== Group G =====================
  {
    id: 'G',
    type: 'group',
    position: { x: 760, y: 540 },
    data: { label: '' },
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
      ],
      problems: [
        { id: 'll-82', title: '「中级」82. 删除排序链表中的重复元素 II', url: 'https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii' },
        { id: 'll-378', title: '「中级」378. 有序矩阵中第 K 小的元素', url: 'https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix' },
        { id: 'll-373', title: '「中级」373. 查找和最小的 K 对数字', url: 'https://leetcode.cn/problems/find-k-pairs-with-smallest-sums' },
        { id: 'll-2', title: '「中级」2. 两数相加', url: 'https://leetcode.cn/problems/add-two-numbers' },
        { id: 'll-445', title: '「中级」445. 两数相加 II', url: 'https://leetcode.cn/problems/add-two-numbers-ii' },
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
     
      ],
      problems: [
        // BFS 经典习题 I
        { id: 'bfs1-919', title: '「中级」919. 完全二叉树插入器（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/complete-binary-tree-inserter' },
        { id: 'bfs1-117', title: '「中级」117. 填充每个节点的下一个右侧节点指针 II（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii' },
        { id: 'bfs1-662', title: '「中级」662. 二叉树最大宽度（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/maximum-width-of-binary-tree' },
        { id: 'bfs1-863', title: '「中级」863. 二叉树中所有距离为 K 的结点（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/all-nodes-distance-k-in-binary-tree' },
        { id: 'bfs1-310', title: '「中级」310. 最小高度树（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/minimum-height-trees' },
        { id: 'bfs1-841', title: '「中级」841. 钥匙和房间（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/keys-and-rooms' },
        { id: 'bfs1-1306', title: '「中级」1306. 跳跃游戏 III（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/jump-game-iii' },
        { id: 'bfs1-433', title: '「中级」433. 最小基因变化（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/minimum-genetic-mutation' },
        { id: 'bfs1-1926', title: '「中级」1926. 迷宫中离入口最近的出口（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/nearest-exit-from-entrance-in-maze' },
        { id: 'bfs1-1091', title: '「中级」1091. 二进制矩阵中的最短路径（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/shortest-path-in-binary-matrix' },

        // BFS 经典习题 II
        { id: 'bfs2-994', title: '「中级」994. 腐烂的橘子（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/rotting-oranges' },
        { id: 'bfs2-924', title: '「高级」924. 尽量减少恶意软件的传播（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/minimize-malware-spread' },
        { id: 'bfs2-2101', title: '「中级」2101. 引爆最多的炸弹（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/detonate-the-maximum-bombs' },
        { id: 'bfs2-542', title: '「中级」542. 01 矩阵（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/01-matrix' },
        { id: 'bfs2-417', title: '「中级」417. 太平洋大西洋水流问题（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/pacific-atlantic-water-flow' },
        { id: 'bfs2-365', title: '「中级」365. 水壶问题（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/water-and-jug-problem' },
        { id: 'bfs2-721', title: '「中级」721. 账户合并（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/accounts-merge' },
        { id: 'bfs2-2850', title: '「高级」2850. 将石头分散到网格图的最少移动次数（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid' },
        { id: 'bfs2-127', title: '「高级」127. 单词接龙（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/word-ladder' },
        { id: 'bfs2-399', title: '「中级」399. 除法求值（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/evaluate-division' },

        // 回溯（DFS）经典习题 I
        { id: 'dfs1-967', title: '「中级」967. 连续差相同的数字（回溯 I）', url: 'https://leetcode.cn/problems/numbers-with-same-consecutive-differences' },
        { id: 'dfs1-980', title: '「高级」980. 不同路径 III（回溯 I）', url: 'https://leetcode.cn/problems/unique-paths-iii' },
        { id: 'dfs1-526', title: '「中级」526. 优美的排列（回溯 I）', url: 'https://leetcode.cn/problems/beautiful-arrangement' },
        { id: 'dfs1-491', title: '「中级」491. 递增子序列（回溯 I）', url: 'https://leetcode.cn/problems/non-decreasing-subsequences' },
        { id: 'dfs1-131', title: '「中级」131. 分割回文串（回溯 I）', url: 'https://leetcode.cn/problems/palindrome-partitioning' },
        { id: 'dfs1-93', title: '「中级」93. 复原 IP 地址（回溯 I）', url: 'https://leetcode.cn/problems/restore-ip-addresses' },
        { id: 'dfs1-89', title: '「中级」89. 格雷编码（回溯 I）', url: 'https://leetcode.cn/problems/gray-code' },
        { id: 'dfs1-17', title: '「中级」17. 电话号码的字母组合（回溯 I）', url: 'https://leetcode.cn/problems/letter-combinations-of-a-phone-number' },
        { id: 'dfs1-79', title: '「中级」79. 单词搜索（回溯 I）', url: 'https://leetcode.cn/problems/word-search' },
        { id: 'dfs1-473', title: '「中级」473. 火柴拼正方形（回溯 I）', url: 'https://leetcode.cn/problems/matchsticks-to-square' },

        // 回溯（DFS）经典习题 II
        { id: 'dfs2-1219', title: '「中级」1219. 黄金矿工（回溯 II）', url: 'https://leetcode.cn/problems/path-with-maximum-gold' },
        { id: 'dfs2-1849', title: '「中级」1849. 将字符串拆分为递减的连续值（回溯 II）', url: 'https://leetcode.cn/problems/splitting-a-string-into-descending-consecutive-values' },
        { id: 'dfs2-1593', title: '「中级」1593. 拆分字符串使唯一子字符串的数目最大（回溯 II）', url: 'https://leetcode.cn/problems/split-a-string-into-the-max-number-of-unique-substrings' },
        { id: 'dfs2-1079', title: '「中级」1079. 活字印刷（回溯 II）', url: 'https://leetcode.cn/problems/letter-tile-possibilities' },
        { id: 'dfs2-996', title: '「高级」996. 正方形数组的数目（回溯 II）', url: 'https://leetcode.cn/problems/number-of-squareful-arrays' },
        { id: 'dfs2-784', title: '「中级」784. 字母大小写全排列（回溯 II）', url: 'https://leetcode.cn/problems/letter-case-permutation' },
        { id: 'dfs2-638', title: '「中级」638. 大礼包（回溯 II）', url: 'https://leetcode.cn/problems/shopping-offers' },

        // 回溯（DFS）经典习题 III
        { id: 'dfs3-301', title: '「高级」301. 删除无效的括号（回溯 III）', url: 'https://leetcode.cn/problems/remove-invalid-parentheses' },
        { id: 'dfs3-2850', title: '「高级」2850. 将石头分散到网格图的最少移动次数（回溯 III）', url: 'https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid' },
        { id: 'dfs3-1723', title: '「高级」1723. 完成所有工作的最短时间（回溯 III）', url: 'https://leetcode.cn/problems/find-minimum-time-to-finish-all-jobs' },
        { id: 'dfs3-2305', title: '「高级」2305. 公平分发饼干（回溯 III）', url: 'https://leetcode.cn/problems/fair-distribution-of-cookies' },
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
    
      ],
      problems: [
        { id: 'bt-99', title: '「高级」99. 恢复二叉搜索树', url: 'https://leetcode.cn/problems/recover-binary-search-tree' },
        { id: 'bt-669', title: '「中级」669. 修剪二叉搜索树', url: 'https://leetcode.cn/problems/trim-a-binary-search-tree' },
        { id: 'bt-671', title: '「初级」671. 二叉树中第二小的节点', url: 'https://leetcode.cn/problems/second-minimum-node-in-a-binary-tree' },
        { id: 'bt-501', title: '「初级」501. 二叉搜索树中的众数', url: 'https://leetcode.cn/problems/find-mode-in-binary-search-tree' },
        { id: 'bt-530', title: '「初级」530. 二叉搜索树的最小绝对差', url: 'https://leetcode.cn/problems/minimum-absolute-difference-in-bst' },
        { id: 'bt-653', title: '「初级」653. 两数之和 IV - 输入 BST', url: 'https://leetcode.cn/problems/two-sum-iv-input-is-a-bst' },
        { id: 'bt-1008', title: '「中级」1008. 前序遍历构造二叉搜索树', url: 'https://leetcode.cn/problems/construct-binary-search-tree-from-preorder-traversal' },

        // 二叉搜索树经典例题 II
        { id: 'bst2-108', title: '「初级」108. 将有序数组转换为二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree' },
        { id: 'bst2-1382', title: '「中级」1382. 将二叉搜索树变平衡（BST 经典 II）', url: 'https://leetcode.cn/problems/balance-a-binary-search-tree' },
        { id: 'bst2-449', title: '「中级」449. 序列化和反序列化二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/serialize-and-deserialize-bst' },
        { id: 'bst2-109', title: '「中级」109. 有序链表转换二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree' },
        { id: 'bst2-173', title: '「中级」173. 二叉搜索树迭代器（BST 经典 II）', url: 'https://leetcode.cn/problems/binary-search-tree-iterator' },
        { id: 'bst2-1305', title: '「中级」1305. 两棵二叉搜索树中的所有元素（BST 经典 II）', url: 'https://leetcode.cn/problems/all-elements-in-two-binary-search-trees' },
      ],
    },
  },

  // ===================== 底部三块 =====================
  {
    id: '20',
    type: 'roadmap',
    position: { x: 300, y: 670 },
    data: {
      label: '项目',
      level: 'high',
      description: '这一部分可有可无，如果你有项目的话你就可以忽略这一部分。你也可以看看这些项目，学习一下项目思路。',
      plan: '3天',
      tutorials: [
        { id: 'proj-video-platform', title: '⭐️ 视频创作平台：创作者分层与生态优化 (数仓项目)', url: 'https://xiaowantree.com/creator-tiers/' },
        { id: 'proj-ads', title: '⭐️ 商业化广告 (数仓项目)', url: 'https://xiaowantree.com/si-ji-ai-si-ji-dao/' },
        {
          id: 'proj-ssg-beginner',
          title: '初学者做 SSG 项目：3 个真实痛点拆解 + 落地方案（附简历模板 + 面试话术 + 场景案例）',
          url: 'https://xiaowantree.com/chu-xue-zhe-zuo-ssg-xiang-mu-3-ge-zhen-shi-tong-dian-chai-jie-luo-di-fang-an-fu-jian-li-mo-ban-mian-shi-hua-zhu-chang-jing-an-li/',
        },
      ],
      problems: [],
    },
  },

  {
    id: '21',
    type: 'roadmap',
    position: { x: 300, y: 740 },
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
    position: { x: 300, y: 810 },
    data: {
      label: '面经',
      level: 'high',
      description: '系统设计/业务场景综合题。',
      plan: '3天',
      tutorials: [
      ],
      problems: [
        { id: 'mj-meituan-rc-intern', title: '美团面经附答案（日常实习）', url: 'https://xiaowantree.com/mei-tuan-yi-mian-ri-chang-shi-xi/' },
        { id: 'mj-bytedance-de-1', title: '字节大数据开发附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-kai-fa/' },
        { id: 'mj-kuande-invest', title: '宽德投资数据开发题目附答案', url: 'https://xiaowantree.com/kuan-de-tou-zi-shu-ju-kai-fa-da-shu-ju-kai-fa-mian-shi-ti-mu/' },
        { id: 'mj-bytedance-intern-convert', title: '字节大数据实习转正跨部门附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-kai-fa-kua-bu-men-zhuan-zheng/' },
        { id: 'mj-jd-de-fulltime', title: '京东大数据开发社招题目附答案', url: 'https://xiaowantree.com/jing-dong-da-shu-ju-kai-fa-data-engineer-she-zhao-xiao-zhao-ke-kan/' },
        { id: 'mj-bytedance-intern-2', title: '字节大数据开发实习跨部门二面面试题目附答案', url: 'https://xiaowantree.com/zi-jie-shu-ju-kai-fa-shu-ju-cang-ku-mian-shi-er-mian/' },
        { id: 'mj-bytedance-de-3', title: '字节大数据开发三面面试题目附答案', url: 'https://xiaowantree.com/zi-jie-shu-ju-kai-fa-mian-shi-ti-mu-fu-da-an/' },
        { id: 'mj-nio-de-1', title: '蔚来数据开发一面面试题目附答案', url: 'https://xiaowantree.com/wei-lai-shu-ju-kai-fa-yi-mian/' },
        { id: 'mj-ant-de-1', title: '蚂蚁数开一面面试题目附答案', url: 'https://xiaowantree.com/ma-yi-shu-ju-kai-fa-mian-shi-ti-mu-mian-jing/' },
        { id: 'mj-bytedance-de-20250825', title: '字节大数据开发一面20250825面试题目附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-yi-mian/' },
        { id: 'mj-meituan-de-20250918', title: '美团大数据开发一面20250918面试题目附答案', url: 'https://xiaowantree.com/mei-tuan-yi-mian-shu-ju-kai-fa-mian-shi-ti-mu-fu-da-an/' },
        { id: 'mj-bytedance-ecom-20250821', title: '字节电商数据开发一面面试题目附答案20250821', url: 'https://xiaowantree.com/zi-jie-dian-shang-shu-ju-kai-fa-yi-mian-mian-shi-ti-mu-fu-da-an-20250821/' },
        { id: 'mj-tencent-pcg-20250310', title: '腾讯-PCG-内容平台-数据工程-一面(2025.3.10)', url: 'https://xiaowantree.com/teng-xun-pcg-nei-rong-ping-tai-shu-ju-gong-cheng-yi-mian-2025-3-10/' },
        { id: 'mj-meituan-intern-202507', title: '美团大数据开发实习 2025年7月', url: 'https://xiaowantree.com/mei-tuan-da-shu-ju-kai-fa-shi-xi-2025nian-7yue/' },
        { id: 'mj-bytedance-lifeservice-20250313', title: '字节跳动-生活服务-大数据开发一面(2025.3.13)', url: 'https://xiaowantree.com/zi-jie-tiao-dong-sheng-huo-fu-wu-da-shu-ju-kai-fa-yi-mian-2025-3-13/' },
        { id: 'mj-kuaishou-de-20250402', title: '快手大数据开发一面2025.4.2', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-yi-mian-2025-4-2/' },
        { id: 'mj-eleme-de-20250314', title: '阿里饿了么大数据开发2025.3.14', url: 'https://xiaowantree.com/a-li-e-liao-yao-da-shu-ju-kai-fa-2025-3-14/' },
        { id: 'mj-meituan-core-20250324', title: '美团-本地商业核心-基础研发部-上海-大数据开发-一面(2025.3.24)', url: 'https://xiaowantree.com/mei-tuan-ben-di-shang-ye-he-xin-ji-chu-yan-fa-bu-shang-hai-da-shu-ju-kai-fa-yi-mian-2025-3-24/' },
        { id: 'mj-kuaishou-de-2-20250408', title: '快手-大数据开发-二面(2025.4.8）', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-er-mian-3-24/' },
        { id: 'mj-bytedance-lifeservice-2-20250325', title: '字节跳动-生活服务-大数据开发-二面(3.25)', url: 'https://xiaowantree.com/zi-jie-tiao-dong-sheng-huo-fu-wu-da-shu-ju-kai-fa-er-mian-2025-3-25/' },
        { id: 'mj-bilibili-de-20250407', title: 'Bilibili-商业化-大数据开发-一面(2025.4.7)', url: 'https://xiaowantree.com/bilibili-shang-ye-hua-da-shu-ju-kai-fa-yi-mian-2025-4-7/' },
        { id: 'mj-baidu-de-20250401', title: '百度-大数据平台开发-一面(2025.4.1)', url: 'https://xiaowantree.com/bai-du-da-shu-ju-ping-tai-kai-fa-yi-mian-2025-4-1/' },
        { id: 'mj-kuaishou-de-2-202504', title: '快手大数据开发二面附答案202504', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-er-mian-fu-da-an-202504/' },
        { id: 'mj-bytedance-de-20250818', title: '字节跳动大数据开发一面20250818', url: 'https://xiaowantree.com/zi-jie-tiao-dong-da-shu-ju-kai-fa-yi-mian-20250818/' },
        { id: 'mj-jd-retail-1-202509', title: '京东-零售-一面202509', url: 'https://xiaowantree.com/jing-dong-ling-shou-yi-mian-202509/' },
        { id: 'mj-jd-retail-2-202508', title: '京东-零售-二面附答案202508', url: 'https://xiaowantree.com/jing-dong-ling-shou-er-mian-202508/' },
        { id: 'mj-shopee-de-2-202509', title: '虾皮数据开发二面题目附答案202509', url: 'https://xiaowantree.com/xia-pi-shu-ju-kai-fa-er-mian-ti-mu-fu-da-an/' },
        { id: 'mj-bytedance-dw-202508', title: '字节数仓面试题（附答案）202508', url: 'https://xiaowantree.com/zi-jie-shu-cang-mian-shi-ti-202508/' },
        { id: 'mj-china-unicom-dw', title: '中国联通数仓面试题（附答案）', url: 'https://xiaowantree.com/zhong-guo-lian-tong-da-shu-ju/' },
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
        // 动态规划经典习题 I
        { id: 'dp1-343', title: '「中级」343. 整数拆分', url: 'https://leetcode.cn/problems/integer-break' },
        { id: 'dp1-63', title: '「中级」63. 不同路径 II', url: 'https://leetcode.cn/problems/unique-paths-ii' },
        { id: 'dp1-1262', title: '「中级」1262. 可被三整除的最大和', url: 'https://leetcode.cn/problems/greatest-sum-divisible-by-three' },
        { id: 'dp1-120', title: '「中级」120. 三角形最小路径和', url: 'https://leetcode.cn/problems/triangle' },
        { id: 'dp1-368', title: '「中级」368. 最大整除子集', url: 'https://leetcode.cn/problems/largest-divisible-subset' },
        { id: 'dp1-718', title: '「中级」718. 最长重复子数组', url: 'https://leetcode.cn/problems/maximum-length-of-repeated-subarray' },

        // 动态规划经典习题 II
        { id: 'dp2-97', title: '「中级」97. 交错字符串', url: 'https://leetcode.cn/problems/interleaving-string' },
        { id: 'dp2-152', title: '「中级」152. 乘积最大子数组', url: 'https://leetcode.cn/problems/maximum-product-subarray' },
        { id: 'dp2-221', title: '「中级」221. 最大正方形', url: 'https://leetcode.cn/problems/maximal-square' },
        { id: 'dp2-329', title: '「高级」329. 矩阵中的最长递增路径', url: 'https://leetcode.cn/problems/longest-increasing-path-in-a-matrix' },
        { id: 'dp2-1235', title: '「高级」1235. 规划兼职工作', url: 'https://leetcode.cn/problems/maximum-profit-in-job-scheduling' },

        // 背包问题经典习题
        { id: 'knap-1049', title: '「中级」1049. 最后一块石头的重量 II', url: 'https://leetcode.cn/problems/last-stone-weight-ii' },
        { id: 'knap-474', title: '「中级」474. 一和零', url: 'https://leetcode.cn/problems/ones-and-zeroes' },
        { id: 'knap-3180', title: '「中级」3180. 执行操作可获得的最大总奖励 I', url: 'https://leetcode.cn/problems/maximum-total-reward-using-operations-i' },

        // 打家劫舍问题模式
        { id: 'robp-2140', title: '「中级」2140. 解决智力问题', url: 'https://leetcode.cn/problems/solving-questions-with-brainpower' },
        { id: 'robp-2320', title: '「中级」2320. 统计放置房子的方式数', url: 'https://leetcode.cn/problems/count-number-of-ways-to-place-houses' },
        { id: 'robp-983', title: '「中级」983. 最低票价', url: 'https://leetcode.cn/problems/minimum-cost-for-tickets' },
        { id: 'robp-740', title: '「中级」740. 删除并获得点数', url: 'https://leetcode.cn/problems/delete-and-earn' },
        { id: 'robp-2611', title: '「中级」2611. 老鼠和奶酪', url: 'https://leetcode.cn/problems/mice-and-cheese' },
        { id: 'robp-2789', title: '「中级」2789. 合并后数组中的最大元素', url: 'https://leetcode.cn/problems/largest-element-in-an-array-after-merge-operations' },

        // 股票买卖问题（DP）
        { id: 'stock-121', title: '「初级」121. 买卖股票的最佳时机', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock' },
        { id: 'stock-122', title: '「中级」122. 买卖股票的最佳时机 II', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii' },
        { id: 'stock-123', title: '「高级」123. 买卖股票的最佳时机 III', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii' },
        { id: 'stock-188', title: '「高级」188. 买卖股票的最佳时机 IV', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv' },
        { id: 'stock-309', title: '「中级」309. 最佳买卖股票时机含冷冻期', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown' },
        { id: 'stock-714', title: '「中级」714. 买卖股票的最佳时机含手续费', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee' },

        // 打家劫舍系列
        { id: 'rob-198', title: '「初级」198. 打家劫舍', url: 'https://leetcode.cn/problems/house-robber' },
        { id: 'rob-213', title: '「中级」213. 打家劫舍 II', url: 'https://leetcode.cn/problems/house-robber-ii' },
        { id: 'rob-337', title: '「中级」337. 打家劫舍 III', url: 'https://leetcode.cn/problems/house-robber-iii' },

        // 贪心算法练习
        { id: 'greedy-45', title: '「中级」45. 跳跃游戏 II', url: 'https://leetcode.cn/problems/jump-game-ii' },
        { id: 'greedy-55', title: '「中级」55. 跳跃游戏', url: 'https://leetcode.cn/problems/jump-game' },
        { id: 'greedy-435', title: '「中级」435. 无重叠区间', url: 'https://leetcode.cn/problems/non-overlapping-intervals' },
        { id: 'greedy-452', title: '「中级」452. 用最少数量的箭引爆气球', url: 'https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons' },
        { id: 'greedy-134', title: '「中级」134. 加油站', url: 'https://leetcode.cn/problems/gas-station' },
        { id: 'greedy-253', title: '「中级」253. 会议室 II', url: 'https://leetcode.cn/problems/meeting-rooms-ii' },
        { id: 'greedy-1024', title: '「中级」1024. 视频拼接', url: 'https://leetcode.cn/problems/video-stitching' },
        { id: 'greedy-1288', title: '「中级」1288. 删除被覆盖区间', url: 'https://leetcode.cn/problems/remove-covered-intervals' },
        { id: 'greedy-56', title: '56. 合并区间', url: 'https://leetcode.cn/problems/merge-intervals' },
        { id: 'greedy-986', title: '986. 区间列表的交集', url: 'https://leetcode.cn/problems/interval-list-intersections' },
      ],
    },
  },
]


// ================= Edges（保持你原样）=================
const usEdges = [
  { id: 'edge-01', source: '0', target: 'A' },
  { id: 'edge-02', source: '0', target: 'I' },
  { id: 'edge-03', source: '0', target: 'C' },
  { id: 'edge-04', source: '0', target: 'D' },
  { id: 'edge-IH', source: 'I', target: 'H' },
  // { id: 'edge-AE', source: 'A', target: 'E' },
  // { id: 'edge-AH', source: 'A', target: 'H' },
  // { id: 'edge-C16', source: 'C', target: '16' },
  // { id: 'edge-DG', source: 'D', target: 'G' },
  // { id: 'edge-1320', source: '13', target: '20' },
  // { id: 'edge-1321', source: '13', target: '21' },
  // { id: 'edge-G22', source: 'G', target: '22' },
].map((e) => ({
  ...e,
  type: 'bezier',
  markerEnd: { type: MarkerType.ArrowClosed },
  style: { strokeWidth: 2 },
}))

// ================= Nodes（保持你原样）=================
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
    style: { width: 220, height: 330 },
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
      description: 'HDFS 存储原理(块、复制、NameNode、DataNode), MapReduce 执行过程(Map/Shuffle/Reduce 流程)。',
      plan: '1天',
      tutorials: [
        { id: 'Hadoop-1', title: 'Hadoop 教程（一）hadoop介绍', url: 'https://xiaowantree.com/hadoop-ru-men-yu-he-xin-gai-nian-wan-zheng-zhi-nan/' },
        { id: 'Hadoop-2', title: 'Hadoop 教程（二）HDFS 架构解析（详解版）', url: 'https://xiaowantree.com/hadoop-jiao-cheng-er-hdfs-jia-gou-jie-xi-xiang-jie-ban/' },
        { id: 'Hadoop-3', title: 'Hadoop 教程（三）mapreduce介绍', url: 'https://xiaowantree.com/hadoop-jiao-cheng-san-mapreducejie-shao/' },
        { id: 'Hadoop-4', title: 'Hadoop 教程（四）mapreduce架构解析', url: 'https://xiaowantree.com/xiang-jie-yarnji-chu-jia-gou-ji-qi-she-ji-si-xiang' },
        { id: 'Hadoop-5', title: 'Hadoop 教程（五）yarn-架构解析', url: 'https://xiaowantree.com/xiang-jie-yarnji-chu-jia-gou-ji-qi-she-ji-si-xiang' },
      ],
      problems: [
        { id: 'Hadoop-p1', title: '『问题集锦』Hadoop 相关问题', url: 'https://xiaowantree.com/hadoop-xiangg' },
        { id: 'Hadoop-p2', title: 'Hadoop 数据仓库知识点整理', url: 'https://xiaowantree.com/zhe-shi-yi-ge-ce-shi-de-sqlti-mu' },
      ],
    },
  },

  {
    id: 'hbase',
    type: 'roadmap',
    position: { x: 20, y: 190 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Hbase',
      level: 'low',
      description: 'HBase 是构建在 HDFS 之上的 分布式实时 NoSQL 数据库，用于大规模数据的低延迟随机读写，而不是复杂分析查询。学习时应重点关注 数据模型与 RowKey 设计，理解其对性能和稳定性的影响。',
      plan: '1天',
      tutorials: [
        { id: 'Hbase-1', title: 'HBase 基础概念：列式存储与表设计', url: 'https://xiaowantree.com/hbase-ji-chu-gai-nian-lie-shi-cun-chu-yu-biao-she-ji' },
        { id: 'Hbase-2', title: 'HBase 架构解析：RegionServer、Master 与 ZooKeeper', url: 'https://xiaowantree.com/hbasehe-xin-zhi-shi-ti-xi-xiang-jie-cong-ji-chu-dao-jia-gou-de-ba-gu-wen' },
        { id: 'Hbase-3', title: 'HBase 的读写流程：从 RowKey 到 MemStore 与 HFile', url: 'https://xiaowantree.com/hbase-de-du-xie-liu-cheng-cong-rowkey-dao-memstore-yu-hfile' },
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
      description: 'Hive 是构建在 Hadoop 之上的 离线数据仓库工具，用于大规模数据的分析与统计查询，数据实际存储在 HDFS 中。学习时应关注 表结构设计与查询执行方式，而不是把 Hive 当作传统数据库来使用。',
      plan: '1天',
      tutorials: [
        { id: 'Hive-1', title: 'Hive面试宝典:从核心架构到调优实战', url: 'https://xiaowantree.com/hivemian-shi-bao-dian-cong-he-xin-gai-gou-dao-diao-you-shi-zhan' },
        { id: 'Hive-2', title: 'Hive 元数据 Metastore 详解:表、分区与 Schema 管理', url: 'https://xiaowantree.com/hive-yuan-shu-ju-metastore-xiang-jie-biao-fen-qu-yu-schema-guan-li' },
        { id: 'Hive-3', title: '如何用 Hive 优化查询：分区、分桶与索引', url: 'https://xiaowantree.com/ru-he-yong-hive-you-hua-cha-xun-fen-qu-fen-tong-yu-suo-yin' },
        { id: 'Hive-4', title: 'Hive 与传统数据库的对比：适用场景与局限', url: 'https://xiaowantree.com/hive-yu-chuan-tong-shu-ju-ku-de-dui-bi-gua-yong-chang-jing-ju-xian-yu-mian-shi-zhi-nan' },
        { id: 'Hive-5', title: '实战：<在 Hadoop 集群上部署与调优 Hive', url: 'https://xiaowantree.com/zai-hadoop-ji-qun-diao-you-hive' },
      ],
      problems: [],
    },
  },

  {
    id: '6',
    type: 'roadmap',
    position: { x: 20, y: 260 },
    parentId: 'A',
    extent: 'parent',
    data: {
      label: 'Spark',
      level: 'low',
      description: 'Spark 是一种 通用的分布式计算引擎，用于对大规模数据进行高效的批处理与流式计算。学习时应重点理解 计算模型与执行流程，而不仅仅是 API 的使用方式。',
      plan: '1天',
      tutorials: [
        { id: 'Spark-1', title: 'RDD 到 DataFrame：理解 Spark 的演进', url: 'https://xiaowantree.com/rdd-dao-dataframe-li-jie-spark-de-yan-jin' },
        { id: 'Spark-2', title: 'Spark SQL 实战：大规模数据分析', url: 'https://xiaowantree.com/spark-sql-shi-zhan-da-gui-mo-shu-ju-fen-xi' },
        { id: 'Spark-3', title: 'Spark Streaming：流式计算的经典应用', url: 'https://xiaowantree.com/spark-streaming-liu-shi-ji-suan-de-jing-dian-ying-yong-yu-shen-du-shi-jian' },
        { id: 'Spark-4', title: '性能优化技巧：缓存、Shuffle 与资源调度', url: 'https://xiaowantree.com/spark-ji-zhi-xing-neng-diao-you-nei-he-aqeyu-shi-zhan-shou-ce' },
      ],
      problems: [],
    },
  },

  // ===================== Data Warehouse =====================
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
        { id: 'dw-1', title: '数据仓库八股文', url: 'https://xiaowantree.com/shu-ju-cang-ku-ba-gu/' },
        { id: 'dw-2', title: '新手如何快速入门《大数据之路》选读', url: 'https://xiaowantree.com/xin-shou-ru-he-xue-xi-a-li-da-shu-ju-zhi-lu/' },
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
        { id: 'dw-layering', title: '《数据仓库为什么要分层》', url: 'https://xiaowantree.com/shu-ju-cang-ku-wei-shi-yao-yao-fen-ceng/' },
        { id: 'dw-interview-plus', title: '《数据仓库面试题精炼和增强》', url: 'https://xiaowantree.com/demo-post-title-1/' },
        { id: 'dw-wide-table', title: '数据仓库大宽表详细教程', url: 'https://xiaowantree.com/shu-ju-cang-ku-da-kuan-biao-xiang-xi-jiao-cheng/' },
        { id: 'dw-hive-distinct', title: '《大数据八股｜Hive 的 count(distinct) 为什么慢》', url: 'https://xiaowantree.com/da-shu-ju-ba-gu-hivede-count-distinct-wei-shi-yao-man/' },
        { id: 'dw-intern-summary', title: '如何总结实习工作：数据倾斜处理与经验复盘', url: 'https://xiaowantree.com/shi-xi-gong-zuo-zong-jie-su-cheng-zhi-nan-2zhou-gao-ding-shi-xi-mian-shi/' },
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
        { id: 'sql-basic-1', title: 'SQL 基础入门与数据库基础知识总结', url: 'https://xiaowantree.com/sql-ji-chu-ru-men-yu-shu-ju-ku-ji-chu-zhi-shi-zong-jie/' },
        { id: 'sql-basic-2', title: '校招必备！SQL连续登录问题完全攻略', url: 'https://xiaowantree.com/sql1/' },
        { id: 'sql-basic-3', title: '行转列与列转行完全攻略', url: 'https://xiaowantree.com/sql-xing-zhuan-lie-yu-lie-zhuan-xing-wan-quan-gong-lue/' },
        { id: 'sql-basic-4', title: '三道经典SQL题解析，助你掌握复杂数据分析技巧', url: 'https://xiaowantree.com/biao-ti-san-dao-jing-dian-sqlti-jie-xi-zhu-ni-zhang-wo-fu-za-shu-ju-fen-xi-ji-qiao/' },
      ],
      problems: [
        { id: 'sql-175', title: '「初级」175. 组合两个表', url: 'https://leetcode.cn/problems/combine-two-tables/' },
        { id: 'sql-181', title: '「初级」181. 超过经理收入的员工', url: 'https://leetcode.cn/problems/employees-earning-more-than-their-managers/' },
        { id: 'sql-182', title: '「初级」182. 查找重复的电子邮件', url: 'https://leetcode.cn/problems/duplicate-emails/' },
        { id: 'sql-183', title: '「初级」183. 从不订购的客户', url: 'https://leetcode.cn/problems/customers-who-never-order/' },
        { id: 'sql-196', title: '「初级」196. 删除重复的电子邮件', url: 'https://leetcode.cn/problems/delete-duplicate-emails/' },
        { id: 'sql-197', title: '「初级」197. 上升的温度', url: 'https://leetcode.cn/problems/rising-temperature/' },
        { id: 'sql-511', title: '「初级」511. 游戏玩法分析 I', url: 'https://leetcode.cn/problems/game-play-analysis-i/' },
        { id: 'sql-512', title: '「初级」512. 游戏玩法分析 II', url: 'https://leetcode.cn/problems/game-play-analysis-ii/' },
        { id: 'sql-577', title: '「初级」577. 员工奖金', url: 'https://leetcode.cn/problems/employee-bonus/' },
        { id: 'sql-584', title: '「初级」584. 找到客户推荐者', url: 'https://leetcode.cn/problems/find-customer-referee/' },
        { id: 'sql-595', title: '「初级」595. 大的国家', url: 'https://leetcode.cn/problems/big-countries/' },
        { id: 'sql-596', title: '「初级」596. 超过 5 名学生的课', url: 'https://leetcode.cn/problems/classes-more-than-5-students/' },
        { id: 'sql-620', title: '「初级」620. 有趣的电影', url: 'https://leetcode.cn/problems/not-boring-movies/' },
        { id: 'sql-627', title: '「初级」627. 交换工资', url: 'https://leetcode.cn/problems/swap-salary/' },
        { id: 'sql-1148', title: '「初级」1148. 文章浏览 I', url: 'https://leetcode.cn/problems/article-views-i/' },
        { id: 'sql-1251', title: '「初级」1251. 平均售价', url: 'https://leetcode.cn/problems/average-selling-price/' },
      ],
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
      tutorials: [],
      problems: [
        { id: 'sql-176', title: '「中级」176. 第二高的薪水', url: 'https://leetcode.cn/problems/second-highest-salary/' },
        { id: 'sql-177', title: '「中级」177. 第 N 高的薪水', url: 'https://leetcode.cn/problems/nth-highest-salary/' },
        { id: 'sql-178', title: '「中级」178. 分数排名', url: 'https://leetcode.cn/problems/rank-scores/' },
        { id: 'sql-180', title: '「中级」180. 连续出现的数字', url: 'https://leetcode.cn/problems/consecutive-numbers/' },
        { id: 'sql-184', title: '「中级」184. 部门工资最高的员工', url: 'https://leetcode.cn/problems/department-highest-salary/' },
        { id: 'sql-534', title: '「中级」534. 游戏玩法分析 III', url: 'https://leetcode.cn/problems/game-play-analysis-iii/' },
        { id: 'sql-550', title: '「中级」550. 游戏玩法分析 IV', url: 'https://leetcode.cn/problems/game-play-analysis-iv/' },
        { id: 'sql-570', title: '「中级」570. 拥有至少 5 名直接下属的经理', url: 'https://leetcode.cn/problems/managers-with-at-least-5-direct-reports/' },
        { id: 'sql-574', title: '「中级」574. 获胜候选人', url: 'https://leetcode.cn/problems/winning-candidate/' },
        { id: 'sql-578', title: '「中级」578. 回复率最高的问题', url: 'https://leetcode.cn/problems/get-highest-answer-rate-question/' },
        { id: 'sql-580', title: '「中级」580. 统计各学院学生人数', url: 'https://leetcode.cn/problems/count-student-number-in-departments/' },
        { id: 'sql-585', title: '「中级」585. 2016 年的投资', url: 'https://leetcode.cn/problems/investments-in-2016/' },
        { id: 'sql-602', title: '「中级」602. 好友请求 II：最多的好友', url: 'https://leetcode.cn/problems/friend-requests-ii-who-has-the-most-friends/' },
      ],
    },
  },

  // ===================== Group D =====================
  {
    id: 'D',
    type: 'group',
    position: { x: 760, y: 240 },
    data: { label: '算法练习' },
    style: { width: 250, height: 260 },
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
     
      ],
      problems: [
        { id: 'arr-80', title: '「中级」80. 删除有序数组中的重复项 II', url: 'https://leetcode.cn/problems/remove-duplicates-from-sorted-array-ii' },
        { id: 'arr-125', title: '「初级」125. 验证回文串', url: 'https://leetcode.cn/problems/valid-palindrome' },
        { id: 'arr-75', title: '「中级」75. 颜色分类', url: 'https://leetcode.cn/problems/sort-colors' },
        { id: 'arr-88', title: '「初级」88. 合并两个有序数组', url: 'https://leetcode.cn/problems/merge-sorted-array' },
        { id: 'arr-977', title: '「初级」977. 有序数组的平方', url: 'https://leetcode.cn/problems/squares-of-a-sorted-array' },
        { id: 'arr-1329', title: '「中级」1329. 将矩阵按对角线排序', url: 'https://leetcode.cn/problems/sort-the-matrix-diagonally' },
        { id: 'arr-1260', title: '「初级」1260. 二维网格迁移', url: 'https://leetcode.cn/problems/shift-2d-grid' },
        { id: 'arr-867', title: '「初级」867. 转置矩阵', url: 'https://leetcode.cn/problems/transpose-matrix' },
        { id: 'arr-14', title: '「初级」14. 最长公共前缀', url: 'https://leetcode.cn/problems/longest-common-prefix' },
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
        { id: 'hash-1-two-sum', title: '「初级」1. 两数之和', url: 'https://leetcode.cn/problems/two-sum' },
        { id: 'hash-128-longest-seq', title: '「中级」128. 最长连续序列', url: 'https://leetcode.cn/problems/longest-consecutive-sequence' },
        { id: 'hash-290-word-pattern', title: '「初级」290. 单词规律', url: 'https://leetcode.cn/problems/word-pattern' },
        { id: 'hash-519-random-flip', title: '「中级」519. 随机翻转矩阵', url: 'https://leetcode.cn/problems/random-flip-matrix' },
        { id: 'hash-138-copy-random-list', title: '「中级」138. 复制带随机指针的链表', url: 'https://leetcode.cn/problems/copy-list-with-random-pointer' },
        { id: 'hash-133-clone-graph', title: '「中级」133. 克隆图', url: 'https://leetcode.cn/problems/clone-graph' },
        { id: 'hash-242-valid-anagram', title: '「初级」242. 有效的字母异位词', url: 'https://leetcode.cn/problems/valid-anagram' },
        { id: 'hash-49-group-anagrams', title: '「中级」49. 字母异位词分组', url: 'https://leetcode.cn/problems/group-anagrams' },
        { id: 'hash-387-first-unique', title: '「初级」387. 字符串中的第一个唯一字符', url: 'https://leetcode.cn/problems/first-unique-character-in-a-string' },
        { id: 'hash-169-majority', title: '「初级」169. 多数元素', url: 'https://leetcode.cn/problems/majority-element' },
        { id: 'hash-389-find-diff', title: '「初级」389. 找不同', url: 'https://leetcode.cn/problems/find-the-difference' },
        { id: 'hash-442-dup-array', title: '「中级」442. 数组中重复的数据', url: 'https://leetcode.cn/problems/find-all-duplicates-in-an-array' },
        { id: 'hash-448-missing-numbers', title: '「初级」448. 找到所有数组中消失的数字', url: 'https://leetcode.cn/problems/find-all-numbers-disappeared-in-an-array' },
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
 
      ],
      problems: [
        // 队列练习（来自“队列的经典习题”）
        { id: 'queue-933', title: '「初级」933. 最近的请求次数（队列）', url: 'https://leetcode.cn/problems/number-of-recent-calls' },
        { id: 'queue-622', title: '「初级」622. 设计循环队列（队列）', url: 'https://leetcode.cn/problems/design-circular-queue' },
        { id: 'queue-641', title: '「中级」641. 设计循环双端队列（队列）', url: 'https://leetcode.cn/problems/design-circular-deque' },
        { id: 'queue-1670', title: '「中级」1670. 设计前中后队列（队列）', url: 'https://leetcode.cn/problems/design-front-middle-back-queue' },
        { id: 'queue-2073', title: '「初级」2073. 买票需要的时间（队列）', url: 'https://leetcode.cn/problems/time-needed-to-buy-tickets' },

        // 栈练习（来自“栈的经典习题”）
        { id: 'stack-71', title: '「中级」71. 简化路径（栈）', url: 'https://leetcode.cn/problems/simplify-path' },
        { id: 'stack-143', title: '「中级」143. 重排链表（栈）', url: 'https://leetcode.cn/problems/reorder-list' },
        { id: 'stack-20', title: '「初级」20. 有效的括号（栈）', url: 'https://leetcode.cn/problems/valid-parentheses' },
        { id: 'stack-150', title: '「中级」150. 逆波兰表达式求值（栈）', url: 'https://leetcode.cn/problems/evaluate-reverse-polish-notation' },
        { id: 'stack-225', title: '「初级」225. 用队列实现栈（栈）', url: 'https://leetcode.cn/problems/implement-stack-using-queues' },
        { id: 'stack-388', title: '「中级」388. 文件的最长绝对路径（栈）', url: 'https://leetcode.cn/problems/longest-absolute-file-path' },
        { id: 'stack-155', title: '「初级」155. 最小栈（栈）', url: 'https://leetcode.cn/problems/min-stack' },
        { id: 'stack-895', title: '「高级」895. 最大频率栈（栈）', url: 'https://leetcode.cn/problems/maximum-frequency-stack' },
      ],
    },
  },

  // ===================== 简历与冲刺阶段 =====================
  {
    id: 'H',
    type: 'group',
    position: { x: 280, y: 560 },
    data: { label: '简历与冲刺阶段' },
    style: { width: 220, height: 320 },
  },

  {
    id: '13',
    type: 'roadmap',
    position: { x: 300, y: 600 },
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
    position: { x: 40, y: 620 },
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
        { id: 'flink-1', title: '《Flink 核心理念：有界与无界流》', url: 'https://xiaowantree.com/flink-he-xin-li-nian-you-jie-yu-wu-jie-liu/' },
        { id: 'flink-2', title: '《Flink 的时间语义与窗口机制详解》', url: 'https://xiaowantree.com/flink-de-shi-jian-yu-yi-yu-chuang-kou-ji-zhi-xiang-jie/' },
        { id: 'flink-3', title: '《Flink 状态管理：一致性检查点与保存点》', url: 'https://xiaowantree.com/flink-zhuang-tai-guan-li-shen-du-jie-xi/' },
        { id: 'flink-4', title: '《Flink SQL 上手：用 SQL 做实时计算》', url: 'https://xiaowantree.com/flink-sql-shang-shou-shang-he-xin-yuan-li-yu-ji-chu-yu-fa/' },
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
      level: 'mid',
      description: 'Kafka 消息队列基础。',
      plan: '1天',
      tutorials: [
        { id: 'kafka-1', title: 'Kafka 基础概念', url: 'https://xiaowantree.com/kafka-ji-chu-jia-gou-yu-yuan-li-xiang-jie/' },
        { id: 'kafka-2', title: 'Topic,Partition与存储机制', url: 'https://xiaowantree.com/topic-partitionyu-cun-chu-ji-zhi/' },
        { id: 'kafka-3', title: '生产者（Producer）机制', url: 'https://xiaowantree.com/sheng-chan-zhe-producer-ji-zhi/' },
        { id: 'kafka-4', title: '消费者（Consumer）机制', url: 'https://xiaowantree.com/xiao-fei-zhe-consumer-ji-zhi/' },
        { id: 'kafka-5', title: '高级特性与性能优化', url: 'https://xiaowantree.com/gao-ji-te-xing-yu-xing-neng-you-hua/' },

      ],
      problems: [
        { id: 'kafka-p1', title: 'Kafka常见问题', url: 'https://xiaowantree.com/kafkachang-jian-wen-ti/' },
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
      tutorials: [],
      problems: [
        { id: 'sql-185', title: '「高级」185. 部门工资前三高的所有员工', url: 'https://leetcode.cn/problems/department-top-three-salaries/' },
        { id: 'sql-262', title: '「高级」262. 行程和用户', url: 'https://leetcode.cn/problems/trips-and-users/' },
        { id: 'sql-571', title: '「高级」571. 根据频次求中位数', url: 'https://leetcode.cn/problems/find-median-given-frequency-of-numbers/' },
        { id: 'sql-579', title: '「高级」579. 员工累计薪水', url: 'https://leetcode.cn/problems/find-cumulative-salary-of-an-employee/' },
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
      ],
      problems: [
        { id: 'll-82', title: '「中级」82. 删除排序链表中的重复元素 II', url: 'https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii' },
        { id: 'll-378', title: '「中级」378. 有序矩阵中第 K 小的元素', url: 'https://leetcode.cn/problems/kth-smallest-element-in-a-sorted-matrix' },
        { id: 'll-373', title: '「中级」373. 查找和最小的 K 对数字', url: 'https://leetcode.cn/problems/find-k-pairs-with-smallest-sums' },
        { id: 'll-2', title: '「中级」2. 两数相加', url: 'https://leetcode.cn/problems/add-two-numbers' },
        { id: 'll-445', title: '「中级」445. 两数相加 II', url: 'https://leetcode.cn/problems/add-two-numbers-ii' },
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
     
      ],
      problems: [
        // BFS 经典习题 I
        { id: 'bfs1-919', title: '「中级」919. 完全二叉树插入器（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/complete-binary-tree-inserter' },
        { id: 'bfs1-117', title: '「中级」117. 填充每个节点的下一个右侧节点指针 II（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/populating-next-right-pointers-in-each-node-ii' },
        { id: 'bfs1-662', title: '「中级」662. 二叉树最大宽度（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/maximum-width-of-binary-tree' },
        { id: 'bfs1-863', title: '「中级」863. 二叉树中所有距离为 K 的结点（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/all-nodes-distance-k-in-binary-tree' },
        { id: 'bfs1-310', title: '「中级」310. 最小高度树（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/minimum-height-trees' },
        { id: 'bfs1-841', title: '「中级」841. 钥匙和房间（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/keys-and-rooms' },
        { id: 'bfs1-1306', title: '「中级」1306. 跳跃游戏 III（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/jump-game-iii' },
        { id: 'bfs1-433', title: '「中级」433. 最小基因变化（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/minimum-genetic-mutation' },
        { id: 'bfs1-1926', title: '「中级」1926. 迷宫中离入口最近的出口（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/nearest-exit-from-entrance-in-maze' },
        { id: 'bfs1-1091', title: '「中级」1091. 二进制矩阵中的最短路径（BFS 经典习题 I）', url: 'https://leetcode.cn/problems/shortest-path-in-binary-matrix' },

        // BFS 经典习题 II
        { id: 'bfs2-994', title: '「中级」994. 腐烂的橘子（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/rotting-oranges' },
        { id: 'bfs2-924', title: '「高级」924. 尽量减少恶意软件的传播（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/minimize-malware-spread' },
        { id: 'bfs2-2101', title: '「中级」2101. 引爆最多的炸弹（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/detonate-the-maximum-bombs' },
        { id: 'bfs2-542', title: '「中级」542. 01 矩阵（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/01-matrix' },
        { id: 'bfs2-417', title: '「中级」417. 太平洋大西洋水流问题（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/pacific-atlantic-water-flow' },
        { id: 'bfs2-365', title: '「中级」365. 水壶问题（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/water-and-jug-problem' },
        { id: 'bfs2-721', title: '「中级」721. 账户合并（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/accounts-merge' },
        { id: 'bfs2-2850', title: '「高级」2850. 将石头分散到网格图的最少移动次数（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid' },
        { id: 'bfs2-127', title: '「高级」127. 单词接龙（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/word-ladder' },
        { id: 'bfs2-399', title: '「中级」399. 除法求值（BFS 经典习题 II）', url: 'https://leetcode.cn/problems/evaluate-division' },

        // 回溯（DFS）经典习题 I
        { id: 'dfs1-967', title: '「中级」967. 连续差相同的数字（回溯 I）', url: 'https://leetcode.cn/problems/numbers-with-same-consecutive-differences' },
        { id: 'dfs1-980', title: '「高级」980. 不同路径 III（回溯 I）', url: 'https://leetcode.cn/problems/unique-paths-iii' },
        { id: 'dfs1-526', title: '「中级」526. 优美的排列（回溯 I）', url: 'https://leetcode.cn/problems/beautiful-arrangement' },
        { id: 'dfs1-491', title: '「中级」491. 递增子序列（回溯 I）', url: 'https://leetcode.cn/problems/non-decreasing-subsequences' },
        { id: 'dfs1-131', title: '「中级」131. 分割回文串（回溯 I）', url: 'https://leetcode.cn/problems/palindrome-partitioning' },
        { id: 'dfs1-93', title: '「中级」93. 复原 IP 地址（回溯 I）', url: 'https://leetcode.cn/problems/restore-ip-addresses' },
        { id: 'dfs1-89', title: '「中级」89. 格雷编码（回溯 I）', url: 'https://leetcode.cn/problems/gray-code' },
        { id: 'dfs1-17', title: '「中级」17. 电话号码的字母组合（回溯 I）', url: 'https://leetcode.cn/problems/letter-combinations-of-a-phone-number' },
        { id: 'dfs1-79', title: '「中级」79. 单词搜索（回溯 I）', url: 'https://leetcode.cn/problems/word-search' },
        { id: 'dfs1-473', title: '「中级」473. 火柴拼正方形（回溯 I）', url: 'https://leetcode.cn/problems/matchsticks-to-square' },

        // 回溯（DFS）经典习题 II
        { id: 'dfs2-1219', title: '「中级」1219. 黄金矿工（回溯 II）', url: 'https://leetcode.cn/problems/path-with-maximum-gold' },
        { id: 'dfs2-1849', title: '「中级」1849. 将字符串拆分为递减的连续值（回溯 II）', url: 'https://leetcode.cn/problems/splitting-a-string-into-descending-consecutive-values' },
        { id: 'dfs2-1593', title: '「中级」1593. 拆分字符串使唯一子字符串的数目最大（回溯 II）', url: 'https://leetcode.cn/problems/split-a-string-into-the-max-number-of-unique-substrings' },
        { id: 'dfs2-1079', title: '「中级」1079. 活字印刷（回溯 II）', url: 'https://leetcode.cn/problems/letter-tile-possibilities' },
        { id: 'dfs2-996', title: '「高级」996. 正方形数组的数目（回溯 II）', url: 'https://leetcode.cn/problems/number-of-squareful-arrays' },
        { id: 'dfs2-784', title: '「中级」784. 字母大小写全排列（回溯 II）', url: 'https://leetcode.cn/problems/letter-case-permutation' },
        { id: 'dfs2-638', title: '「中级」638. 大礼包（回溯 II）', url: 'https://leetcode.cn/problems/shopping-offers' },

        // 回溯（DFS）经典习题 III
        { id: 'dfs3-301', title: '「高级」301. 删除无效的括号（回溯 III）', url: 'https://leetcode.cn/problems/remove-invalid-parentheses' },
        { id: 'dfs3-2850', title: '「高级」2850. 将石头分散到网格图的最少移动次数（回溯 III）', url: 'https://leetcode.cn/problems/minimum-moves-to-spread-stones-over-grid' },
        { id: 'dfs3-1723', title: '「高级」1723. 完成所有工作的最短时间（回溯 III）', url: 'https://leetcode.cn/problems/find-minimum-time-to-finish-all-jobs' },
        { id: 'dfs3-2305', title: '「高级」2305. 公平分发饼干（回溯 III）', url: 'https://leetcode.cn/problems/fair-distribution-of-cookies' },
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
    
      ],
      problems: [
        { id: 'bt-99', title: '「高级」99. 恢复二叉搜索树', url: 'https://leetcode.cn/problems/recover-binary-search-tree' },
        { id: 'bt-669', title: '「中级」669. 修剪二叉搜索树', url: 'https://leetcode.cn/problems/trim-a-binary-search-tree' },
        { id: 'bt-671', title: '「初级」671. 二叉树中第二小的节点', url: 'https://leetcode.cn/problems/second-minimum-node-in-a-binary-tree' },
        { id: 'bt-501', title: '「初级」501. 二叉搜索树中的众数', url: 'https://leetcode.cn/problems/find-mode-in-binary-search-tree' },
        { id: 'bt-530', title: '「初级」530. 二叉搜索树的最小绝对差', url: 'https://leetcode.cn/problems/minimum-absolute-difference-in-bst' },
        { id: 'bt-653', title: '「初级」653. 两数之和 IV - 输入 BST', url: 'https://leetcode.cn/problems/two-sum-iv-input-is-a-bst' },
        { id: 'bt-1008', title: '「中级」1008. 前序遍历构造二叉搜索树', url: 'https://leetcode.cn/problems/construct-binary-search-tree-from-preorder-traversal' },

        // 二叉搜索树经典例题 II
        { id: 'bst2-108', title: '「初级」108. 将有序数组转换为二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree' },
        { id: 'bst2-1382', title: '「中级」1382. 将二叉搜索树变平衡（BST 经典 II）', url: 'https://leetcode.cn/problems/balance-a-binary-search-tree' },
        { id: 'bst2-449', title: '「中级」449. 序列化和反序列化二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/serialize-and-deserialize-bst' },
        { id: 'bst2-109', title: '「中级」109. 有序链表转换二叉搜索树（BST 经典 II）', url: 'https://leetcode.cn/problems/convert-sorted-list-to-binary-search-tree' },
        { id: 'bst2-173', title: '「中级」173. 二叉搜索树迭代器（BST 经典 II）', url: 'https://leetcode.cn/problems/binary-search-tree-iterator' },
        { id: 'bst2-1305', title: '「中级」1305. 两棵二叉搜索树中的所有元素（BST 经典 II）', url: 'https://leetcode.cn/problems/all-elements-in-two-binary-search-trees' },
      ],
    },
  },

  // ===================== 底部三块 =====================
  {
    id: '20',
    type: 'roadmap',
    position: { x: 300, y: 670 },
    data: {
      label: '项目',
      level: 'high',
      description: '这一部分可有可无，如果你有项目的话你就可以忽略这一部分。你也可以看看这些项目，学习一下项目思路。',
      plan: '3天',
      tutorials: [
        { id: 'proj-video-platform', title: '⭐️ 视频创作平台：创作者分层与生态优化 (数仓项目)', url: 'https://xiaowantree.com/creator-tiers/' },
        { id: 'proj-ads', title: '⭐️ 商业化广告 (数仓项目)', url: 'https://xiaowantree.com/si-ji-ai-si-ji-dao/' },
        {
          id: 'proj-ssg-beginner',
          title: '初学者做 SSG 项目：3 个真实痛点拆解 + 落地方案（附简历模板 + 面试话术 + 场景案例）',
          url: 'https://xiaowantree.com/chu-xue-zhe-zuo-ssg-xiang-mu-3-ge-zhen-shi-tong-dian-chai-jie-luo-di-fang-an-fu-jian-li-mo-ban-mian-shi-hua-zhu-chang-jing-an-li/',
        },
      ],
      problems: [],
    },
  },

  {
    id: '21',
    type: 'roadmap',
    position: { x: 300, y: 740 },
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
    position: { x: 300, y: 810 },
    data: {
      label: '面经',
      level: 'high',
      description: '系统设计/业务场景综合题。',
      plan: '3天',
      tutorials: [
      ],
      problems: [
        { id: 'mj-meituan-rc-intern', title: '美团面经附答案（日常实习）', url: 'https://xiaowantree.com/mei-tuan-yi-mian-ri-chang-shi-xi/' },
        { id: 'mj-bytedance-de-1', title: '字节大数据开发附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-kai-fa/' },
        { id: 'mj-kuande-invest', title: '宽德投资数据开发题目附答案', url: 'https://xiaowantree.com/kuan-de-tou-zi-shu-ju-kai-fa-da-shu-ju-kai-fa-mian-shi-ti-mu/' },
        { id: 'mj-bytedance-intern-convert', title: '字节大数据实习转正跨部门附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-kai-fa-kua-bu-men-zhuan-zheng/' },
        { id: 'mj-jd-de-fulltime', title: '京东大数据开发社招题目附答案', url: 'https://xiaowantree.com/jing-dong-da-shu-ju-kai-fa-data-engineer-she-zhao-xiao-zhao-ke-kan/' },
        { id: 'mj-bytedance-intern-2', title: '字节大数据开发实习跨部门二面面试题目附答案', url: 'https://xiaowantree.com/zi-jie-shu-ju-kai-fa-shu-ju-cang-ku-mian-shi-er-mian/' },
        { id: 'mj-bytedance-de-3', title: '字节大数据开发三面面试题目附答案', url: 'https://xiaowantree.com/zi-jie-shu-ju-kai-fa-mian-shi-ti-mu-fu-da-an/' },
        { id: 'mj-nio-de-1', title: '蔚来数据开发一面面试题目附答案', url: 'https://xiaowantree.com/wei-lai-shu-ju-kai-fa-yi-mian/' },
        { id: 'mj-ant-de-1', title: '蚂蚁数开一面面试题目附答案', url: 'https://xiaowantree.com/ma-yi-shu-ju-kai-fa-mian-shi-ti-mu-mian-jing/' },
        { id: 'mj-bytedance-de-20250825', title: '字节大数据开发一面20250825面试题目附答案', url: 'https://xiaowantree.com/zi-jie-da-shu-ju-yi-mian/' },
        { id: 'mj-meituan-de-20250918', title: '美团大数据开发一面20250918面试题目附答案', url: 'https://xiaowantree.com/mei-tuan-yi-mian-shu-ju-kai-fa-mian-shi-ti-mu-fu-da-an/' },
        { id: 'mj-bytedance-ecom-20250821', title: '字节电商数据开发一面面试题目附答案20250821', url: 'https://xiaowantree.com/zi-jie-dian-shang-shu-ju-kai-fa-yi-mian-mian-shi-ti-mu-fu-da-an-20250821/' },
        { id: 'mj-tencent-pcg-20250310', title: '腾讯-PCG-内容平台-数据工程-一面(2025.3.10)', url: 'https://xiaowantree.com/teng-xun-pcg-nei-rong-ping-tai-shu-ju-gong-cheng-yi-mian-2025-3-10/' },
        { id: 'mj-meituan-intern-202507', title: '美团大数据开发实习 2025年7月', url: 'https://xiaowantree.com/mei-tuan-da-shu-ju-kai-fa-shi-xi-2025nian-7yue/' },
        { id: 'mj-bytedance-lifeservice-20250313', title: '字节跳动-生活服务-大数据开发一面(2025.3.13)', url: 'https://xiaowantree.com/zi-jie-tiao-dong-sheng-huo-fu-wu-da-shu-ju-kai-fa-yi-mian-2025-3-13/' },
        { id: 'mj-kuaishou-de-20250402', title: '快手大数据开发一面2025.4.2', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-yi-mian-2025-4-2/' },
        { id: 'mj-eleme-de-20250314', title: '阿里饿了么大数据开发2025.3.14', url: 'https://xiaowantree.com/a-li-e-liao-yao-da-shu-ju-kai-fa-2025-3-14/' },
        { id: 'mj-meituan-core-20250324', title: '美团-本地商业核心-基础研发部-上海-大数据开发-一面(2025.3.24)', url: 'https://xiaowantree.com/mei-tuan-ben-di-shang-ye-he-xin-ji-chu-yan-fa-bu-shang-hai-da-shu-ju-kai-fa-yi-mian-2025-3-24/' },
        { id: 'mj-kuaishou-de-2-20250408', title: '快手-大数据开发-二面(2025.4.8）', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-er-mian-3-24/' },
        { id: 'mj-bytedance-lifeservice-2-20250325', title: '字节跳动-生活服务-大数据开发-二面(3.25)', url: 'https://xiaowantree.com/zi-jie-tiao-dong-sheng-huo-fu-wu-da-shu-ju-kai-fa-er-mian-2025-3-25/' },
        { id: 'mj-bilibili-de-20250407', title: 'Bilibili-商业化-大数据开发-一面(2025.4.7)', url: 'https://xiaowantree.com/bilibili-shang-ye-hua-da-shu-ju-kai-fa-yi-mian-2025-4-7/' },
        { id: 'mj-baidu-de-20250401', title: '百度-大数据平台开发-一面(2025.4.1)', url: 'https://xiaowantree.com/bai-du-da-shu-ju-ping-tai-kai-fa-yi-mian-2025-4-1/' },
        { id: 'mj-kuaishou-de-2-202504', title: '快手大数据开发二面附答案202504', url: 'https://xiaowantree.com/kuai-shou-da-shu-ju-kai-fa-er-mian-fu-da-an-202504/' },
        { id: 'mj-bytedance-de-20250818', title: '字节跳动大数据开发一面20250818', url: 'https://xiaowantree.com/zi-jie-tiao-dong-da-shu-ju-kai-fa-yi-mian-20250818/' },
        { id: 'mj-jd-retail-1-202509', title: '京东-零售-一面202509', url: 'https://xiaowantree.com/jing-dong-ling-shou-yi-mian-202509/' },
        { id: 'mj-jd-retail-2-202508', title: '京东-零售-二面附答案202508', url: 'https://xiaowantree.com/jing-dong-ling-shou-er-mian-202508/' },
        { id: 'mj-shopee-de-2-202509', title: '虾皮数据开发二面题目附答案202509', url: 'https://xiaowantree.com/xia-pi-shu-ju-kai-fa-er-mian-ti-mu-fu-da-an/' },
        { id: 'mj-bytedance-dw-202508', title: '字节数仓面试题（附答案）202508', url: 'https://xiaowantree.com/zi-jie-shu-cang-mian-shi-ti-202508/' },
        { id: 'mj-china-unicom-dw', title: '中国联通数仓面试题（附答案）', url: 'https://xiaowantree.com/zhong-guo-lian-tong-da-shu-ju/' },
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
        // 动态规划经典习题 I
        { id: 'dp1-343', title: '「中级」343. 整数拆分', url: 'https://leetcode.cn/problems/integer-break' },
        { id: 'dp1-63', title: '「中级」63. 不同路径 II', url: 'https://leetcode.cn/problems/unique-paths-ii' },
        { id: 'dp1-1262', title: '「中级」1262. 可被三整除的最大和', url: 'https://leetcode.cn/problems/greatest-sum-divisible-by-three' },
        { id: 'dp1-120', title: '「中级」120. 三角形最小路径和', url: 'https://leetcode.cn/problems/triangle' },
        { id: 'dp1-368', title: '「中级」368. 最大整除子集', url: 'https://leetcode.cn/problems/largest-divisible-subset' },
        { id: 'dp1-718', title: '「中级」718. 最长重复子数组', url: 'https://leetcode.cn/problems/maximum-length-of-repeated-subarray' },

        // 动态规划经典习题 II
        { id: 'dp2-97', title: '「中级」97. 交错字符串', url: 'https://leetcode.cn/problems/interleaving-string' },
        { id: 'dp2-152', title: '「中级」152. 乘积最大子数组', url: 'https://leetcode.cn/problems/maximum-product-subarray' },
        { id: 'dp2-221', title: '「中级」221. 最大正方形', url: 'https://leetcode.cn/problems/maximal-square' },
        { id: 'dp2-329', title: '「高级」329. 矩阵中的最长递增路径', url: 'https://leetcode.cn/problems/longest-increasing-path-in-a-matrix' },
        { id: 'dp2-1235', title: '「高级」1235. 规划兼职工作', url: 'https://leetcode.cn/problems/maximum-profit-in-job-scheduling' },

        // 背包问题经典习题
        { id: 'knap-1049', title: '「中级」1049. 最后一块石头的重量 II', url: 'https://leetcode.cn/problems/last-stone-weight-ii' },
        { id: 'knap-474', title: '「中级」474. 一和零', url: 'https://leetcode.cn/problems/ones-and-zeroes' },
        { id: 'knap-3180', title: '「中级」3180. 执行操作可获得的最大总奖励 I', url: 'https://leetcode.cn/problems/maximum-total-reward-using-operations-i' },

        // 打家劫舍问题模式
        { id: 'robp-2140', title: '「中级」2140. 解决智力问题', url: 'https://leetcode.cn/problems/solving-questions-with-brainpower' },
        { id: 'robp-2320', title: '「中级」2320. 统计放置房子的方式数', url: 'https://leetcode.cn/problems/count-number-of-ways-to-place-houses' },
        { id: 'robp-983', title: '「中级」983. 最低票价', url: 'https://leetcode.cn/problems/minimum-cost-for-tickets' },
        { id: 'robp-740', title: '「中级」740. 删除并获得点数', url: 'https://leetcode.cn/problems/delete-and-earn' },
        { id: 'robp-2611', title: '「中级」2611. 老鼠和奶酪', url: 'https://leetcode.cn/problems/mice-and-cheese' },
        { id: 'robp-2789', title: '「中级」2789. 合并后数组中的最大元素', url: 'https://leetcode.cn/problems/largest-element-in-an-array-after-merge-operations' },

        // 股票买卖问题（DP）
        { id: 'stock-121', title: '「初级」121. 买卖股票的最佳时机', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock' },
        { id: 'stock-122', title: '「中级」122. 买卖股票的最佳时机 II', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii' },
        { id: 'stock-123', title: '「高级」123. 买卖股票的最佳时机 III', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii' },
        { id: 'stock-188', title: '「高级」188. 买卖股票的最佳时机 IV', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv' },
        { id: 'stock-309', title: '「中级」309. 最佳买卖股票时机含冷冻期', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown' },
        { id: 'stock-714', title: '「中级」714. 买卖股票的最佳时机含手续费', url: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee' },

        // 打家劫舍系列
        { id: 'rob-198', title: '「初级」198. 打家劫舍', url: 'https://leetcode.cn/problems/house-robber' },
        { id: 'rob-213', title: '「中级」213. 打家劫舍 II', url: 'https://leetcode.cn/problems/house-robber-ii' },
        { id: 'rob-337', title: '「中级」337. 打家劫舍 III', url: 'https://leetcode.cn/problems/house-robber-iii' },

        // 贪心算法练习
        { id: 'greedy-45', title: '「中级」45. 跳跃游戏 II', url: 'https://leetcode.cn/problems/jump-game-ii' },
        { id: 'greedy-55', title: '「中级」55. 跳跃游戏', url: 'https://leetcode.cn/problems/jump-game' },
        { id: 'greedy-435', title: '「中级」435. 无重叠区间', url: 'https://leetcode.cn/problems/non-overlapping-intervals' },
        { id: 'greedy-452', title: '「中级」452. 用最少数量的箭引爆气球', url: 'https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons' },
        { id: 'greedy-134', title: '「中级」134. 加油站', url: 'https://leetcode.cn/problems/gas-station' },
        { id: 'greedy-253', title: '「中级」253. 会议室 II', url: 'https://leetcode.cn/problems/meeting-rooms-ii' },
        { id: 'greedy-1024', title: '「中级」1024. 视频拼接', url: 'https://leetcode.cn/problems/video-stitching' },
        { id: 'greedy-1288', title: '「中级」1288. 删除被覆盖区间', url: 'https://leetcode.cn/problems/remove-covered-intervals' },
        { id: 'greedy-56', title: '56. 合并区间', url: 'https://leetcode.cn/problems/merge-intervals' },
        { id: 'greedy-986', title: '986. 区间列表的交集', url: 'https://leetcode.cn/problems/interval-list-intersections' },
      ],
    },
  },
]



// ================= Edges（保持你原样）=================
const initialEdges = [
  { id: 'edge-01', source: '0', target: 'A' },
  { id: 'edge-02', source: '0', target: 'I' },
  { id: 'edge-03', source: '0', target: 'C' },
  { id: 'edge-04', source: '0', target: 'D' },
  { id: 'edge-IH', source: 'I', target: 'H' },
  { id: 'edge-AE', source: 'A', target: 'E' },
  { id: 'edge-AH', source: 'A', target: 'H' },
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





export default function RoadmapFlow({ mode = 'de' }) {
  // ✅ ROADMAP_ID 跟 mode 走（非常关键：否则 /us /de 共用进度）
  const ROADMAP_ID = mode === 'us' ? 'us_roadmap' : 'china_de_roadmap'

  // ✅ 根据 mode 选择一套 nodes/edges 作为“基准数据”
  const { baseNodes, baseEdges } = useMemo(() => {
    const srcNodes = mode === 'us' ? usNodes : initialNodes
    const srcEdges = mode === 'us' ? usEdges : initialEdges
    return {
      baseNodes: cloneNodes(srcNodes),
      baseEdges: cloneEdges(srcEdges),
    }
  }, [mode])

  // ✅ ReactFlow 状态
  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(baseEdges)

  const [activeNode, setActiveNode] = useState(null)

  // ✅ userId 就用 email（未绑定前 = null）
  const [userId, setUserId] = useState(null)

  // ✅ 进度：{ [nodeId]: { [itemId]: true } }
  const [progressMap, setProgressMap] = useState({})

  // ✅ mode 切换时：重置画布 nodes/edges（否则仍是首次 init 那套）
  useEffect(() => {
    setNodes(baseNodes)
    setEdges(baseEdges)
    setActiveNode(null)
  }, [baseNodes, baseEdges, setNodes, setEdges])

  // 1) 等待 App.jsx 绑定 email（或直接从 window 读到）
  useEffect(() => {
    if (window.__ROADMAP_USER_EMAIL__) {
      setUserId(window.__ROADMAP_USER_EMAIL__)
    }

    function onReady() {
      if (window.__ROADMAP_USER_EMAIL__) {
        setUserId(window.__ROADMAP_USER_EMAIL__)
      }
    }

    window.addEventListener('roadmap:user-ready', onReady)
    return () => window.removeEventListener('roadmap:user-ready', onReady)
  }, [])

  // 2) userId 拿到后拉取进度（未登录不拉）——且依赖 ROADMAP_ID（de/us 分开）
  useEffect(() => {
    if (!userId) return

    fetchRoadmapProgress({ roadmapId: ROADMAP_ID, userId })
      .then((data) => {
        setProgressMap(data || {})
      })
      .catch((e) => {
        console.error('[progress] fetch failed', e)
        setProgressMap({})
      })
  }, [userId, ROADMAP_ID])

  // 3) 把进度写回到 node.data.progress（显示进度条）
  useEffect(() => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.type !== 'roadmap') return node

        const tutorials = node.data?.tutorials || []
        const problems = node.data?.problems || []

        // ✅ 只统计有 id 的 item
        const items = [...tutorials, ...problems].filter((it) => it?.id)

        const total = items.length
        const checkedMap = progressMap[node.id] || {}

        const done = items.reduce((acc, it) => {
          const key = it.id
          return acc + (checkedMap[key] ? 1 : 0)
        }, 0)

        return {
          ...node,
          data: {
            ...node.data,
            progress: { done, total },
          },
        }
      })
    )
  }, [progressMap, setNodes])

  // ✅ 勾选/取消：调用后端 + 本地更新（userId = email）
  async function toggleItem({ nodeId, itemId, checked }) {
    if (!userId) {
      alert(
        '您未登录，进度将不会被保存。\n为了您的学习体验，请登录后再使用该学习路径图。'
      )
      return
    }

    if (!itemId) {
      console.warn('[toggleItem] blocked: missing itemId')
      return
    }

    try {
      if (checked) {
        await markItemDone({ roadmapId: ROADMAP_ID, nodeId, itemId, userId })
      } else {
        await unmarkItemDone({ roadmapId: ROADMAP_ID, nodeId, itemId, userId })
      }

      // 本地同步（乐观更新）
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
        proOptions={{ hideAttribution: true }}
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
      </ReactFlow>

      <NodeDrawer
        mode={mode} 
        node={activeNode}
        onClose={() => setActiveNode(null)}
        progressMap={progressMap}
        onToggleItem={toggleItem}
        userId={userId}
      />
    </div>
  )
}