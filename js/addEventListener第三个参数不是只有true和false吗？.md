# addEventListener第三个参数不是只有true和false吗？

第三个参数**不只有 true/false**，还可以是一个 **Options 对象**。

## 三种形式

### 1. boolean（旧写法）

```
window.addEventListener('resize', handler, true)   // 捕获阶段
window.addEventListener('resize', handler, false)  // 冒泡阶段（默认）
```

### 2. Options 对象（新写法）

```
window.addEventListener('resize', handler, {
  capture: false,    // 等价于 true/false
  once: true,        // 只触发一次
  signal: abortController.signal  // 可以通过 abort() 移除监听
})
```

### 3. 不加第三个参数

```
window.addEventListener('resize', handler)  // 等价于 false
```

## 您的代码解释

```
const controller = new AbortController();
window.addEventListener('resize', () => {}, { signal: controller.signal });
controller.abort();  // 这行会移除上面的 resize 监听
```

**优势**：相比 `removeEventListener` 需要保存引用，`AbortController` 可以在任意时刻取消监听，无需记住原来的 listener 函数。

## 对比

| 方式                  | 优点                   | 缺点                   |
| --------------------- | ---------------------- | ---------------------- |
| `removeEventListener` | 兼容性好               | 需要保存 listener 引用 |
| `AbortController`     | 可随时取消，代码更简洁 | 需要新浏览器支持       |

所以您最初注释掉的那种写法是**传统方式**，下面的 `AbortController` 是**现代方式**，两者都可以。
