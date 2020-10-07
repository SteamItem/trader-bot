import { EnumBot, EnumSite } from "./enum";

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function compareStrings(s1: string, s2: string): boolean {
  s1 = s1.trim();
  s2 = s2.trim();
  if (s1.length !== s2.length) {
    return false;
  }
  return s1.localeCompare(s2) === 0;
}

function getSiteOfBot(id: EnumBot): EnumSite {
  switch (id) {
    case EnumBot.EmpireInstant:
    case EnumBot.EmpireTradeLockLogger:
      return EnumSite.CsGoEmpire;
    case EnumBot.RollbitCsGo:
    case EnumBot.RollbitCsGoLogger:
      return EnumSite.Rollbit;
    case EnumBot.DuelbitsCsGoWorker:
      return EnumSite.Duelbits;
    default: throw new Error("Unknown bot id");
  }
}

export default {
  sleep,
  compareStrings,
  getSiteOfBot
}