import { Context, Markup } from 'telegraf';
import { UserWallet } from '../types/UserWallet';
import { ethers } from 'ethers';
import { networkScanLink, prisma, provider } from '../constants';
import { encrypt } from '../encryption';
import { generateStartingMenuHTML } from '../html';
import { persistentHTMLReply } from '../replies';

export const startMenu = async (ctx: Context) => {
  // first check if the user exists
  const userExists = await prisma.user.findUnique({
    where: {
      id: ctx.from!.id.toString(),
    },
  });

  let wallet1: UserWallet;
  let wallet2: UserWallet;
  let wallet3: UserWallet;

  // create the user and store them in the db
  if (userExists === null) {
    const newWallet1 = ethers.Wallet.createRandom(provider);
    const newWallet2 = ethers.Wallet.createRandom(provider);
    const newWallet3 = ethers.Wallet.createRandom(provider);

    await prisma.user.create({
      data: {
        id: ctx.from!.id.toString(),
        wallet1: newWallet1.address,
        wallet1PrivateKey: encrypt(newWallet1.privateKey).encryptedData,
        wallet2: newWallet2.address,

        wallet2PrivateKey: encrypt(newWallet2.privateKey).encryptedData,
        wallet3: newWallet3.address,
        wallet3PrivateKey: encrypt(newWallet3.privateKey).encryptedData,
      },
    });

    wallet1 = { address: newWallet1.address };
    wallet2 = { address: newWallet2.address };
    wallet3 = { address: newWallet3.address };
  } else {
    wallet1 = { address: userExists.wallet1 };
    wallet2 = { address: userExists.wallet2 };
    wallet3 = { address: userExists.wallet3 };
  }

  return persistentHTMLReply(
    ctx,
    generateStartingMenuHTML(wallet1, wallet2, wallet3, networkScanLink),
    Markup.inlineKeyboard([
      [
        Markup.button.callback('Create Order', 'createorder'),
        Markup.button.callback('Instant Buy', 'buy'),
        Markup.button.callback('Instant Sell', 'sell'),
      ],
      [
        Markup.button.callback('Update Order', 'updateorder'),
        Markup.button.callback('Delete Order', 'deleteorder'),
        Markup.button.callback('Collect Funds', 'collectfunds'),
      ],
      [
        Markup.button.callback('Active Orders', 'activeorders'),
        Markup.button.callback('DCA Status', 'orderstatus'),
        Markup.button.callback('Settings', 'settings'),
      ],
    ])
  );
};
