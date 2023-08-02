import { Markup } from 'telegraf';

export const backButton = (callback_action: string) => {
  return Markup.button.callback('⬅️ Back', callback_action);
};
