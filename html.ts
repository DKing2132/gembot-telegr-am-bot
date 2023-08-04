import 'dotenv/config';
import { UserWallet } from './types/UserWallet';
import { OrderToCreate } from './types/OrderToCreate';
import { DAI, USDC, USDT, WETH, networkScanLink } from './constants';
import { GetAllOrdersResponse } from './types/responses/GetAllOrdersResponse';
import { UnitOfTime } from './types/UnitOfTime';
import { OrderToUpdate } from './types/OrderToUpdate';
import { orderFields } from './types/UpdateOrderFields';
import { BuySellOrder } from './types/BuyOrder';
import { CollectFunds } from './types/CollectFunds';
import { tokenAPIRoute } from './routes';
import { TokenResponse } from './types/responses/TokenResponse';
import { fetchWithTimeout } from './network';
import { OrderStatusHistoryResponse } from './types/responses/OrderStatusHistoryResponse';

const unitOfTimeConverter = (unitOfTime: UnitOfTime) => {
  if (unitOfTime === 'HOURS') {
    return 'Hourly';
  }
  if (unitOfTime === 'DAYS') {
    return 'Daily';
  }
  if (unitOfTime === 'WEEKS') {
    return 'Weekly';
  }
  return 'Monthly';
};

const getTokenName = async (tokenAddress: string, isNativeETH: boolean) => {
  if (isNativeETH && tokenAddress === WETH) {
    return 'ETH';
  } else if (tokenAddress === WETH) {
    return 'WETH';
  } else if (tokenAddress === USDC) {
    return 'USDC';
  } else if (tokenAddress === USDT) {
    return 'USDT';
  } else if (tokenAddress === DAI) {
    return 'DAI';
  } else {
    try {
      const response = await fetchWithTimeout(
        `${process.env.API_URL}${tokenAPIRoute}?address=${tokenAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        const tokenResponse: TokenResponse = await response.json();
        if (tokenResponse.name && tokenResponse.symbol) {
          return `${tokenResponse.name} (${tokenResponse.symbol})`;
        } else {
          return tokenAddress;
        }
      } else {
        return tokenAddress;
      }
    } catch (e) {
      console.log(e);
      return tokenAddress;
    }
  }
};

export const generateStartingMenuHTML = (
  wallet1: UserWallet,
  wallet2: UserWallet,
  wallet3: UserWallet,
  networkScanLink: string
) => {
  return `
💎 <b>Welcome to GemBot!</b> 💎

We've created 3 wallets for you automatically to get you started. Your private keys are encrypted and can be accessed via settings.
  
You can now create a DCA order or instant buys/sells 👇


===== <b> Your Wallets </b> =====
<a href="${networkScanLink}address/${wallet1.address}"><b>Wallet 1</b></a>
Address: 
<code>${wallet1.address}</code>

<a href="${networkScanLink}address/${wallet2.address}"><b>Wallet 2</b></a>
Address:
<code>${wallet2.address}</code>

<a href="${networkScanLink}address/${wallet3.address}"><b>Wallet 3</b></a>
Address:
<code>${wallet3.address}</code>


`;
};

export const generateWalletsHTML = (
  wallet1: UserWallet,
  wallet2: UserWallet,
  wallet3: UserWallet,
  networkScanLink: string
) => {
  return `
===== <b> ⚠️ Do not share with anyone ⚠️ </b> =====


<a href="${networkScanLink}address/${wallet1.address}"><b>Wallet 1</b></a>
Address:
<code>${wallet1.address}</code>
Private Key:
<code>${wallet1.privateKey?.substring(2)}</code>

<a href="${networkScanLink}address/${wallet1.address}"><b>Wallet 2</b></a>
Address:
<code>${wallet2.address}</code>
Private Key:
<code>${wallet2.privateKey?.substring(2)}</code>

<a href="${networkScanLink}address/${wallet3.address}"><b>Wallet 3</b></a>
Address:
<code>${wallet3.address}</code>
Private Key:
<code>${wallet3.privateKey?.substring(2)}</code>


===== <b> ⚠️ Do not share with anyone ⚠️ </b> =====

<b>Message will be deleted automatically in 1 minute.</b>
`;
};

export const generateCreateOrderHTML = () => {
  return `
<b>Creating Order</b>🚀

Please select token to deposit:

`;
};

export const generateSettingsHTML = () => {
  return `
⚙️ <b>Settings</b> ⚙️

Please select one of the following options:

`;
};

export const confirmYourOrderHTML = async (order: OrderToCreate) => {
  return `
🚀 <b>Confirm Your Order</b> 🚀

Please confirm your order:

<b>Deposited Token</b>: ${await getTokenName(
    order.depositedTokenAddress!,
    order.isNativeETH!
  )}
<b>Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Desired Token</b>: ${await getTokenName(
    order.desiredTokenAddress!,
    order.isNativeETH!
  )}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime!)}
<b>Frequency</b>: ${order.frequency}
<b>Wallet</b>: ${order.walletOwnerAddress}

⚠️ <i>Please make sure you have enough ETH to cover gas for transactions</i> ⚠️
`;
};

export const orderWasCreatedHTML = () => {
  return `
🚀 <b>Order Created</b> 🚀

Your order was created successfully. Checkout Active Orders to see your order.
`;
};

export const orderCreationFailedHTML = (message: string) => {
  return `

❌ <b>Order Creation Failed</b> ❌

<b>Reason</b>: ${message}
`;
};

export const errorEncounteredHTML = (message: string) => {
  return `
❌ <b>Error Encountered</b> ❌

<b>Reason</b>: ${message}
`;
};

export const generateActiveOrdersHTML = async (
  orders: GetAllOrdersResponse
) => {
  let text = `
🚀 <b>Active Orders</b> 🚀

<b>Total Orders</b>: ${
    orders.wallet1Orders.length +
    orders.wallet2Orders.length +
    orders.wallet3Orders.length
  }

===== <b>Wallet 1</b> =====
`;

  if (orders.wallet1Orders.length > 0) {
    for (const order of orders.wallet1Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderID}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  text += `
===== <b>Wallet 2</b> =====
  `;

  if (orders.wallet2Orders.length > 0) {
    for (const order of orders.wallet2Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderID}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  text += `
===== <b>Wallet 3</b> =====
  `;

  if (orders.wallet3Orders.length > 0) {
    for (const order of orders.wallet3Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderID}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  return text;
};

export const generateFailedGetActiveOrdersHTML = (message: string) => {
  return `
❌ <b>Failed to get active orders</b> ❌

<b>Reason</b>: ${message}
`;
};

export const generateDeleteOrderHTML = () => {
  return `
🗑️ <b>Delete Order</b> 🗑️

Please enter the ID of the order to delete:

`;
};

export const generateDeleteOrderConfirmHTML = (orderID: string) => {
  return `
🗑️ <b>Delete Order</b> 🗑️

Are you sure you want to delete the following order?

<b>Order</b>: ${orderID}

`;
};

export const generateDeleteSuccessHTML = () => {
  return `Order has been successfully deleted, hopefully we see you back soon 🚀`;
};

export const generateDeleteFailedHTML = (message: string) => {
  return `
❌ <b>Failed to delete order</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateUpdateOrderHTML = () => {
  return `
🚀 <b>Update Order</b> 🚀

Please enter the ID of the order to update:

`;
};

export const generateUpdateOrderInvalidValueTypeHTML = (valueType: string) => {
  return `
❌ <b>Invalid ${valueType}</b> ❌

Please enter a valid ${valueType}.

`;
};

export const generateUpdateOrderConfirmHTML = async (order: OrderToUpdate) => {
  return `
🚀 <b>Update Order</b> 🚀

Are you sure you want to update the following order:

<b>Order</b>: ${order.orderID}
<b>Field</b>: ${orderFields[order.field as keyof typeof orderFields]}
<b>Value</b>: ${
    order.field === 'unitOfTime'
      ? unitOfTimeConverter(order.value! as UnitOfTime)
      : order.field === 'desiredToken'
      ? await getTokenName(order.value as string, false)
      : order.value
  }

${
  order.field === 'depositedTokenAmount'
    ? '⚠️ <i>Please make sure you have enough ETH to cover gas for transactions</i> ⚠️'
    : ''
}
`;
};

export const generateUpdateOrderCreatedSuccessfullyHTML = () => {
  return `
🚀 <b>Order Updated</b> 🚀

Your order was updated successfully! Checkout Active Orders to see your updated order.

`;
};

export const generateUpdateOrderFailedHTML = (message: string) => {
  return `
❌ <b>Failed to update order</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateBuyHTML = () => {
  return `
🚀 <b>Instant Buy</b> 🚀

Please select the token you would like to perform the buy with:

`;
};

export const generateBuyConfirmHTML = async (buyOrder: BuySellOrder) => {
  return `
🚀 <b>Instant Buy</b> 🚀

Are you sure you want to perform the following buy:

<b>Wallet</b>: <code>${buyOrder.walletOwnerAddress}</code>
<b>Buy Token</b>: ${await getTokenName(
    buyOrder.depositedTokenAddress!,
    buyOrder.isNativeETH!
  )}
<b>Buy Token Amount</b>: ${buyOrder.depositedTokenAmount!}
<b>Desired Token</b>: ${await getTokenName(
    buyOrder.desiredTokenAddress!,
    buyOrder.isNativeETH!
  )}

⚠️ <i>Please make sure you have enough ETH to cover gas for transactions</i> ⚠️
`;
};

export const generateBuyFailedHTML = (message: string) => {
  return `
❌ <b>Failed to perform buy</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateBuySuccessHTML = (txHash: string) => {
  return `
🚀 <b>Buy Successful</b> 🚀

Your buy was successful! Checkout your wallet on etherscan to see your new balance.

<a href="${networkScanLink}tx/${txHash}">Transaction Link</a>
`;
};

export const generateSellHTML = () => {
  return `
🚀 <b>Instant Sell</b> 🚀

Please enter the address of the token you would like to sell:

`;
};

export const generateSellDesiredTokenHTML = () => {
  return `
🚀 <b>Instant Sell</b> 🚀

Please select the token you would like to perform the sell for:

`;
};

export const generateSellConfirmHTML = async (sellOrder: BuySellOrder) => {
  return `

🚀 <b>Instant Sell</b> 🚀

Are you sure you want to perform the following sell:

<b>Wallet</b>: <code>${sellOrder.walletOwnerAddress}</code>
<b>Sell Token</b>: ${await getTokenName(
    sellOrder.depositedTokenAddress!,
    sellOrder.isNativeETH!
  )}
<b>Sell Token Amount</b>: ${sellOrder.depositedTokenAmount!}
<b>Desired Token</b>: ${await getTokenName(
    sellOrder.desiredTokenAddress!,
    sellOrder.isNativeETH!
  )}

⚠️ <i>Please make sure you have enough ETH to cover gas for transactions</i> ⚠️
`;
};

export const generateSellSuccessHTML = (txHash: string) => {
  return `

🚀 <b>Sell Successful</b> 🚀

Your sell was successful! Checkout your wallet on etherscan to see your new balance.

<a href="${networkScanLink}tx/${txHash}">Transaction Link</a>
`;
};

export const generateSellFailedHTML = (message: string) => {
  return `
❌ <b>Failed to perform sell</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateCollectFundsLinkWalletHTML = () => {
  return `
⚠️ <b>Collect Funds</b> ⚠️

You do not have a wallet linked to your account. Please link a wallet to your account via settings before collecting funds.
`;
};

export const generateCollectFundsHTML = () => {
  return `
🚀 <b>Collect Funds</b> 🚀

Please select or enter the address of the token you would like to collect funds for:
  
`;
};

export const generateCollectFundsConfirmHTML = async (
  collectFundsRequest: CollectFunds
) => {
  return `
🚀 <b>Collect Funds</b> 🚀

Are you sure you want to collect funds for the following token:

<b>Wallet</b>: <code>${collectFundsRequest.walletOwnerAddress}</code>
<b>Token</b>: ${await getTokenName(
    collectFundsRequest.tokenToWithdrawAddress!,
    collectFundsRequest.isNativeETH!
  )}
<b>Amount</b>: ${collectFundsRequest.tokenToWithdrawAmount}
`;
};

export const generatePleaseWaitHTML = () => {
  return `
⏳ <b>Please Wait</b> ⏳

Please wait while we process your transaction. It may take anywhere from 15 seconds to 5 minutes depending on the network traffic.
`;
};

export const generateCollectFundsSuccessHTML = (txHash: string) => {
  return `
🚀 <b>Collect Funds</b> 🚀

Your collect funds was successful! Checkout your wallet on etherscan to see your new balance.

<a href="${networkScanLink}tx/${txHash}">Transaction Link</a>
`;
};

export const generateCollectFundsFailedHTML = (message: string) => {
  return `
❌ <b>Failed to collect funds</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateLinkWalletHTML = () => {
  return `
🚀 <b>Link Wallet</b> 🚀

Please enter the address of the wallet you would like to link to your account to:

`;
};

export const generateLinkWalletConfirmHTML = (linkWallet: string) => {
  return `
🚀 <b>Link Wallet</b> 🚀

Are you sure you want to link the following wallet to your account:

<b>Wallet</b>: <code>${linkWallet}</code>

⚠️ <b>Warning</b> ⚠️

<i>Make sure this is the correct wallet address. If you link the wrong wallet address, funds collected will be sent to the wrong address.</i>

<i>If a wallet is already linked this will overwrite the previous wallet address.</i>
`;
};

export const generateLinkWalletSuccessHTML = () => {
  return `
🚀 <b>Link Wallet</b> 🚀

Your wallet was successfully linked to your account!
`;
};

export const generateLinkWalletFailedHTML = (message: string) => {
  return `
❌ <b>Failed to link wallet</b> ❌

<b>Reason</b>: ${message}

`;
};

export const generateErrorRetrievingWalletHTML = () => {
  return `
❌ <b>Error Retrieving Wallet</b> ❌

There was an error retrieving your wallet. Please try again later.
`;
};

const getDateInNiceFormat = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true,
    hour: 'numeric',
    minute: 'numeric',
  });
};

export const generateOrderStatusesHTML = async (
  orderStatuses: OrderStatusHistoryResponse
) => {
  let text = `
🚀 <b>Order Statuses</b> 🚀

===== <b>Wallet 1</b> =====
`;

  if (orderStatuses.wallet1Orders.length > 0) {
    for (const order of orderStatuses.wallet1Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderId}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}
<b>Status</b>: ${order.status} - ${order.message}
<b>Last Updated</b>: ${getDateInNiceFormat(order.lastUpdatedAt)}
<b>Next Update</b>: ${getDateInNiceFormat(order.nextUpdateAt)}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  text += `
===== <b>Wallet 2</b> =====
  `;

  if (orderStatuses.wallet2Orders.length > 0) {
    for (const order of orderStatuses.wallet2Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderId}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}
<b>Status</b>: ${order.status} - ${order.message}
<b>Last Updated</b>: ${getDateInNiceFormat(order.lastUpdatedAt)}
<b>Next Update</b>: ${getDateInNiceFormat(order.nextUpdateAt)}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  text += `
===== <b>Wallet 3</b> =====
  `;

  if (orderStatuses.wallet3Orders.length > 0) {
    for (const order of orderStatuses.wallet3Orders) {
      text += `
<b>Order ID</b>: <code>${order.orderId}</code>
<b>Deposited Token</b>: ${await getTokenName(
        order.depositedTokenAddress,
        order.isNativeETH
      )}
<b>Desired Token</b>: ${await getTokenName(
        order.desiredTokenAddress,
        order.isNativeETH
      )}
<b>Remaining Deposited Amount</b>: ${order.depositedTokenAmount}
<b>Unit of Time</b>: ${unitOfTimeConverter(order.unitOfTime)}
<b>Transactions Remaining</b>: ${order.frequency}
<b>Status</b>: ${order.status} - ${order.message}
<b>Last Updated</b>: ${getDateInNiceFormat(order.lastUpdatedAt)}
<b>Next Update</b>: ${getDateInNiceFormat(order.nextUpdateAt)}

`;
    }
  } else {
    text += '\nNo orders found.\n';
  }

  return text;
};

export const generateOrderStatusesFailedHTML = (message: string) => {
  return `
❌ <b>Failed to retrieve order statuses</b> ❌

<b>Reason</b>: ${message}

`;
};
