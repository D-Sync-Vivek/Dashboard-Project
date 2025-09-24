"use client";
import React, { useState } from "react";
import useSWR from "swr";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  PieChart,
  Bar,
  Pie,
  Cell,
} from "recharts";

const fetcher = (...args) => fetch(...args).then((res) => res.json());
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28EFE",
  "#F55C5C",
  "#6AC6D3",
];

const page = () => {
  const { data, error, isLoading } = useSWR("/api/stats", fetcher);

  const chartData = data?.monthlySales ?? [];
  const productData = data?.productSales ?? [];
  const productShare = data?.productShare ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div>Failed to Load: {error.message}</div>;
  if (!Array.isArray(chartData)) return <div>No data</div>;
  return (
    <>
      <div className="mt-5 p-1">
        <div className="heading text-4xl font-bold text-center">Dashboard</div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
          <p className="text-2xl font-bold text-gray-900">{data.total}</p>
        </div>
        <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis dataKey="totalSales" />
                <Tooltip />
                <Legend />
                <Line dataKey="totalSales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="product" />
                <YAxis dataKey="totalSales" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales">
                  {productData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Pie
                  data={productShare}
                  dataKey="share"
                  nameKey="product"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                >
                  {productShare.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
