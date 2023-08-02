import { UnitOfTime } from './UnitOfTime';

export type OrderToCreate = {
  walletOwnerAddress?: string;
  depositedTokenAddress?: string;
  desiredTokenAddress?: string;
  depositedTokenAmount?: number;
  isNativeETH?: boolean;
  unitOfTime?: UnitOfTime;
  frequency?: number;
};
