# WBS → Jira 映射表

**项目**：Mars 5 Ultra 散热优化专项
**Jira 项目 Key**：`MAR5`（建议）
**映射日期**：2026-05-07

---

## 1. 映射规则

| WBS 层级 | 含义 | Jira Issue Type | 说明 |
|----------|------|-----------------|------|
| L1 | 模块/阶段 | **Epic** | 主题性容器，横跨多个 Sprint |
| L2 | 工作包 | **Story** | 可独立交付的用户价值增量，单 Sprint 内完成 |
| L3 | 具体任务 | **Sub-task** | 实现步骤，依附于 Story |
| — | 纯文档/流程类 | **Task** | 不需要 Story 格式的独立任务项 |

### 优先级映射

| PRD 优先级 | Jira Priority |
|------------|---------------|
| P0 | Highest |
| P1 | High |
| P2 | Medium |
| P3 | Low |

### WBS 依赖 → Jira 链接

WBS 中的"依赖"列转换为 Jira 的 Issue Link：
- `depends on` / `blocks` 类型链接

---

## 2. 完整映射表

### Epic 1: 结构散热改造

**Jira Epic**：`MAR5-EPIC-1` — 底部风道与散热结构优化
**Epic 描述**：重新设计底部散热风道，提升气流覆盖效率，为风扇升级提供结构基础

| WBS ID | Jira Issue Type | Jira Summary | 负责人 | Story Points | Sprint |
|--------|----------------|-------------|--------|-------------|--------|
| WBS-01 | Story | 底部风道结构重新设计 | 结构工程师 (周工) | 8 | Sprint 1 |
| — | Sub-task | 现有风道 CFD 建模与热仿真 | 周工 | — | Sprint 1 |
| — | Sub-task | 新风道方案 3D 设计（≥2 方案） | 周工 | — | Sprint 1 |
| — | Sub-task | CFD 仿真对比与方案选定 | 周工 | — | Sprint 1 |
| — | Sub-task | 3D 打印手板制作与装配验证 | 周工 | — | Sprint 2 |

### Epic 2: 散热硬件升级

**Jira Epic**：`MAR5-EPIC-2` — 风扇与隔热硬件升级
**Epic 描述**：升级风扇规格、增加关键元件隔热，达成降温目标

| WBS ID | Jira Issue Type | Jira Summary | 负责人 | Story Points | Sprint |
|--------|----------------|-------------|--------|-------------|--------|
| WBS-02 | Story | 新风扇选型与样品采购 | 硬件/供应链 (陈工/张工) | 5 | Sprint 1-2 |
| — | Sub-task | 同尺寸高风压风扇市场调研 | 陈工 | — | Sprint 1 |
| — | Sub-task | 候选风扇噪音-风量曲线测绘 | 陈工 | — | Sprint 2 |
| — | Sub-task | 风扇选型评审与定标 | 陈工 | — | Sprint 2 |
| — | Sub-task | 样品采购与到货跟踪 | 张工(供应链) | — | Sprint 2 |
| WBS-03 | Story | 关键元件隔热方案验证 | 硬件 (陈工) | 3 | Sprint 2 |
| — | Sub-task | LED 矩阵隔热垫材料选型 | 陈工 | — | Sprint 2 |
| — | Sub-task | 隔热垫安装位置与厚度方案验证 | 陈工 | — | Sprint 2 |
| WBS-07 | Task | BOM 变更评审与成本核算 | 供应链/生产 (张工) | 2 | Sprint 4 |

### Epic 3: 固件温控策略

**Jira Epic**：`MAR5-EPIC-3` — 固件智能温控与风扇 PWM 调速
**Epic 描述**：实现基于多点温度反馈的 PWM 风扇调速策略，含打印结束延时散热

| WBS ID | Jira Issue Type | Jira Summary | 负责人 | Story Points | Sprint |
|--------|----------------|-------------|--------|-------------|--------|
| WBS-04 | Story | 温控 PWM 调速与温度读取 | 固件 (赵工) | 8 | Sprint 2-3 |
| — | Sub-task | 多点热敏电阻点位确认与标定 | 赵工 | — | Sprint 2 |
| — | Sub-task | PWM 驱动实现（含 PID 参数调优） | 赵工 | — | Sprint 3 |
| — | Sub-task | 打印结束延时散热逻辑实现 | 赵工 | — | Sprint 3 |
| — | Sub-task | 固件与硬件联调 | 赵工+陈工 | — | Sprint 3 |

### Epic 4: 测试验证

**Jira Epic**：`MAR5-EPIC-4` — DVT 热测试与用户验证
**Epic 描述**：完成散热优化的全部验证测试，确保达成 PRD 目标

| WBS ID | Jira Issue Type | Jira Summary | 负责人 | Story Points | Sprint |
|--------|----------------|-------------|--------|-------------|--------|
| WBS-05 | Story | DVT 热测试与噪音测试 | 测试 (王工) | 5 | Sprint 3-4 |
| — | Sub-task | TC-HEAT-001：连续打印长时温度测试 | 王工 | — | Sprint 3 |
| — | Sub-task | TC-HEAT-002：打印结束自动散热测试 | 王工 | — | Sprint 3 |
| — | Sub-task | TC-HEAT-003：噪音测试 | 王工 | — | Sprint 3 |
| — | Sub-task | TC-HEAT-004：极端环境 (32℃) 测试 | 王工 | — | Sprint 4 |
| — | Sub-task | TC-HEAT-005：长期可靠性测试（2000h） | 王工 | — | Sprint 4+ |
| WBS-06 | Story | 用户主观盲测 | 测试 (王工) | 2 | Sprint 4 |
| — | Sub-task | 盲测方案设计（5 位内部用户） | 王工 | — | Sprint 4 |
| — | Sub-task | 盲测执行与结果分析 | 王工 | — | Sprint 4 |

---

## 3. Sprint 规划总览

| Sprint | 日期范围 | 包含 Stories | 目标 |
|--------|----------|-------------|------|
| Sprint 1 | 04-15 ~ 04-28 | WBS-01 (风道设计) | EVT 启动，风道 CFD 仿真完成 |
| Sprint 2 | 04-29 ~ 05-12 | WBS-02 (风扇选型), WBS-03 (隔热验证) | 样机到位，风扇定标 |
| Sprint 3 | 05-13 ~ 05-26 | WBS-04 (固件温控), WBS-05 (DVT 测试) | 固件联调，DVT 初步结果 |
| Sprint 4 | 05-27 ~ 06-09 | WBS-05 (极端测试), WBS-06 (用户盲测), WBS-07 (BOM 评审) | 全部测试完成，量产评审 |
| Sprint 5 | 06-10 ~ 06-17 | 收尾与文档 | 问题复盘、经验沉淀 |

---

## 4. 在 Jira 中创建的步骤

### 方式一：手动创建
1. 在 Jira 中创建 Project（Key: `MAR5`）
2. 按上表逐条创建 Epic → Story → Sub-task
3. 使用 Jira 的"Advanced Roadmaps"将 Epic 关联到 Sprint
4. 为每个 Issue 添加 `Acceptance Criteria` 字段（从 PRD 第 7 节提取）

### 方式二：CSV 批量导入
1. 将上表导出为 CSV（参考 `jira-api-setup-guide.md` 的格式）
2. Jira → Settings → External System Import → CSV
3. 映射列：Summary → Summary, Issue Type → Issue Type, 自定义字段

### 方式三：通过 REST API（推荐用于自动化）
参考 [jira-api-setup-guide.md](jira-api-setup-guide.md) 中的批量创建脚本。
