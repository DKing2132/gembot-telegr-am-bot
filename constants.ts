import { PrismaClient } from '@prisma/client';
import { ethers } from 'ethers';

export const chainEnv = process.env.CHAIN_ENV!;
if (chainEnv === undefined) {
  throw new Error('CHAIN_ENV must be provided!');
}

export const nodeEnv = process.env.NODE_ENV!;
if (nodeEnv === undefined) {
  throw new Error('NODE_ENV must be provided!');
}

export const WETH =
  chainEnv === 'development'
    ? '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
    : '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
export const USDC =
  chainEnv === 'development'
    ? '0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4'
    : '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const DAI =
  chainEnv === 'development'
    ? '0x73967c6a0904aA032C103b4104747E88c566B1A2'
    : '0x6B175474E89094C44Da98b954EedeAC495271d0F';
export const USDT =
  chainEnv === 'development'
    ? '0x509Ee0d083DdF8AC028f2a56731412edD63223B9'
    : '0xdAC17F958D2ee523a2206206994597C13D831ec7';

// environment variables
export const keyStr = process.env.ENCRYPTION_KEY!;
if (keyStr === undefined) {
  throw new Error('ENCRYPTION_KEY must be provided!');
}

export const ivStr = process.env.ENCRYPTION_IV!;
if (ivStr === undefined) {
  throw new Error('ENCRYPTION_IV must be provided!');
}

const useDevBot = process.env.USE_DEV_BOT!;
if (useDevBot === undefined) {
  throw new Error('USE_DEV_BOT must be provided!');
}

export const token =
  useDevBot === 'true'
    ? process.env.DEV_TELEGRAM_BOT_TOKEN!
    : process.env.TELEGRAM_BOT_TOKEN!;
if (token === undefined) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

export const networkScanLink =
  chainEnv === 'development'
    ? process.env.TESTNET_NETWORK_SCAN_LINK!
    : process.env.NETWORK_SCAN_LINK!;
if (networkScanLink === undefined) {
  throw new Error('Correct ENV NETWORK_SCAN_LINK must be provided!');
}

const httpsNodeProviderURL =
  chainEnv === 'development'
    ? process.env.TESTNET_HTTPS_NODE_PROVIDER_URL!
    : process.env.HTTPS_NODE_PROVIDER_URL!;
if (httpsNodeProviderURL === undefined) {
  throw new Error(
    `${
      chainEnv === 'development'
        ? 'TESTNET_HTTPS_NODE_PROVIDER_URL'
        : 'HTTPS_NODE_PROVIDER_URL'
    } must be provided!`
  );
}

export const domain = process.env.DOMAIN!;
if (domain === undefined) {
  throw new Error('DOMAIN must be provided!');
}

export const provider = new ethers.providers.JsonRpcProvider(
  httpsNodeProviderURL
);

export const prisma = new PrismaClient();

export const optionUnderConstruction = '🚧  Option is under development. 🚧';
