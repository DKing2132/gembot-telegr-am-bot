import { UnitOfTime } from '../UnitOfTime';

export type OrderResponse = {
  orderID?: string;
  walletOwnerAddress: string;
  depositedTokenAddress: string;
  desiredTokenAddress: string;
  depositedTokenAmount: number;
  isNativeETH: boolean;
  unitOfTime: UnitOfTime;
  frequency: number;
  isLimitOrder?: boolean;
  marketCapTarget?: number;
};
