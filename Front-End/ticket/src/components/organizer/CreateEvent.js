import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../Loader';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
  date: Yup.date()
    .required('Date is required')
    .min(new Date(), 'Event date must be in the future'),
  time: Yup.string()
    .required('Time is required'),
  location: Yup.string()
    .required('Location is required'),
  category: Yup.string()
    .required('Category is required'),
  price: Yup.number()
    .required('Price is required')
    .min(0, 'Price must be greater than or equal to 0'),
  capacity: Yup.number()
    .required('Capacity is required')
    .min(1, 'Capacity must be at least 1')
    .max(1000, 'Capacity must not exceed 1000'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'File size is too large', (value) => {
      if (!value) return true;
      return value.size <= 5000000; // 5MB
    })
    .test('fileType', 'Unsupported file type', (value) => {
      if (!value) return true;
      return ['image/jpeg', 'image/png', 'image/jpg'].includes(value.type);
    }),
});

export default function CreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: '',
      price: '',
      capacity: '',
      image: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const formData = new FormData();
        Object.keys(values).forEach((key) => {
          formData.append(key, values[key]);
        });

        await axios.post('/api/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        toast.success('Event created successfully');
        navigate('/organizer/events');
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to create event');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="px-4 sm:px-0">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Create New Event
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Fill in the details below to create a new event.
            </p>
          </div>
        </div>

        <div className="mt-5 md:mt-0 md:col-span-2">
          <form onSubmit={formik.handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Event Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.title && formik.errors.title && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.description && formik.errors.description && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formik.values.date}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.date && formik.errors.date && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.date}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      id="time"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formik.values.time}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.time && formik.errors.time && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.time}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    id="location"
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    value={formik.values.location}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.location && formik.errors.location && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.location}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={formik.values.category}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <option value="">Select a category</option>
                    <option value="music">Music</option>
                    <option value="sports">Sports</option>
                    <option value="arts">Arts & Theater</option>
                    <option value="food">Food & Drink</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                  </select>
                  {formik.touched.category && formik.errors.category && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.category}</p>
                  )}
                </div>

                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      id="price"
                      min="0"
                      step="0.01"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.price}</p>
                    )}
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                      Capacity
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      id="capacity"
                      min="1"
                      max="1000"
                      className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formik.values.capacity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.capacity && formik.errors.capacity && (
                      <p className="mt-2 text-sm text-red-600">{formik.errors.capacity}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Image</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <input
                        type="file"
                        name="image"
                        id="image"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          formik.setFieldValue('image', event.currentTarget.files[0]);
                        }}
                        onBlur={formik.handleBlur}
                      />
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                      </label>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  </div>
                  {formik.touched.image && formik.errors.image && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors.image}</p>
                  )}
                </div>
              </div>

              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  type="button"
                  onClick={() => navigate('/organizer/events')}
                  className="btn-secondary mr-3"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? <Loader /> : 'Create Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 