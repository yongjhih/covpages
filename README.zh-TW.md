# covpages

[English](README.md) · [繁體中文](README.zh-TW.md)

[![Coverage](https://yongjhih.github.io/covpages/badge.svg)](https://yongjhih.github.io/covpages/)
[![MCP Pages: Connect](https://img.shields.io/badge/MCP%20Pages-Connect-238636?logo=github&logoColor=white)](https://yongjhih.github.io/ai-proxy/dashboard.html#add-url=https%3A%2F%2Fyongjhih.github.io%2Fcovpages%2Fcovpages%2Fmcp)
[![Specification](https://img.shields.io/badge/docs-specification-blue.svg)](docs/SPECIFICATION.md)
[![Benchmark](https://img.shields.io/badge/benchmark-97.6%25%20savings-success.svg)](docs/BENCHMARK.md)
[![Devcontainer](https://img.shields.io/badge/devcontainer-ready-blue.svg)](.devcontainer/README.md)
[![Docker](https://img.shields.io/badge/docker-wrapper-informational.svg)](docs/DOCKER.md)
[![React](https://img.shields.io/badge/react-component-61dafb.svg)](docs/REACT_INTEGRATION.md)

> **極致精美的 GitHub 原生風格單元測試覆蓋率報告產生器，專為 GitHub Pages 打造。**  
> 支援主流格式（LCOV、Cobertura、JSON）、免建置隨放即用（Drop-in）部署、commit 區間歷史回溯計算，以及跨儲存庫、目錄與個別檔案的多 commit 覆蓋率歷史趨勢圖。

🌐 **專案官網**: [https://yongjhih.github.io/covpages/](https://yongjhih.github.io/covpages/)（[中文版](https://yongjhih.github.io/covpages/zh/)）  
📊 **即時覆蓋率報告**: [https://yongjhih.github.io/covpages/covpages/](https://yongjhih.github.io/covpages/covpages/)  
📚 **技術文件**: [儲存架構規格書 (EN)](docs/SPECIFICATION.md) · [空間與頻寬評測 (EN)](docs/BENCHMARK.md) · [Docker 與 Devcontainer 指南 (EN)](docs/DOCKER.md) · [React 整合指南 (EN)](docs/REACT_INTEGRATION.md)

---

## ✨ 核心特色

- **🎨 正統 GitHub Primer UI 設計**:
  - 像素級還原 GitHub 原生外觀：排版、配色、邊框、頁籤、Pill 徽章與 Octicons 圖示。
  - 原生支援 **亮色與深色模式（Light & Dark mode）** 切換（系統自動、手動切換、偏好儲存）。
  - 真實程式碼檢視器，包含行號、執行命中次數欄（`42x`, `0`），以及綠/紅覆蓋率標註。
  - 鍵盤快速鍵（`/` 或 `t` 快速搜尋檔案、`n` 跳轉至下一處未覆蓋程式碼）。
- **🔀 分支與標籤（Branch & Tag）覆蓋率切換**:
  - GitHub Primer 風格的分支與標籤選擇下拉選單，具備即時搜尋與篩選能力。
  - 支援在所有已記錄的分支或標籤間切換，檢視其特定指標與檔案快照。
  - 深度 URL hash 路由（`#branch=...`, `#tag=...`, `#file=...`, `#tab=...`），在任何子目錄部署下皆能順暢運作。
- **📦 Git Delta 壓縮與 LCOV 正規化**:
  - 自動依字母順序排列 `SF:` 檔案記錄、依行號整理詳情，並強制轉換為 LF 換行符號。
  - 自動寫入 `.gitattributes`（`*.info text eol=lf delta`, `*.lcov text eol=lf delta`），使 Git packfile 能夠有效進行增量（delta）壓縮，節省高達 98% 的歷史資料空間。
- **📖 子目錄與 `/docs/covpages` 部署**:
  - 直接從 `main` 分支的 `/docs/covpages` 發布，無需建立獨立的 `gh-pages` 分支。
  - 自動產生 `.nojekyll` 並全面採用嚴格相對路徑，讓報告可在任意子路徑下完美渲染（例如 `https://<user>.github.io/<repo>/covpages/`）。
  - 可透過 `npx covpages init --docs` 直接產生對應的 GitHub Actions 工作流程。
- **📈 多 Commit 覆蓋率歷史趨勢圖**:
  - 隨時間追蹤每個 Git commit 的測試覆蓋率演變。
  - **全域趨勢圖**：全專案的行覆蓋率、函式覆蓋率與分支覆蓋率歷史曲線。
  - **目錄趨勢**：可點進任何目錄（如 `src/parsers/`）檢視該模組的覆蓋率走向。
  - **單一檔案趨勢**：跨 commit 監控特定檔案，第一時間掌握覆蓋率退步或提升。
  - Commit 差異計算與 GitHub 徽章風格標記（`▲ +2.5%`, `▼ -0.8%`）。
  - 互動式向量 SVG 趨勢圖，支援懸停提示（Hover Tooltip）與快照檢視。
- **⏪ 一鍵 Commit 區間歷史回溯（Backfill）**:
  - 透過 `covpages backfill` 指令，一次在多個過去的 commit 執行測試（如 `HEAD~10..HEAD`）。
  - 自動整理各版本覆蓋率，瞬間建立完整的多 commit 歷史時間軸！
- **📁 支援主流覆蓋率格式與預設配置（Presets）**:
  - **LCOV**（`lcov.info`, `.lcov`）
  - **Cobertura & Clover XML**（`cobertura.xml`, `clover.xml`）
  - **Istanbul / JSON**（`coverage-summary.json`, `coverage-final.json`）
  - 內建 **Flutter/Dart, Vitest, Jest, Rust, Python, Go, C/C++** 預設配置。
- **💎 Impeccable 標準檢驗合格**:
  - 通過 `impeccable detect` 嚴格審查，**0 設計反模式（0 design anti-patterns）**。
  - 語意化 HTML5、無障礙 ARIA 標籤、響應式容器查詢（Container queries）與高對比焦點框線。
- **🔒 極度輕量、零執行期依賴**:
  - 極速且完全自包含的純靜態輸出。
  - 100% 離線可用，支援本機 `file://` 直接開啟或部署至 GitHub Pages。
- **🛠️ 內建 WebMCP 與 AI 助理整合**:
  - 自動產生符合 MCP 標準的端點頁面，支援本機 `ai-proxy`（`npx ai-proxy add`）直接調用。
  - 頁面內建 Ask AI 智慧對話側邊欄，支援本機 WebMCP 工具調度、提升覆蓋率價值分析、CI 諮詢與錨點跳轉。

---

## ⚡ 部署模式 1：零建置隨放即用（Zero-Build Drop-in，最簡易）

無需在 CI 流程中執行任何繁瑣的產生工具！

### 步驟 1：建立 Drop-in 站點

```bash
npx covpages dropin gh-pages
```

這會在 `gh-pages/` 目錄中產生靜態的 `index.html` 與 `.nojekyll`。

### 步驟 2：放入 `lcov.info`

每當測試執行完畢後，只需將 `lcov.info` 複製至該目錄：

```bash
cp coverage/lcov.info gh-pages/lcov.info
```

Commit 並推送到 `gh-pages` 分支！當瀏覽者開啟 GitHub Pages 網址時，瀏覽器會在毫秒內動態讀取並解析 `lcov.info`！

---

## 🚀 部署模式 2：透過 CI 預先產出報告（Pre-rendered Build）

### 使用 `npx` 執行（無需全域安裝）

```bash
# 從 lcov.info 產生報告
npx covpages coverage/lcov.info

# 或自訂輸出目錄與標題
npx covpages generate --input coverage/lcov.info --output gh-pages --title "專案測試覆蓋率"
```

### 本機即時預覽

```bash
npx covpages serve covpages-dist
```

---

## ⏪ 回溯過去 Commit 建立趨勢圖（Backfill）

想要立刻為過去的 commit 產生連續覆蓋率趨勢圖嗎？

```bash
# 回溯最近 10 個 commit
npx covpages backfill -n 10 --test-cmd "npm test"

# 或回溯特定 commit 區間
npx covpages backfill --range "v1.0.0..v2.0.0" --test-cmd "flutter test --coverage"
```

`covpages backfill` 將自動：
1. 安全地暫存（stash）您尚未提交的工作目錄。
2. 逐一 checkout 區間內的每個歷史 commit。
3. 執行指定的測試指令並擷取產生的 `lcov.info`。
4. 將儲存庫還原回原先的分支。
5. 立即產出完整的多 commit 覆蓋率歷史趨勢！

---

## 🌟 框架預設配置（Presets）與整合範例

執行 `npx covpages presets <framework>` 即可取得該語言/框架的最佳測試指令與 GitHub Actions 工作流程範本：

| 框架 / 語言 | 測試指令 | 輸出檔案 | 檢視配置範本 |
|-------------|----------|----------|--------------|
| **Flutter / Dart** | `flutter test --coverage` | `coverage/lcov.info` | `npx covpages presets flutter` |
| **Dart (Pure)** | `dart test --coverage=coverage ...` | `coverage/lcov.info` | `npx covpages presets dart` |
| **Vitest (TS/JS)** | `npx vitest run --coverage` | `coverage/lcov.info` | `npx covpages presets vitest` |
| **Jest (TS/JS)** | `npx jest --coverage --coverageReporters="lcov"` | `coverage/lcov.info` | `npx covpages presets jest` |
| **Rust** | `cargo llvm-cov --lcov --output-path coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets rust` |
| **Python** | `pytest --cov --cov-report=lcov:coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets python` |
| **Go** | `go test -coverprofile=coverage.out ./...` | `coverage.out` | `npx covpages presets go` |
| **C / C++** | `lcov --capture --directory . --output-file coverage/lcov.info` | `coverage/lcov.info` | `npx covpages presets cpp` |

### 一鍵初始化指定框架的 CI 工作流程

```bash
# 初始化 Flutter 專案的工作流程
npx covpages init --framework flutter

# 初始化 Rust 專案的工作流程
npx covpages init --framework rust

# 初始化 Python 專案的工作流程
npx covpages init --framework python
```

---

## 🐳 部署模式 3：Docker-Wrapper CLI 與 Devcontainer

本機或 CI Runner 上沒有安裝 Node.js？直接透過 Docker 或 Devcontainer 執行 Covpages！

### 1. Docker-Wrapper CLI

`covpages-docker` 封裝腳本會自動偵測 Docker 或 Podman，掛載目前工作目錄，維持宿主機使用者的檔案權限（`-u $(id -u):$(id -g)`），並自動傳遞 CI 環境變數：

```bash
# 直接使用包裝腳本（環境無需安裝 Node.js）
./bin/covpages-docker.sh generate --input coverage/lcov.info --output docs/covpages

# 或透過 npx 執行
npx covpages-docker generate --input coverage/lcov.info --output docs/covpages

# 或透過 covpages CLI 調用
npx covpages docker generate --input coverage/lcov.info --output docs/covpages
```

### 2. 官方 Docker 映像檔

```bash
docker run --rm \
  -v "$PWD:/workspace" \
  -w /workspace \
  -u "$(id -u):$(id -g)" \
  ghcr.io/yongjhih/covpages:latest generate \
    --input coverage/lcov.info \
    --output docs/covpages
```

### 3. Devcontainer（支援 VS Code 與 GitHub Codespaces）

直接在 VS Code 或 GitHub Codespaces 中開啟此儲存庫，系統會自動套用 `.devcontainer/devcontainer.json`，預先配置好 Node.js 22、Git 與相關延伸模組。
詳細說明請參閱 [docs/DOCKER.md](docs/DOCKER.md)。

---

## 🤖 GitHub Actions CI 工作流程範例

```yaml
name: Test Coverage Pages

on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: write
  pages: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  coverage:
    runs-on: ubuntu-latest
    steps:
      - name: 檢出儲存庫
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 設定 Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: 安裝套件並執行測試
        run: |
          npm ci
          npm run test:coverage

      - name: 還原過往覆蓋率歷史快取
        uses: actions/cache/restore@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-${{ github.ref_name }}
          restore-keys: |
            covpages-history-

      - name: 產生具歷史紀錄的 covpages 報告
        run: |
          npx covpages generate \
            --input coverage/lcov.info \
            --output covpages-dist \
            --commit "${{ github.sha }}" \
            --branch "${{ github.ref_name }}" \
            --message "${{ github.event.head_commit.message }}"

      - name: 儲存覆蓋率歷史快取
        if: github.ref == 'refs/heads/main'
        uses: actions/cache/save@v4
        with:
          path: covpages-dist/history.json
          key: covpages-history-${{ github.ref_name }}-${{ github.run_id }}

      - name: 發布至 gh-pages 分支
        if: github.ref == 'refs/heads/main'
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./covpages-dist
          force_orphan: true
```

---

## 🏷️ 動態覆蓋率 SVG 徽章（Badge）

每次建置或產生 Drop-in 站點時，Covpages 都會自動產出相容於 Shields.io 的高品質向量 SVG 徽章（`badge.svg`），完全不依賴任何外部第三方徽章服務。

直接將徽章嵌入至您的 `README.md`：

```markdown
[![Coverage](https://<username>.github.io/<repo>/badge.svg)](https://<username>.github.io/<repo>/)
```

以本儲存庫為例：
```markdown
[![Coverage](https://yongjhih.github.io/covpages/badge.svg)](https://yongjhih.github.io/covpages/)
```

徽章顏色評級指標：
- `≥ 80%`：Primer Green 綠色（`#2da44e`）
- `50% – 79.9%`：Primer Yellow 黃色（`#bf8700`）
- `< 50%`：Primer Red 紅色（`#cf222e`）

---

## 🛠️ CLI 指令手冊

```
指令列表 (COMMANDS):
  generate (預設)     為 GitHub Pages 產出靜態覆蓋率網站
  dropin              產出免建置隨放即用的純靜態站點 (index.html + .nojekyll)
  backfill            在過去一系列歷史 Git commit 上回溯執行測試並產出覆蓋率
  presets             檢視主流框架的整合指南與 GitHub Actions 工作流程
  serve               啟動本機即時預覽 Web 伺服器
  init                快速建立發布至 GitHub Pages 的 Actions 工作流程
  help                顯示說明畫面

參數選項 (OPTIONS):
  -i, --input <path>      輸入的覆蓋率檔案 (lcov.info, cobertura.xml, coverage-summary.json)
  -o, --output <dir>      站點輸出目錄 (預設: "covpages-dist")
  -f, --format <type>     覆蓋率格式: lcov | cobertura | json | auto (預設: auto)
  --history <file>        歷史資料 JSON 檔案路徑 (預設: "<output>/history.json")
  --history-dir <dir>     包含多個 commit 報告的目錄 (用於產生趨勢)
  --commit <sha>          Commit SHA (預設讀取目前 Git HEAD)
  -m, --message <msg>     Commit 訊息 (預設讀取目前 Git HEAD message)
  -a, --author <author>   Commit 作者 (預設讀取目前 Git author)
  -b, --branch <branch>   分支名稱 (預設讀取目前 Git branch)
  -t, --tag <tag>         標籤名稱 (若目前在標籤上則預設讀取 tag)
  --base-url <url>        子目錄部署的 Base URL (例如: "/docs/covpages/")
  --save-raw              儲存正規化後的原始 LCOV 至 objects/<sha[0:2]>/<sha[2:]>.lcov
  --docs                  以 docs/covpages 作為目標進行 GitHub Pages 部署
  --date <iso-date>       Commit 日期 (預設讀取 Git 日期或當下時間)
  --title <title>         自訂報告標題
  --repo <name>           儲存庫名稱 (例如 owner/repo)
  --no-source             排除在報告中內嵌原始碼
  --max-history <number>  歷史紀錄點上限 (預設: 100)
  --range <git-range>     回溯測試的 Git 版本範圍 (例如 HEAD~5..HEAD)
  -n, --count <number>    回溯測試的 commit 數量 (預設: 5)
  --test-cmd <cmd>        回溯時執行的測試指令 (例如 "npm test")
  --coverage-file <path>  測試指令產出的覆蓋率檔案路徑 (預設: "coverage/lcov.info")
  --framework <name>      init/presets 的目標框架 (flutter, vitest, jest, rust, python, go, cpp)
  -p, --port <port>       本機預覽伺服器埠號 (預設: 8080)
  -v, --version           顯示版本號
  -h, --help              顯示說明資訊
```

---

## 📦 程式碼呼叫 API（Programmatic API）

```typescript
import { generateCoveragePages, backfillCommits, createDropinSite, FRAMEWORK_PRESETS } from 'covpages';

// 1. 產生完整預渲染靜態站點
const data = generateCoveragePages({
  inputs: ['coverage/lcov.info'],
  outputDir: 'gh-pages',
  title: '專案單元測試覆蓋率',
});

// 2. 或建立零建置隨放即用站點
createDropinSite('gh-pages', '專案單元測試覆蓋率');

// 3. 或回溯歷史 commit 覆蓋率
backfillCommits({
  count: 5,
  testCmd: 'npm test',
  coverageFile: 'coverage/lcov.info',
});
```

---

## 📄 開源授權

MIT © 2026 covpages 貢獻者
