import type {
  ApiEnvelope,
  EtfDetail,
  EtfListItem,
  StockHoldersDetail,
  WatchlistEtfItem
} from "@xstocketf/types";
import {
  fallbackEtfDetails,
  fallbackEtfs,
  fallbackStockHolders,
  fallbackWatchlist
} from "./mock-data";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

async function fetchJson<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (path.startsWith("/api/v1/etfs?") || path === "/api/v1/etfs") {
      return fallbackEtfs as T;
    }
    if (path.startsWith("/api/v1/etfs/")) {
      const code = path.split("/").pop()?.toUpperCase() ?? "00981A";
      return (fallbackEtfDetails[code] ?? fallbackEtfDetails["00981A"]) as T;
    }
    if (path.startsWith("/api/v1/stocks/")) {
      const ticker = path.split("/")[4]?.toUpperCase() ?? "2330";
      return (fallbackStockHolders[ticker] ?? fallbackStockHolders["2330"]) as T;
    }
    if (path === "/api/v1/me/watchlist/etfs") {
      return fallbackWatchlist as T;
    }

    throw error;
  }
}

export function getEtfs(searchParams?: {
  q?: string;
  assetClass?: string;
}) {
  const params = new URLSearchParams();
  if (searchParams?.q) {
    params.set("q", searchParams.q);
  }
  if (searchParams?.assetClass) {
    params.set("assetClass", searchParams.assetClass);
  }

  const query = params.toString();
  return fetchJson<ApiEnvelope<EtfListItem[]>>(
    `/api/v1/etfs${query ? `?${query}` : ""}`
  );
}

export function getEtfDetail(code: string) {
  return fetchJson<ApiEnvelope<EtfDetail>>(`/api/v1/etfs/${code}`);
}

export function getStockHolders(ticker: string) {
  return fetchJson<ApiEnvelope<StockHoldersDetail>>(
    `/api/v1/stocks/${ticker}/holders`
  );
}

export function getWatchlistEtfs() {
  return fetchJson<ApiEnvelope<WatchlistEtfItem[]>>(`/api/v1/me/watchlist/etfs`);
}
