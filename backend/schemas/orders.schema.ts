import { object, string, number, array, mixed } from "yup";

export const placeOrderSchema = object({
  body: object({
    orderId: string().required(),
    customer_name: string().required(),
    customer_phone: string().required(),
    customer_email: string().required(),
    shipping_address: string().required(),
    order_date: string(),
    paymentMethod: string().required(),
    status: mixed().oneOf([
      "Delivered",
      "OnTheWay",
      "Pending",
      "Cancelled",
      "Returned",
    ]),
    orderItems: array()
      .of(
        object().shape({
          productId: number().required(),
          quantity: number().required(),
        })
      )
      .min(1),
  }),
});
