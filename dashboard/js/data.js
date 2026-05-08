/**
 * data.js — 仪表盘唯一数据源
 * 所有模拟数据集中定义于此，各可视化模块从此读取
 * 可通过 Jira Connector 获取实时数据覆盖
 */
(function(global) {
  global.Dashboard = global.Dashboard || {};

  var APP_DATA = {
    // ---- 项目基本信息 ----
    project: {
      name: 'Mars 5 Ultra 散热优化专项',
      progress: 55,
      status: 'active',
      currentSprint: 3,
      totalSprints: 5,
      lastUpdated: '2026-05-08 14:30'
    },

    // ---- 里程碑 ----
    milestones: [
      { id: 'M1', name: 'EVT启动', date: '2026-04-20', status: 'done' },
      { id: 'M2', name: '样机到位', date: '2026-04-28', status: 'done' },
      { id: 'M3', name: 'DVT热测试', date: '2026-05-05', status: 'active' },
      { id: 'M4', name: '固件联调', date: '2026-05-12', status: 'pending' },
      { id: 'M5', name: '量产评审', date: '2026-05-20', status: 'pending' }
    ],

    // ---- 看板 ----
    kanban: {
      columns: [
        {
          id: 'backlog', name: '待规划',
          items: [
            { id: 'K1', func: '固件', funcClass: 'firmware', title: '实现风扇异常告警上报逻辑' },
            { id: 'K2', func: '测试', funcClass: 'testing', title: '编写长期可靠性复测用例' }
          ]
        },
        {
          id: 'todo', name: '待办',
          items: [
            { id: 'K3', func: '固件', funcClass: 'firmware', title: '实现打印结束自动延速散热逻辑' },
            { id: 'K4', func: '测试', funcClass: 'testing', title: '编写极端环境(32℃)热测试用例' }
          ]
        },
        {
          id: 'in_progress', name: '进行中',
          items: [
            { id: 'K5', func: '结构', funcClass: 'structure', title: '底部新风道3D打印手板验证' },
            { id: 'K6', func: '硬件', funcClass: 'hardware', title: '新风扇样品噪音-风量曲线测绘' },
            { id: 'K7', func: '固件', funcClass: 'firmware', title: 'PWM温控PID参数初步调试' }
          ]
        },
        {
          id: 'review', name: '评审中',
          items: []
        },
        {
          id: 'done', name: '已完成',
          items: [
            { id: 'K8', func: '结构', funcClass: 'structure', title: '新风道CFD仿真通过' },
            { id: 'K9', func: '供应链', funcClass: 'supply', title: '新风扇供应商定标' },
            { id: 'K10', func: '硬件', funcClass: 'hardware', title: '隔热垫材料选型确认' }
          ]
        }
      ]
    },

    // ---- 风险登记板 (含概率×影响) ----
    risks: [
      {
        id: 'R1',
        description: '新风扇样品交期可能延迟至5/12',
        probability: 4, impact: 4,
        severity: '高',
        mitigation: '已联系备选供应商，最晚5/10到样',
        owner: '张工(供应链)',
        status: 'active'
      },
      {
        id: 'R2',
        description: '满速噪音测试37dB，超过目标35dB',
        probability: 4, impact: 3,
        severity: '中',
        mitigation: '固件限最高转速85%，评估温升影响',
        owner: '李工(硬件)',
        status: 'active'
      },
      {
        id: 'R3',
        description: '风道修改可能影响UV遮光',
        probability: 3, impact: 3,
        severity: '中',
        mitigation: 'DVT中增加遮光专项测试',
        owner: '王工(测试)',
        status: 'active'
      },
      {
        id: 'R4',
        description: '新隔热材料高温下是否释放异味待确认',
        probability: 2, impact: 2,
        severity: '低',
        mitigation: '安排材料气味测试',
        owner: '陈工(硬件)',
        status: 'monitoring'
      },
      {
        id: 'R5',
        description: '温控PID参数调优耗时超预期',
        probability: 2, impact: 2,
        severity: '低',
        mitigation: '预留固件调试buffer',
        owner: '赵工(固件)',
        status: 'monitoring'
      }
    ],

    // ---- 团队负载 ----
    team: [
      { name: '周工', role: '结构', tasks: 2, pointsCommitted: 8, capacity: 70, risk: 'ok' },
      { name: '陈工', role: '硬件', tasks: 3, pointsCommitted: 13, capacity: 85, risk: 'warn' },
      { name: '赵工', role: '固件', tasks: 3, pointsCommitted: 12, capacity: 90, risk: 'over' },
      { name: '王工', role: '测试', tasks: 2, pointsCommitted: 7, capacity: 55, risk: 'ok' },
      { name: '张工', role: '供应链', tasks: 1, pointsCommitted: 2, capacity: 30, risk: 'ok' }
    ],

    // ---- Sprint 日历 ----
    sprints: [
      { id: 'S1', name: 'Sprint 1', start: '2026-04-15', end: '2026-04-28', status: 'done',
        goal: 'EVT启动，风道CFD仿真完成' },
      { id: 'S2', name: 'Sprint 2', start: '2026-04-29', end: '2026-05-12', status: 'current',
        goal: '样机到位，风扇定标' },
      { id: 'S3', name: 'Sprint 3', start: '2026-05-13', end: '2026-05-26', status: 'upcoming',
        goal: '固件联调，DVT初步结果' },
      { id: 'S4', name: 'Sprint 4', start: '2026-05-27', end: '2026-06-09', status: 'upcoming',
        goal: '全部测试完成，量产评审' },
      { id: 'S5', name: 'Sprint 5', start: '2026-06-10', end: '2026-06-17', status: 'upcoming',
        goal: '问题复盘与经验沉淀' }
    ],

    // ---- 燃尽图数据 (Sprint 2 的每日点数) ----
    burndown: {
      sprints: {
        'S1': {
          totalPoints: 20,
          ideal:    [20, 18, 15, 13, 10, 8, 5, 3, 1, 0, 0, 0, 0, 0],
          actual:   [20, 20, 16, 14, 10, 8, 5, 4, 2, 0, 0, 0, 0, 0]
        },
        'S2': {
          totalPoints: 18,
          ideal:    [18, 16, 14, 12, 10, 9, 7, 5, 3, 2, 0, 0, 0, 0],
          actual:   [18, 18, 16, 15, 14, 13, 11, 9, 7, 0, 0, 0, 0, 0]
        },
        'S3': {
          totalPoints: 22,
          ideal:    [22, 20, 17, 15, 13, 10, 8, 5, 3, 1, 0, 0, 0, 0],
          actual:   [22, 22, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      }
    },

    // ---- 跨团队同步记录 ----
    syncLog: [
      {
        id: 'SYNC-01',
        date: '2026-05-06',
        time: '16:00',
        title: '散热专项同步会议',
        attendees: ['硬件(陈)', '固件(赵)', '结构(周)', '测试(王)', '产品(本人)'],
        teams: ['hardware', 'firmware', 'structure', 'testing', 'pm'],
        decisions: [
          '新风道手板明日完成打印，结构周工负责装配验证',
          '固件PWM驱动已就绪，待硬件输出风扇转速曲线后联调',
          '噪音问题安排5位内部员工盲测',
          '新风扇交期风险可控，备选方案已就绪'
        ],
        actionItems: [
          { item: '输出风扇转速-电压曲线数据', owner: '硬件陈工', due: '2026-05-08', status: 'open' },
          { item: '安排5位内部员工噪音盲测', owner: '测试王工', due: '2026-05-10', status: 'open' },
          { item: '完成新风道手板装配验证', owner: '结构周工', due: '2026-05-07', status: 'done' }
        ],
        nextSync: '2026-05-09 15:00',
        nextFocus: 'DVT初步结果'
      },
      {
        id: 'SYNC-02',
        date: '2026-05-03',
        time: '10:00',
        title: '风扇选型评审会',
        attendees: ['硬件(陈)', '结构(周)', '供应链(张)', '测试(王)', '产品(本人)'],
        teams: ['hardware', 'structure', 'supply', 'testing', 'pm'],
        decisions: [
          '确认选用备选供应商B的风扇型号（风量+25%），放弃原供应商A（风量+15%不达标）',
          '风扇交期确认：5/8到样，5/10前完成测绘',
          '隔热材料选型确认：使用硅基隔热垫（耐温200℃）'
        ],
        actionItems: [
          { item: '下发风扇样品采购订单', owner: '张工(供应链)', due: '2026-05-03', status: 'done' },
          { item: '安排隔热垫来料检验', owner: '陈工(硬件)', due: '2026-05-06', status: 'done' }
        ],
        nextSync: '2026-05-06 16:00',
        nextFocus: '风扇样品到位后启动联调'
      }
    ],

    // ---- 待决策事项 ----
    decisions: [
      {
        id: 'D1',
        title: '噪音超标方案选择',
        context: '新风扇满速37dB超过PRD目标35dB',
        options: [
          '方案A：固件限最高转速85%，接受温升+1.5℃',
          '方案B：换回原风扇，接受风量不达标',
          '方案C：修改外壳增加隔音棉，BOM+¥3，交期+5天'
        ],
        recommendation: '方案A',
        deadline: '2026-05-09',
        owner: '产品经理'
      },
      {
        id: 'D2',
        title: 'Sprint 3 测试资源冲突',
        context: '测试王工下周同时支持两个项目，DVT进度可能延后2天',
        options: [
          '方案A：接受延后2天，不影响里程碑',
          '方案B：临时调配其他测试工程师支援'
        ],
        recommendation: '方案A',
        deadline: '2026-05-10',
        owner: '产品经理'
      }
    ],

    // ---- Jira 集成配置 ----
    // 本地演示: baseUrl: '/api/jira' (通过 Node.js 代理)
    // Confluence: baseUrl: 'https://你的域名.atlassian.net' (同域免代理)
    jira: {
      enabled: false,
      baseUrl: '/api/jira',
      projectKey: 'MAR5'
    }
  };

  global.Dashboard.Data = {
    get: function() { return APP_DATA; },
    getProject: function() { return APP_DATA.project; },
    getMilestones: function() { return APP_DATA.milestones; },
    getKanban: function() { return APP_DATA.kanban; },
    getRisks: function() { return APP_DATA.risks; },
    getTeam: function() { return APP_DATA.team; },
    getSprints: function() { return APP_DATA.sprints; },
    getBurndown: function() { return APP_DATA.burndown; },
    getSyncLog: function() { return APP_DATA.syncLog; },
    getDecisions: function() { return APP_DATA.decisions; },
    getJiraConfig: function() { return APP_DATA.jira; },

    // 更新看板数据（拖拽后调用）
    updateKanban: function(columns) {
      APP_DATA.kanban.columns = columns;
    },

    // 更新 Jira 配置
    updateJiraConfig: function(config) {
      Object.assign(APP_DATA.jira, config);
    }
  };

})(window);
