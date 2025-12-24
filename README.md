# 项目说明（React + Vite）

这是一个使用 Vite 搭建的 React 前端项目。以下内容介绍如何在本地安装依赖、运行开发服务器、构建产物以及把构建结果上传到远端服务器。

## 环境准备
- Node.js 18+（已在仓库中使用 npm）
- npm 包管理器

安装依赖：
```bash
npm install
```

## 本地开发
启动开发服务器（默认端口 5173）：
```bash
npm run dev
```

## 构建生产环境产物
运行构建命令后，会在 `dist/` 目录下生成静态资源：
```bash
npm run build
```

## 将构建结果上传到远端
构建完成后，可通过以下命令把 `dist` 目录内容上传到目标服务器（使用指定的私钥和路径）：
```bash
scp -i ~/.ssh/id_rsa -o IdentitiesOnly=yes -r dist/* ubuntu@119.28.179.118:/home/ubuntu/ghost-blog/roadmap-dist/
```

## 其他说明
- 需要确保本机具备访问远端服务器的网络和 SSH 权限。
- 如果上传失败，请检查密钥路径、服务器可达性以及目标目录的写入权限。
