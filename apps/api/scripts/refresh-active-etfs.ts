import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type {
  EtfDetail,
  EtfHoldingItemView,
  EtfListItem,
  StockHoldersDetail
} from "@xstocketf/types";
import { activeEtfRegistry } from "../src/data/active-etf-registry.js";
import { generatedActiveEtfDataset } from "../src/data/generated/active-etf-snapshots.js";
import { parseYahooHoldingHtml } from "../src/lib/yahoo-holding-parser.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(
  __dirname,
  "../src/data/generated/active-etf-snapshots.ts"
);

interface DatasetFile {
  generatedAt: string;
  source: string[];
  etfList: EtfListItem[];
  etfDetails: Record<string, EtfDetail>;
  stockHolders: Record<string, StockHoldersDetail>;
}

function toTsLiteral(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function buildStockHolders(etfDetails: Record<string, EtfDetail>) {
  const stockHolders: Record<string, StockHoldersDetail> = {};

  for (const etf of Object.values(etfDetails)) {
    for (const holding of etf.holdings) {
      if (!holding.ticker) {
        continue;
      }

      const current =
        stockHolders[holding.ticker] ??
        {
          ticker: holding.ticker,
          stockName: holding.stockName,
          asOfDate: etf.holdingsAsOfDate,
          holderEtfs: []
        };

      current.asOfDate = current.asOfDate ?? etf.holdingsAsOfDate;
      current.holderEtfs.push({
        code: etf.code,
        name: etf.name,
        issuerName: etf.issuerName,
        weightPct: holding.weightPct,
        changeWeightPct: null,
        actionType: null,
        holdingsAsOfDate: etf.holdingsAsOfDate
      });

      stockHolders[holding.ticker] = current;
    }
  }

  for (const detail of Object.values(stockHolders)) {
    detail.holderEtfs.sort((left, right) => right.weightPct - left.weightPct);
  }

  return stockHolders;
}

async function fetchEtfDetail(item: (typeof activeEtfRegistry)[number]) {
  const url = `https://tw.stock.yahoo.com/quote/${item.quoteSymbol}/holding`;
  const response = await fetch(url, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Yahoo request failed for ${item.code}: ${response.status}`);
  }

  const html = await response.text();
  const parsed = parseYahooHoldingHtml(html);
  const previous = generatedActiveEtfDataset.etfDetails[item.code];
  const holdings: EtfHoldingItemView[] = parsed.holdings.map((holding) => ({
    ticker: holding.ticker,
    stockName: holding.stockName,
    weightPct: holding.weightPct,
    changeWeightPct: null,
    actionType: null
  }));

  const detail: EtfDetail = {
    code: item.code,
    name: item.name,
    issuerName: item.issuerName,
    benchmark: previous?.benchmark ?? null,
    latestClose: previous?.latestClose ?? null,
    estimatedNav: previous?.estimatedNav ?? null,
    premiumDiscountPct: previous?.premiumDiscountPct ?? null,
    holdingsAsOfDate: parsed.holdingsAsOfDate,
    sources: [url],
    holdings
  };

  return {
    detail,
    listItem: {
      code: item.code,
      name: item.name,
      issuerName: item.issuerName,
      assetClass: item.assetClass,
      latestClose: detail.latestClose,
      premiumDiscountPct: detail.premiumDiscountPct,
      latestNavDate: detail.holdingsAsOfDate
    } satisfies EtfListItem
  };
}

async function main() {
  const generatedAt = new Date().toISOString();
  const etfDetails: Record<string, EtfDetail> = {};
  const etfList: EtfListItem[] = [];
  const source = ["tw.stock.yahoo.com/quote/*/holding"];

  for (const item of activeEtfRegistry) {
    try {
      const result = await fetchEtfDetail(item);
      etfDetails[item.code] = result.detail;
      etfList.push(result.listItem);
      console.log(`refreshed ${item.code} (${result.detail.holdings.length} holdings)`);
    } catch (error) {
      const previous = generatedActiveEtfDataset.etfDetails[item.code];
      const fallbackListItem = generatedActiveEtfDataset.etfList.find(
        (etf) => etf.code === item.code
      );

      if (!previous || !fallbackListItem) {
        throw error;
      }

      etfDetails[item.code] = previous;
      etfList.push(fallbackListItem);
      console.warn(`reused previous snapshot for ${item.code}: ${String(error)}`);
    }
  }

  etfList.sort((left, right) => left.code.localeCompare(right.code));
  const stockHolders = buildStockHolders(etfDetails);
  const dataset: DatasetFile = {
    generatedAt,
    source,
    etfList,
    etfDetails,
    stockHolders
  };

  const fileContent = `import type { ActiveEtfDataset } from "../active-etf-dataset.js";

export const generatedActiveEtfDataset: ActiveEtfDataset = ${toTsLiteral(
    dataset
  )};
`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, fileContent, "utf8");
  console.log(`wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
