import { TokenGetterTask } from './TokenGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireTokenGetterTask extends TokenGetterTask {
  async getToken(): Promise<string> {
    const code = this.bot.code;
    if (!code)
      throw new Error("Code not found");
    const api = new CSGOEmpireApi();
    const token = await api.getToken(code, this.bot.cookie);
    return token.token.toString();
  }
}
