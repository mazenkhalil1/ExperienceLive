import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const EventAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventData, setEventData] = useState(null);

  const fetchEventData = useCallback(async () => {
    try {
      // First fetch the event details
      const eventResponse = await axiosInstance.get(`/events/${id}`);
      const event = eventResponse.data.data;

      // Then fetch the bookings for this event
      const bookingsResponse = await axiosInstance.get(`/events/${id}/bookings`);
      const bookings = bookingsResponse.data.data || [];

      // Calculate analytics
      const totalTickets = event.totalTickets || 0;
      const bookedTickets = totalTickets - (event.remainingTickets || 0);
      const percentBooked = ((bookedTickets / totalTickets) * 100).toFixed(2);
      
      setEventData({
        title: event.title,
        totalTickets,
        bookedTickets,
        remainingTickets: event.remainingTickets || 0,
        percentBooked,
        price: event.price || 0,
        revenue: bookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0),
        bookings
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching event data:', err);
      setError(err.response?.data?.message || 'Failed to fetch event data');
      showToast.error(err.response?.data?.message || 'Failed to fetch event data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchEventData}
            className="text-blue-600 hover:text-blue-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">No event data available</p>
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
    { name: 'Booked', value: eventData.bookedTickets },
    { name: 'Available', value: eventData.remainingTickets },
    { name: 'Cancelled', value: 0 }
  ].filter(item => item.value > 0);

  // Prepare data for booking trend
  const bookingTrendData = eventData.bookings?.map(item => ({
    date: new Date(item.createdAt).toLocaleDateString(),
    bookings: 1,
    revenue: item.totalPrice || 0
  })) || [];

  // Calculate revenue metrics
  const totalRevenue = eventData.revenue || 0;
  const averageRevenuePerTicket = eventData.bookedTickets ? totalRevenue / eventData.bookedTickets : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Analytics - {eventData.title}
          </h2>
          <button
            onClick={() => navigate('/organizer/events')}
            className="text-gray-600 hover:text-gray-800"
          >
            Back to Events
          </button>
        </div>

        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800">Total Tickets</h3>
              <p className="text-2xl font-bold text-blue-600">
                {eventData.totalTickets}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-800">Tickets Booked</h3>
              <p className="text-2xl font-bold text-green-600">
                {eventData.bookedTickets}
              </p>
              <p className="text-sm text-green-600">
                {eventData.percentBooked}% of total
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-800">Available Tickets</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {eventData.remainingTickets}
              </p>
              <p className="text-sm text-yellow-600">
                {(100 - parseFloat(eventData.percentBooked)).toFixed(2)}% remaining
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
          {bookingTrendData.length > 0 && (
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
          )}

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
                <h4 className="text-sm font-medium text-gray-600">Potential Revenue</h4>
                <p className="text-2xl font-bold text-gray-900">
                  ${(eventData.remainingTickets * eventData.price).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
            {eventData.bookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Booking Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tickets
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {eventData.bookings.map((booking, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${booking.totalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No bookings yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 