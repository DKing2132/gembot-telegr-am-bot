export type UpdateOrderFields =
  | 'desiredToken'
  | 'depositedTokenAmount'
  | 'unitOfTime'
  | 'frequency'
  | 'marketCapTarget';

export const orderFields = {
  desiredToken: 'Desired Token',
  depositedTokenAmount: 'Deposited Token Amount',
  unitOfTime: 'Unit of Time',
  frequency: 'Frequency',
  marketCapTarget: 'Target Market Cap',
};
