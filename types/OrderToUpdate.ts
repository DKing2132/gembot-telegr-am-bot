import { UnitOfTime } from './UnitOfTime';
import { UpdateOrderFields } from './UpdateOrderFields';
import { OrderResponse } from './responses/OrderResponse';

export type OrderToUpdateRequestBody = {
  orderID?: string;
  field?: UpdateOrderFields;
  value?: string | number | UnitOfTime;
  isLimitOrder?: boolean;
};

export type OrderToUpdate = {
  order?: OrderResponse;
} & OrderToUpdateRequestBody;
