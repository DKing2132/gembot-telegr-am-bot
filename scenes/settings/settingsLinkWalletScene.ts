import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import { generateLinkWalletHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';

export const settingsLinkWalletScene = new Scenes.BaseScene<DCAContext>(
  'settings_linkwallet'
);

settingsLinkWalletScene.enter(async (ctx) => {
  ctx.session.linkWallet = '';

  await temporaryHTMLReply(
    ctx,
    generateLinkWalletHTML(),
    Markup.inlineKeyboard([backButton('settings_back')])
  );
});

settingsLinkWalletScene.action('settings_back', async (ctx) => {
  ctx.session.linkWallet = '';

  await ctx.scene.leave();
  await ctx.scene.enter('settings');
});

// hears for any ethereum wallet address
settingsLinkWalletScene.hears(/^0x[a-fA-F0-9]{40}$/, async (ctx) => {
  ctx.session.linkWallet = ctx.message!.text;

  await ctx.scene.leave();
  await ctx.scene.enter('settings_linkwallet_confirm');
});
