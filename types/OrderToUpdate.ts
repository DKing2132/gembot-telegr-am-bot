import { UnitOfTime } from './UnitOfTime';
import { UpdateOrderFields } from './UpdateOrderFields';

export type OrderToUpdate = {
  orderID?: string;
  field?: UpdateOrderFields;
  value?: string | number | UnitOfTime;
};
