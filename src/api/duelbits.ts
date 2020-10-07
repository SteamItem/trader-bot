import { ApiBase } from './apiBase';
import { IDuelbitsListingsResponse, IDuelbitsWebsocketPollingResponse } from '../interfaces/duelbits';

export class DuelbitsApi extends ApiBase {
  private apiBaseUrl = 'https://api.duelbits.com';
  private wsBaseUrl = 'https://ws.duelbits.com/socket.io';

  public async csgoInventory(): Promise<IDuelbitsListingsResponse> {
    const items = await this.axiosInstance.get<IDuelbitsListingsResponse>(`${this.apiBaseUrl}/listings`);
    return items.data;
  }

  public async getPollingResponse(): Promise<IDuelbitsWebsocketPollingResponse> {
    const response = await this.axiosInstance.get(`${this.wsBaseUrl}/?transport=polling`);
    const regexp = new RegExp('{.*}', 'g');
    const regexpResponses = regexp.exec(response.data);
    return JSON.parse(regexpResponses[0]);
  }
}