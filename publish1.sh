#!/bin/bash

# 递归遍历所有 .md 文件，添加 <back-top/>
add_back_top() {
    local dir="$1"
    
    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue
        
        local basename=$(basename "$item")
        
        case "$basename" in
            .vuepress|assets|docs|node_modules)
                continue
                ;;
        esac
        
        if [ -d "$item" ]; then
            add_back_top "$item"
        elif [[ "$item" == *.md ]]; then
            # 检查是否已包含 <back-top/>
            if ! grep -q '<back-top/>' "$item" 2>/dev/null; then
                echo "" >> "$item"
                echo "<back-top/>" >> "$item"
            fi
        fi
    done
}

# 递归遍历所有 .md 文件，移除 <back-top/>
remove_back_top() {
    local dir="$1"
    
    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue
        
        local basename=$(basename "$item")
        
        case "$basename" in
            .vuepress|assets|docs|node_modules)
                continue
                ;;
        esac
        
        if [ -d "$item" ]; then
            remove_back_top "$item"
        elif [[ "$item" == *.md ]]; then
            # 移除 <back-top/> 及其前面的空行
            if grep -q '<back-top/>' "$item" 2>/dev/null; then
                sed -i '/^<back-top\/>$/d' "$item"
                # 删除文件末尾的空行
                while [[ $(tail -n 1 "$item") == "" ]]; do
                    sed -i '$ d' "$item"
                done
            fi
        fi
    done
}

# 生成侧边栏
generate_sidebar() {
    local dir="$1"
    local indent="$2"
    local first=true
    
    local dirs=()
    
    for item in "$dir"/*; do
        [ ! -e "$item" ] && continue
        
        local basename=$(basename "$item")
        
        case "$basename" in
            .vuepress|assets|docs|node_modules)
                continue
                ;;
        esac
        
        if [ -d "$item" ]; then
            dirs+=("$item")
        fi
    done
    
    if [ ${#dirs[@]} -eq 0 ]; then
        return
    fi
    
    # 输出子目录
    for dir_item in "${dirs[@]}"; do
        local dir_name=$(basename "$dir_item")
        
        if [ "$first" = true ]; then
            first=false
        else
            printf ",\n"
        fi
        
        printf '%s{\n' "$indent"
        printf '%s  "title": "%s",\n' "$indent" "$dir_name"
        printf '%s  "children": [\n' "$indent"
        
        # 子目录下的文件
        local child_first=true
        for file in "$dir_item"/*.md; do
            [ ! -e "$file" ] && continue
            
            local rel_path="${file#./}"
            local title=$(grep -m1 '^#\s*' "$file" 2>/dev/null | sed 's/^#\s*//' | sed 's/[[:space:]]*$//')
            [ -z "$title" ] && title=$(basename "$file" .md)
            
            if [ "$child_first" = true ]; then
                child_first=false
            else
                printf ",\n"
            fi
            
            printf '%s    ["%s", "%s"]' "$indent" "$rel_path" "$title"
        done
        
        printf '\n%s  ]\n' "$indent"
        printf '%s}' "$indent"
    done
    
    # 输出当前目录下的文件（跳过 README.md）
    for file in "$dir"/*.md; do
        [ ! -e "$file" ] && continue
        
        local basename=$(basename "$file")
        [ "$basename" = "README.md" ] && continue
        
        local rel_path="${file#./}"
        local title=$(grep -m1 '^#\s*' "$file" 2>/dev/null | sed 's/^#\s*//' | sed 's/[[:space:]]*$//')
        [ -z "$title" ] && title=$(basename "$file" .md)
        
        if [ "$first" = true ]; then
            first=false
        else
            printf ",\n"
        fi
        
        printf '%s["%s", "%s"]' "$indent" "$rel_path" "$title"
    done
}

# ========== 主流程 ==========

echo "步骤1: 给所有 .md 文件添加 <back-top/> ..."
add_back_top "."

echo "步骤2: 生成 .vuepress/config.js ..."
OUTPUT_FILE=".vuepress/config.js"

cat > "$OUTPUT_FILE" << 'HEADER'
module.exports = {
  title: '日常收集',
  description: 'Just playing around',
  base: '/k/',
  plugins: [
    ['vuepress-plugin-side-anchor']
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

echo "步骤3: 执行 npm run build ..."
npm run build

echo "步骤4: 移除所有 .md 文件中的 <back-top/> ..."
remove_back_top "."


#清空docs文件夹
rm -rf docs/*

#生成的整站文件拷贝到docs中
cp -R .vuepress/dist/* docs/

#清空dist文件夹
rm -rf .vuepress/dist/*

echo "完成！"

