export type BuySellOrder = {
  walletOwnerAddress?: string;
  depositedTokenAddress?: string;
  desiredTokenAddress?: string;
  depositedTokenAmount?: number;
  isNativeETH?: boolean;
};
