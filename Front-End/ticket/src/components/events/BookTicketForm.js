import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader';

const validationSchema = Yup.object({
  quantity: Yup.number()
    .min(1, 'Must book at least 1 ticket')
    .max(10, 'Cannot book more than 10 tickets')
    .required('Quantity is required'),
  paymentMethod: Yup.string()
    .oneOf(['credit_card', 'paypal'], 'Please select a valid payment method')
    .required('Payment method is required'),
});

export default function BookTicketForm({ event, onCancel }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      quantity: 1,
      paymentMethod: 'credit_card',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`/api/events/${event._id}/book`, values);
        toast.success('Tickets booked successfully!');
        navigate(`/bookings/${response.data.bookingId}`);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to book tickets');
      } finally {
        setLoading(false);
      }
    },
  });

  const totalPrice = event.price * formik.values.quantity;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="quantity" className="form-label">
          Number of Tickets
        </label>
        <div className="mt-1 flex items-center">
          <button
            type="button"
            onClick={() => formik.setFieldValue('quantity', Math.max(1, formik.values.quantity - 1))}
            className="p-2 border border-gray-300 rounded-l-md"
          >
            -
          </button>
          <input
            type="number"
            id="quantity"
            name="quantity"
            {...formik.getFieldProps('quantity')}
            className="form-input rounded-none text-center w-20"
            min="1"
            max="10"
          />
          <button
            type="button"
            onClick={() => formik.setFieldValue('quantity', Math.min(10, formik.values.quantity + 1))}
            className="p-2 border border-gray-300 rounded-r-md"
          >
            +
          </button>
        </div>
        {formik.touched.quantity && formik.errors.quantity && (
          <div className="form-error">{formik.errors.quantity}</div>
        )}
      </div>

      <div>
        <label className="form-label">Payment Method</label>
        <div className="mt-2 space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="credit_card"
              {...formik.getFieldProps('paymentMethod')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2">Credit Card</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              {...formik.getFieldProps('paymentMethod')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="ml-2">PayPal</span>
          </label>
        </div>
        {formik.touched.paymentMethod && formik.errors.paymentMethod && (
          <div className="form-error">{formik.errors.paymentMethod}</div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Price per ticket</span>
          <span>${event.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Quantity</span>
          <span>{formik.values.quantity}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 btn-primary"
        >
          {loading ? (
            <Loader size="small" />
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
    </form>
  );
} 