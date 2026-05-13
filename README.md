# Duanyanyu · 硬件产品经理作品集

从电网设备测试到3D打印PM的完整能力展示。在无PM岗位的行业环境中自驱完成了需求分析、跨部门协同、问题闭环推动——本质上承担了硬件PM的核心职能。

## 快速导航

- **在线浏览**：[duanyayu.github.io/pm-portfolio](https://duanyayu.github.io/pm-portfolio)
- **构建命令**：`node scripts/build.js`
- **源码目录**：`src/`（12篇思考文档）
- **构建输出**：`site/`（HTML页面）

## 项目结构

```
├── src/           # 源Markdown文件（12篇能力证据+简历）
├── site/          # 构建生成的HTML页面
├── assets/        # CSS、JS、图片、简历文件
├── tools/         # md格式转换PDF工具
├── scripts/       # 构建脚本
├── reference/     # Mars 5 Ultra仪表盘参考页
└── deliverables/  # 散热优化PRD文档
```

## 内容组织

10篇能力证据文档，从浅到深排列：

1. ELEGOO 公司速览
2. JD能力对齐：8项要求×我的证据
3. 面试高频题：我的回答策略
4. 从测试报告到PRD的视角转换
5. PRD拆解：4个Epic×12个Story
6. 电网设备与3D打印：同一套系统思维
7. ELEGOO深度研究：三个核心问题与我的方案
8. 竞品地图：四小龙谁在赚什么钱
9. 四个战略判断：多色、耗材、生态、可靠性
10. 把蛋糕做大：从卖打印机到硬件基础设施

## 本地使用

```bash
npm install
node scripts/build.js
# 用浏览器打开 site/index.html
```

## Mars 5 Ultra 散热优化仪表盘

页面内可通过按钮访问基于Mars 5 Ultra用户反馈的全流程产品管理模拟，包含用户洞察、PRD、任务拆解、项目管理、验证闭环。
