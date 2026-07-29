#!/usr/bin/env node
/**
 * apply-region.js — 把国家/地区代码映射成 Vercel 区域代码
 * 用法: node apply-region.js JP
 *       node apply-region.js HK
 *       node apply-region.js SG
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const REGION_META = {
  iad1: "Washington, D.C., USA (美东)",
  cle1: "Cleveland, USA (美东)",
  sfo1: "San Francisco, USA (美西)",
  pdx1: "Portland, USA (美西)",
  yul1: "Montréal, Canada (加拿大)",
  gru1: "São Paulo, Brazil (南美)",
  dub1: "Dublin, Ireland (欧洲)",
  lhr1: "London, UK (欧洲)",
  cdg1: "Paris, France (欧洲)",
  fra1: "Frankfurt, Germany (欧洲)",
  arn1: "Stockholm, Sweden (欧洲)",
  hnd1: "Tokyo, Japan (亚太)",
  kix1: "Osaka, Japan (亚太)",
  icn1: "Seoul, South Korea (亚太)",
  hkg1: "Hong Kong (亚太)",
  sin1: "Singapore (亚太)",
  bom1: "Mumbai, India (亚太)",
  syd1: "Sydney, Australia (亚太)",
  dxb1: "Dubai, UAE (中东)",
  cpt1: "Cape Town, South Africa (非洲)",
};

const COUNTRY_TO_REGION = {
  US: "iad1", US_EAST: "iad1", US_WEST: "sfo1", USA: "iad1",
  CA: "yul1", CANADA: "yul1",
  BR: "gru1", BRAZIL: "gru1",
  EU: "fra1", DE: "fra1", GERMANY: "fra1",
  UK: "lhr1", GB: "lhr1",
  FR: "cdg1", FRANCE: "cdg1",
  IE: "dub1", IRELAND: "dub1",
  SE: "arn1", SWEDEN: "arn1",
  JP: "hnd1", JAPAN: "hnd1", TOKYO: "hnd1",
  KR: "icn1", KOREA: "icn1",
  HK: "hkg1", HONGKONG: "hkg1",
  SG: "sin1", SINGAPORE: "sin1",
  IN: "bom1", INDIA: "bom1",
  AU: "syd1", AUSTRALIA: "syd1",
  AE: "dxb1", UAE: "dxb1", DUBAI: "dxb1",
  ZA: "cpt1", SOUTHAFRICA: "cpt1",
};

function resolveRegion(raw) {
  if (!raw) return null;
  const key = String(raw).trim().toUpperCase();
  const lower = key.toLowerCase();
  if (REGION_META[lower]) return lower;
  if (COUNTRY_TO_REGION[key]) return COUNTRY_TO_REGION[key];
  return null;
}

const VERCEL_JSON = process.env.VERCEL_JSON || join(process.cwd(), "vercel.json");
const input =
  process.argv[2] ||
  process.env.DEPLOY_COUNTRY ||
  process.env.DEPLOY_REGION ||
  process.env.VERCEL_REGION;

if (!input) {
  console.error(
    "[apply-region] 请提供部署国家/地区代码，例如: node apply-region.js JP"
  );
  process.exit(1);
}

if (!existsSync(VERCEL_JSON)) {
  console.error(`[apply-region] 找不到 vercel.json：${VERCEL_JSON}`);
  process.exit(1);
}

const region = resolveRegion(input);
if (!region) {
  console.error(
    `[apply-region] 无法识别 "${input}"。支持：JP/HK/SG/US/DE...`
  );
  process.exit(1);
}

const config = JSON.parse(readFileSync(VERCEL_JSON, "utf-8"));
config.regions = [region];
writeFileSync(VERCEL_JSON, JSON.stringify(config, null, 2) + "\n");
console.log(`[apply-region] 部署区域 → ${region}（${REGION_META[region]}），已写入 ${VERCEL_JSON}，重新部署后生效。`);
