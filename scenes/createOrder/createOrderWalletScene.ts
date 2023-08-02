import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { backButton } from '../../keyboard/backButton';
import { temporaryReply } from '../../replies';
import { WalletHelper } from '../../utilities/WalletHelper';

export const createOrderWalletScene = new Scenes.BaseScene<DCAContext>(
  'createorder_wallet'
);

createOrderWalletScene.enter(async (ctx) => {
  await temporaryReply(
    ctx,
    'Please select a wallet to use to create this order',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Wallet 1', 'createorder_wallet_1'),
        Markup.button.callback('Wallet 2', 'createorder_wallet_2'),
        Markup.button.callback('Wallet 3', 'createorder_wallet_3'),
      ],
      [backButton('createorder_back')],
    ])
  );
});

createOrderWalletScene.action('createorder_back', async (ctx) => {
  ctx.session.orderToCreate.walletOwnerAddress = undefined;

  await ctx.scene.leave();
  await ctx.scene.enter('createorder_frequency');
});

createOrderWalletScene.action('createorder_wallet_1', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    1,
    'create',
    'createorder_confirm',
    'createorder_back'
  );
});

createOrderWalletScene.action('createorder_wallet_2', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    2,
    'create',
    'createorder_confirm',
    'createorder_back'
  );
});

createOrderWalletScene.action('createorder_wallet_3', async (ctx) => {
  await WalletHelper.getWalletAddressesHelper(
    ctx,
    3,
    'create',
    'createorder_confirm',
    'createorder_back'
  );
});
