# roadmap-react

数据工程学习路线图前端项目（React + Vite + React Flow）。

最后更新：2026-02-14

## 1. 项目概览

本项目用于展示数据工程学习路线图，支持：

- 以可视化节点图方式浏览学习阶段和知识点
- 点击节点查看教程链接、题目链接
- DE / US 两种模式切换（当前是同一套 UI 壳，后续可分数据）
- 通过 `/api` 接口读取和写入学习进度

当前线上部署路径基于 `vite.config.js` 配置：

- `base: '/roadmap/'`

所以线上入口通常是：

- `https://xiaowantree.com/roadmap/`

## 2. 技术栈

- React 19
- Vite 7
- React Router (`HashRouter`)
- React Flow
- ESLint

## 3. 目录结构

```text
src/
  App.jsx                  # 路由入口，DE/US 页面壳
  main.jsx                 # 应用挂载（HashRouter）
  RoadmapFlow.jsx          # 路线图节点与边数据（核心内容维护文件）
  StageLegend.jsx          # 左上角图例/说明
  api/roadmap.js           # 进度相关 API 封装
  components/              # 各类节点组件 + 抽屉组件
  assets/                  # 品牌图片、图标资源
vite.config.js             # base 与本地代理配置
README.md                  # 当前文档
```

## 4. 环境要求

- Node.js 18+
- npm
- 可访问服务器的 SSH 权限（用于部署）

安装依赖：

```bash
npm install
```

## 5. 本地开发

启动开发服务器：

```bash
npm run dev
```

常用本地地址：

- `http://127.0.0.1:5173/roadmap/`
- `http://127.0.0.1:5173/roadmap/#/de`
- `http://127.0.0.1:5173/roadmap/#/us`

说明：

- 项目使用 `HashRouter`，路由最终会体现在 `#/...`
- `App.jsx` 中 `/` 会重定向到 `/de`

## 6. 常用命令

```bash
# 本地开发
npm run dev

# 生产构建
npm run build

# 本地预览构建产物
npm run preview

# 代码检查
npm run lint
```

## 7. 内容维护（最常改）

路线图内容主要在 `src/RoadmapFlow.jsx`。

每个节点通常包含：

- `label`：节点标题
- `description`：节点描述
- `tutorials`：教程列表（`id`、`title`、`url`）
- `problems`：题目列表（`id`、`title`、`url`）

示例（简化）：

```jsx
{
  id: '25',
  type: 'roadmap',
  data: {
    label: 'Hive',
    tutorials: [
      {
        id: 'Hive-1',
        title: 'Hive面试宝典:从核心架构到调优实战',
        url: 'https://xiaowantree.com/hivemian-shi-bao-dian-cong-he-xin-jia-gou-dao-diao-you-shi-zhan/',
      },
    ],
    problems: [],
  },
}
```

维护建议：

- `id` 尽量保持稳定，避免进度映射错乱
- `url` 尽量使用完整 `https://...` 绝对链接
- 修改后先本地验证点击是否跳转正确，再部署

## 8. API 与进度机制

API 封装文件：`src/api/roadmap.js`

- 基础路径：`/api`
- 请求会带 `credentials: 'include'`

主要接口：

- `GET /api/roadmap/whoami`
- `GET /api/roadmaps/:roadmapId/progress?user_id=...`
- `PUT /api/roadmaps/:roadmapId/nodes/:nodeId/items/:itemId`
- `DELETE /api/roadmaps/:roadmapId/nodes/:nodeId/items/:itemId?user_id=...`

本地开发代理见 `vite.config.js`：

- `/api` -> `https://xiaowantree.com`

## 9. 生产部署（当前服务器）

### 9.1 构建

```bash
npm run build
```

构建产物在 `dist/`。

### 9.2 上传到服务器

```bash
scp -i ~/.ssh/id_rsa -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new -r dist/* ubuntu@119.28.179.118:/home/ubuntu/ghost-blog/roadmap-dist/
```

### 9.3 部署后校验（推荐）

校验线上页面引用是否是新资源：

```bash
curl -s https://xiaowantree.com/roadmap/ | rg "index-.*\\.js|index-.*\\.css" -o
```

远端看文件时间：

```bash
ssh -i ~/.ssh/id_rsa -o IdentitiesOnly=yes ubuntu@119.28.179.118 "ls -lt /home/ubuntu/ghost-blog/roadmap-dist/assets | head -n 8"
```

## 10. 部署到你自己的服务器（必须写的代码）

如果你要把项目迁移到你自己的域名和服务器，至少要改这 3 个地方：

1. `vite.config.js` 的 `base`
2. `vite.config.js` 的 `/api` 代理目标
3. 服务器（如 Nginx）的静态目录和 `/api` 反向代理

### 10.1 推荐把 `vite.config.js` 改成环境变量版本

把 `vite.config.js` 改成下面这样（推荐）：

```js
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE_PATH || '/roadmap/'
  const apiTarget = env.VITE_API_TARGET || 'https://xiaowantree.com'

  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
```

### 10.2 新建生产环境变量

在项目根目录新建 `.env.production`：

```bash
VITE_BASE_PATH=/roadmap/
VITE_API_TARGET=https://your-domain.com
```

说明：

- 如果你要部署在根路径，把 `VITE_BASE_PATH` 改成 `/`
- 如果后端 API 不在同域，`VITE_API_TARGET` 写后端完整域名

### 10.3 Nginx 配置示例（可直接改）

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态目录（上传 dist 的位置）
    root /var/www/roadmap;
    index index.html;

    # 前端站点
    location /roadmap/ {
        try_files $uri $uri/ /roadmap/index.html;
    }

    # API 反向代理
    location /api/ {
        proxy_pass http://127.0.0.1:2368/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 10.4 你的服务器部署命令模板

```bash
# 1) 本地构建
npm run build

# 2) 上传到你的服务器静态目录
rsync -avz --delete dist/ user@your-server:/var/www/roadmap/

# 3) 重载 Nginx
ssh user@your-server "sudo nginx -t && sudo systemctl reload nginx"
```

### 10.5 最终访问地址如何判断

- `VITE_BASE_PATH=/roadmap/` -> `https://your-domain.com/roadmap/`
- `VITE_BASE_PATH=/` -> `https://your-domain.com/`

## 11. 同步到 GitHub

示例：推送到 `newlevi` 分支

```bash
git add -A
git commit -m "chore: sync latest local roadmap updates"
git push origin HEAD:newlevi
```

查看分支是否已更新：

```bash
git ls-remote --heads origin newlevi
```

## 12. URL 健康检查（可选）

可以批量检查 `src` 内 URL 是否返回 4xx/5xx（不改代码）：

```bash
rg -n --no-heading --glob '!src/RoadmapFlow.backup-*.jsx' "url:\\s*'[^']+'" src
```

建议在部署前后都做一次抽样检查，重点看刚改过的链接。

## 13. 常见问题排查

1. 端口 5173 已占用  
使用 `lsof -nP -iTCP:5173 -sTCP:LISTEN` 查占用进程，确认是否已有 Vite 在跑。

2. 页面没更新  
先强刷浏览器缓存，再检查线上是否引用了新的 `index-xxxx.js`。

3. `scp` 或 `rsync` 上传失败  
检查私钥路径、服务器 IP、目标目录权限、网络连通性。

4. 本地接口请求失败  
检查 `vite.config.js` 代理是否正确，确认后端 `/api` 服务可用。
