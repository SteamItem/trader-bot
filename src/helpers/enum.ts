export enum EnumSite {
  CsGoEmpire = 1,
  Rollbit = 2,
  Duelbits = 3
}

export function siteText(site: EnumSite): string {
  switch (site) {
    case EnumSite.CsGoEmpire: return "CSGOEmpire";
    case EnumSite.Rollbit: return "Rollbit";
    case EnumSite.Duelbits: return "Duelbits";
    default: throw new Error("Site not found");
  }
}

export enum EnumBot {
  EmpireInstant = 1,
  EmpireTradeLockLogger = 2,
  RollbitCsGo = 3,
  RollbitCsGoLogger = 4,
  DuelbitsCsGoWorker = 5
}

export function getBotText(bot: EnumBot): string {
  switch(bot) {
    case EnumBot.EmpireInstant: return "Instant";
    case EnumBot.EmpireTradeLockLogger: return "TradeLock Logger";
    case EnumBot.RollbitCsGo: return "Rollbit";
    case EnumBot.RollbitCsGoLogger: return "Rollbit Logger";
    case EnumBot.DuelbitsCsGoWorker: return "Duelbits"
    default: throw new Error("Bot not found");
  }
}

export enum EnumSteamApp {
  CsGo = 730,
  Dota = 570
}