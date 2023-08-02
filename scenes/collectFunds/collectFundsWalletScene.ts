import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryReply } from '../../replies';
import { backButton } from '../../keyboard/backButton';
import { WalletHelper } from '../../utilities/WalletHelper';

export const collectFundsWalletScene = new Scenes.BaseScene<DCAContext>(
  'collectfunds_wallet'
);

collectFundsWalletScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select a wallet to use to collect funds from',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Wallet 1', 'collectfunds_wallet_1'),
        Markup.button.callback('Wallet 2', 'collectfunds_wallet_2'),
        Markup.button.callback('Wallet 3', 'collectfunds_wallet_3'),
      ],
      [backButton('collectfunds_back')],
    ])
  );
});

collectFundsWalletScene.action('collectfunds_back', async (ctx) => {
  ctx.session.collectFunds.walletOwnerAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('collectfunds_amount');
});

collectFundsWalletScene.action('collectfunds_wallet_1', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    1,
    'collect',
    'collectfunds_confirm',
    'collectfunds_back'
  );
});

collectFundsWalletScene.action('collectfunds_wallet_2', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    2,
    'collect',
    'collectfunds_confirm',
    'collectfunds_back'
  );
});

collectFundsWalletScene.action('collectfunds_wallet_3', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    3,
    'collect',
    'collectfunds_confirm',
    'collectfunds_back'
  );
});
