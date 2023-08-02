import { Markup } from 'telegraf';

export const backToMenuButton = (callback_action: string) => {
  return Markup.button.callback('⬆️ Back to main menu', callback_action);
};
