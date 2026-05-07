# CLAUDE.md — Mars 5 Ultra 产品经理作品集项目

## 项目概述

本项目是硬件产品经理求职面试作品集，展示从用户反馈→洞察→PRD→任务拆解→项目管理→验证闭环的完整产品经理思维链条。所有数据基于公开用户反馈推演，不依赖任何内部信息。

## 核心文件路径

### 交付物
- [用户洞察报告](deliverables/user-insight-report-v1.md) — Mars 5 Ultra 用户深度洞察 V1.0
- [散热优化 PRD](deliverables/thermal-optimization-prd-v1.md) — 散热系统优化专项 PRD V1.0
- [项目管理仪表盘 (原始版)](deliverables/project-dashboard.html) — 修改前对照版本

### 标准文档与模板
- [文档索引](docs/README.md) — 所有文档的导航入口
- [PRD 模板](docs/templates/prd-template.md)
- [用户洞察报告模板](docs/templates/user-insight-report-template.md)
- [设计评审 Checklist](docs/templates/design-review-checklist.md)
- [项目执行 SOP](docs/templates/project-execution-sop.md)
- [需求管理规范](docs/templates/product-requirements-management-standards.md)

### Jira 集成
- [WBS→Jira 映射表](docs/jira/wbs-to-jira-mapping.md) — PRD 任务到 Jira Epic/Story/子任务的映射
- [Jira API 对接指南](docs/jira/jira-api-setup-guide.md) — Jira Cloud REST API 配置说明

### 增强版仪表盘
- [仪表盘入口](dashboard/index.html) — 浏览器直接打开即可演示
- [数据中心](dashboard/js/data.js) — 所有模拟数据的唯一数据源
- [主控脚本](dashboard/js/dashboard.js) — 标签页导航与事件总线

### 开发日志
- [日志模板](dev-log/template.md)
- [日志目录](dev-log/) — 按月组织，每日自动生成

## 工作说明

### 每日日志机制
1. 每次对话结束时，Stop Hook 自动执行 `scripts/dev-log-init.sh`，从模板创建当日日志文件（如 `dev-log/2026-05/2026-05-08.md`）
2. 下次对话开始时，若当日日志仍为空白模板，请提醒用户补充内容
3. 日志模板包含四个板块：已完成、进行中、阻塞项、下一步计划

### 使用模板的方式
- 新建 PRD 时：复制 `docs/templates/prd-template.md`，按章节填写
- 新建用户洞察报告时：复制 `docs/templates/user-insight-report-template.md`
- 设计评审前：逐项核对 `docs/templates/design-review-checklist.md`
- 项目启动时：按 `docs/templates/project-execution-sop.md` 的 Phase-Gate 流程执行
- 管理需求时：遵循 `docs/templates/product-requirements-management-standards.md` 中的 ID 规范和优先级定义

### 仪表盘修改
- 所有模拟数据集中在 `dashboard/js/data.js`，修改数据只改这一个文件
- 各可视化模块（burndown.js、kanban.js 等）通过事件总线通信，修改单个模块不影响其他模块
- Jira 实时数据功能默认关闭，需按 `docs/jira/jira-api-setup-guide.md` 配置后方可启用

### 文档规范
- 所有 Markdown 文件使用 UTF-8 编码
- 文件命名使用小写英文 + 连字符
- 版本号在文件名中体现（如 `-v1`）
