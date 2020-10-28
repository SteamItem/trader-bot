export interface IWithdrawResult {
  name: string;
  price: number;
}

export interface IFailWithdrawResult extends IWithdrawResult {
  message: string;
}