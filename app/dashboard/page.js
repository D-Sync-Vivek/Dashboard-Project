"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromMonth = parseInt(searchParams.get("from") ?? 1);
  const toMonth = parseInt(searchParams.get("to") ?? 12);
  const fetchURL = `/api/stats?from=${fromMonth}&to=${toMonth}`;
  const { data, error, isLoading } = useSWR(fetchURL, fetcher);

  const chartData = data?.monthlySales ?? [];
  const productData = data?.productSales ?? [];
  const bestProduct = productData.reduce((maxProd, currentProd) => {
    return currentProd.totalSales > (maxProd?.totalSales ?? -Infinity)
      ? currentProd
      : maxProd;
  }, {product: "N/A", totalSales: 0});
  const productShare = data?.productShare ?? [];

  if (isLoading)
    return (
       <div className="flex flex-col justify-center items-center min-h-screen"> 
      <div className="h-12 w-12 rounded-full border-4 border-gray-300 border-t-blue-700 animate-spin"></div>
      Loading...
    </div>
    );
  if (error) return <div>Failed to Load: {error.message}</div>;
  if (!Array.isArray(chartData)) return <div>No data</div>;

  const months = 
  ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

  const handleChange = (type, value) => {
    const newfrom = type === "from" ? value : fromMonth;
    const newto = type === "to" ? value : toMonth;
    router.replace(`?from=${newfrom}&to=${newto}`);
  };

  return (
    <>
      <div className="mt-5 p-1">
        <div className="heading text-4xl font-bold text-center">Dashboard</div>

        {/* Filter */}
        <div className="flex gap-2 items-center mb-6">
          <label htmlFor="from">From:</label>
          <select
            name="from"
            id=""
            value={fromMonth}
            onChange={e => handleChange("from",Number(e.target.value)) }
          >
            {months.map((month, i) => (
              <option key={month} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
          <label htmlFor="to">To</label>

          <select
            name="to"
            id=""
            value={toMonth}
            onChange={e => handleChange("to", Number(e.target.value))}
          >
            {months.map((month, i) => (
              <option key={month} value={i + 1}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Summary Cards */}
        <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-500">Total Sales</h2>
            <p className="text-2xl font-bold text-gray-900">{data.total}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 flex gap-6">
            <div>
              <h2 className="text-sm font-medium text-gray-500">
                Best Product
              </h2>
              <p className="text-2xl font-bold text-gray-900">
                {bestProduct.product}
              </p>
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Product Sales</h2>
              <p className="text-2xl font-bold text-gray-900">
                {bestProduct.totalSales}
              </p>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-sm font-medium text-gray-500">
              Average Monthly Sales
            </h2>
            <p className="text-2xl font-bold text-gray-900">{data.average}</p>
          </div>
        </div>
        {/* Charts */}
        <div className="my-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div className="text-lg text-center font-semibold mb-2">
              Monthly Sales Trend
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={ chartData }
              >
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
            <div className="text-lg text-center font-semibold mb-2">
              Sales By Product
            </div>
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
            <div className="text-lg text-center font-semibold mb-2">
              Product Share (%)
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart key={`${fromMonth} -${toMonth}`}>
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
