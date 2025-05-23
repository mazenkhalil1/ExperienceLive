import React, { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../services/axiosConfig';
import { showToast } from '../shared/Toast';
import Loader from '../shared/Loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const EventAnalytics = ({ eventId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/events/${eventId}/analytics`);
      setAnalytics(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err.response?.data?.message || 'Failed to fetch analytics data');
      showToast.error(err.response?.data?.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const TICKET_STATUS_COLORS = {
    available: '#00C49F',
    booked: '#0088FE',
    cancelled: '#FF8042'
  };

  // Prepare data for pie chart
  const ticketDistributionData = [
    { name: 'Booked', value: analytics.bookedTickets },
    { name: 'Available', value: analytics.availableTickets },
    { name: 'Cancelled', value: analytics.cancelledTickets || 0 }
  ].filter(item => item.value > 0);

  // Prepare data for booking trend
  const bookingTrendData = analytics.bookingTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    bookings: item.count,
    revenue: item.revenue
  }));

  // Calculate revenue metrics
  const totalRevenue = analytics.revenue;
  const averageRevenuePerTicket = totalRevenue / analytics.bookedTickets || 0;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Tickets</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.totalTickets}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Tickets Booked</h3>
          <p className="text-2xl font-bold text-green-600">
            {analytics.bookedTickets}
          </p>
          <p className="text-sm text-green-600">
            {((analytics.bookedTickets / analytics.totalTickets) * 100).toFixed(1)}% of total
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Available Tickets</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {analytics.availableTickets}
          </p>
          <p className="text-sm text-yellow-600">
            {((analytics.availableTickets / analytics.totalTickets) * 100).toFixed(1)}% remaining
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-purple-800">Total Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-sm text-purple-600">
            ${averageRevenuePerTicket.toFixed(2)} per ticket
          </p>
        </div>
      </div>

      {/* Ticket Distribution */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Ticket Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ticketDistributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name} (${value}, ${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {ticketDistributionData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={TICKET_STATUS_COLORS[entry.name.toLowerCase()] || COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Booking Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bookingTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#0088FE"
                name="Bookings"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#00C49F"
                name="Revenue ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Analysis */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Revenue Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Total Revenue</h4>
            <p className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Average Revenue/Ticket</h4>
            <p className="text-2xl font-bold text-gray-900">${averageRevenuePerTicket.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-600">Projected Revenue</h4>
            <p className="text-2xl font-bold text-gray-900">
              ${(analytics.availableTickets * analytics.price).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 