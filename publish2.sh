#!/bin/bash

echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo -e "\033[31m  author: zhicheng\033[0m"
echo -e "\033[31m  该脚本使用vuepress自动生成静态站点到docs目录中\033[0m" 
echo -e "\033[32m～～～～～～～～～～～～～～～～～～～～～～～～～\033[0m"
echo -e ""

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
                # 删除 <back-top/>
                sed '/^<back-top\/>$/d' "$item" > "$item.tmp" && mv "$item.tmp" "$item"

                # 删除文件末尾空行
                while [[ $(tail -n 1 "$item") == "" ]]; do
                    sed '$d' "$item" > "$item.tmp" && mv "$item.tmp" "$item"
                done
            fi
        fi
    done
}

# ============================================================
# 递归生成无限级侧边栏
# 参数：
#   $1 - 当前目录路径
#   $2 - 当前缩进字符串
# 输出：递归生成的侧边栏 JSON 片段（stdout）
# ============================================================
generate_sidebar() {
    local dir="$1"
    local indent="$2"
    local first=true
    local result=""

    # 遍历目录中的子目录（递归处理）
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

            # 递归获取子目录的内容
            sub_result=$(generate_sidebar "$item" "    $indent")

            # 只有子目录非空（有文件或其他子目录）才输出
            if [ -n "$sub_result" ]; then
                if [ "$first" != true ]; then
                    result="${result},\n"
                fi
                first=false

                result="${result}${indent}{\n"
                result="${result}${indent}  \"title\": \"${dir_name}\",\n"
                result="${result}${indent}  \"children\": [\n"
                result="${result}${sub_result}\n"
                result="${result}${indent}  ]\n"
                result="${result}${indent}}"
            fi
        fi
    done

    # 遍历当前目录下的 .md 文件
    for file in "$dir"/*.md; do
        [ ! -e "$file" ] && continue

        local basename=$(basename "$file")
        [ "$basename" = "README.md" ] && continue

        # 计算相对路径：去掉开头的 ./
        local rel_path="/${file#./}"
        # 去掉路径中多余的斜杠
        rel_path=$(echo "$rel_path" | sed 's#//*#/#g')

        # 尝试从文件第一行 # 标题提取
        local title
        title=$(grep -m1 '^#\s*' "$file" 2>/dev/null | sed 's/^#\s*//' | sed 's/[[:space:]]*$//')
        if [ -z "$title" ]; then
            title="${basename%.md}"
        fi

        # 转义标题中的双引号
        title=$(echo "$title" | sed 's/"/\\"/g')

        if [ "$first" != true ]; then
            result="${result},\n"
        fi
        first=false

        result="${result}${indent}[\"${rel_path}\", \"${title}\"]"
    done

    echo -e "$result"
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

# 生成侧边栏内容（捕获 stdout）
sidebar_content=$(generate_sidebar "." "    ")

# 写入侧边栏内容
if [ -n "$sidebar_content" ]; then
    echo -e "$sidebar_content" >> "$OUTPUT_FILE"
fi

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
