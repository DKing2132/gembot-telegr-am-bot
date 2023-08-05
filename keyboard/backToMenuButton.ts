import { Markup } from 'telegraf';

export const backToMenuButton = (callback_action: string) => {
  return Markup.button.callback('⬆️ Back to Main Menu', callback_action);
};
