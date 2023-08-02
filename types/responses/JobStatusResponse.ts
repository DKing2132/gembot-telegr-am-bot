export type JobStatusResponse = {
  status: 'ERROR' | 'SUCCESS' | 'FAILED' | 'PEDNING';
  message: string;
  transactionHash?: string;
};
