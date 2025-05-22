import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Cell
} from 'recharts';

const EventAnalytics = ({ eventId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [eventId, fetchAnalytics]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/users/events/analytics/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAnalytics(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch analytics data');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-4">Loading analytics...</div>;
  if (error) return <div className="text-center text-red-500 py-4">{error}</div>;
  if (!analytics) return <div className="text-center py-4">No analytics data available</div>;

  const COLORS = ['#0088FE', '#00C49F'];

  // Prepare data for pie chart
  const pieData = [
    { name: 'Booked', value: analytics.bookedTickets },
    { name: 'Available', value: analytics.availableTickets },
  ];

  // Prepare data for booking trend
  const trendData = analytics.bookingTrend.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    bookings: item.count,
  }));

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Tickets</h3>
          <p className="text-2xl font-bold text-blue-600">
            {analytics.totalTickets}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Tickets Booked</h3>
          <p className="text-2xl font-bold text-green-600">
            {analytics.bookedTickets}
          </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Revenue</h3>
          <p className="text-2xl font-bold text-purple-600">
            ${analytics.revenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Ticket Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Ticket Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Booking Trend */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Booking Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" name="Tickets Booked" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Booking Rate</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {((analytics.bookedTickets / analytics.totalTickets) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">of total tickets booked</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Average Daily Bookings</h3>
          <p className="text-3xl font-bold text-indigo-600">
            {(analytics.averageDailyBookings || 0).toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">tickets per day</p>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 