# xStockETF

依 `deep-research-report.md` 落地的主動式 ETF Web MVP 骨架，採用 pnpm monorepo，包含：

- `apps/web`: Next.js App Router 前端
- `apps/api`: NestJS API
- `packages/types`: 共用型別
- `prisma`: 資料模型
- `infra/docker-compose.yml`: 本地容器啟動

## MVP 功能

- 公開首頁
- ETF 清單頁
- ETF 詳頁
- 股票詳頁
- 會員自選清單
- API envelope: `{ data, meta }`

## 本地啟動

```bash
pnpm install
pnpm dev
```

API 預設為 `http://localhost:4000`，Web 預設為 `http://localhost:3000`。

## Docker

```bash
docker compose -f infra/docker-compose.yml up -d --build
```

## 注意

目前 API 以 mock data 先完成資訊架構與畫面串接，下一步可把 `prisma/schema.prisma` 與真實 ETL / CMoney 權限整合接上。
