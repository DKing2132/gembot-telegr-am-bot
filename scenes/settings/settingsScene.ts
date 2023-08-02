import { Markup, Scenes } from 'telegraf';
import { DCAContext } from '../../context/DCAContext';
import { generateSettingsHTML, generateWalletsHTML } from '../../html';
import { backButton } from '../../keyboard/backButton';
import { startMenu } from '../../menu/startMenu';
import { networkScanLink, prisma } from '../../constants';
import { decrypt, iv } from '../../encryption';
import { temporaryHTMLReply, temporaryReply } from '../../replies';

export const settingsScene = new Scenes.BaseScene<DCAContext>('settings');

settingsScene.enter(async (ctx) => {
  await temporaryHTMLReply(
    ctx,
    generateSettingsHTML(),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Link Wallet', 'settings_linkwallet'),
        Markup.button.callback('Private Keys', 'settings_privatekeys'),
      ],
      [backButton('settings_back')],
    ])
  );
});

settingsScene.action('settings_back', async (ctx) => {
  await ctx.scene.leave();
  await startMenu(ctx);
});

settingsScene.action('settings_privatekeys', async (ctx) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: ctx.from!.id.toString(),
    },
  });
  if (userExists === null) {
    return await temporaryReply(ctx, 'You have no wallets to view!');
  }
  const wallet1 = {
    address: userExists.wallet1,
    privateKey: decrypt({
      iv: iv.toString('hex'),
      encryptedData: userExists.wallet1PrivateKey,
    }),
  };
  const wallet2 = {
    address: userExists.wallet2,
    privateKey: decrypt({
      iv: iv.toString('hex'),
      encryptedData: userExists.wallet2PrivateKey,
    }),
  };
  const wallet3 = {
    address: userExists.wallet3,
    privateKey: decrypt({
      iv: iv.toString('hex'),
      encryptedData: userExists.wallet3PrivateKey,
    }),
  };

  return await temporaryHTMLReply(
    ctx,
    generateWalletsHTML(wallet1, wallet2, wallet3, networkScanLink),
    undefined,
    60
  );
});

settingsScene.action('settings_linkwallet', async (ctx) => {
  await ctx.scene.leave();
  await ctx.scene.enter('settings_linkwallet');
});