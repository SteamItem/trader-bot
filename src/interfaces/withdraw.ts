export interface IWithdrawResult {
  name: string;
  price: number;
}

export interface IFailWithdrawResult extends IWithdrawResult {
  message: string;
}

export interface IInventoryOperationTiming {
  source: string;
  name: string;
  price: number;
  filterTime: number;
  withdrawTime: number;
  successWithdrawCount: number;
  failWithdrawCount: number;
}