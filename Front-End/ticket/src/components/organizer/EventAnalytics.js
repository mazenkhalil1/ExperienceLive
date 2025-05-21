import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import Loader from '../Loader';

export default function EventAnalytics() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchEventData();
  }, [id]);

  const fetchEventData = async () => {
    try {
      setLoading(true);
      const [eventResponse, analyticsResponse] = await Promise.all([
        axios.get(`/api/events/${id}`),
        axios.get(`/api/events/${id}/analytics`),
      ]);

      setEvent(eventResponse.data);
      setAnalytics(analyticsResponse.data);
    } catch (error) {
      toast.error('Failed to fetch event data');
      console.error('Error fetching event data:', error);
      navigate('/organizer/events');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!event || !analytics) {
    return null;
  }

  const stats = [
    {
      name: 'Total Revenue',
      value: `$${analytics.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      change: analytics.revenueChange,
    },
    {
      name: 'Tickets Sold',
      value: analytics.ticketsSold,
      icon: UserGroupIcon,
      change: analytics.ticketsChange,
    },
    {
      name: 'Average Price',
      value: `$${analytics.averagePrice.toFixed(2)}`,
      icon: ChartBarIcon,
      change: analytics.priceChange,
    },
    {
      name: 'Days Until Event',
      value: analytics.daysUntilEvent,
      icon: CalendarIcon,
      change: null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {event.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(event.date).toLocaleDateString()} at {event.location}
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="button"
            onClick={() => navigate(`/organizer/events/${id}/edit`)}
            className="btn-secondary"
          >
            Edit Event
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              key={item.name}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {item.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {item.value}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              {item.change !== null && (
                <div className="bg-gray-50 px-5 py-3">
                  <div className="text-sm">
                    <span
                      className={`font-medium ${
                        item.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {item.change >= 0 ? '+' : ''}
                      {item.change}%
                    </span>
                    <span className="text-gray-500"> from last week</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Sales Over Time</h3>
          <div className="mt-4">
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart will be implemented here
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900">Ticket Sales by Category</h3>
          <div className="mt-4">
            <div className="h-64 flex items-center justify-center text-gray-500">
              Chart will be implemented here
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tickets
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics.recentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${booking.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 