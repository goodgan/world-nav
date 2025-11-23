# World-Nav 📚

一个功能完整的现代化网页导航系统，支持书签管理、智能搜索、分类筛选、置顶功能和安全的管理后台。

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Cloudflare-orange)

## ✨ 核心特性

- 🔍 **智能搜索** - 实时模糊搜索，支持名称/URL/描述
- 📌 **书签置顶** - 重要书签优先显示（最多4个）
- 🎨 **现代设计** - Bootstrap 5 + 自定义样式，响应式布局
- 🔐 **安全登录** - MD5+Salt 加密，Token 持久化
- 🚀 **无服务器** - Cloudflare Workers + KV，全球加速
- 📱 **移动友好** - 完美适配手机和平板设备
- 🎯 **自动图标** - 自动获取网站 Favicon
- 💾 **实时保存** - 数据即时同步到云端

## 技术栈

### 前端
- **HTML5 + CSS3 + JavaScript (ES6+)**
- **Bootstrap 5.3.8** - UI 框架
- **Bootstrap Icons 1.11.1** - 图标库
- **原生 JavaScript** - 无框架依赖
- **响应式设计** - 移动端优先

### 后端
- **Cloudflare Workers** - Edge 计算平台
- **Cloudflare KV** - 分布式键值存储
- **MD5 加密** - 密码哈希（学习用途）
- **RESTful API** - 标准 HTTP 接口

## 📋 功能清单

### 🌐 客户端 (`index.html`)

#### 核心功能
- ✅ **书签展示**
  - 网格布局，卡片式设计
  - 自动获取网站 Favicon（Google Favicon API）
  - 无图标时显示首字母
  - 悬停显示完整描述
  - 点击新标签页打开
  
- ✅ **智能搜索**
  - 实时模糊搜索
  - 支持书签名称搜索
  - 支持 URL 搜索
  - 支持描述搜索
  - 即时显示结果

- ✅ **分类筛选**
  - 下拉框快速切换
  - 显示所有分类
  - 与搜索功能联动

- ✅ **分页显示**
  - 每页显示 12 个书签
  - 智能分页器
  - 显示总数统计
  - 页码跳转

- ✅ **置顶功能**
  - 置顶书签优先显示
  - 绿色边框高亮
  - 📌 置顶标记
  - 自动排序（置顶在前）

- ✅ **其他功能**
  - 实时时钟（年-月-日 时:分:秒）
  - 响应式设计
  - 移动端优化
  - 平滑动画效果

### 🛠️ 管理后台 (`admin.html`)

#### 登录系统
- ✅ **安全登录**
  - MD5 + Salt 加密验证
  - Token 持久化（localStorage）
  - 自动登录（记住状态）
  - 密码显示/隐藏切换
  - 退出登录功能

#### 书签管理
- ✅ **CRUD 操作**
  - ➕ 添加书签
  - ✏️ 编辑书签
  - 🗑️ 删除书签
  - 📋 列表展示

- ✅ **高级功能**
  - 🔍 实时模糊搜索（名称/URL/描述）
  - 🏷️ 分类筛选下拉框
  - 📄 分页显示（10 条/页）
  - 📌 书签置顶（最多 4 个）
  - ⚡ 一键切换置顶状态
  - 🎨 置顶书签绿色高亮
  - 💡 自动获取网站图标
  - ⚠️ 置顶数量限制提示

#### 分类管理
- ✅ **分类操作**
  - 添加分类
  - 编辑分类名称
  - 删除分类
  - 级联删除关联书签
  - 分类列表展示

#### 系统设置
- ✅ **密码管理**
  - 修改管理员密码
  - 修改 Salt 值
  - 当前密码验证
  - 密码显示/隐藏
  - 修改后自动退出

#### UI/UX 优化
- ✅ 圆角设计（10px）
- ✅ 下拉框美化
- ✅ 搜索框优化
- ✅ 按钮悬停效果
- ✅ 表单验证提示
- ✅ 友好的错误信息
- ✅ 响应式布局

## 🔌 后端 API

### API 接口列表

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| `GET` | `/api/data` | 获取所有书签和分类 | ❌ 公开 |
| `POST` | `/api/login` | 管理员登录 | ❌ 公开 |
| `POST` | `/api/data` | 更新书签和分类 | ✅ 需要 |
| `PUT` | `/api/password` | 修改密码和 Salt | ✅ 需要 |

### 接口详细说明

#### 1️⃣ GET `/api/data`
获取所有公开数据（书签和分类）

**请求示例：**
```javascript
const response = await fetch('https://your-worker.workers.dev/api/data');
const data = await response.json();
```

**响应示例：**
```json
{
  "bookmarks": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Google",
      "url": "https://google.com",
      "icon": "https://www.google.com/s2/favicons?domain=google.com&sz=64",
      "desc": "全球最大的搜索引擎",
      "pinned": false
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "常用"
    }
  ]
}
```

#### 2️⃣ POST `/api/login`
管理员登录验证

**请求示例：**
```javascript
const response = await fetch('https://your-worker.workers.dev/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'admin' })
});
const data = await response.json();
```

**响应示例：**
```json
{
  "success": true,
  "token": "f6fdffe48c908deb0f4c3bd36c032e72",
  "salt": "admin"
}
```

#### 3️⃣ POST `/api/data`
更新书签和分类数据（需要认证）

**请求示例：**
```javascript
const response = await fetch('https://your-worker.workers.dev/api/data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-token-here'
  },
  body: JSON.stringify({
    bookmarks: [...],
    categories: [...]
  })
});
```

**响应示例：**
```json
{
  "success": true
}
```

#### 4️⃣ PUT `/api/password`
修改管理员密码和 Salt（需要认证）

**请求示例：**
```javascript
const response = await fetch('https://your-worker.workers.dev/api/password', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'your-token-here'
  },
  body: JSON.stringify({
    currentPassword: 'admin',
    newPassword: '123456',
    newSalt: 'newsalt'
  })
});
```

**响应示例：**
```json
{
  "success": true
}
```

### 📦 数据结构

#### Bookmark（书签对象）
```typescript
interface Bookmark {
  id: number;              // 唯一标识
  categoryId: number;      // 所属分类 ID
  name: string;            // 书签名称
  url: string;             // 网址
  icon: string;            // 图标 URL（自动获取）
  desc: string;            // 描述
  pinned: boolean;         // 是否置顶
}
```

#### Category（分类对象）
```typescript
interface Category {
  id: number;              // 唯一标识
  name: string;            // 分类名称
}
```

#### Auth（认证对象）
```typescript
interface Auth {
  passwordHash: string;    // MD5(password + salt)
  salt: string;            // 盐值
}
```

#### 完整数据库结构
```json
{
  "bookmarks": [Bookmark],
  "categories": [Category],
  "auth": Auth
}
```

### 🔐 安全机制

#### 密码加密
- **算法**：MD5（仅用于学习，生产环境请使用 bcrypt）
- **加盐**：`MD5(password + salt)`
- **默认密码**：`admin`
- **默认 Salt**：`admin`
- **Hash 值**：`f6fdffe48c908deb0f4c3bd36c032e72`

#### 认证流程
1. 用户输入密码
2. 后端计算 `MD5(password + salt)`
3. 比较计算结果与数据库中的 `passwordHash`
4. 验证通过返回 token（即 passwordHash）
5. 后续请求携带 token 在 `Authorization` header 中

#### CORS 配置
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

#### 图标获取
使用 Google Favicon API 自动获取网站图标：
```javascript
icon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
```

## 部署方法

### 1. 本地开发

#### 安装依赖
```bash
cd backend
npm install
```

#### 启动后端
```bash
cd backend
npx wrangler dev
```
后端将运行在 `http://localhost:8787`

#### 访问前端
直接在浏览器打开：
- 公共页面：`frontend/index.html`
- 管理后台：`frontend/admin.html`

**默认登录信息**：
- 密码：`admin`
- Salt：`admin`

### 2. 生产部署（网页端操作）

#### 步骤 1：部署后端到 Cloudflare Workers

1. **登录 Cloudflare Dashboard**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录您的账号

2. **创建 Worker**
   - 左侧菜单选择 **Workers & Pages**
   - 点击 **Create application** → **Create Worker**
   - 输入名称（如 `world-nav-backend`）
   - 点击 **Deploy**

3. **编辑 Worker 代码**
   - 部署后点击 **Edit code** 按钮
   - 删除默认代码
   - 复制 `backend/src/worker.js` 的全部内容
   - 粘贴到编辑器中
   - 点击右上角 **Save and Deploy**

4. **创建 KV 命名空间**
   - 返回 Workers & Pages 页面
   - 左侧菜单选择 **KV**
   - 点击 **Create a namespace**
   - 命名为 `WORLD_NAV_KV`
   - 点击 **Add**

5. **绑定 KV 到 Worker**
     ```javascript
     const API_URL = 'https://your-worker.workers.dev/api';
     ```
   - 将 `your-worker.workers.dev` 替换为您的实际 Worker URL

2. **推送代码到 GitHub**
   ```bash
   git add .
   git commit -m "更新 API 地址"
   git push
   ```

3. **在 Cloudflare Pages 部署**
   - 在 Cloudflare Dashboard，选择 **Workers & Pages**
   - 点击 **Create application** → **Pages** → **Connect to Git**
   - 选择您的 GitHub 仓库
   - 构建设置：
     - 框架预设：None
     - 构建命令：留空
     -部署命令：echo "No build needed"
     - 非生产分支部署命令：留空
     - 构建输出目录：`frontend`
   - 点击 **Save and Deploy**

4. **访问您的网站**
   - 部署完成后，Cloudflare Pages 会提供一个 URL
   - 访问该 URL 即可使用您的导航网站

### 3. 其他部署选项

- **前端**：可部署到任何静态托管服务（Vercel、Netlify、GitHub Pages 等）
- **后端**：必须部署到 Cloudflare Workers（或修改代码适配其他平台）

## 📂 项目结构

```
world-nav/
├── frontend/                      # 前端文件
│   ├── index.html                # 🌐 客户端主页
│   ├── admin.html                # 🛠️ 管理后台
│   ├── debug.html                # 🐛 调试页面
│   ├── css/
│   │   └── style.css             # 自定义样式
│   ├── js/
│   │   ├── app.js                # 客户端逻辑（搜索/筛选/分页）
│   │   ├── admin.js              # 管理端逻辑（CRUD/登录）
│   │   └── md5.js                # MD5 加密库
│   └── assets/
│       └── bootstrap/            # Bootstrap 5.3.8 本地文件
│           ├── css/
│           └── js/
├── backend/                       # 后端文件
│   ├── src/
│   │   └── worker.js             # Cloudflare Worker API
│   ├── package.json              # 依赖配置
│   └── wrangler.toml             # Worker 部署配置
├── db.json                        # 初始数据模板
├── README.md                      # 📖 项目文档
├── IMPLEMENTATION_SUMMARY.md      # 📋 实现总结
├── FEATURES_COMPARISON.md         # 🔄 功能对比
├── TESTING_CHECKLIST.md           # ✅ 测试清单
└── QUICK_START.md                 # 🚀 快速上手
```

### 核心文件说明

#### 前端核心文件

**`frontend/index.html`** - 客户端主页
- 书签展示网格
- 搜索和筛选组件
- 分页器
- 实时时钟

**`frontend/admin.html`** - 管理后台
- 登录界面
- 书签管理（CRUD）
- 分类管理
- 系统设置

**`frontend/js/app.js`** - 客户端逻辑
```javascript
// 主要功能
- fetchData()              // 从 API 获取数据
- renderBookmarks()        // 渲染书签卡片
- filterBookmarks()        // 搜索和筛选
- renderPagination()       // 分页控制
- updateClock()            // 实时时钟
```

**`frontend/js/admin.js`** - 管理端逻辑
```javascript
// 主要功能
- handleLogin()            // 登录验证
- handlePasswordChange()   // 修改密码
- saveBookmark()           // 保存书签（自动获取图标）
- togglePin()              // 切换置顶状态
- filterAndRenderBookmarks() // 搜索筛选分页
- renderAdminPagination()  // 管理端分页器
```

**`frontend/js/md5.js`** - MD5 加密
```javascript
// 纯前端 MD5 实现
- md5(string)              // 返回 MD5 哈希值
```

**`frontend/css/style.css`** - 自定义样式
```css
/* 主要样式 */
- 书签卡片样式
- 置顶书签高亮（绿色边框）
- 搜索框和下拉框美化
- 分页器样式
- 响应式布局
- 密码显示按钮
```

#### 后端核心文件

**`backend/src/worker.js`** - Cloudflare Worker
```javascript
// API 路由处理
export default {
  async fetch(request, env, ctx) {
    // OPTIONS 请求（CORS 预检）
    // GET /api/data        - 获取数据
    // POST /api/login      - 登录验证
    // POST /api/data       - 更新数据
    // PUT /api/password    - 修改密码
  }
}

// 核心函数
- getDb(env)               // 从 KV 读取数据库
- handleGetData()          // 处理获取数据请求
- handleLogin()            // 处理登录请求
- handleUpdateData()       // 处理更新数据请求
- handleUpdatePassword()   // 处理修改密码请求
```

**`backend/wrangler.toml`** - Worker 配置
```toml
name = "world-nav-backend"
main = "src/worker.js"
compatibility_date = "2024-01-01"

[[kv_namespaces]]
binding = "WORLD_NAV_KV"
id = "your-kv-namespace-id"
```

#### 数据文件

**`db.json`** - 初始数据模板
```json
{
  "bookmarks": [
    {
      "id": 1,
      "categoryId": 1,
      "name": "Google",
      "url": "https://google.com",
      "icon": "",
      "desc": "全球最大的搜索引擎",
      "pinned": false
    }
  ],
  "categories": [
    {"id": 1, "name": "常用"},
    {"id": 2, "name": "开发"},
    {"id": 3, "name": "工具"}
  ],
  "auth": {
    "passwordHash": "f6fdffe48c908deb0f4c3bd36c032e72",
    "salt": "admin"
  }
}
```

## ⚠️ 注意事项

### 安全相关
1. **立即修改默认密码**
   - 默认密码：`admin`
   - 首次登录后请在"系统设置"中修改

2. **MD5 加密说明**
   - ⚠️ MD5 已不安全，仅用于学习和演示
   - 生产环境强烈建议使用 bcrypt 或 Argon2
   - 详见 [为什么 MD5 不安全](#为什么-md5-不安全)

3. **Token 持久化**
   - Token 保存在 localStorage
   - 关闭浏览器后仍保持登录
   - 如需退出请点击"退出登录"

### 数据相关
4. **数据存储**
   - `db.json` 仅是初始模板
   - 实际数据存储在 Cloudflare KV
   - KV 数据全球同步，延迟极低

5. **数据备份**
   - 建议定期导出数据备份
   - 可通过 Cloudflare Dashboard 管理 KV 数据

### 部署相关
6. **CORS 配置**
   - 已配置 `Access-Control-Allow-Origin: *`
   - 如需限制来源，修改 worker.js 中的 corsHeaders

7. **自定义域名**
   - Worker 和 Pages 都支持自定义域名
   - 在 Cloudflare Dashboard 中配置 DNS

8. **API 地址配置**
   - 前端代码中需要修改 API_URL
   - 文件：`frontend/js/app.js` 和 `frontend/js/admin.js`
   - 改为你的 Worker URL

### 功能限制
9. **置顶书签上限**
   - 最多 4 个置顶书签
   - 超出会提示："置顶书签已满，如需置顶请先撤销其他书签置顶！"

10. **浏览器兼容性**
    - 支持现代浏览器（Chrome、Firefox、Safari、Edge）
    - 需要支持 ES6+ 语法
    - 需要支持 localStorage

## 🔍 为什么 MD5 不安全

### MD5 的问题
- ❌ **碰撞攻击**：不同输入可产生相同哈希
- ❌ **彩虹表**：常见密码的 MD5 已被收录
- ❌ **计算太快**：GPU 每秒可计算数十亿次
- ❌ **无法抵抗暴力破解**

### 推荐的替代方案

#### 1. Bcrypt（推荐）
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

// 加密
const hash = await bcrypt.hash('admin', saltRounds);

// 验证
const isMatch = await bcrypt.compare('admin', hash);
```

**优点**：
- ✅ 自动加盐
- ✅ 故意设计得慢（抵抗暴力破解）
- ✅ 可配置工作因子
- ✅ 广泛使用，成熟稳定

#### 2. Argon2（最新推荐）
```javascript
const argon2 = require('argon2');

// 加密
const hash = await argon2.hash('admin');

// 验证
const isMatch = await argon2.verify(hash, 'admin');
```

**优点**：
- ✅ 2015 年密码哈希竞赛冠军
- ✅ 抵抗 GPU 和 ASIC 攻击
- ✅ 内存密集型
- ✅ 目前最安全

### 安全性对比

| 算法 | 速度 | 抗暴力破解 | 推荐使用 |
|------|------|-----------|---------|
| MD5 | 极快 | ❌ 极弱 | ❌ 不推荐 |
| SHA-256 | 快 | ⚠️ 较弱 | ⚠️ 不推荐存密码 |
| Bcrypt | 慢 | ✅ 强 | ✅ 推荐 |
| Argon2 | 慢 | ✅ 最强 | ✅✅ 最推荐 |

## 🐛 常见问题

### Q1: 登录后刷新页面需要重新登录？
**A**: 检查浏览器是否禁用了 localStorage。Token 保存在 localStorage 中实现持久化登录。

### Q2: 修改密码后无法登录？
**A**: 
1. 检查新密码是否正确
2. 如果修改了 Salt，需要用新密码 + 新 Salt 登录
3. 如果忘记密码，需要手动修改 KV 中的数据

### Q3: 置顶书签不显示在最前面？
**A**: 强制刷新页面（Ctrl+F5），确保加载最新代码。

### Q4: 图标无法显示？
**A**: 
1. 检查网络连接（需要访问 Google Favicon API）
2. 某些网站可能没有 Favicon
3. 会自动显示首字母作为替代

### Q5: API 请求失败？
**A**: 
1. 检查 Worker 是否正常运行
2. 检查 API_URL 是否配置正确
3. 检查浏览器控制台错误信息
4. 确认 CORS 配置正确

### Q6: 如何备份数据？
**A**: 
1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages → KV
3. 选择 WORLD_NAV_KV
4. 找到 `db` 键，复制值
5. 保存为 JSON 文件

### Q7: 如何恢复数据？
**A**: 
1. 在 KV 页面点击 "Add entry"
2. Key 输入：`db`
3. Value 粘贴备份的 JSON
4. 点击保存



## 👨‍💻 作者

Made with ❤️ by [GoodGan](https://github.com/GoodGan)

---

**如果这个项目对你有帮助，请给个 ⭐ Star！**