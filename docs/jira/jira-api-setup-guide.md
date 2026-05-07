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
- **方案 A（推荐）**：使用本地代理服务器，绕过 CORS
- **方案 B**：使用浏览器插件禁用 CORS（仅限开发/演示）
- **方案 C**：使用 Jira 的 `atlascode` 或官方浏览器扩展

> 仪表盘默认使用模拟数据（`data.js` 中的 `APP_DATA`），即使 Jira 连接失败也不会影响演示。

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
