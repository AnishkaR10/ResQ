// Here's your updated ReportForm.tsx with proper text colors:

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface ReportFormData {
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  contactInfo: string;
}

interface ReportFormProps {
  onReportCreated: () => void;
}

const categories = [
  'theft',
  'vandalism',
  'assault',
  'harassment',
  'suspicious_activity',
  'drug_activity',
  'other'
];

export default function ReportForm({ onReportCreated }: ReportFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ReportFormData>({
    defaultValues: {
      latitude: 12.9716, // Default to Bangalore
      longitude: 77.5946
    }
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('latitude', position.coords.latitude);
          setValue('longitude', position.coords.longitude);
          console.log('Location updated:', position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Could not get your location. Using default location (Bangalore).');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting form data:', data);
      
      // Validate required fields
      if (!data.title || !data.category) {
        throw new Error('Title and category are required');
      }

      if (!data.latitude || !data.longitude) {
        throw new Error('Location is required');
      }

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description || '');
      formData.append('category', data.category);
      formData.append('latitude', data.latitude.toString());
      formData.append('longitude', data.longitude.toString());
      formData.append('address', data.address || '');
      formData.append('contactInfo', data.contactInfo || '');
      
      if (photo) {
        formData.append('photo', photo);
        console.log('Photo attached:', photo.name);
      }

      console.log('Sending request to backend...');
      const response = await axios.post('http://localhost:3001/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000, // 10 second timeout
      });

      console.log('Response received:', response.data);
      alert('Report submitted successfully!');
      reset();
      setPhoto(null);
      onReportCreated();
    } catch (error: any) {
      console.error('Error submitting report:', error);
      
      let errorMessage = 'Error submitting report. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error:', error.response.data);
        errorMessage = `Server error: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error:', error.request);
        errorMessage = 'Network error. Please check if the backend server is running.';
      } else if (error.message) {
        // Something else happened
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Report an Incident</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Title *</label>
          <input
            {...register('title', { required: 'Title is required' })}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
            placeholder="Brief description of the incident"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Category *</label>
          <select
            {...register('category', { required: 'Category is required' })}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
          >
            <option value="" className="text-gray-500">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="text-gray-900">
                {cat.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
          <textarea
            {...register('description')}
            className="w-full p-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
            placeholder="Detailed description of what happened"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Latitude *</label>
            <input
              {...register('latitude', { 
                required: 'Latitude is required',
                valueAsNumber: true,
                validate: value => !isNaN(value) || 'Must be a valid number'
              })}
              type="number"
              step="any"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              placeholder="12.9716"
            />
            {errors.latitude && (
              <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Longitude *</label>
            <input
              {...register('longitude', { 
                required: 'Longitude is required',
                valueAsNumber: true,
                validate: value => !isNaN(value) || 'Must be a valid number'
              })}
              type="number"
              step="any"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
              placeholder="77.5946"
            />
            {errors.longitude && (
              <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={getCurrentLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          📍 Use Current Location
        </button>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Address</label>
          <input
            {...register('address')}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
            placeholder="Street address or landmark"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setPhoto(file);
              if (file) {
                console.log('Photo selected:', file.name, file.size, 'bytes');
              }
            }}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
          />
          {photo && (
            <p className="text-sm text-green-600 mt-1">Selected: {photo.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">Contact Info</label>
          <input
            {...register('contactInfo')}
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 bg-white"
            placeholder="Phone or email (optional)"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </form>
    </div>
  );
}