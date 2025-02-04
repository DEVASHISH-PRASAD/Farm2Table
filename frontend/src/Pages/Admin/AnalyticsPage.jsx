import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaUser, FaCartPlus, FaTag } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  fetchUserSignups,
  fetchOrderSales,
  fetchItemSales,
  fetchMonthlySales,
} from "../../Redux/Slices/AnalyticsSlice.js";
import Header from "../Header.jsx";
import Footer from "../Footer.jsx";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { userSignups, orderSales, itemSales, monthlySales, status, error } =
    useSelector((state) => state.analytics);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-indexed months (January is 1)

  useEffect(() => {
    dispatch(fetchUserSignups({ year: selectedYear, month: selectedMonth }));
    dispatch(fetchOrderSales({ year: selectedYear, month: selectedMonth }));
    dispatch(fetchItemSales({ year: selectedYear, month: selectedMonth }));
    dispatch(fetchMonthlySales({ year: selectedYear, month: selectedMonth }));
  }, [dispatch, selectedYear, selectedMonth]);

  // Log errors to console
  useEffect(() => {
    if (status === "failed" && error) {
      console.error("Analytics API Error:", error);
    }
  }, [status, error]);

  // Calculate Total User Registered up to now
  const totalUserRegistered =
    userSignups?.reduce((acc, curr) => acc + curr.totalSignups, 0) || 0;

  // Calculate Total Sales up to now
  const totalSalesUpToNow =
    orderSales?.reduce((acc, curr) => acc + curr.totalSales, 0) || 0;

  // Calculate Total Sales in the Selected Month and Year
  const totalSalesForMonth =
    monthlySales?.find(
      (sale) =>
        sale._id.year === selectedYear && sale._id.month === selectedMonth
    )?.totalSales || 0;

  // Calculate Total Revenue Earned
  const totalRevenueEarned =
    orderSales?.reduce((acc, curr) => acc + curr.totalRevenue, 0) || 0;

  // Function to prepare chart data
  const prepareChartData = (data, label) => {
    return {
      labels: data?.length
        ? data?.map((item) => {
            const monthName = new Date(
              item._id.year,
              item._id.month - 1
            ).toLocaleString("en", { month: "long" });
            return `${monthName} ${item._id.year}`; // Format as Month Year
          })
        : [],
      datasets: [
        {
          label: label,
          data: data?.length
            ? data?.map((item) => item.totalSignups || item.totalSales || 0)
            : [],
          backgroundColor: "#4caf50", // Green for line chart
          borderColor: "#4caf50",
          borderWidth: 1,
        },
      ],
    };
  };

  // Line Chart for User Signups
  const userSignupsChartData = prepareChartData(userSignups, "User Signups");

  // Bar Chart for User Signups (Additional Chart)
  const userSignupsBarChartData = {
    labels: userSignups?.length
      ? userSignups.map((item) => {
          const monthName = new Date(
            item._id.year,
            item._id.month - 1
          ).toLocaleString("en", { month: "long" });
          return `${monthName} ${item._id.year}`; // Format as Month Year
        })
      : [],
    datasets: [
      {
        label: "User Signups",
        data: userSignups?.length
          ? userSignups.map((item) => item.totalSignups)
          : [],
        backgroundColor: "#ff9900", // Orange for bar chart
        borderColor: "#ff9900",
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart for Item Sales (Top 10 Items)
  const getTopItems = (items) => {
    if (!items?.length) return [];
    return [...items]
      .sort((a, b) => b.totalSales - a.totalSales) // Sort items by sales in descending order
      .slice(0, 10); // Get top 10 items
  };

  const topItemSales = getTopItems(itemSales);

  const itemSalesChartData = {
    labels: topItemSales?.length
      ? topItemSales.map((item) => item._id.itemName)
      : [],
    datasets: [
      {
        label: "Item Sales",
        data: topItemSales?.length
          ? topItemSales.map((item) => item.totalSales)
          : [],
        backgroundColor: topItemSales?.length
          ? topItemSales.map((_, index) => {
              const colors = [
                "#ff6384",
                "#36a2eb",
                "#ffcd56",
                "#4bc0c0",
                "#f39c12",
                "#9b59b6",
                "#1abc9c",
                "#e74c3c",
                "#3498db",
                "#2ecc71",
              ];
              return colors[index % colors.length]; // Loop through colors if there are more items than colors
            })
          : [],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className=" w-full mx-auto ">
      <Header className="w-full" />
      <h2 className="text-3xl font-semibold text-center mb-6 mt-4">
        Analytics Dashboard
      </h2>

      {/* Year and Month Selection */}
      <div className="flex justify-center mb-6 space-x-4">
        <div className="flex items-center">
          <label htmlFor="year" className="mr-2">
            Year:
          </label>
          <select
            id="year"
            className="border p-2 rounded"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {[2020, 2021, 2022, 2023, 2024, 2025].map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <label htmlFor="month" className="mr-2">
            Month:
          </label>
          <select
            id="month"
            className="border p-2 rounded"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <option key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString("en", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show loading state */}
      {status === "loading" && (
        <p className="text-center text-lg">Loading data...</p>
      )}

      {/* Show error state */}
      {status === "failed" && (
        <p className="text-center text-red-500">Error: {error}</p>
      )}

      {/* Check if data exists */}
      {(userSignups?.length === 0 && itemSales?.length === 0) && (
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <p className="text-center text-lg font-semibold">
            No data available for{" "}
            {new Date(selectedYear, selectedMonth - 1).toLocaleString("en", {
              month: "long",
            })}{" "}
            {selectedYear}.
          </p>
        </div>
      )}

      {/* Grid for two charts per row */}
      {(userSignups?.length > 0 || itemSales?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Total User Registered (Bar Chart) */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold flex items-center mb-4">
              <FaUser className="mr-2" /> Total User Registered (Bar Chart)
            </h3>
            <div className="mb-4" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: ["Total Registered Users"],
                  datasets: [
                    {
                      label: "User Signups",
                      data: [totalUserRegistered],
                      backgroundColor: "#ff9900",
                      borderColor: "#ff9900",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Total Sales up to Now (Bar Chart) */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold flex items-center mb-4">
              <FaCartPlus className="mr-2" /> Total Sales up to Now (Bar Chart)
            </h3>
            <div className="mb-4" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: ["Total Sales up to Now"],
                  datasets: [
                    {
                      label: "Total Sales",
                      data: [totalSalesUpToNow],
                      backgroundColor: "#4caf50",
                      borderColor: "#4caf50",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Total Sales in Selected Year and Month (Bar Chart) */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold flex items-center mb-4">
              <FaCartPlus className="mr-2" /> Total Sales in{" "}
              {new Date(selectedYear, selectedMonth - 1).toLocaleString("en", {
                month: "long",
              })}{" "}
              {selectedYear}
            </h3>
            <div className="mb-4" style={{ height: "300px" }}>
              <Bar
                data={{
                  labels: [
                    `Total Sales in ${new Date(
                      selectedYear,
                      selectedMonth - 1
                    ).toLocaleString("en", { month: "long" })}`,
                  ],
                  datasets: [
                    {
                      label: "Sales",
                      data: [totalSalesForMonth],
                      backgroundColor: "#ff6347",
                      borderColor: "#ff6347",
                      borderWidth: 1,
                    },
                  ],
                }}
              />
            </div>
          </div>

          {/* Total Revenue Earned */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-2xl font-semibold flex items-center mb-4">
              <FaCartPlus className="mr-2" /> Total Revenue Earned
            </h3>
            <div className="mb-4 text-center">
              <strong>Total Revenue: </strong>₹{totalRevenueEarned.toFixed(2)}
            </div>
          </div>
        </div>
      )}
      <Footer className="w-full" />
    </div>
  );
};

export default AnalyticsPage;
