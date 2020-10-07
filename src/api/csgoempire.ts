import { AxiosRequestConfig } from 'axios';
import { IEmpireProfile, IEmpireTradeLockInventoryItem } from '../interfaces/csgoEmpire';
import { IEmpireInstantInventoryItem } from '../interfaces/csgoEmpire';
import { ApiBase } from './apiBase';
import { Constants } from '../helpers/constant';

export class CSGOEmpireApi extends ApiBase {
  private baseUrl = 'https://csgoempire.gg/api/v2';
  public async getToken(code: string, cookie: string) {
    const data = JSON.stringify({
      "code": code,
      "uuid": "00000000-0000-0000-0000-000000000000"
    });

    const content: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    const result = await this.axiosInstance.post(`${this.baseUrl}/user/security/token`, data, content);
    return result.data;
  }

  public async profile(cookie: string): Promise<IEmpireProfile> {
    const content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    const result = await this.axiosInstance.get<IEmpireProfile>(`${this.baseUrl}/user`, content);
    return result.data;
  }

  public async withdraw(cookie: string, token: string, bot_id: number, item_ids: string[]) {
    const data = JSON.stringify({
      "security_token": token,
      "bot_id": bot_id,
      "item_ids": item_ids
    });

    const content = {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,tr;q=0.8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': cookie,
        'Host': 'csgoempire.gg',
        'Origin': 'https://csgoempire.gg',
        'pragma': 'no-cache',
        'referer': 'https://csgoempire.gg/withdraw',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty',
        'User-Agent': Constants.UserAgent
      },
      withCredentials: true,
      timeout: 20000,
      maxRedirects: 4
    };
    const result = await this.axiosInstance.post(`${this.baseUrl}/trade/withdraw`, data, content);
    return result.data;
  }

  public async instantInventory(cookie: string): Promise<IEmpireInstantInventoryItem[]> {
    const content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    const items = await this.axiosInstance.get<IEmpireInstantInventoryItem[]>(`${this.baseUrl}/p2p/inventory/instant`, content);
    return items.data;
  }

  public async tradelockInventory(cookie: string): Promise<IEmpireTradeLockInventoryItem[]> {
    const content = {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
        'Host': 'csgoempire.gg'
      }
    };
    const items = await this.axiosInstance.get<IEmpireTradeLockInventoryItem[]>(`${this.baseUrl}/hermes/inventory/10`, content);
    return items.data;
  }
}