import { Context, Markup } from 'telegraf';
import { DCAContext } from './context/DCAContext';
import { InlineKeyboardMarkup, Update } from 'telegraf/src/core/types/typegram';

const deleteTimeout = (ctx: Context, replyId: number, seconds: number) => {
  setTimeout(async () => {
    // delete reply
    await ctx.deleteMessage(replyId);
  }, 1000 * seconds);
};

export const persistentHTMLReply = async (
  ctx: Context<Update> | DCAContext,
  reply: string,
  keyboard?: Markup.Markup<InlineKeyboardMarkup>
) => {
  return await ctx.reply(reply, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...keyboard,
  });
};

export const persistentReply = async (
  ctx: Context<Update> | DCAContext,
  reply: string,
  keyboard?: Markup.Markup<InlineKeyboardMarkup>
) => {
  return await ctx.reply(reply, {
    disable_web_page_preview: true,
    ...keyboard,
  });
};

export const temporaryHTMLReply = async (
  ctx: Context<Update> | DCAContext,
  reply: string,
  keyboard?: Markup.Markup<InlineKeyboardMarkup>,
  timeoutSeconds: number = 21600
) => {
  const message = await ctx.reply(reply, {
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...keyboard,
  });

  deleteTimeout(ctx, message.message_id, timeoutSeconds);

  return message;
};

export const temporaryReply = async (
  ctx: Context<Update> | DCAContext,
  reply: string,
  keyboard?: Markup.Markup<InlineKeyboardMarkup>,
  timeoutSeconds: number = 21600
) => {
  const message = await ctx.reply(reply, {
    disable_web_page_preview: true,
    ...keyboard,
  });

  deleteTimeout(ctx, message.message_id, timeoutSeconds);

  return message;
};
