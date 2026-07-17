#!/bin/bash

generate_sidebar() {
    local dir="$1"
    local indent="$2"
    local first=true
    
    local files=()
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
        elif [[ "$item" == *.md ]]; then
            files+=("$item")
        fi
    done
    
    if [ ${#dirs[@]} -eq 0 ] && [ ${#files[@]} -eq 0 ]; then
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

OUTPUT_FILE=".vuepress/config.js"

cat > "$OUTPUT_FILE" << 'HEADER'
module.exports = {
  title: '日常记录',
  description: '日常记录',
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

echo "已生成 $OUTPUT_FILE"

#生成静态站点
npm run build

#清空docs文件夹
rm -rf docs/*

#生成的整站文件拷贝到docs中
cp -R .vuepress/dist/* docs/

#清空dist文件夹
rm -rf .vuepress/dist/*

# git add .
# git commit -am'update'
# git pull
# git push
