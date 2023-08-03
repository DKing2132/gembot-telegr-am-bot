import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { temporaryHTMLReply } from '../../replies';
import {
  generateLinkWalletConfirmHTML,
  generateLinkWalletFailedHTML,
  generateLinkWalletSuccessHTML,
} from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { link } from '../../routes';
import { backToMenuButton } from '../../keyboard/backToMenuButton';
import { ErrorMessage } from '../../types/responses/ErrorMessage';
import { fetchWithTimeout } from '../../network';

export const settingsLinkWalletConfirmScene = new Scenes.BaseScene<DCAContext>(
  'settings_linkwallet_confirm'
);

settingsLinkWalletConfirmScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    generateLinkWalletConfirmHTML(ctx.session.linkWallet),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Yes', 'settings_linkwallet_yes'),
        Markup.button.callback('No', 'settings_linkwallet_no'),
      ],
      [backButton('settings_back')],
    ])
  );
});

settingsLinkWalletConfirmScene.action('settings_back', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('settings_linkwallet');
});

settingsLinkWalletConfirmScene.action('settings_back_to_menu', async (ctx) => {
  await ctx.scene.leave();
  await startMenu(ctx);
});

settingsLinkWalletConfirmScene.action('settings_linkwallet_no', async (ctx) => {
  ctx.session.linkWallet = '';

  await ctx.scene.leave();
  await startMenu(ctx);
});

settingsLinkWalletConfirmScene.action(
  'settings_linkwallet_yes',
  async (ctx) => {
    try {
      const response = await fetchWithTimeout(`${process.env.API_URL}${link}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'genesis-bot-user-id': ctx.from!.id.toString(),
        },
        body: JSON.stringify({ walletAddress: ctx.session.linkWallet }),
      });

      if (response.ok) {
        const linkWalletResponse = await response.json();
        console.log(linkWalletResponse);

        await temporaryHTMLReply(
          ctx,
          generateLinkWalletSuccessHTML(),
          Markup.inlineKeyboard([backToMenuButton('settings_back_to_menu')])
        );
      } else {
        const error: ErrorMessage = await response.json();
        await temporaryHTMLReply(
          ctx,
          generateLinkWalletFailedHTML(error.message),
          Markup.inlineKeyboard([
            backToMenuButton('settings_back_to_menu'),
            backButton('settings_back'),
          ])
        );
      }
    } catch (error) {
      console.log(error);
      await temporaryHTMLReply(
        ctx,
        generateLinkWalletFailedHTML('Unknown error'),
        Markup.inlineKeyboard([
          backToMenuButton('settings_back_to_menu'),
          backButton('settings_back'),
        ])
      );
    }
  }
);
