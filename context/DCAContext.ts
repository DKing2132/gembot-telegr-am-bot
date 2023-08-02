import { Context, Scenes } from 'telegraf';
import { OrderToCreate } from '../types/OrderToCreate';
import { Withdrawable } from '../types/Withdrawable';
import { OrderToUpdate } from '../types/OrderToUpdate';
import { BuySellOrder } from '../types/BuyOrder';
import { CollectFunds } from '../types/CollectFunds';

interface DCASession extends Scenes.SceneSession {
  orderToCreate: OrderToCreate;
  orderToDelete: string;
  withdrawable: Withdrawable;
  orderToUpdate: OrderToUpdate;
  buyOrder: BuySellOrder;
  sellOrder: BuySellOrder;
  collectFunds: CollectFunds;
  linkWallet: string;
}

export interface DCAContext extends Context {
  // declare session type
  session: DCASession;

  // declare scene type
  scene: Scenes.SceneContextScene<DCAContext>;
}
