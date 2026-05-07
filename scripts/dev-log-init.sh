#!/bin/bash
# ============================================================
# 开发日志自动初始化脚本
# 每次 Stop Hook 触发时运行，检查今日日志是否存在，不存在则从模板创建
# ============================================================

TODAY=$(date +%Y-%m-%d)
MONTH=$(date +%Y-%m)
LOG_DIR="dev-log/${MONTH}"
LOG_FILE="${LOG_DIR}/${TODAY}.md"

mkdir -p "${LOG_DIR}"

if [ ! -f "${LOG_FILE}" ]; then
  if [ -f dev-log/template.md ]; then
    cp dev-log/template.md "${LOG_FILE}"
    echo "[dev-log] Created ${LOG_FILE} (from template)"
  else
    echo "# Dev Log - ${TODAY}\n\n## Completed\n\n\n## In Progress\n\n\n## Blockers\n\n\n## Next Steps\n\n" > "${LOG_FILE}"
    echo "[dev-log] Created ${LOG_FILE} (bare, template not yet available)"
  fi
else
  echo "[dev-log] ${LOG_FILE} already exists, skipped"
fi
