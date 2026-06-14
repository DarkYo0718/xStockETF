import type { AssetClass } from "@xstocketf/types";

export interface ActiveEtfRegistryItem {
  code: string;
  quoteSymbol: string;
  name: string;
  issuerName: string;
  assetClass: AssetClass;
}

export const activeEtfRegistry: ActiveEtfRegistryItem[] = [
  {
    code: "00980A",
    quoteSymbol: "00980A.TW",
    name: "主動野村臺灣優選",
    issuerName: "野村投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00981A",
    quoteSymbol: "00981A.TW",
    name: "主動統一台股增長",
    issuerName: "統一投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00982A",
    quoteSymbol: "00982A.TW",
    name: "主動群益台灣強棒",
    issuerName: "群益投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00983A",
    quoteSymbol: "00983A.TW",
    name: "主動中信ARK創新",
    issuerName: "中信投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00984A",
    quoteSymbol: "00984A.TW",
    name: "主動安聯台灣高息",
    issuerName: "安聯投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00985A",
    quoteSymbol: "00985A.TW",
    name: "主動野村台灣50",
    issuerName: "野村投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00986A",
    quoteSymbol: "00986A.TW",
    name: "主動台新龍頭成長",
    issuerName: "台新投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00988A",
    quoteSymbol: "00988A.TW",
    name: "主動統一全球創新",
    issuerName: "統一投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00989A",
    quoteSymbol: "00989A.TW",
    name: "主動摩根美國科技",
    issuerName: "摩根投信",
    assetClass: "ACTIVE_STOCK"
  },
  {
    code: "00980D",
    quoteSymbol: "00980D.TWO",
    name: "主動聯博投等入息",
    issuerName: "聯博投信",
    assetClass: "ACTIVE_BOND"
  },
  {
    code: "00981D",
    quoteSymbol: "00981D.TWO",
    name: "主動中信非投等債",
    issuerName: "中信投信",
    assetClass: "ACTIVE_BOND"
  },
  {
    code: "00982D",
    quoteSymbol: "00982D.TWO",
    name: "主動富邦動態入息",
    issuerName: "富邦投信",
    assetClass: "ACTIVE_BOND"
  }
];
