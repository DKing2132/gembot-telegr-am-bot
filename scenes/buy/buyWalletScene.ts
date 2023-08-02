import { Scenes, Markup } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';
import { WalletHelper } from '../../utilities/WalletHelper';

export const buyWalletScene = new Scenes.BaseScene<DCAContext>('buy_wallet');

buyWalletScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select a wallet to use to buy',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Wallet 1', 'buy_wallet_1'),
        Markup.button.callback('Wallet 2', 'buy_wallet_2'),
        Markup.button.callback('Wallet 3', 'buy_wallet_3'),
      ],
      [backButton('buy_back')],
    ])
  );
});

buyWalletScene.action('buy_back', async (ctx) => {
  ctx.session.buyOrder.walletOwnerAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('buy_desiredtoken');
});

buyWalletScene.action('buy_wallet_1', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    1,
    'buy',
    'buy_confirm',
    'buy_back'
  );
});

buyWalletScene.action('buy_wallet_2', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    2,
    'buy',
    'buy_confirm',
    'buy_back'
  );
});

buyWalletScene.action('buy_wallet_3', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    3,
    'buy',
    'buy_confirm',
    'buy_back'
  );
});
