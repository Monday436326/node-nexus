'use client';

import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Search, AlertCircle, Calculator } from 'lucide-react';

export function DemandForm() {
  const { primaryWallet } = useDynamicContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cpuCores: '',
    gpuCount: '',
    gpuType: '',
    ramGB: '',
    storageGB: '',
    maxPricePerHour: '',
    duration: '',
    jobDescription: ''
  });

  const calculateTotalBudget = () => {
    const price = parseFloat(formData.maxPricePerHour) || 0;
    const hours = parseInt(formData.duration) || 0;
    return price * hours;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!primaryWallet?.address) {
      setError('Please connect your wallet first');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/demand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          walletAddress: primaryWallet.address,
          cpuCores: parseInt(formData.cpuCores),
          gpuCount: parseInt(formData.gpuCount),
          ramGB: parseInt(formData.ramGB),
          storageGB: parseInt(formData.storageGB),
          maxPricePerHour: parseFloat(formData.maxPricePerHour),
          duration: parseInt(formData.duration)
        })
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          cpuCores: '',
          gpuCount: '',
          gpuType: '',
          ramGB: '',
          storageGB: '',
          maxPricePerHour: '',
          duration: '',
          jobDescription: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Card>
      {error && (
        <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-danger-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-danger-800">Error</h3>
              <p className="text-sm text-danger-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-success-600 rounded-full flex items-center justify-center mt-0.5">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-success-800">Success</h3>
              <p className="text-sm text-success-700 mt-1">
                Compute request submitted successfully. You can view it in the marketplace.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resource Requirements */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Resource Requirements</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="cpuCores">
                CPU Cores Needed *
              </label>
              <input
                id="cpuCores"
                type="number"
                name="cpuCores"
                value={formData.cpuCores}
                onChange={handleInputChange}
                className="form-input"
                required
                min="1"
                max="128"
                placeholder="e.g., 8"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gpuCount">
                GPU Count Needed *
              </label>
              <input
                id="gpuCount"
                type="number"
                name="gpuCount"
                value={formData.gpuCount}
                onChange={handleInputChange}
                className="form-input"
                required
                min="0"
                max="16"
                placeholder="e.g., 1"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gpuType">
                Preferred GPU Type
              </label>
              <input
                id="gpuType"
                type="text"
                name="gpuType"
                value={formData.gpuType}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., RTX 4090, V100"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ramGB">
                RAM Needed (GB) *
              </label>
              <input
                id="ramGB"
                type="number"
                name="ramGB"
                value={formData.ramGB}
                onChange={handleInputChange}
                className="form-input"
                required
                min="1"
                max="1024"
                placeholder="e.g., 16"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="storageGB">
                Storage Needed (GB) *
              </label>
              <input
                id="storageGB"
                type="number"
                name="storageGB"
                value={formData.storageGB}
                onChange={handleInputChange}
                className="form-input"
                required
                min="1"
                max="10000"
                placeholder="e.g., 500"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="duration">
                Duration (Hours) *
              </label>
              <input
                id="duration"
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="form-input"
                required
                min="1"
                max="8760"
                placeholder="e.g., 24"
              />
            </div>
          </div>
        </div>

        {/* Budget and Job Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center space-x-2">
              <Calculator className="w-5 h-5" />
              <span>Budget</span>
            </h3>
            <div className="form-group">
              <label className="form-label" htmlFor="maxPricePerHour">
                Max Price per Hour (USDC) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-neutral-500">$</span>
                <input
                  id="maxPricePerHour"
                  type="number"
                  name="maxPricePerHour"
                  value={formData.maxPricePerHour}
                  onChange={handleInputChange}
                  className="form-input pl-6"
                  required
                  min="0.01"
                  max="1000"
                  step="0.01"
                  placeholder="1.00"
                />
                <span className="absolute right-3 top-2 text-sm text-neutral-500">USDC</span>
              </div>
            </div>
            
            {formData.maxPricePerHour && formData.duration && (
              <div className="mt-3 p-3 bg-neutral-50 rounded-lg">
                <div className="text-sm text-neutral-600">Total Budget Estimate</div>
                <div className="text-lg font-semibold text-neutral-900">
                  ${calculateTotalBudget().toFixed(2)} USDC
                </div>
                <div className="text-xs text-neutral-500">
                  ${formData.maxPricePerHour}/hour × {formData.duration} hours
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-medium text-neutral-900 mb-4">
              Job Details
            </h3>
            <div className="form-group">
              <label className="form-label" htmlFor="jobDescription">
                Job Description
              </label>
              <textarea
                id="jobDescription"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                className="form-textarea"
                rows={4}
                placeholder="Describe your compute requirements, use case, or any specific needs..."
                maxLength={500}
              />
              <div className="text-xs text-neutral-500 mt-1">
                {formData.jobDescription.length}/500 characters
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
          <Button
            type="submit"
            loading={loading}
            disabled={!primaryWallet?.address}
            className="w-full sm:w-auto"
            icon={Search}
          >
            {loading ? 'Submitting Request...' : 'Submit Compute Request'}
          </Button>
          
          {!primaryWallet?.address && (
            <p className="text-sm text-neutral-500">
              Connect your wallet to submit a compute request
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}