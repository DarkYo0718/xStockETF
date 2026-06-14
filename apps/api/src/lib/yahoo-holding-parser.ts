export interface ParsedHoldingItem {
  ticker: string | null;
  stockName: string;
  weightPct: number;
}

export interface ParsedYahooHoldingPage {
  holdingsAsOfDate: string | null;
  holdings: ParsedHoldingItem[];
}

function escapeRegExp(input: string) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTicker(symbol: string | null) {
  if (!symbol) {
    return null;
  }

  return symbol.replace(/\.(TW|TWO)$/i, "");
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeWeighting(value: string | number) {
  return Number.parseFloat(String(value)).toFixed(2);
}

function findTickerForHolding(html: string, stockName: string, weightPct: number) {
  const escaped = escapeRegExp(stockName);
  const weighting = escapeRegExp(normalizeWeighting(weightPct));
  const quoteEntryPatterns = [
    new RegExp(
      `"ticker":"([^"]+)","name":"${escaped}","weighting":"${weighting}"`,
      "u"
    ),
    new RegExp(
      `"name":"${escaped}","weighting":"${weighting}","ticker":"([^"]+)"`,
      "u"
    ),
    new RegExp(
      `"ticker":"([^"]+)","symbolName":"${escaped}".{0,120}"ratio":"${weighting}%?"`,
      "u"
    )
  ];

  for (const pattern of quoteEntryPatterns) {
    const match = pattern.exec(html);
    if (match?.[1]) {
      return normalizeTicker(match[1]);
    }
  }

  const patterns = [
    new RegExp(`"name":"${escaped}","symbol":"([^"]+)"`, "u"),
    new RegExp(`"symbol":"([^"]+)","name":"${escaped}"`, "u"),
    new RegExp(`"symbolName":"${escaped}","symbol":"([^"]+)"`, "u")
  ];

  for (const pattern of patterns) {
    const match = pattern.exec(html);
    if (match?.[1]) {
      return normalizeTicker(match[1]);
    }
  }

  return null;
}

export function parseYahooHoldingHtml(html: string): ParsedYahooHoldingPage {
  const sectionStart = html.indexOf(">前十大持股<");
  if (sectionStart === -1) {
    throw new Error("Unable to locate Yahoo holding section");
  }

  const sectionHtml = html.slice(sectionStart, sectionStart + 20000);
  const dateMatch =
    /<time[^>]*datatime="([^"]+)"[^>]*>[\s\S]*?<span[^>]*>(\d{4}\/\d{2}\/\d{2})<\/span>/u.exec(
      sectionHtml
    );
  const holdingsAsOfDate = dateMatch?.[2]?.replace(/\//g, "-") ?? null;
  const itemPattern =
    /<li class="D\(f\) Ai\(c\) Jc\(sb\)[\s\S]*?<div class="Fx\(n\) W\(28px\)[\s\S]*?>(\d+)\.<\/div>\s*([^<]+?)\s*<\/div>\s*<div class="Fx\(n\) Pstart\(16px\)">([\d.]+)%<\/div><\/li>/gu;

  const holdings: ParsedHoldingItem[] = [];

  for (const match of sectionHtml.matchAll(itemPattern)) {
    const stockName = decodeHtml(match[2].trim());
    const weightPct = Number.parseFloat(match[3]);
    holdings.push({
      ticker: findTickerForHolding(html, stockName, weightPct),
      stockName,
      weightPct
    });
  }

  if (holdings.length === 0) {
    throw new Error("Unable to parse Yahoo top holdings rows");
  }

  return {
    holdingsAsOfDate,
    holdings
  };
}
