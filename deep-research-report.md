# CMoney 主動式ETF網頁版執行報告與 Codex 開發規格

## 執行摘要

Executive Summary：本次公開資料盤點顯示，CMoney 的「主動式ETF」目前對外產品主體仍以行動端為核心。官方 Landing Page 明確列出六大核心功能：整體資金當日操作指南、整體資金總持股、完整 ETF 清單、單檔 ETF 操作日報、折溢價資訊、投資人討論區；iOS 與 Android 商店頁面則補充了既有商業模式與近期功能迭代，包括免費安裝、App 內購、新註冊 7 天 VIP 試用，以及 ETF/股票搜尋、股票內頁、排序、深淺色介面等功能。公開網頁檢索可找到的是下載導向的介紹頁與 App 上架頁，而不是可直接操作的完整瀏覽器產品。citeturn28view0turn11view0turn11view1

台灣主動式 ETF 的制度背景，讓這個產品非常適合做成網頁版分析工作台。依臺灣證券交易所與金管會現行制度，主動式 ETF 採每日全透明揭露，投信需於每營業日基金淨值結算後在官網揭露當日實際投資組合；但基金經理人得於次一營業日再調整部位，因此盤中可交易部位不必然等同於前一日揭露持股，折溢價與即時預估淨值也都必須帶出「估計值」與時間戳。證券代號第六碼為 A 表示股票主動式 ETF、為 D 表示債券主動式 ETF，且 2025 年起主動式 ETF 已從台股延伸到國外成分證券產品，顯示資料模型一開始就不能只假設「台股、股票型、單一日曆」。citeturn8view0turn4search0turn26view0turn26view1turn18search3

因此，本報告的核心建議是：把網頁版定義為「桌機優先、行動響應式、可 SEO、可分享、可登入、可付費解鎖的研究工作台」，而不是把 App 畫面直接搬到瀏覽器。第一期以「資訊工具」為定位，優先完成 ETF 列表、ETF 詳頁、持股異動、操作日報、折溢價、股票反查持有 ETF、搜尋、登入與權限同步、自選與提醒；不納入交易下單，不做個別買賣勸誘，也不先做即時報價。這樣能延續現有產品核心價值，同時避開最重的市場資料授權成本與投顧法遵風險。citeturn28view0turn11view0turn30search4turn5search0turn5search4turn19search0turn19search1turn6search1turn6search4turn7search1turn7search8

在技術方案上，建議採用 Next.js App Router + NestJS + PostgreSQL + Redis/BullMQ 的容器化單體架構。Next.js App Router 原生支援 Server Components，適合公開頁 SEO 與會員頁混合場景；NestJS 可利用 guards、interceptors 與清楚的 request lifecycle 控制授權、回應封裝與 API 規範；Prisma Migrate 能輸出並管理 SQL migration；Redis/BullMQ 則適合做 ETL、快取與重試型提醒任務。Next.js 與 NestJS 官方文件都直接支持 Docker 部署。citeturn12search0turn12search8turn12search1turn12search5turn12search9turn12search14turn12search19turn21search1turn21search7turn22search0turn22search1

專案節奏建議分成兩段：前三個 Sprint 完成 MVP，六個 Sprint 完成可正式上市的 v1。若能重用 CMoney 既有登入、權限、付費與論壇能力，MVP 可壓在 6 至 8 週；若這些能力都需重做，工期與預算至少增加 20% 至 35%。以不含即時授權行情、且交易功能不納入第一期的假設估算，MVP 建置預算可抓新台幣 290 萬至 370 萬；完整 v1 約 430 萬至 650 萬；若加做經授權即時報價，僅公開可查的 TWSE / TPEx 固定或基礎級行情費用就會顯著墊高月營運成本。citeturn30search2turn30search4turn6search4turn7search8

## 產品定位與範圍

### 現況盤點與產品機會

從公開資料看，CMoney 目前已經建立了相當明確的主動式 ETF 產品心智：官方 Landing Page 用「全台首款量身打造的監測工具」定位產品，並把價值主張集中在經理人持股動向、資金配置方向、操作日報與折溢價；近期 App 版本又強化了搜尋、股票內頁與排序，顯示產品已從單純「看 ETF」走向「由 ETF 反推個股、由個股回看 ETF 資金」的雙向研究流程。這個產品邏輯其實非常適合桌機與瀏覽器，因為使用者會自然想要同時看列表、持股、圖表、個股與討論。citeturn28view0turn11view0turn11view1turn24search4

另一方面，TWSE 自己也已經有 e 添富這種一站式 ETF 平台，提供 ETF 市場統計、可視化分析與篩選器；而且在部分 e 添富 ETF 詳頁上，績效資料來源已直接標示為「全曜財經資訊」。這代表兩件事：第一，市場上已經有「官方整合資訊平台」這種基礎型對手；第二，CMoney 本身至少在部分公開場域已具 ETF 資料輸出能力。換句話說，CMoney 的網頁版不能只做「另一個 ETF 目錄」，而應該明確做成「比官方平台更適合研究、比發行商網站更好比較、比 App 更適合桌機深度操作」的產品。citeturn16search0turn18search1turn29search0

### 未指定假設與建議

下表把你尚未明確指定、但會直接影響開發時間與法遵風險的關鍵假設整理成決策矩陣。表中的「建議」是本報告預設採用的方案。

| 假設項目 | 可選方案 | 對開發的影響 | 建議 |
|---|---|---|---|
| 目標使用者 | 一般散戶、進階研究型投資人、機構/B2B | 一般散戶偏重易懂與提醒；進階研究型偏重桌機效率、篩選、對照；機構/B2B 會要求權限、匯出、SLA 與更嚴謹的稽核 | **先鎖定 CMoney 既有散戶與進階研究型用戶**，不以 B2B 為第一期 |
| 裝置策略 | 桌機優先、行動優先、純 RWD 平均對待 | 行動優先容易複製 App；桌機優先才能放大 Web 價值，如多欄布局、比較視圖、長表格與分享頁 | **桌機優先、行動響應式**。原因是公開可見產品目前已是行動端主體，Web 的新價值應該來自桌機研究效率，而不是再做一個手機頁 citeturn11view0turn11view1turn28view0 |
| 是否登入 | 無登入、基本登入、重用 CMoney SSO/會員 | 無登入可快上線但無法做自選與 VIP；重用既有會員可同步權限、降低重複付費與客服成本 | **重用 CMoney 會員體系**。CMoney 現行登入頁已支援自有帳號、Google、Apple、Facebook，且 FAQ 顯示權限綁定在購買帳號上，最適合做 App/Web 權限打通 citeturn30search4turn30search8turn30search2 |
| 商業模式 | 全免費、Freemium、全付費 | 全免費最快，但與既有 VIP 模式不一致；全付費會壓低流量與 SEO | **Freemium**：公開列表與基礎資訊開放，深度持股異動、統整資金訊號、歷史操作日報與提醒做 VIP。因既有 App 已有 App 內購與 7 天 VIP 試用慣例 citeturn11view0turn11view1 |
| 報價等級 | 僅盤後/EOD、延遲、即時 | 僅盤後最省授權成本；延遲可補足使用情境；即時需 TWSE/TPEx 行情授權合約與月費 | **MVP 先做盤後 + 延遲/估值資訊，不做即時授權行情**。TWSE 將延遲資訊定義為較即時資訊延遲 20 分鐘以上；即時授權需另外簽約與付費 citeturn6search3turn6search1turn6search4turn7search1turn7search8 |
| 資料覆蓋範圍 | 僅台股股票型主動 ETF、加上國外股票型、再加債券型 | 只做台股會大幅簡化 ticker 對應與交易日曆；納入國外與債券，需額外處理時區、FX、估值模型與風險欄位 | **資料模型一次設計成可支援 A / D 與海外成分證券，但 MVP 頁面先優先股票型主動 ETF**。TWSE 規則明確區分 A 與 D，且市場已出現國外成分與債券相關產品訊號 citeturn8view0turn26view1turn18search3 |
| 討論區策略 | 不做、唯讀整合、全新討論區 | 全新社群成本最高，涉及風控、審核、檢舉、法務與內容治理 | **先做唯讀整合 + 深連結到既有 CMoney 討論區；發文功能放 MVP 之後**。現有產品已把「投資人討論區」列為核心功能，但不代表 Web 第一版就要重造社群系統 citeturn28view0 |
| 交易功能 | 不做交易、券商深連結、完整下單 | 完整下單最重，牽涉券商合作、KYC、資安與法遵；深連結較輕 | **第一期不做交易，第二期若驗證需求成立，再做券商 App 深連結**。現有產品定位是監測與分析工具，而不是券商下單端 citeturn28view0turn11view1 |
| AI 推薦程度 | 只做描述性分析、給個別買賣建議、聊天助理 | 一旦走到個別有價證券推介與有償建議，會快速接近投顧法規範圍 | **第一期只做描述性、可回溯、可驗證的資料分析，不做個別買賣勸誘**。投顧契約與廣告規範對個別證券建議、保證獲利與廣告表達有明確限制 citeturn5search0turn5search4turn19search0turn19search1 |

### 建議的 MVP 與非 MVP 範圍

目前公開版本可被視為既有需求基線的功能，主要來自六大核心功能與版本歷程中新增的搜尋、股票內頁、排序。以這個基線回推，MVP 應該做的是「瀏覽器裡最常用、最能區隔 Web 價值」的部分，而不是一次把所有 App 能力完整複製。citeturn28view0turn11view0turn11view1

| 範疇 | MVP 必做 | MVP 後再做 |
|---|---|---|
| 公開資訊 | Landing、ETF 列表、ETF 詳頁、折溢價、基本績效、資料來源與時間戳 | SEO 專題頁、主動 ETF 教育內容中心 |
| 深度分析 | 持股快照、持股異動、操作日報、整體資金總持股、股票反查持有 ETF | 歷史回測、策略比較器、多 ETF 對照工作台 |
| 搜尋 | ETF/股票站內搜尋 | 語意搜尋、自然語言查詢 |
| 會員功能 | 登入、權限同步、自選 ETF / 自選股票、Email/站內提醒 | 推播、進階通知規則、匯出報表 |
| 社群 | 唯讀顯示討論熱度 / 深連結論壇 | 直接留言、檢舉、版主管理 |
| 付費 | Web 端 VIP 解鎖、權限同步、試用提示 | Web 端完整結帳流程、企業方案 |
| 行情 | 盤後與延遲/估值資訊 | 經授權即時行情、盤中提醒 |
| 交易 | 不納入 | 券商深連結、合作開戶導流 |

### 成功指標

本專案的成功不應只看「有沒有把 App 做成網頁」，而要看 Web 是否真的創造了新使用情境。因此建議把 KPI 切成四組：流量、研究深度、權限轉換、留存。具體可定義為公開 SEO 入口 UV、ETF 詳頁停留時間、股票反查使用率、自選建立率、VIP 牆轉換率、登入後 7 日回訪率、每日 ETL 成功率、資料更新 SLA 達成率。這些指標不需要等產品上線才想，應該在 Sprint 一就以 analytics event schema 先定義。

## 使用者體驗與功能設計

### 使用者角色與任務

建議把網頁版主要角色拆成三類。第一類是「追 ETF 的散戶」，他想知道今天哪些主動式 ETF 在加減碼哪些股票、哪些基金有共識、現在追高是否有折溢價風險。第二類是「從 ETF 反推個股的研究型使用者」，他先看股票，想反查有哪幾檔主動式 ETF 在持有、誰在連續加碼、該股在整體主動式 ETF 資金中的佔比是否上升。第三類是「內容與營運端」，他們需要能維護 ETF 基本資料、審核來源、檢查 ETL、安排首頁重點與管理付費權限。這三類任務，正好對應 CMoney 現行對外溝通的六大功能與新增的股票內頁流程。citeturn28view0turn11view0turn11view1

### 使用者流程

```mermaid
flowchart TD
    A[訪客進站] --> B[首頁與主動ETF介紹]
    B --> C[ETF 清單]
    B --> D[搜尋 ETF 或股票]
    C --> E[ETF 詳頁]
    D --> E
    D --> F[股票詳頁]
    E --> G[查看持股快照與操作日報]
    E --> H[查看折溢價與基本績效]
    F --> I[反查持有此股票的主動ETF]
    G --> J{需要更多歷史/提醒?}
    I --> J
    J -- 否 --> K[繼續瀏覽]
    J -- 是 --> L[登入/註冊]
    L --> M[同步會員與 VIP 權限]
    M --> N[加入自選 / 設定提醒]
    N --> O[查看完整歷史訊號]
    O --> P[前往既有討論區或唯讀社群模組]
```

### 資訊架構與主要畫面

因為主動式 ETF 的關鍵是「列表比較 + 單檔深挖 + 個股回查」，Web 首頁不建議照搬手機卡片流。桌機首頁應採三層資訊結構：第一層是市場脈搏，放整體資金今日訊號、今日最多加碼 / 減碼股、熱門 ETF；第二層是可篩選的 ETF 清單；第三層是可分享的單檔詳頁與股票詳頁。citeturn28view0turn11view0turn24search4

| 畫面 | 主要目的 | 必備元件 | 設計備註 |
|---|---|---|---|
| 首頁 | 建立產品價值與市場脈搏 | Hero、今日資金總覽、熱門加碼股、熱門 ETF、CTA、FAQ | 首頁公開可索引，兼顧 SEO 與轉註冊 |
| ETF 清單頁 | 快速比較主動式 ETF | 表格 / 卡片切換、篩選器、排序、搜尋、資料時間戳 | 桌機預設表格；行動版改卡片 |
| ETF 詳頁 | 單檔決策中心 | 基本資料、績效、折溢價、最新持股、持股異動、操作日報、相關討論 | 清楚標示 as-of 日期與來源 |
| 股票詳頁 | 從個股反查 ETF 資金 | 持有該股之主動 ETF 列表、近 N 日加減碼趨勢、持股權重變化 | 這是 Web 與行動端都非常高價值的研究入口 |
| 全市場共識頁 | 看整體資金主線 | 今日加碼 / 減碼排行、跨 ETF 共識、資金流向熱圖 | 可作為每日流量入口 |
| 自選與提醒頁 | 提升留存 | 自選清單、提醒規則、最近觸發紀錄、權限狀態 | 登入後首頁預設導向此模組 |
| 付費牆與權限頁 | 轉換 | 權限對照、試用說明、解鎖功能列表、FAQ | 需與既有 App 付費權限一致 |

### UI 元件規格

這個產品最重要的不是華麗，而是「可信、快、明確」。因此元件規格建議如下：所有資料卡都必須有資料時間戳、來源標籤、是否為估計值、是否為 T-1 持股快照；所有列表都必須支援排序、篩選與儲存視圖；所有折溢價與預估淨值區塊都必須帶出免責說明。TWSE 明確提醒，主動式 ETF 的盤中投資組合不一定等於前一日揭露內容；而多家發行商也都在官網上說明 iNAV/即時估計淨值是以前一日投資組合或不同資訊來源估算，與實際淨值可能有差異。citeturn26view0turn14search3turn14search11turn14search15

建議的共用元件包括：`DataTimestamp`、`SourceBadge`、`PremiumDiscountCard`、`HoldingChangeTable`、`ManagerActionBadge`、`ConsensusHeatmap`、`EntitlementGate`、`ForumSnippet`、`SearchCombobox`、`SavedViewDropdown`、`EmptyState`、`SkeletonLoader`。其中 `EntitlementGate` 應支援「訪客可看摘要、登入可看更多、VIP 才看完整歷史與提醒」三段式顯示。

### 關鍵互動原則

網頁版最大的 UX 風險，不是功能不夠，而是把「資料揭露延遲」誤做成「即時真相」。所以每個持股區塊都應使用明確文案，例如「持股快照（披露日）」與「盤中實際持股可能與前揭露內容不同」；每個折溢價模組都應標示「市價 vs 前一計算基礎之估計淨值」；每張圖表都應能切換絕對數與變動率，避免使用者誤把張數變化當成權重變化。這些都是產品可信度的基本盤。citeturn26view0turn14search15

## 技術架構與資料設計

### 技術選型建議

本案的技術棧需要同時滿足四件事：公開頁 SEO、會員權限頁、批次資料整合、未來可持續擴充。基於官方能力與文件，Next.js App Router 適合做公開頁與會員頁混合的全端前端；NestJS 適合做有明確模組邊界、授權與背景任務的 API 層；Prisma Migrate 適合管理 schema 演進；PostgreSQL 的 JSONB 適合保存異質來源的原始 payload；Redis/BullMQ 適合 ETL、排程與提醒工作。另一方面，Redis Pub/Sub 本身是 at-most-once semantics，不適合拿來當「不能漏送」的提醒主渠道，因此提醒任務應走 BullMQ 或 Streams 類型的可重試隊列，而不是單純 Pub/Sub。citeturn12search0turn12search8turn12search1turn12search5turn12search9turn12search14turn21search1turn21search7turn12search3turn12search19turn21search5turn21search8

| 技術面向 | 建議方案 | 原因 | 不建議作為首選的替代方案 |
|---|---|---|---|
| 前端 | Next.js App Router + TypeScript | SEO、SSR、RSC、較適合公開 Landing + 會員頁混合 | 純 React SPA：公開頁 SEO 與首屏資料整合較弱 |
| 設計系統 | Tailwind CSS + 自建 Design Tokens | 快速對應金融表格、卡片與資料狀態元件 | 重型商用 UI 套件，易受客製限制 |
| 後端 | NestJS | 模組化、授權、interceptor、queue 整合好 | Express 僅適合超輕量 POC；中後期治理成本較高 citeturn21search0 |
| ORM | Prisma | migration 明確、TypeScript 整合佳 | 直接 SQL 可行，但團隊協作成本較高 |
| 主資料庫 | PostgreSQL | 關聯模型穩定、JSONB 可存 raw source payload | 純 NoSQL 不利於歷史快照與查詢整合 |
| 快取 / 工作佇列 | Redis + BullMQ | 快取熱門頁、做 ETL 與提醒任務 | 只有 cron + DB table，擴充與重試治理較差 |
| 搜尋 | MVP 用 PostgreSQL FTS；v1.5 再評估 OpenSearch | MVP 成本低、足夠處理 ETF / 股票名稱搜尋 | 一開始就上獨立搜尋叢集，過早複雜化 |
| 部署 | Docker 化，先上托管容器平台 | Next.js 與 NestJS 皆可直接用 Docker 部署 | 一開始就上 K8s，維運成本過高 citeturn22search0turn22search1 |

### 系統架構圖

```mermaid
flowchart LR
    subgraph Client
        U[Browser]
    end

    subgraph Edge
        CDN[CDN / WAF]
    end

    subgraph Web
        NEXT[Next.js Web App]
    end

    subgraph API
        BFF[NestJS API]
        AUTH[Auth / Entitlement Adapter]
        FORUM[Forum Adapter]
        BILLING[Billing Adapter]
    end

    subgraph Data
        PG[(PostgreSQL)]
        REDIS[(Redis)]
        OBJ[(Object Storage)]
    end

    subgraph Workers
        INGEST[Ingestion Workers]
        ETL[Metrics / Snapshot Jobs]
        ALERT[Alert Jobs]
    end

    subgraph Sources
        TWSEOAS[TWSE OpenAPI]
        TWSEFEED[TWSE Licensed Market Data]
        TPEXFEED[TPEx Market Data]
        ISSUER[Issuer Official Sites]
        CMINTERNAL[CMoney Internal Services]
    end

    U --> CDN --> NEXT --> BFF
    BFF --> PG
    BFF --> REDIS
    BFF --> AUTH
    BFF --> FORUM
    BFF --> BILLING

    INGEST --> TWSEOAS
    INGEST --> TWSEFEED
    INGEST --> TPEXFEED
    INGEST --> ISSUER
    INGEST --> CMINTERNAL

    INGEST --> OBJ
    INGEST --> PG
    ETL --> PG
    ETL --> REDIS
    ALERT --> REDIS
    ALERT --> PG
```

### 資料模型與資料庫設計

此產品的資料庫不要從「畫面」來切，而要從「可追溯的資料實體」來切。核心主表應至少包含：ETF 主檔、股票主檔、ETF 日價量、ETF 日淨值、持股快照表、持股明細表、操作日報摘要、用戶、自選、提醒規則、權限快照、資料匯入紀錄。因為官方來源異質且未必結構統一，建議每一批匯入都保留 `source_payload`、`source_hash`、`source_name`、`retrieved_at`，日後法遵、客服與資料追錯才有基礎。PostgreSQL JSONB 正適合這種半結構化原始來源保存。citeturn21search1turn21search7

```mermaid
erDiagram
    USER ||--o{ ETF_WATCHLIST : has
    USER ||--o{ STOCK_WATCHLIST : has
    USER ||--o{ ALERT_RULE : has
    USER ||--o{ USER_ENTITLEMENT : has

    ETF ||--o{ ETF_PRICE_DAILY : has
    ETF ||--o{ ETF_NAV_DAILY : has
    ETF ||--o{ ETF_HOLDING_SNAPSHOT : has
    ETF ||--o{ ETF_OPERATION_REPORT : has

    ETF_HOLDING_SNAPSHOT ||--o{ ETF_HOLDING_ITEM : contains
    STOCK ||--o{ ETF_HOLDING_ITEM : referenced_by
    STOCK ||--o{ STOCK_PRICE_DAILY : has

    INGEST_JOB ||--o{ INGEST_RECORD : writes
    INGEST_RECORD }o--|| ETF : for_etf

    USER {
      uuid id PK
      string email
      string display_name
      string cmoney_user_id
      datetime created_at
    }

    USER_ENTITLEMENT {
      uuid id PK
      uuid user_id FK
      string plan_code
      boolean is_active
      datetime expires_at
    }

    ETF {
      uuid id PK
      string code
      string name
      string asset_class
      string benchmark
      string base_currency
      string market
      string issuer_name
      boolean is_active
    }

    STOCK {
      uuid id PK
      string ticker
      string name
      string market
      string currency
    }

    ETF_HOLDING_SNAPSHOT {
      uuid id PK
      uuid etf_id FK
      date as_of_date
      datetime published_at
      decimal estimated_nav
      json source_payload
    }

    ETF_HOLDING_ITEM {
      uuid id PK
      uuid snapshot_id FK
      uuid stock_id FK
      decimal weight_pct
      decimal shares
      decimal change_shares
      decimal change_weight_pct
      string action_type
    }

    ETF_OPERATION_REPORT {
      uuid id PK
      uuid etf_id FK
      date trade_date
      json summary_json
      text editorial_note
    }
```

### API 設計原則與介面規格

因為這個產品的最大風險來自「資料時點誤解」，所以 API 絕不能只回資料本體，必須回 `meta`。每個回應至少包含：`generatedAt`、`asOfDate`、`source`、`isEstimated`、`cacheTtlSeconds`。若是持股或折溢價相關欄位，還要有 `disclaimerCode` 供前端渲染固定免責說明。

| Endpoint | 用途 | 權限 | 快取建議 |
|---|---|---|---|
| `GET /api/v1/etfs` | ETF 列表與篩選 | 公開 | 5 分鐘 |
| `GET /api/v1/etfs/:code` | ETF 基本資料 | 公開 | 10 分鐘 |
| `GET /api/v1/etfs/:code/holdings/latest` | 最新持股快照 | VIP / 可部分摘要公開 | 盤後更新後快取 |
| `GET /api/v1/etfs/:code/reports` | 操作日報列表 | VIP | 10 分鐘 |
| `GET /api/v1/market/consensus` | 全市場資金共識 | VIP / 可摘要公開 | 5 分鐘 |
| `GET /api/v1/stocks/:ticker/holders` | 反查持有該股票的主動 ETF | 登入後完整 | 5 分鐘 |
| `GET /api/v1/search?q=` | ETF / 股票搜尋 | 公開 | 1 分鐘 |
| `GET /api/v1/me/entitlements` | 目前權限 | 登入 | 不快取 |
| `GET /api/v1/me/watchlist` | 自選清單 | 登入 | 不快取 |
| `POST /api/v1/me/watchlist/etfs` | 加入自選 ETF | 登入 | 不快取 |
| `POST /api/v1/me/alerts` | 建立提醒 | VIP | 不快取 |

### 資料更新與計算邏輯

資料更新建議拆成三層：第一層是來源擷取，從 TWSE OpenAPI、授權行情、ETF 發行商官方頁與 CMoney 內部服務抓原始資料；第二層是正規化，把 ETF、股票、發行商、日期、貨幣、交易所、持股欄位映射到統一格式；第三層是衍生計算，產出資金總持股、持股異動、共識股、折溢價、股票反查持有 ETF。因為部分來源是官網揭露、部分來源是估計值、部分來源是授權行情，所以資料表中一定要存 `data_grade`，例如 `official_disclosure`、`official_estimate`、`licensed_realtime`、`internal_derived`。這樣前端才有機會把可信度表達清楚。

## 資料來源、授權與法規考量

### 第三方與官方資料來源策略

TWSE 已提供 OpenAPI 平台；政府開放資料授權條款第 1 版允許利用，但要求明確顯名標示來源；同時，TWSE / TPEx 的即時與延遲交易資訊若要正式使用，須依各自資訊使用管理辦法簽約、遵守收費與傳輸規範。另一方面，e 添富使用條款明示禁止未經同意以自動化裝置、腳本、蜘蛛或爬蟲方式下載網站資料。也就是說，MVP 最穩的路線不是「爬別人網站」，而是「能用 OpenAPI 就用 OpenAPI、能用自有內部資料就用內部資料、真的要即時就走正式授權行情」。citeturn16search1turn17search0turn17search8turn6search1turn7search1turn18search1

發行商官方來源則很適合作為主動式 ETF 持股與估值的原始依據，但不適合直接假設成「統一 API」。以公開頁面來看，Nomura、Allianz、CTBC、群益、聯博等官方產品頁各自提供不同類型資訊；其中 CTBC 的相關頁面在無 JavaScript 時甚至無法正常呈現，Allianz 與聯博都提醒即時預估淨值與實際淨值可能有差異，而群益官網則說明其 ETF 即時預估淨值約每 15 秒更新一次。這代表 Web 版需要 adapter-based ingestion，而不是單一 parser。citeturn14search0turn14search3turn15view2turn14search11turn14search15

| 來源類型 | 可取得資料 | 授權 / 法規重點 | 適合階段 | 建議 |
|---|---|---|---|---|
| TWSE OpenAPI | 上市證券公開 API、EOD 類資訊 | 依官方 OpenAPI 與政府資料開放授權條款使用，需顯名標示來源 citeturn16search1turn17search0turn17search8 | MVP | **高優先** |
| TWSE / TPEx 正式行情授權 | 即時或延遲行情、衍生資訊 | 需簽資訊使用契約並支付費用；即時與延遲均受管理 citeturn6search1turn6search4turn7search1turn7search8 | v1.5 之後 | **視商業需求導入** |
| ETF 發行商官網 | 當日實際投資組合、iNAV、公開說明書、公告 | 資料格式不一，部分頁面高度依賴 JS，需保留來源與揭露時間；不得誤導為即時實際淨值 citeturn26view0turn15view2turn14search3turn14search11turn14search15 | MVP | **高優先** |
| CMoney 內部資料服務 | 排名、績效、會員權限、論壇、內容稿件 | 需內部權限協作；若可重用可大幅縮短工期 | MVP | **最高優先** |
| e 添富網站頁面 | ETF 市統計、篩選與部分資料 | 官方使用條款限制未經同意之自動化下載方式 citeturn18search1 | 不建議直接依賴 | **僅作人工比對與驗證** |

### 授權成本與即時報價決策

若你考慮把「即時報價」列入第一期，這會是最直接把專案成本與法遵複雜度拉高的選項。公開可查的 TWSE 收費標準顯示，對非證券商及期貨商而言，即時交易資訊的傳輸授權費每月新台幣 60,000 元，另需依經營規模支付資訊費；TPEx 的國內地區直接傳輸固定資訊使用費每月 60,000 元，另針對 Internet 等傳輸方式每月再加 20,000 元變動費。換句話說，即使先不算 TWSE 的規模型資訊費、專線、備援、第三方 vendor 與法務成本，單是已公開可見的基本費用結構就足以證明：即時行情不該在沒有明確商業回收的前提下進到 MVP。citeturn6search4turn7search8

因此，本報告建議的路線是：MVP 以「盤後揭露 + 延遲或估值型資訊 + 明確時間戳與免責說明」為主；當你完成使用者驗證、知道 Web 用戶真的會因盤中決策受益，再升級到正式授權行情。

### 投顧、廣告與文案邊界

法遵上最需要小心的，不是資料本身，而是文字和互動方式。依現行投顧規範，證券投資顧問事業對證券投資或交易提供分析意見或推介建議時，應訂定書面契約；另有行為規範明確禁止保證獲利、負擔損失、於公開媒體對不特定人進行未附合理分析依據的個別有價證券推介，以及容易使人認為確可獲利的表示。廣告警語也必須以顯著方式揭示。這表示 Web 版可以做「描述性分析」、「持股異動摘要」、「資金共識呈現」、「歷史資料視覺化」，但第一期不應做「AI 幫你挑明天會漲哪一檔」、「立即買進」、「保證勝率」這種文案與互動。citeturn5search0turn5search4turn19search0turn19search1

實務上，建議把文案規則寫進 CMS 與前端元件層。也就是說，任何帶投資傾向的文案都透過白名單模板產生，並在頁面底部與卡片 hover 狀態自動帶出固定警語；涉及個股的內容，只能說明「哪些主動式 ETF 正在加碼/減碼」、「歷史上權重如何變動」，不能用推介語態。

### 個資、帳號與用戶權限

CMoney 目前已有會員隱私權政策，明示遵循個人資料保護法；Google Play 上的 App 資料安全說明也把「傳輸時加密」與「可要求刪除資料」視為基本期待。若 Web 版要做登入、自選、提醒與權限同步，就不應單純沿用手機 App 的最低蒐集假設，而應在 Web 版補齊 cookie 同意、登入紀錄、刪除申請、匯出申請、通知偏好與資料保存政策。citeturn13search0turn11view1turn20search4

### 建議查閱的原始來源

下列來源，建議作為專案開始前的法遵、資料、產品三方共同閱讀清單。

| 來源 | 用途 | 建議 |
|---|---|---|
| CMoney「主動式ETF」官方 Landing Page | 盤點現有產品價值主張與六大功能 | 以此作為 Web UX 資訊架構基線 citeturn28view0 |
| App Store「主動式ETF」頁面 | 盤點 iOS 版定位、版本迭代與付費模式 | 以此確認現有商業模式與新功能脈絡 citeturn11view0 |
| Google Play「主動式ETF」頁面 | 盤點 Android 版定位、資料安全聲明 | 以此設計 Web 權限與刪除流程預期 citeturn11view1 |
| TWSE「主動式交易所交易基金」 | 主動式 ETF 制度基本定義 | 作為 A/D 類型、每日揭露規則與風險文案依據 citeturn8view0 |
| 金管會「證券投資信託基金管理辦法」 | 法源基礎 | 作為主動式 ETF 法規邊界依據 citeturn4search0 |
| TWSE e 添富平台與使用條款 | 市場統計、競品基準、使用限制 | 只做比對參考，不作未授權自動擷取來源 citeturn16search0turn18search1 |
| TWSE / TPEx 交易資訊使用管理與收費標準 | 即時或延遲行情導入成本 | 決定是否進入即時報價開發 citeturn6search1turn6search4turn7search1turn7search8 |
| 政府資料開放授權條款第 1 版 | 開放資料顯名要求 | 所有 OpenAPI / 政府資料重製都應遵循 citeturn17search0turn17search8 |
| CMoney 會員登入與隱私頁 | SSO / 權限打通 | 優先重用現有會員與權限模型 citeturn30search4turn13search0 |

## 交付計畫、測試、部署與維運

### 測試計畫

這類金融資訊產品的測試不能只有「畫面有沒有跑出來」。最少要有六個維度：業務邏輯、資料正確性、法遵文案、效能、權限與事故回復。尤其持股快照、操作日報、折溢價與股票反查，是最容易被使用者拿去做盤中決策的地方，任何欄位對錯都不是單純 UX bug，而是產品信任問題。citeturn26view0turn14search15

| 測試類型 | 測試重點 | 工具建議 | 驗收標準 |
|---|---|---|---|
| Unit Test | 計算欄位、排序、篩選、權限 gating | Jest / Vitest | 覆蓋率 > 80% 於核心 domain service |
| Integration Test | API + DB + Cache + queue | Jest + Supertest + Testcontainers | 核心 API 全綠 |
| E2E | 搜尋、登入、自選、VIP 牆、詳頁導流 | Playwright | 關鍵流程皆可回歸 |
| Data QA | ETF 基本資料、持股快照、揭露時間、來源追溯 | 自建校驗 job | 每日 ETL 差異報表可追原因 |
| Performance | 首頁、ETF 清單、ETF 詳頁、搜尋 | k6 / Lighthouse | 公開頁 LCP 與 API p95 達標 |
| Security | 認證、權限、CSRF、Rate Limit、XSS、Secrets | SAST + DAST + dependency scan | 上線前完成修補 |
| UAT | PM / 法遵 / 客服 / 內容 | UAT checklist | 文案、免責聲明、客服流程全部簽核 |

### 部署策略

Next.js 與 NestJS 官方文件都允許以 Docker 方式佈署；GitHub Actions 可直接做 CI/CD，GitHub Container Registry 可用來寄存映像。就專案複雜度來看，建議先選擇「托管容器服務 + PostgreSQL + Redis 託管服務」的模式，而不是一開始就自建 Kubernetes。citeturn22search0turn22search1turn23search18turn23search1

| 方案 | 適用情境 | 優點 | 缺點 | 建議 |
|---|---|---|---|---|
| 托管容器平台 | MVP 到 v1 | 上線快、維運輕、相容 Docker | 進階網路與成本最佳化較受限 | **首選** |
| VPS + Docker Compose | 團隊非常小、成本極敏感 | 便宜直觀 | 備援、升級、觀測、彈性較弱 | 可用於 internal beta |
| Kubernetes | 高流量、多環境、多團隊 | 彈性高、可治理 | 導入與維運成本高 | 不建議做 MVP |

### 維運與可觀測性

維運上，至少需要四層監控：前端體驗、API 效能、資料工作流、法遵異常。前端要看 RUM 與 Web Vitals；API 要看 p95 latency、error rate、cache hit rate；ETL 要看成功率、來源延遲、資料異常數；法遵面要看被隱藏/下架的內容、人工審核待處理數、錯誤提醒觸發率。若未來加入提醒功能，建議每封通知都記錄觸發條件、來源、資料時點與送達狀態，避免客服無法追查。

### 風險評估與緩解措施

| 風險 | 等級 | 說明 | 緩解措施 |
|---|---|---|---|
| 資料揭露延遲被誤解為即時 | 高 | 主動式 ETF 實際盤中部位可與前一揭露日不同 citeturn26view0 | 全站加時間戳、估值標籤、固定免責說明 |
| 未授權抓取行情或網站資料 | 高 | TWSE / TPEx 行情需簽約；e 添富禁止未經同意之自動化下載 citeturn6search1turn7search1turn18search1 | 僅用 OpenAPI、正式授權與內部資料 |
| 文案越界成投資勸誘 | 高 | 投顧與廣告規範對推介、保證獲利有明確限制 citeturn5search0turn5search4turn19search0turn19search1 | 文案模板化、法遵審核、禁用敏感詞 |
| 發行商來源格式不一致 | 中高 | 官網頁面與 iNAV 呈現方式差異大，部分強依賴 JS citeturn15view2turn14search3turn14search11 | Adapter-based ingestion、保留 raw payload |
| 帳號與權限未與 App 打通 | 中高 | 用戶可能重複付費、客服量上升 | 優先重用 CMoney 會員與 entitlements |
| 搜尋與列表效能下滑 | 中 | ETF/股票雙向查詢易產生多 join | MVP 用 PostgreSQL 索引與快取，成長後再拆搜尋服務 |
| 討論區內容風險 | 中 | 社群內容可能帶來檢舉與法務風險 | MVP 先唯讀整合，不自建發文 |
| 即時行情成本失控 | 中高 | 授權費、資訊費與維運成本拉高 | 先做 EOD / 延遲，達成 PMF 後再導入 |

### 工時、人力配置與預算估算

以下估算基於本報告預設假設：重用 CMoney 登入 / 權限；MVP 不含交易、不含正式即時授權行情；討論區先唯讀整合；以中階到資深混編團隊進行。

| 角色 | MVP 平均投入 | v1 平均投入 | 主要職責 |
|---|---:|---:|---|
| Product Manager / PO | 0.5 FTE | 0.7 FTE | 範圍控管、需求優先序、上線協調 |
| UI/UX Designer | 0.4 FTE | 0.5 FTE | IA、桌機版型、設計系統 |
| Frontend Engineer | 1.5 FTE | 2.0 FTE | Next.js、頁面、互動、SEO |
| Backend Engineer | 1.5 FTE | 2.0 FTE | API、ETL、權限、資料流 |
| Data Engineer | 0.5 FTE | 0.8 FTE | 資料適配、校驗、衍生指標 |
| QA Engineer | 0.4 FTE | 0.7 FTE | 測試、回歸、UAT |
| DevOps / SRE | 0.2 FTE | 0.3 FTE | CI/CD、部署、觀測 |
| 法遵 / 內容審閱 | 0.1 FTE | 0.2 FTE | 警語、文案與來源流程 |

| 項目 | MVP 估算 | v1 估算 |
|---|---:|---:|
| 人力成本 | NT$ 230 萬 ～ 280 萬 | NT$ 360 萬 ～ 520 萬 |
| 設計 / 法遵 / UAT | NT$ 25 萬 ～ 40 萬 | NT$ 40 萬 ～ 60 萬 |
| 雲端 / 測試 / 觀測 / 第三方工具 | NT$ 15 萬 ～ 25 萬 | NT$ 30 萬 ～ 50 萬 |
| 預備金與變更緩衝 | NT$ 20 萬 ～ 25 萬 | NT$ 30 萬 ～ 45 萬 |
| **總計** | **NT$ 290 萬 ～ 370 萬** | **NT$ 430 萬 ～ 650 萬** |

| 月營運項目 | 不含即時行情 | 含即時行情 |
|---|---:|---:|
| 雲端主機 / DB / Redis / 儲存 / CDN | NT$ 3 萬 ～ 8 萬 | NT$ 5 萬 ～ 12 萬 |
| 觀測、信件、簡訊、錯誤追蹤 | NT$ 1 萬 ～ 3 萬 | NT$ 2 萬 ～ 4 萬 |
| 市場資料 | 低到中低 | 顯著升高，且公開可見固定 / 基礎費用已可推知至少是高五位數到低六位數等級 citeturn6search4turn7search8 |
| **月總計** | **NT$ 5 萬 ～ 15 萬** | **NT$ 20 萬 ～ 40 萬以上** |

### Sprint 切分

以下以每個 Sprint 兩週規劃，前三個 Sprint 為 MVP，後三個 Sprint 為正式上市版補全。

| Sprint | 目標 | 主要交付 |
|---|---|---|
| Sprint A | 基礎建設 | Monorepo、設計系統、Auth/Entitlement Adapter、ETF 主檔、首頁與 ETF 清單 |
| Sprint B | 深度頁面 | ETF 詳頁、持股快照、折溢價、資料來源與時間戳、操作日報列表 |
| Sprint C | MVP 完成 | 搜尋、股票詳頁反查持有 ETF、自選、VIP 牆、基本 analytics、Beta 上線 |
| Sprint D | 研究效率 | 全市場共識頁、已儲存視圖、歷史查詢、Email / 站內提醒 |
| Sprint E | 社群與內容 | 唯讀論壇整合、內容維護台、法遵流程、自動 QA 報表 |
| Sprint F | 上線硬化 | 效能優化、緩存策略、壓測、資安檢查、正式上線與 SOP |

## Codex 可直接使用的開發規格

### 專案結構

以下結構以 **pnpm monorepo + Next.js App Router + NestJS + Prisma + PostgreSQL + Redis/BullMQ** 為基準，符合前述技術建議與官方能力邊界。citeturn12search0turn12search1turn12search14turn12search19turn22search0turn22search1

```text
cmoney-active-etf-web/
├─ apps/
│  ├─ web/
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ etfs/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [code]/page.tsx
│  │  │  │  ├─ stocks/
│  │  │  │  │  └─ [ticker]/page.tsx
│  │  │  │  └─ me/watchlist/page.tsx
│  │  │  ├─ components/
│  │  │  │  ├─ etf-table.tsx
│  │  │  │  ├─ premium-discount-card.tsx
│  │  │  │  ├─ source-badge.tsx
│  │  │  │  └─ entitlement-gate.tsx
│  │  │  └─ lib/
│  │  │     ├─ api.ts
│  │  │     └─ types.ts
│  │  ├─ next.config.ts
│  │  ├─ package.json
│  │  └─ Dockerfile
│  └─ api/
│     ├─ src/
│     │  ├─ main.ts
│     │  ├─ app.module.ts
│     │  ├─ common/
│     │  │  ├─ guards/auth.guard.ts
│     │  │  ├─ interceptors/response.interceptor.ts
│     │  │  └─ filters/http-exception.filter.ts
│     │  ├─ modules/
│     │  │  ├─ etfs/
│     │  │  │  ├─ etfs.controller.ts
│     │  │  │  ├─ etfs.service.ts
│     │  │  │  └─ dto/list-etfs.dto.ts
│     │  │  ├─ stocks/
│     │  │  │  ├─ stocks.controller.ts
│     │  │  │  └─ stocks.service.ts
│     │  │  ├─ watchlist/
│     │  │  │  ├─ watchlist.controller.ts
│     │  │  │  └─ watchlist.service.ts
│     │  │  ├─ entitlements/
│     │  │  └─ ingest/
│     │  └─ prisma/prisma.service.ts
│     ├─ test/
│     │  └─ etfs.e2e-spec.ts
│     ├─ package.json
│     └─ Dockerfile
├─ packages/
│  ├─ ui/
│  ├─ config/
│  └─ types/
├─ prisma/
│  ├─ schema.prisma
│  ├─ seed.ts
│  └─ migrations/
├─ infra/
│  ├─ docker-compose.yml
│  └─ nginx/
├─ .github/
│  └─ workflows/
│     └─ ci.yml
├─ .env.example
├─ pnpm-workspace.yaml
└─ package.json
```

### MVP 功能清單

| 優先度 | MVP 功能 | 說明 |
|---|---|---|
| P0 | 公開首頁 | SEO + 下載 / 註冊導流 |
| P0 | ETF 清單 | 篩選、排序、搜尋 |
| P0 | ETF 詳頁 | 基本資料、績效、折溢價、最新持股快照 |
| P0 | 操作日報 | 單檔 ETF 當日摘要與歷史列表 |
| P0 | 股票反查持有 ETF | 從股票看資金去向 |
| P0 | 登入與權限同步 | 接既有 CMoney 會員 / entitlement |
| P0 | 自選清單 | ETF / 股票加入自選 |
| P1 | 全市場共識頁 | 今日資金主線與焦點股 |
| P1 | Email / 站內提醒 | 自選異動通知 |
| P2 | 唯讀討論區整合 | 深連結論壇或嵌入摘要 |
| P3 | 正式即時行情 | 需另走授權資料專案 |
| P3 | 交易功能 | 不列入 MVP |

### 前端範例

`apps/web/src/lib/api.ts`

```ts
export type ApiMeta = {
  generatedAt: string;
  asOfDate?: string;
  source: string[];
  isEstimated?: boolean;
};

export type ApiResponse<T> = {
  data: T;
  meta: ApiMeta;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export async function apiGet<T>(
  path: string,
  init?: RequestInit & { revalidate?: number }
): Promise<ApiResponse<T>> {
  const { revalidate = 300, ...rest } = init ?? {};
  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json() as Promise<ApiResponse<T>>;
}
```

`apps/web/src/app/etfs/page.tsx`

```tsx
import { apiGet } from "@/lib/api";

type EtfListItem = {
  code: string;
  name: string;
  issuerName: string;
  assetClass: "ACTIVE_STOCK" | "ACTIVE_BOND";
  latestClose?: number;
  premiumDiscountPct?: number;
  latestNavDate?: string;
};

export default async function EtfListPage() {
  const res = await apiGet<EtfListItem[]>("/api/v1/etfs?active=true", {
    revalidate: 300,
  });

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">主動式 ETF 清單</h1>
        <p className="text-sm text-gray-500">
          資料更新時間：{res.meta.generatedAt}
        </p>
      </header>

      <div className="overflow-x-auto rounded-xl border">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 text-left">
              <th className="px-4 py-3">代號</th>
              <th className="px-4 py-3">名稱</th>
              <th className="px-4 py-3">發行人</th>
              <th className="px-4 py-3">類型</th>
              <th className="px-4 py-3">收盤價</th>
              <th className="px-4 py-3">折溢價</th>
            </tr>
          </thead>
          <tbody>
            {res.data.map((etf) => (
              <tr key={etf.code} className="border-b">
                <td className="px-4 py-3 font-medium">{etf.code}</td>
                <td className="px-4 py-3">
                  <a href={`/etfs/${etf.code}`} className="hover:underline">
                    {etf.name}
                  </a>
                </td>
                <td className="px-4 py-3">{etf.issuerName}</td>
                <td className="px-4 py-3">
                  {etf.assetClass === "ACTIVE_STOCK" ? "股票主動式" : "債券主動式"}
                </td>
                <td className="px-4 py-3">{etf.latestClose ?? "-"}</td>
                <td className="px-4 py-3">
                  {etf.premiumDiscountPct != null
                    ? `${etf.premiumDiscountPct.toFixed(2)}%`
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
```

`apps/web/src/app/etfs/[code]/page.tsx`

```tsx
import { apiGet } from "@/lib/api";

type HoldingItem = {
  ticker: string;
  stockName: string;
  weightPct: number;
  changeWeightPct?: number;
  actionType?: "BUY" | "SELL" | "NEW" | "EXIT" | "HOLD";
};

type EtfDetail = {
  code: string;
  name: string;
  issuerName: string;
  benchmark?: string;
  latestClose?: number;
  estimatedNav?: number;
  premiumDiscountPct?: number;
  holdings: HoldingItem[];
};

export default async function EtfDetailPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const res = await apiGet<EtfDetail>(`/api/v1/etfs/${code}`);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <section className="mb-8">
        <h1 className="text-2xl font-bold">
          {res.data.code} {res.data.name}
        </h1>
        <p className="mt-2 text-gray-600">
          發行人：{res.data.issuerName}　Benchmark：
          {res.data.benchmark ?? "無"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          as of {res.meta.asOfDate ?? "-"}；來源：{res.meta.source.join(" / ")}
          {res.meta.isEstimated ? "；含估計值" : ""}
        </p>
      </section>

      <section className="mb-8 grid gap-4 md:grid-cols-3">
        <StatCard title="最新收盤價" value={res.data.latestClose ?? "-"} />
        <StatCard title="估計淨值" value={res.data.estimatedNav ?? "-"} />
        <StatCard
          title="折溢價"
          value={
            res.data.premiumDiscountPct != null
              ? `${res.data.premiumDiscountPct.toFixed(2)}%`
              : "-"
          }
        />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">最新持股快照</h2>
        <div className="overflow-x-auto rounded-xl border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 text-left">
                <th className="px-4 py-3">股票</th>
                <th className="px-4 py-3">權重</th>
                <th className="px-4 py-3">權重變化</th>
                <th className="px-4 py-3">動作</th>
              </tr>
            </thead>
            <tbody>
              {res.data.holdings.map((item) => (
                <tr key={item.ticker} className="border-b">
                  <td className="px-4 py-3">
                    <a
                      href={`/stocks/${item.ticker}`}
                      className="hover:underline"
                    >
                      {item.ticker} {item.stockName}
                    </a>
                  </td>
                  <td className="px-4 py-3">{item.weightPct.toFixed(2)}%</td>
                  <td className="px-4 py-3">
                    {item.changeWeightPct != null
                      ? `${item.changeWeightPct.toFixed(2)}%`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">{item.actionType ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          主動式 ETF 盤中實際持股可能與前一揭露快照不同，請以發行人正式公告為準。
        </p>
      </section>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
```

### 後端範例

`apps/api/src/modules/etfs/dto/list-etfs.dto.ts`

```ts
import { IsBooleanString, IsIn, IsOptional, IsString } from "class-validator";

export class ListEtfsDto {
  @IsOptional()
  @IsBooleanString()
  active?: string;

  @IsOptional()
  @IsIn(["ACTIVE_STOCK", "ACTIVE_BOND"])
  assetClass?: "ACTIVE_STOCK" | "ACTIVE_BOND";

  @IsOptional()
  @IsString()
  q?: string;
}
```

`apps/api/src/modules/etfs/etfs.controller.ts`

```ts
import {
  Controller,
  Get,
  Param,
  ParseStringPipe,
  Query,
} from "@nestjs/common";
import { EtfsService } from "./etfs.service";
import { ListEtfsDto } from "./dto/list-etfs.dto";

@Controller("/api/v1/etfs")
export class EtfsController {
  constructor(private readonly etfsService: EtfsService) {}

  @Get()
  async list(@Query() query: ListEtfsDto) {
    const data = await this.etfsService.list(query);
    return {
      data,
      meta: {
        generatedAt: new Date().toISOString(),
        source: ["db.cache"],
      },
    };
  }

  @Get(":code")
  async detail(@Param("code", ParseStringPipe) code: string) {
    const data = await this.etfsService.detail(code.toUpperCase());
    return {
      data,
      meta: {
        generatedAt: new Date().toISOString(),
        asOfDate: data.holdingsAsOfDate,
        source: data.sources,
        isEstimated: true,
      },
    };
  }
}
```

`apps/api/src/modules/etfs/etfs.service.ts`

```ts
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ListEtfsDto } from "./dto/list-etfs.dto";

@Injectable()
export class EtfsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListEtfsDto) {
    const items = await this.prisma.etf.findMany({
      where: {
        isActive: query.active ? query.active === "true" : undefined,
        assetClass: query.assetClass,
        OR: query.q
          ? [
              { code: { contains: query.q, mode: "insensitive" } },
              { name: { contains: query.q, mode: "insensitive" } },
            ]
          : undefined,
      },
      include: {
        latestMetric: true,
      },
      orderBy: [{ code: "asc" }],
      take: 200,
    });

    return items.map((i) => ({
      code: i.code,
      name: i.name,
      issuerName: i.issuerName,
      assetClass: i.assetClass,
      latestClose: i.latestMetric?.latestClose,
      premiumDiscountPct: i.latestMetric?.premiumDiscountPct,
      latestNavDate: i.latestMetric?.asOfDate?.toISOString().slice(0, 10),
    }));
  }

  async detail(code: string) {
    const etf = await this.prisma.etf.findUnique({
      where: { code },
      include: {
        latestMetric: true,
        holdingSnapshots: {
          orderBy: { asOfDate: "desc" },
          take: 1,
          include: {
            items: {
              orderBy: { weightPct: "desc" },
              take: 50,
              include: { stock: true },
            },
          },
        },
      },
    });

    if (!etf) {
      throw new NotFoundException(`ETF ${code} not found`);
    }

    const snapshot = etf.holdingSnapshots[0];

    return {
      code: etf.code,
      name: etf.name,
      issuerName: etf.issuerName,
      benchmark: etf.benchmark,
      latestClose: etf.latestMetric?.latestClose ?? null,
      estimatedNav: etf.latestMetric?.estimatedNav ?? null,
      premiumDiscountPct: etf.latestMetric?.premiumDiscountPct ?? null,
      holdingsAsOfDate: snapshot?.asOfDate?.toISOString().slice(0, 10) ?? null,
      sources: ["issuer.official", "twse.openapi"],
      holdings:
        snapshot?.items.map((item) => ({
          ticker: item.stock.ticker,
          stockName: item.stock.name,
          weightPct: Number(item.weightPct),
          changeWeightPct: item.changeWeightPct
            ? Number(item.changeWeightPct)
            : null,
          actionType: item.actionType,
        })) ?? [],
    };
  }
}
```

### Prisma Schema

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum AssetClass {
  ACTIVE_STOCK
  ACTIVE_BOND
}

enum ActionType {
  BUY
  SELL
  NEW
  EXIT
  HOLD
}

model User {
  id             String            @id @default(uuid())
  email          String            @unique
  displayName    String?
  cmoneyUserId   String?           @unique
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  entitlements   UserEntitlement[]
  etfWatchlist   EtfWatchlistItem[]
  stockWatchlist StockWatchlistItem[]
}

model UserEntitlement {
  id        String   @id @default(uuid())
  userId    String
  planCode  String
  isActive  Boolean  @default(true)
  expiresAt DateTime?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, isActive])
}

model Etf {
  id               String               @id @default(uuid())
  code             String               @unique
  name             String
  issuerName       String
  assetClass       AssetClass
  benchmark        String?
  baseCurrency     String               @default("TWD")
  market           String               @default("TW")
  isActive         Boolean              @default(true)
  createdAt        DateTime             @default(now())
  updatedAt        DateTime             @updatedAt
  latestMetric     EtfMetricDaily?
  holdingSnapshots EtfHoldingSnapshot[]
  watchlistItems   EtfWatchlistItem[]
}

model Stock {
  id             String               @id @default(uuid())
  ticker         String               @unique
  name           String
  market         String               @default("TW")
  currency       String               @default("TWD")
  holdingItems   EtfHoldingItem[]
  watchlistItems StockWatchlistItem[]
}

model EtfMetricDaily {
  id                 String   @id @default(uuid())
  etfId              String   @unique
  asOfDate           DateTime
  latestClose        Decimal? @db.Decimal(18, 4)
  estimatedNav       Decimal? @db.Decimal(18, 4)
  premiumDiscountPct Decimal? @db.Decimal(8, 4)
  rawPayload         Json?
  etf                Etf      @relation(fields: [etfId], references: [id], onDelete: Cascade)
}

model EtfHoldingSnapshot {
  id            String           @id @default(uuid())
  etfId         String
  asOfDate      DateTime
  publishedAt   DateTime?
  sourceName    String
  sourceHash    String?
  sourcePayload Json?
  etf           Etf              @relation(fields: [etfId], references: [id], onDelete: Cascade)
  items         EtfHoldingItem[]

  @@unique([etfId, asOfDate])
  @@index([asOfDate])
}

model EtfHoldingItem {
  id              String             @id @default(uuid())
  snapshotId      String
  stockId         String
  weightPct       Decimal            @db.Decimal(10, 4)
  shares          Decimal?           @db.Decimal(20, 4)
  changeWeightPct Decimal?           @db.Decimal(10, 4)
  actionType      ActionType         @default(HOLD)
  snapshot        EtfHoldingSnapshot @relation(fields: [snapshotId], references: [id], onDelete: Cascade)
  stock           Stock              @relation(fields: [stockId], references: [id], onDelete: Restrict)

  @@unique([snapshotId, stockId])
  @@index([stockId])
}

model EtfWatchlistItem {
  id        String   @id @default(uuid())
  userId    String
  etfId     String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  etf       Etf      @relation(fields: [etfId], references: [id], onDelete: Cascade)

  @@unique([userId, etfId])
}

model StockWatchlistItem {
  id        String   @id @default(uuid())
  userId    String
  stockId   String
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  stock     Stock    @relation(fields: [stockId], references: [id], onDelete: Cascade)

  @@unique([userId, stockId])
}
```

`prisma/migrations/manual_indexes.sql`

```sql
CREATE INDEX IF NOT EXISTS idx_etf_holdingsnapshot_etf_date_desc
  ON "EtfHoldingSnapshot" ("etfId", "asOfDate" DESC);

CREATE INDEX IF NOT EXISTS idx_etfholdingitem_snapshot_weight_desc
  ON "EtfHoldingItem" ("snapshotId", "weightPct" DESC);
```

### API Request / Response JSON 範例

`GET /api/v1/etfs/00981A`

```json
{
  "data": {
    "code": "00981A",
    "name": "主動統一台股增長",
    "issuerName": "統一投信",
    "benchmark": "臺灣證券交易所發行量加權股價指數",
    "latestClose": 30.6,
    "estimatedNav": 30.41,
    "premiumDiscountPct": 0.62,
    "holdingsAsOfDate": "2026-06-12",
    "sources": ["issuer.official", "twse.openapi"],
    "holdings": [
      {
        "ticker": "2330",
        "stockName": "台積電",
        "weightPct": 9.75,
        "changeWeightPct": 0.35,
        "actionType": "BUY"
      },
      {
        "ticker": "2383",
        "stockName": "台光電",
        "weightPct": 7.64,
        "changeWeightPct": -0.12,
        "actionType": "SELL"
      }
    ]
  },
  "meta": {
    "generatedAt": "2026-06-14T03:12:22.111Z",
    "asOfDate": "2026-06-12",
    "source": ["issuer.official", "twse.openapi"],
    "isEstimated": true
  }
}
```

`POST /api/v1/me/watchlist/etfs`

Request:

```json
{
  "code": "00981A"
}
```

Response:

```json
{
  "data": {
    "ok": true,
    "watchlistItemId": "3afdd850-4dca-4671-bdbc-0bcf0202ba34"
  },
  "meta": {
    "generatedAt": "2026-06-14T03:13:10.111Z",
    "source": ["app.write"]
  }
}
```

### 測試範例

`apps/api/test/etfs.e2e-spec.ts`

```ts
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../src/app.module";

describe("ETFs API", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /api/v1/etfs should return envelope", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/etfs?active=true")
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.meta).toHaveProperty("generatedAt");
  });
});
```

`apps/web/e2e/etf-list.spec.ts`

```ts
import { test, expect } from "@playwright/test";

test("ETF list page renders and supports navigation", async ({ page }) => {
  await page.goto("/etfs");
  await expect(page.getByRole("heading", { name: "主動式 ETF 清單" })).toBeVisible();

  await page.getByRole("link", { name: /00981A/ }).click();
  await expect(page).toHaveURL(/\/etfs\/00981A$/);
});
```

### CI/CD 腳本範例

`.github/workflows/ci.yml`

```yaml
name: ci

on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          cache: pnpm

      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build

  docker:
    if: github.ref == 'refs/heads/main'
    needs: quality
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/api/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/cmoney-active-etf-api:latest

      - uses: docker/build-push-action@v6
        with:
          context: .
          file: apps/web/Dockerfile
          push: true
          tags: ghcr.io/${{ github.repository_owner }}/cmoney-active-etf-web:latest
```

### Dockerfile 與部署範例

`apps/web/Dockerfile`

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --filter ./apps/web... --filter ./packages/types... --frozen-lockfile=false

FROM deps AS builder
COPY . .
RUN pnpm --filter web build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public
EXPOSE 3000
CMD ["node", "apps/web/server.js"]
```

`apps/api/Dockerfile`

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY prisma prisma
RUN pnpm install --filter ./apps/api... --frozen-lockfile=false

FROM deps AS builder
COPY . .
RUN pnpm --filter api build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
RUN corepack enable && pnpm install --prod --frozen-lockfile=false
EXPOSE 4000
CMD ["node", "dist/main.js"]
```

`infra/docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: active_etf
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  api:
    build:
      context: ..
      dockerfile: apps/api/Dockerfile
    environment:
      DATABASE_URL: postgresql://app:app@postgres:5432/active_etf?schema=public
      REDIS_URL: redis://redis:6379
      PORT: 4000
    depends_on:
      - postgres
      - redis
    ports:
      - "4000:4000"

  web:
    build:
      context: ..
      dockerfile: apps/web/Dockerfile
    environment:
      NEXT_PUBLIC_API_BASE_URL: http://localhost:4000
    depends_on:
      - api
    ports:
      - "3000:3000"

volumes:
  pgdata:
```

部署指令：

```bash
pnpm install
pnpm prisma migrate deploy
docker compose -f infra/docker-compose.yml up -d --build
```

### 環境變數範本

`.env.example`

```bash
# app
NODE_ENV=development
PORT=4000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# database
DATABASE_URL=postgresql://app:app@localhost:5432/active_etf?schema=public
REDIS_URL=redis://localhost:6379

# auth / existing cmoney integration
CMONEY_AUTH_BASE_URL=https://auth.cmoney.tw
CMONEY_MEMBER_INFO_URL=https://www.cmoney.tw/identity/account/info
CMONEY_JWT_PUBLIC_KEY=replace_me
CMONEY_ENTITLEMENT_API_URL=https://internal.cmoney.example/entitlements

# forum / content
CMONEY_FORUM_BASE_URL=https://www.cmoney.tw/forum
CMONEY_CONTENT_API_URL=https://internal.cmoney.example/content

# data sources
TWSE_OPENAPI_BASE_URL=https://openapi.twse.com.tw/v1
ENABLE_REALTIME_MARKET_DATA=false
MARKET_DATA_MODE=eod
DATA_SOURCE_PRIMARY=internal_then_official

# notifications
EMAIL_FROM=no-reply@example.com
SMTP_URL=smtp://user:pass@mail.example.com:587
ALERT_COOLDOWN_MINUTES=60

# observability
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

### 給 Codex / Copilot 的實作提示

可以直接用下面這段作為開發起始 prompt：

```text
請建立一個 pnpm monorepo 專案，包含：
- apps/web: Next.js App Router + TypeScript
- apps/api: NestJS + Prisma + PostgreSQL + Redis/BullMQ
- 以主動式 ETF 資料站為題，先完成以下 MVP：
  1. 公開首頁
  2. ETF 清單頁（支援搜尋 / 篩選 / 排序）
  3. ETF 詳頁（基本資料、最新持股快照、折溢價卡）
  4. 股票詳頁（反查持有該股票的主動式 ETF）
  5. 會員自選清單
  6. API 回應一律使用 { data, meta } envelope，meta 至少含 generatedAt / asOfDate / source / isEstimated
- Prisma schema 需包含 User, UserEntitlement, Etf, Stock, EtfMetricDaily, EtfHoldingSnapshot, EtfHoldingItem, EtfWatchlistItem, StockWatchlistItem
- 前端頁面先用假資料與 fetch 接後端
- 後端先提供 GET /api/v1/etfs, GET /api/v1/etfs/:code, GET /api/v1/stocks/:ticker/holders, POST /api/v1/me/watchlist/etfs
- 實作 Dockerfile、docker-compose、GitHub Actions CI
- 加入 Jest 與 Playwright 基本測試
- 所有跟淨值、折溢價、持股快照相關畫面，都要顯示資料時間戳與免責提示
```

上述規格的核心原則很簡單：**先把 Web 的價值做出來，再決定是否做昂貴的即時行情與更重的社群 / 交易整合**。這樣最符合目前 CMoney 主動式 ETF 產品的公開定位、台灣主動式 ETF 的揭露實務，以及第一期可控的技術與法遵風險。citeturn28view0turn26view0turn6search4turn7search8turn5search0turn19search1