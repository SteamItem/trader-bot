import { WorkerTask } from '../Common/WorkerTask';
import { IWithdrawResult, IFailWithdrawResult } from '../../interfaces/withdraw';
export abstract class WithdrawMakerTask<II> extends WorkerTask {
  taskName = "Withdraw Maker";
  constructor(inventoryItemsToBuy: II[]) {
    super();
    this.$inventoryItemsToBuy = inventoryItemsToBuy;
    this.$successWithdrawResult = [];
    this.$failWithdrawResult = [];
  }
  private $inventoryItemsToBuy: II[];
  public get inventoryItemsToBuy(): II[] {
    return this.$inventoryItemsToBuy;
  }
  protected $successWithdrawResult: IWithdrawResult[];
  public get successWithdrawResult(): IWithdrawResult[] {
    return this.$successWithdrawResult;
  }
  protected $failWithdrawResult: IFailWithdrawResult[];
  public get failWithdrawResult(): IFailWithdrawResult[] {
    return this.$failWithdrawResult;
  }
  async work(): Promise<void> {
    if (!this.inventoryItemsToBuy) return;
    await this.withdrawAll();
  }
  abstract withdrawAll(): Promise<void>;
}
