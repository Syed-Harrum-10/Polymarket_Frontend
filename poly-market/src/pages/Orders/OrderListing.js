import OrderItem from "./OrderItem";

export default function OrderListing({ orders }) {
    const orderArray = Array.isArray(orders)
      ? orders
      : orders?.Order
      ? orders.Order
      : [];
  
    if (orderArray.length === 0) return <p>No orders found.</p>;
  
    return (
      <div className="order-list">
        {orderArray.map((order) => (
          <OrderItem key={order.id} order={order} />
        ))}
      </div>
    );
  }
  