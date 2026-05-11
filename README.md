# 我是[你的名字]——从硬件测试到硬件 PM

> 我是一名电网设备硬件测试工程师，正在寻找 3D 打印行业的硬件产品经理机会。
> 这个仓库不是"一个项目的文档"——**它是我作为产品经理的完整能力证明。**

---

## 你看完这个页面需要 3 分钟。但如果要深入看证据，你需要 15 分钟。

### 在线演示（推荐）

👉 **[点此打开我的产品经理仪表盘](https://duanyayu.github.io/pm-portfolio/dashboard/)** — 浏览器直接打开，无需安装任何东西。包含燃尽图、拖拽看板、风险矩阵、Jira 连接器等 7 个功能模块。

### 我做了什么

过去一年，我在电网设备测试工作中发现——**这个行业没有产品经理岗位，但 PM 要做的事（需求分析、跨部门协同、缺陷闭环、验证迭代）并不会凭空消失。它被打散在不同角色身上。而测试部，恰好是离"问题全貌"最近的位置。**

我主动承担了跨部门协调的角色。最典型的一个案例是 TU36 海外电表的电源柜兼容性问题——我通过 6 组对照实验，在 2 天内定位到供应商设备的带载能力边界，推动了硬件研发、嵌入式软件、测试、供应商四方的协同闭环。

然后我做了这件事：**把这段经历用产品经理的工具和方法论重新翻译了一遍。**

### 我的作品集包含什么

**如果你只有 5 分钟，看这三个：**

| 优先级 | 看什么 | 证明什么 |
|---|---|---|
| ⭐⭐⭐ | [**项目管理仪表盘**](https://duanyayu.github.io/pm-portfolio/dashboard/) | Jira/Confluence/敏捷开发流程的工具使用能力 |
| ⭐⭐⭐ | [**散热优化 PRD**](deliverables/thermal-optimization-prd-v1.md) | PRD 撰写、WBS 拆解、任务分解能力 |
| ⭐⭐⭐ | [**用户洞察报告**](deliverables/user-insight-report-v1.md) | 市场与用户洞察、数据驱动决策能力 |

**如果你有 15 分钟，再看这三个：**

| 优先级 | 看什么 | 证明什么 |
|---|---|---|
| ⭐⭐ | [**Jira Sprint Board**](https://duanyayu.github.io/pm-portfolio/dashboard/jira-board.html) | Jira Epic/Story/Sub-task 层级管理、敏捷 Scrum 流程 |
| ⭐⭐ | [**Confluence 项目文档空间**](https://duanyayu.github.io/pm-portfolio/dashboard/confluence.html) | Confluence 文档管理、项目信息同步机制 |
| ⭐⭐ | [**测试报告→PRD 改写对照**](deliverables/career-transition/A2-prd-from-test-report.md) | 从执行思维到产品思维的跃迁证据 |

---

## 为什么我能做硬件 PM

我理解 3D 打印的核心产品挑战——**打印质量的可重复性取决于材料、机械精度、固件参数、切片软件的多层依赖。** 这和我在电网设备中处理的"电压→互感器→电路设计→嵌入式固件→测试设备"多层依赖链是同构的。

我做的事：**在没有 PM 的环境中，自己长出了 PM 的工作模式。** 不是在等别人告诉我该做什么——我看到阻塞就去解决，看到系统性风险就推动，看到问题全貌就协调各方。

---

## 我熟悉 Jira 和 Confluence 吗？

是的。这个仓库里有证据：

- [**Jira Sprint Board 模拟**](https://duanyayu.github.io/pm-portfolio/dashboard/jira-board.html) — 我把 TU36 问题闭环拆成了 4 个 Epic、12 个 Story，每个 Story 有 Issue Key、Story Points、Acceptance Criteria、优先级、Sprint 分配。这就是我在 Jira 中管理项目的方式。
- [**Confluence 项目文档空间**](https://duanyayu.github.io/pm-portfolio/dashboard/confluence.html) — 我按 Confluence 的文档树结构组织了项目文档：PRD、设计评审记录、会议纪要、风险登记板、决策日志。这就是我在 Confluence 中维护项目信息的方式。
- [**WBS → Jira 映射表**](docs/jira/wbs-to-jira-mapping.md) — 我理解 PRD 任务如何映射到 Jira 的 Initiative → Epic → Story → Sub-task 层级。
- [**Jira API 对接方案**](docs/jira/jira-api-setup-guide.md) — 我研究过 Jira Cloud REST API v3 的认证、请求格式和错误处理。

---

## 项目结构

```
├── dashboard/                    # 👈 HR 请直接点开这个文件夹的 index.html
│   ├── index.html                #   项目管理仪表盘入口
│   ├── jira-board.html           #   Jira Sprint Board 模拟
│   ├── confluence.html           #   Confluence 文档空间模拟
│   ├── css/                      #   样式文件
│   └── js/                       #   10 个功能模块（1346 行 Vanilla JS）
├── deliverables/                 # 核心交付物（Markdown）
│   ├── user-insight-report-v1.md #   用户洞察报告
│   ├── thermal-optimization-prd-v1.md # 散热优化 PRD
│   └── career-transition/        #   职业转型备战包（11 个文件）
├── docs/                         # 标准模板与方法论文档
│   ├── templates/                #   PRD / 用户报告 / 设计评审 / SOP 模板
│   └── jira/                     #   WBS-Jira 映射 + API 对接指南
└── CLAUDE.md                     # 本项目的工作指引
```

---

## 技术说明

- 仪表盘是纯前端应用——零依赖、零构建、零 `npm install`
- 浏览器直接打开 `dashboard/index.html` 即可完整运行
- 基于 Vanilla JavaScript (IIFE 模块化)、CSS Grid/Flexbox、SVG 图表、HTML5 Drag & Drop API
- Jira 实时数据功能通过 REST API v3 连接，默认使用模拟数据以保证离线演示的稳定性

---

## 联系我

如果你看到这里——我已经证明了我能用自己的方式解决问题。现在我需要一个机会，把这些能力用在真正的产品上。

📧 [你的邮箱]
📱 [你的电话]
🔗 [你的 LinkedIn]
