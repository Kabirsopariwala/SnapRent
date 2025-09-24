import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [dailyTraffic, setDailyTraffic] = useState([]);
  const [hourlyTraffic, setHourlyTraffic] = useState([]);
  const [productOrders, setProductOrders] = useState([]); // 👈 new state

  // Fetch stats once
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          withCredentials: true,
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    fetchStats();
  }, []);

  // Fetch traffic every 10s
  useEffect(() => {
    let interval;
    async function fetchTraffic() {
      try {
        const dailyRes = await axios.get(
          "http://localhost:5000/api/admin/traffic",
          { withCredentials: true }
        );
        setDailyTraffic(dailyRes.data || []);

        const hourlyRes = await axios.get(
          "http://localhost:5000/api/admin/traffic/hourly",
          { withCredentials: true }
        );
        setHourlyTraffic(hourlyRes.data || []);
      } catch (err) {
        console.error("Failed to fetch traffic", err);
      }
    }
    fetchTraffic();
    interval = setInterval(fetchTraffic, 10000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fetch product orders (per product order counts)
  useEffect(() => {
    async function fetchProductOrders() {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/admin/stats/product-orders",
          { withCredentials: true }
        );
        setProductOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch product orders", err);
      }
    }
    fetchProductOrders();
  }, []);

  // Chart Data
  const dailyData = {
    labels: dailyTraffic.map((d) => d.day || d.date || ""),
    datasets: [
      {
        label: "Visits per Day",
        data: dailyTraffic.map((d) => d.visits ?? d.count ?? 0),
        borderColor: "#4ade80",
        backgroundColor: "rgba(74, 222, 128, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const hourlyData = {
    labels: hourlyTraffic.map((h) =>
      h.hour !== undefined ? h.hour + ":00" : ""
    ),
    datasets: [
      {
        label: "Visits per Hour",
        data: hourlyTraffic.map((h) => h.visits ?? h.count ?? 0),
        backgroundColor: "#38bdf8",
      },
    ],
  };

  const productOrderData = {
    labels: productOrders.map((p) => p._id), // product name or id
    datasets: [
      {
        label: "Total Orders",
        data: productOrders.map((p) => p.totalOrders),
        backgroundColor: "#f87171",
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="cards-container">
        <div className="card">
          <div>Total Products</div>
          <div className="card-value">{stats.totalProducts}</div>
        </div>
        <div className="card">
          <div>Total Users</div>
          <div className="card-value">{stats.totalUsers}</div>
        </div>
        <div className="card">
          <div>Total Categories</div>
          <div className="card-value">{stats.totalCategories}</div>
        </div>
        <div className="card">
          <div>Total Orders</div>
          <div className="card-value">{stats.totalOrders}</div>
        </div>
      </div>

      <div className="charts-container">
        

        <div className="chart-card">
          <h3>Orders per Product</h3>
          <Bar data={productOrderData} />
        </div>
      </div>
    </div>
  );
}
