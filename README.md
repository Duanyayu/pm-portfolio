# Mars 5 Ultra 散热优化专项 — 产品经理作品集

## 关于本项目

本项目是硬件产品经理求职面试作品集，完整展示从**用户反馈 → 洞察 → PRD → 任务拆解 → 项目管理 → 验证闭环**的产品思维链条。所有数据基于公开用户反馈推演，不依赖任何内部信息。

## 快速导航

### 核心交付物
| 文件 | 说明 |
|------|------|
| [用户洞察报告](deliverables/user-insight-report-v1.md) | 基于三位真实用户的公开测评，系统化识别 P0/P1/P2 痛点，含竞品推演与产品策略建议 |
| [散热优化 PRD](deliverables/thermal-optimization-prd-v1.md) | 完整的硬件 PRD，含量化目标、功能需求、验收标准、WBS、固件接口定义 |
| [项目管理仪表盘](dashboard/index.html) | 增强版交互仪表盘，含燃尽图、拖拽看板、5×5 风险矩阵、团队负载、Sprint 日历等 7 个模块 |

### 仪表盘演示
```bash
# 直接浏览器打开即可演示，无需任何安装
open dashboard/index.html
```

仪表盘功能模块：
- **概览标签页** — 里程碑时间线 + SVG 燃尽图（理想 vs 实际）+ 风险热力图
- **看板标签页** — 拖拽式任务看板，卡片可在列间拖动，数据持久化到 localStorage
- **风险管理** — 5×5 概率×影响矩阵 + 风险详情表
- **团队负载** — 成员任务数、承诺点数、容量占用率
- **发布日历** — Gantt 风格 Sprint 时间线 + 里程碑标记
- **同步记录** — 结构化会议纪要，按团队过滤
- **Jira 实时数据** — 可选连接 Jira Cloud REST API（默认关闭）

### 标准文档与模板
| 文件 | 适用场景 |
|------|----------|
| [PRD 模板](docs/templates/prd-template.md) | 新功能/优化项需求定义 |
| [用户洞察报告模板](docs/templates/user-insight-report-template.md) | 用户研究结论输出 |
| [设计评审 Checklist](docs/templates/design-review-checklist.md) | 硬件各阶段评审 |
| [项目执行 SOP](docs/templates/project-execution-sop.md) | Phase-Gate 流程管理（含 RACI） |
| [需求管理规范](docs/templates/product-requirements-management-standards.md) | 需求 ID、优先级、追溯、变更控制 |
| [WBS→Jira 映射表](docs/jira/wbs-to-jira-mapping.md) | PRD 任务到 Jira Epic/Story/子任务 |
| [Jira API 对接指南](docs/jira/jira-api-setup-guide.md) | Jira Cloud REST API 配置 |

### 开发日志
- [日志目录](dev-log/) — 每日自动生成（Stop Hook）的开发记录

## 项目结构

```
├── deliveries/          # 核心交付物
├── dashboard/           # 增强版交互仪表盘（纯前端，零依赖）
│   ├── index.html       #   入口
│   ├── css/             #   样式
│   └── js/              #   10 个模块（data, kanban, burndown, risk-matrix, ...）
├── docs/                # 标准文档与模板
│   ├── templates/       #   PRD/用户报告/设计评审/执行SOP/需求管理 模板
│   └── jira/            #   WBS映射 + API指南
├── dev-log/             # 每日开发日志（自动生成）
├── scripts/             # 工具脚本（日志初始化）
├── CLAUDE.md            # Claude Code 项目指引
└── .claude/settings.json # Hook 配置
```

## 技术栈

- **仪表盘**：纯 Vanilla JavaScript (IIFE 模式)、CSS Grid/Flexbox、SVG 图表、HTML5 Drag & Drop API
- **无第三方依赖**，无需 `npm install`，浏览器直接打开即可运行
- **Jira 集成**：REST API v3 + 优雅降级（连接失败时回退模拟数据）
- **自动化日志**：Claude Code Stop Hook → Shell 脚本 → 模板复制

## 演示要点

面试时可按以下流程讲解：

1. **用户洞察报告**（3 分钟）— 展示如何从用户原声→产品化转译→策略建议
2. **散热优化 PRD**（5 分钟）— 展示 PRD 的结构、量化目标、WBS 拆解
3. **项目管理仪表盘**（5 分钟）— 实时演示看板拖拽、燃尽图、风险矩阵
4. **标准模板体系**（2 分钟）— 快速展示项目执行 SOP 和需求管理规范
5. **Jira 集成思维**（2 分钟）— 展示 WBS→Jira 映射表 + API 对接方案
