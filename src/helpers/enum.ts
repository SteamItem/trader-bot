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
  CsGoEmpire = 1,
  Rollbit = 3,
  RollbitLogger = 4,
  Duelbits = 5
}

export function getBotText(bot: EnumBot): string {
  switch(bot) {
    case EnumBot.CsGoEmpire: return "CSGO Empire";
    case EnumBot.Rollbit: return "Rollbit";
    case EnumBot.RollbitLogger: return "Rollbit Logger";
    case EnumBot.Duelbits: return "Duelbits"
    default: throw new Error("Bot not found");
  }
}

export enum EnumSteamApp {
  CsGo = 730,
  Dota = 570
}