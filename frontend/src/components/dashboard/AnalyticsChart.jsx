import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const MonthlyApplicationsChart = ({ data }) => {
  const chartData = {
    labels: (data || []).map(d => d.month),
    datasets: [
      {
        label: 'Applications',
        data: (data || []).map(d => d.count),
        backgroundColor: 'rgba(37, 99, 235, 0.75)',
        borderColor: '#2563eb',
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export const MonthlyRevenueChart = ({ data }) => {
  const chartData = {
    labels: (data || []).map(d => d.month),
    datasets: [
      {
        fill: true,
        label: 'Revenue (₹)',
        data: (data || []).map(d => d.revenue),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
};

export const StatusDistributionChart = ({ data }) => {
  const chartData = {
    labels: (data || []).map(d => d.status),
    datasets: [
      {
        data: (data || []).map(d => d.count),
        backgroundColor: [
          '#f59e0b', // Pending
          '#0284c7', // Approved
          '#16a34a', // Issued
          '#dc2626', // Rejected
          '#64748b', // Expired
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return <Doughnut data={chartData} options={options} />;
};
