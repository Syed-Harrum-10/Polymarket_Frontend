"use client";

export default function OrderItem({ order }) {
  if (!order) return null; // Prevent rendering if order is undefined

  return (
    <div className="order-card">
      <div className="order-header">
        <h3>Order #{order.id}</h3>
        <span className={`status ${order.status?.toLowerCase()}`}>
          {order.status}
        </span>
      </div>

      <div className="order-body">
        <p><strong>Listing:</strong> {order.listingId || "N/A"}</p>
        <p><strong>Amount:</strong> ${order.amount || 0}</p>
        <p><strong>Seller:</strong> {order.sellerId || "N/A"}</p>
        <p><strong>Buyer:</strong> {order.buyerId || "N/A"}</p>
      </div>

      <div className="order-footer">
        <p>Placed on: {order.createdAt ? new Date(order.createdAt).toLocaleString() : "N/A"}</p>
      </div>
    </div>
  );
}
