import { IEmpireTradeLockInventoryItem } from '../../interfaces/csgoEmpire';
import { InventoryGetterTask } from './InventoryGetterTask';
import { CSGOEmpireApi } from '../../api/csgoempire';
export class EmpireTradeLockInventoryGetterTask extends InventoryGetterTask<IEmpireTradeLockInventoryItem> {
  getStoreItems(): Promise<IEmpireTradeLockInventoryItem[]> {
    const api = new CSGOEmpireApi();
    return api.tradelockInventory(this.botParam.cookie);
  }
}
