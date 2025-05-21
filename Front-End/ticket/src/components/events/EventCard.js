import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    return `$${price.toFixed(2)}`;
  };

  return (
    <Link to={`/events/${event._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.imageUrl || 'https://via.placeholder.com/400x300'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {event.category && (
            <span className="absolute top-2 right-2 px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
              {event.category}
            </span>
          )}
        </div>

        {/* Event Details */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
            
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
              <span>{formatPrice(event.price)}</span>
            </div>
          </div>

          {/* Organizer Info */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <img
                src={event.organizer.avatar || 'https://via.placeholder.com/32'}
                alt={event.organizer.name}
                className="h-8 w-8 rounded-full"
              />
              <div className="ml-2">
                <p className="text-sm font-medium text-gray-900">
                  {event.organizer.name}
                </p>
                <p className="text-xs text-gray-500">
                  {event.organizer.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 