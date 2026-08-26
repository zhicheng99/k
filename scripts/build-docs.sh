#!/bin/bash
set -e

mkdir -p docs .vuepress/dist

echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo -e "\033[31m  author: zhicheng\033[0m"
echo -e "\033[31m  该脚本使用vuepress自动生成静态站点到docs目录中\033[0m"
echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo ""


# ============================================================
# 递归生成无限级侧边栏（✅ 直接 echo，不拼接）
# ============================================================
generate_sidebar() {
    local dir="$1"
    local indent="$2"
    local first=true

    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue

        local basename=$(basename "$item")

        case "$basename" in
            .vuepress|assets|docs|node_modules|_*|__*)
                continue
                ;;
        esac

        if [ -d "$item" ]; then
            local sub_result
            sub_result=$(generate_sidebar "$item" "    $indent")
            [ -z "$sub_result" ] && continue

            if [ "$first" = true ]; then
                first=false
            else
                printf ",\n"
            fi

            printf '%s{\n' "$indent"
            printf '%s  "title": "%s",\n' "$indent" "$basename"
            printf '%s  "children": [\n' "$indent"
            printf '%s\n' "$sub_result"
            printf '%s  ]\n' "$indent"
            printf '%s}' "$indent"
        fi
    done

    for file in "$dir"/*.md; do
        [ ! -e "$file" ] && continue

        local basename=$(basename "$file")
        [ "$basename" = "README.md" ] && continue

        local rel_path="${file#./}"
        local title=$(grep -m1 '^#\{1,6\}\s*' "$file" 2>/dev/null | sed 's/^#\{1,6\}\s*//' | sed 's/[[:space:]]*$//')
        [ -z "$title" ] && title=$(basename "$file" .md)

        if [ "$first" = true ]; then
            first=false
        else
            printf ",\n"
        fi

        printf '%s["%s", "%s"]' "$indent" "$rel_path" "$title"
    done
}

# ============================================================
# 主流程
# ============================================================

echo -e "\033[32m 步骤1: 生成 .vuepress/config.js ...\033[0m"
OUTPUT_FILE=".vuepress/config.js"

cat > "$OUTPUT_FILE" << 'HEADER'
module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor', {
      showDepth: null
    }],'@vuepress/back-to-top'
  ],
  themeConfig: {
    algolia: {
      appId: "VHK35PIBP8",
     // apiKey:"72e05530eb3e8b95d9a65cef01f2b00c",
      apiKey:"c64d99d7233c868e667414b42aa4aa54",
      indexName: "kk",
    },
    sidebarDepth: 0,
    sidebar: [
HEADER

generate_sidebar "." "    " >> "$OUTPUT_FILE"

cat >> "$OUTPUT_FILE" << 'FOOTER'
    ]
  }
}
FOOTER


echo -e "\033[32m 步骤2: 执行 npm run build ...\033[0m"
npm run build

echo -e "\033[32m 步骤3: 清空docs文件夹\033[0m"
rm -rf docs/*

echo -e "\033[32m 步骤4: 整站文件拷贝到docs中\033[0m"
cp -R .vuepress/dist/* docs/

echo -e "\033[32m 步骤5: 清空dist文件夹\033[0m"
rm -rf .vuepress/dist/*

echo -e "\033[32m 静态站点生成完毕！√ \033[0m"