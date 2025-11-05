"use client";
import { useEffect, useState } from "react";
import OrderList from "./OrderListing";


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("https://poly-market-backend.vercel.app/orders", {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch orders:", text);
          setOrders([]);
          return;
        }

        const data = await res.json();
        setOrders(data.Order || data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="orders-container">
      <h1>Your Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length > 0 ? (
        <OrderList orders={orders} />
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
