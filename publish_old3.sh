#!/bin/bash

echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo -e "\033[31m  author: zhicheng\033[0m"
echo -e "\033[31m  该脚本使用vuepress自动生成静态站点到docs目录中\033[0m"
echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo ""

# ============================================================
# 递归遍历所有 .md 文件，添加 <back-top/>
# ============================================================
add_back_top() {
    local dir="$1"

    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue

        local basename=$(basename "$item")

        case "$basename" in
            .vuepress|assets|docs|node_modules|_*|__*)
                continue
                ;;
        esac

        if [ -d "$item" ]; then
            add_back_top "$item"
        elif [[ "$item" == *.md ]]; then
            if ! grep -q '<back-top/>' "$item" 2>/dev/null; then
                echo "" >> "$item"
                echo "<back-top/>" >> "$item"
            fi
        fi
    done
}

# ============================================================
# 递归遍历所有 .md 文件，移除 <back-top/>
# ============================================================
remove_back_top() {
    local dir="$1"

    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue

        local basename=$(basename "$item")

        case "$basename" in
            .vuepress|assets|docs|node_modules|_*|__*)
                continue
                ;;
        esac

        if [ -d "$item" ]; then
            remove_back_top "$item"
        elif [[ "$item" == *.md ]]; then
            if grep -q '<back-top/>' "$item" 2>/dev/null; then
                sed '/^<back-top\/>$/d' "$item" > "$item.tmp" && mv "$item.tmp" "$item"

                while [[ $(tail -n 1 "$item") == "" ]]; do
                    sed '$d' "$item" > "$item.tmp" && mv "$item.tmp" "$item"
                done
            fi
        fi
    done
}

# ============================================================
# 递归生成无限级侧边栏（✅ 直接 echo，不拼接）
# ============================================================
generate_sidebar() {
    local dir="$1"
    local indent="$2"
    local first=true

    # 子目录
    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue

        local basename=$(basename "$item")

        case "$basename" in
            .vuepress|assets|docs|node_modules|_*|__*)
                continue
                ;;
        esac

        if [ -d "$item" ]; then
            local dir_name=$(basename "$item")
            local sub_result
            sub_result=$(generate_sidebar "$item" "    $indent")

            if [ -n "$sub_result" ]; then
                if [ "$first" = false ]; then
                    echo ","
                fi
                first=false

                echo "${indent}{"
                echo "${indent}  \"title\": \"${dir_name}\","
                echo "${indent}  \"children\": ["
                echo "$sub_result"
                echo "${indent}  ]"
                echo "${indent}}"
            fi
        fi
    done

    # .md 文件
    for file in "$dir"/*.md; do
        [ ! -e "$file" ] && continue

        local basename=$(basename "$file")
        [ "$basename" = "README.md" ] && continue

        local rel_path="/${file#./}"
        rel_path=$(echo "$rel_path" | sed 's#//*#/#g')

        local title
        title=$(grep -m1 '^#\s*' "$file" 2>/dev/null | sed 's/^#\s*//' | sed 's/[[:space:]]*$//')
        [ -z "$title" ] && title="${basename%.md}"
        title=$(echo "$title" | sed 's/"/\\"/g')

        if [ "$first" = false ]; then
            echo ","
        fi
        first=false

        echo "${indent}[\"${rel_path}\", \"${title}\"]"
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
    }]
  ],
  themeConfig: {
    algolia: {
      appId: "VHK35PIBP8",
      apiKey: "bb89a7555541af96d500213fb23ea66d",
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

echo -e "\033[32m 步骤2: 给所有 .md 文件添加 <back-top/> ...\033[0m"
add_back_top "."

echo -e "\033[32m 步骤3: 执行 npm run build ...\033[0m"
npm run build

echo -e "\033[32m 步骤4: 移除所有 .md 文件中的 <back-top/> ...\033[0m"
remove_back_top "."

echo -e "\033[32m 步骤5: 清空docs文件夹\033[0m"
rm -rf docs/*

echo -e "\033[32m 步骤6: 整站文件拷贝到docs中\033[0m"
cp -R .vuepress/dist/* docs/

echo -e "\033[32m 步骤7: 清空dist文件夹\033[0m"
rm -rf .vuepress/dist/*

echo -e "\033[32m 静态站点生成完毕！√ \033[0m"