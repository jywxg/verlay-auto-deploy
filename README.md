# verlay-auto-deploy

Vercel 一键部署 [vevc/verlay](https://github.com/vevc/verlay)（VLESS-over-WebSocket 代理）

把以下信息发给 AI，即可自动完成部署：

- Vercel Token（vcp_ 开头）
- 部署国家（可选，默认 JP）
- 自定义域名（可选）

---

## 支持国家/地区

| 国家/地区 | Vercel 区域 | 推荐场景 |
|-----------|-------------|----------|
| JP        | hnd1        | 亚洲首选 |
| SG        | sin1        | 东南亚   |
| HK        | hkg1        | 华语地区 |
| US        | iad1        | 北美     |
| DE        | fra1        | 欧洲     |

---

## 部署后修改

- 换国家：把国家代码发给 AI（如 `HK`），自动更新 `vercel.json` 后重新部署
- 换域名：把域名发给 AI，更新 `DOMAIN` 环境变量后重新部署