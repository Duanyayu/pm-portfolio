# Jira Cloud REST API 对接指南

**版本**：V1.0
**适用**：Jira Cloud (atlassian.net)
**API 版本**：v3

---

## 1. 前置准备

### 1.1 获取 API Token
1. 登录 [https://id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. 点击 "Create API token"
3. 输入 Label（如 `dashboard-integration`）
4. 复制生成的 Token（仅显示一次，请妥善保存）

### 1.2 确认 Jira Cloud URL
- 格式：`https://{your-domain}.atlassian.net`
- 示例：`https://yourcompany.atlassian.net`

### 1.3 确认 Project Key
- 在 Jira 中进入目标项目
- 左侧菜单 → Project Settings → Details → Key
- 示例：`MAR5`

### 1.4 认证方式
Jira Cloud REST API 使用 HTTP Basic Auth：
- **用户名**：你的 Atlassian 账号邮箱
- **密码**：上面创建的 API Token

```bash
# 示例 curl
curl -u "your-email@example.com:your-api-token" \
  "https://your-domain.atlassian.net/rest/api/3/project/MAR5"
```

---

## 2. 常用 API 端点

### 2.1 获取项目信息
```bash
curl -u "email:token" \
  "https://your-domain.atlassian.net/rest/api/3/project/{projectKey}"
```

### 2.2 获取 Sprint 列表
```bash
curl -u "email:token" \
  "https://your-domain.atlassian.net/rest/agile/1.0/board/{boardId}/sprint"
```

### 2.3 获取 Board 中的 Issues
```bash
curl -u "email:token" \
  "https://your-domain.atlassian.net/rest/agile/1.0/board/{boardId}/issue"
```

### 2.4 搜索 Issues（JQL）
```bash
curl -u "email:token" \
  -H "Content-Type: application/json" \
  -X POST \
  --data '{"jql":"project = MAR5 AND sprint in openSprints()","maxResults":50}' \
  "https://your-domain.atlassian.net/rest/api/3/search"
```

### 2.5 创建 Issue
```bash
curl -u "email:token" \
  -H "Content-Type: application/json" \
  -X POST \
  --data '{
    "fields": {
      "project": {"key": "MAR5"},
      "summary": "底部风道结构重新设计",
      "description": "重新设计底部进风口、内部导流结构...",
      "issuetype": {"name": "Story"},
      "priority": {"name": "High"}
    }
  }' \
  "https://your-domain.atlassian.net/rest/api/3/issue"
```

### 2.6 获取 Issue 的 Sprint 信息
```bash
curl -u "email:token" \
  "https://your-domain.atlassian.net/rest/agile/1.0/issue/{issueKey}"
```

---

## 3. 仪表盘对接配置

### 3.1 配置 `dashboard/js/data.js` 中的 Jira 开关

```javascript
// data.js 中的 Jira 配置
APP_DATA.jira = {
  enabled: false,        // 改为 true 启用 Jira 实时数据
  baseUrl: 'https://your-domain.atlassian.net',
  projectKey: 'MAR5',
  // 注意：API Token 不应写在前端代码中（见 3.2 的安全说明）
};
```

### 3.2 安全注意事项

**重要**：Jira API Token 不应直接写在前端 JavaScript 中，因为任何打开 HTML 的人都能看到。

推荐的三种方案：

| 方案 | 适用场景 | 复杂度 |
|------|----------|--------|
| **A. 浏览器直接弹窗询问** | 面试演示时手动输入 | 低 |
| **B. 本地代理服务器** | 正式开发环境 | 中 |
| **C. 仅使用模拟数据** | 离线演示（默认） | 零 |

#### 方案 A：浏览器弹窗（推荐演示用）
`jira-connector.js` 会检测到需要认证时弹出对话框，让用户输入邮箱和 Token，存入 `sessionStorage`（关闭浏览器后自动清除）。

#### 方案 B：本地代理
在本地运行一个简单的代理服务（如 Node.js + `http-proxy`），Token 存储在服务端环境变量中。浏览器请求代理地址而非直接请求 Jira。

```bash
# 启动代理（示例）
JIRA_EMAIL=your-email JIRA_TOKEN=your-token node proxy.js
```

### 3.3 CORS 问题处理

Jira Cloud API **不支持**浏览器直接跨域调用（CORS headers 未设置）。

**解决方案**：
- **方案 A**：部署到 Confluence，与 Jira 同域（推荐，见 3.4）
- **方案 B**：使用本地代理服务器，绕过 CORS
- **方案 C**：使用浏览器插件禁用 CORS（仅限开发/演示）
- **方案 D**：仅使用模拟数据（默认，离线可用）

> 仪表盘默认使用模拟数据，即使 Jira 连接失败也不影响演示。

### 3.4 Confluence 部署（方案 A：同域解决 CORS）

**原理**：Confluence Cloud 与 Jira Cloud 共享 `*.atlassian.net` 域。将仪表盘部署到 Confluence 页面后，JavaScript 对 Jira API 的请求属于同源请求，不受 CORS 限制。

> ⚠️ **已知限制**：Confluence Cloud 的内置 HTML Macro 将内容渲染在沙箱 iframe 中，可能仍会阻断 fetch 请求。如果你遇到此问题，可尝试以下替代方案：
> - 使用 Confluence 的 "HTML for Confluence" 第三方 App（支持无沙箱模式）
> - 使用 Confluence Server/Data Center 版（无 iframe 限制）
> - 方案 B（本地代理）兜底

#### 部署步骤

**步骤 1：配置 Jira 地址**
打开 `dashboard/confluence.html`，搜索 `baseUrl`，将值改为你的 Jira Cloud 地址：
```javascript
// 在文件中搜索 baseUrl 并修改
baseUrl: 'https://your-company.atlassian.net',
```

**步骤 2：在 Confluence 中创建页面**
1. 登录 Confluence → 进入目标 Space
2. 点击 "创建"（Create）→ 空白页面
3. 输入页面标题（如 "Mars 5 Ultra 散热优化仪表盘"）

**步骤 3：插入 HTML Macro**
1. 在编辑器中输入 `/html` 或点击 "+" → "其他宏" → 搜索 "HTML"
2. 选择 "HTML" 宏

**步骤 4：粘贴仪表盘代码**
1. 用文本编辑器打开 `dashboard/confluence.html`
2. 全选复制全部内容（约 67KB）
3. 粘贴到 HTML 宏的输入框中
4. 点击 "插入" → "发布"（或 "更新"）

**步骤 5：验证**
1. 发布后，在 Confluence 页面中应能看到仪表盘完整渲染
2. 打开"Jira 实时"开关
3. 输入你的 Jira 邮箱和 API Token
4. 由于 Confluence 与 Jira 同域，请求应该成功

#### 如果 Confluence HTML Macro 仍报 CORS 错误

尝试以下替代方案：
- **Confluence 附件 + HTML Include App**：将 `confluence.html` 上传为页面附件，使用支持完整 JS 执行的第三方 HTML App 加载
- **回退到本地代理（方案 B）**：在本地运行一个 Node.js 代理，浏览器访问 `http://localhost:3000` 打开仪表盘
- **回退到模拟数据**：关闭 Jira 实时开关，仪表盘仍可完整演示所有功能

---

## 4. 仪表盘数据流

```
用户打开 dashboard/index.html
  │
  ├── 加载 data.js（模拟数据，始终可用）
  │
  ├── 检查 jira.enabled
  │     │
  │     ├── false (默认) → 使用模拟数据渲染仪表盘
  │     │
  │     └── true → jira-connector.js 尝试获取实时数据
  │           │
  │           ├── 成功 → 合并覆盖模拟数据 → 渲染
  │           │
  │           └── 失败 (CORS/Auth/Network) → 降级到模拟数据 → 渲染（控制台打印错误详情）
```

---

## 5. 测试连接

### 命令行快速测试
```bash
# 测试认证是否成功
curl -u "your-email@example.com:your-api-token" \
  -I "https://your-domain.atlassian.net/rest/api/3/myself"

# 成功时返回 HTTP 200，失败返回 401
```

### 在仪表盘中测试
1. 配置 `data.js` 中的 `jira.enabled = true` 和 `jira.baseUrl`
2. 打开 `dashboard/index.html`
3. 页面加载后弹出认证对话框，输入邮箱和 API Token
4. 观察控制台日志：成功的请求会打印 `[Jira] Connected`，失败会打印错误详情
5. 在页面右上角切换"实时数据 / 模拟数据"模式

---

## 6. 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| 401 Unauthorized | API Token 错误或过期 | 重新生成 Token |
| 404 Not Found | Project Key 或 Issue Key 错误 | 检查 Key 拼写 |
| CORS Error (控制台) | 浏览器直接调用 Jira API | 使用本地代理（见 3.3） |
| 数据不更新 | 本地缓存 | 切换"实时数据"开关或清除浏览器缓存 |
| 403 Forbidden | 账号没有该项目的权限 | 检查 Jira 项目权限设置 |

---

## 7. 参考资料

- [Jira Cloud REST API v3 文档](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Jira Agile REST API 文档](https://developer.atlassian.com/cloud/jira/software/rest/intro/)
- [Atlassian API Token 管理](https://id.atlassian.com/manage-profile/security/api-tokens)
