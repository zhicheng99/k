# 特别说明：

|                                  | 旧版（有 git push）          | 新版（upload-pages-artifact）   |
| -------------------------------- | ---------------------------- | ------------------------------- |
| workflow 文件                    | `build-docs.yml`             | `deploy-docs.yml`               |
| 发布方式                         | push `docs/`→ Pages 从分支读 | artifact → deploy-pages → Pages |
| 是否触发 `upload-pages-artifact` | ❌ 不会                       | ✅ 会                            |

**你贴的那段 `git commit/push docs/`代码，是旧版 workflow 里的。它不会触发 `upload-pages-artifact`和 `deploy-pages`——因为它根本没有这两个步骤。**

新版方式需要设置 仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

