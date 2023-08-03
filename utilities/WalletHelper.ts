import { Markup } from 'telegraf';
import { DCAContext } from '../context/DCAContext';
import { generateErrorRetrievingWalletHTML } from '../html';
import { temporaryHTMLReply } from '../replies';
import { wallet } from '../routes';
import { GetWalletResponse } from '../types/responses/GetWalletResponse';
import { backButton } from '../keyboard/backButton';
import { fetchWithTimeout } from '../network';

export class WalletHelper {
  // wallet index is 1-based
  public static async getWalletAddressesHelper(
    ctx: DCAContext,
    walletIndex: number,
    type: 'create' | 'buy' | 'sell' | 'collect',
    next_scene: string,
    back_action: string
  ) {
    try {
      const response = await fetchWithTimeout(
        `${process.env.API_URL}${wallet}?wallet=${walletIndex}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'genesis-bot-user-id': ctx.from!.id.toString(),
          },
        }
      );

      if (response.ok) {
        const walletAddress: GetWalletResponse = await response.json();
        console.log(walletAddress);

        if (type === 'create') {
          ctx.session.orderToCreate.walletOwnerAddress =
            walletAddress.walletAddress;
        } else if (type === 'buy') {
          ctx.session.buyOrder.walletOwnerAddress = walletAddress.walletAddress;
        } else if (type === 'sell') {
          ctx.session.sellOrder.walletOwnerAddress =
            walletAddress.walletAddress;
        } else if (type === 'collect') {
          ctx.session.collectFunds.walletOwnerAddress =
            walletAddress.walletAddress;
        }

        await ctx.scene.leave();
        await ctx.scene.enter(next_scene);
      } else {
        await temporaryHTMLReply(
          ctx,
          generateErrorRetrievingWalletHTML(),
          Markup.inlineKeyboard([backButton(back_action)])
        );
      }
    } catch (err) {
      await temporaryHTMLReply(
        ctx,
        generateErrorRetrievingWalletHTML(),
        Markup.inlineKeyboard([backButton(back_action)])
      );
    }
  }
}
