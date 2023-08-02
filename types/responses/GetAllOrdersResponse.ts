import { Order } from '../Order';

export type GetAllOrdersResponse = {
  wallet1Orders: Order[];
  wallet2Orders: Order[];
  wallet3Orders: Order[];
};
