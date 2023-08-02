import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';
import { WalletHelper } from '../../utilities/WalletHelper';

export const sellWalletScene = new Scenes.BaseScene<DCAContext>('sell_wallet');

sellWalletScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select a wallet to use to sell from',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Wallet 1', 'sell_wallet_1'),
        Markup.button.callback('Wallet 2', 'sell_wallet_2'),
        Markup.button.callback('Wallet 3', 'sell_wallet_3'),
      ],
      [backButton('sell_back')],
    ])
  );
});

sellWalletScene.action('sell_back', async (ctx) => {
  ctx.session.sellOrder.walletOwnerAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('sell_desiredtoken');
});

sellWalletScene.action('sell_wallet_1', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    1,
    'sell',
    'sell_confirm',
    'sell_back'
  );
});

sellWalletScene.action('sell_wallet_2', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    2,
    'sell',
    'sell_confirm',
    'sell_back'
  );
});

sellWalletScene.action('sell_wallet_3', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    3,
    'sell',
    'sell_confirm',
    'sell_back'
  );
});
