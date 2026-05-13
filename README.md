# Duanyanyu · 硬件产品经理作品集

从电网设备测试到3D打印PM的完整能力展示。在无PM岗位的行业环境中自驱完成了需求分析、跨部门协同、问题闭环推动——本质上承担了硬件PM的核心职能。

## 查看作品集

**在线浏览：** [duanyayu.github.io/pm-portfolio](https://duanyayu.github.io/pm-portfolio)

**本地查看：** 下载仓库后，用浏览器打开 `site/index.html` 即可浏览全部内容，无需构建。

**自行构建：**
```bash
npm install
node scripts/build.js
# 构建完成后用浏览器打开 site/index.html
```

## 页面导航

| 页面 | 文件路径 | 说明 |
|------|----------|------|
| 首页 | `site/index.html` | 简历下载、ELEGOO深度研究、10篇能力证据 |
| 文档详情 | `site/docs/*.html` | 每篇思考文档的独立阅读页面 |
| 仪表盘 | `reference/mars5-dashboard.html` | Mars 5 Ultra散热优化全流程模拟 |
| md转换工具 | `tools/converter.html` | 拖入.md文件即可预览并导出HTML/PDF |
| 散热PRD | `deliverables/thermal-optimization-prd-v1.md` | 标准硬件PRD格式文档 |

## 目录结构

```
├── src/              # 源Markdown文件（12篇文档+简历）
├── site/             # 构建输出的HTML页面，浏览器直接打开
├── assets/           # CSS样式、JS交互、产品图片、简历docx
├── tools/            # md格式转换PDF工具
├── scripts/          # 构建脚本
├── reference/        # Mars 5 Ultra仪表盘参考页
└── deliverables/     # 散热优化PRD文档
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
