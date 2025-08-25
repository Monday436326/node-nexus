'use client';

import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Server, AlertCircle } from 'lucide-react';

export function SupplyForm() {
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
    pricePerHour: '',
    location: ''
  });

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
      const response = await fetch('/api/supply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          walletAddress: primaryWallet.address,
          cpuCores: parseInt(formData.cpuCores),
          gpuCount: parseInt(formData.gpuCount),
          ramGB: parseInt(formData.ramGB),
          storageGB: parseInt(formData.storageGB),
          pricePerHour: parseFloat(formData.pricePerHour)
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
          pricePerHour: '',
          location: ''
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit offer');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit offer');
    }
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                Supply offer submitted successfully and is now available in the marketplace.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hardware Specifications */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4 flex items-center space-x-2">
            <Server className="w-5 h-5" />
            <span>Hardware Specifications</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label" htmlFor="cpuCores">
                CPU Cores *
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
                GPU Count *
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
                placeholder="e.g., 2"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gpuType">
                GPU Type
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
                RAM (GB) *
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
                placeholder="e.g., 32"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="storageGB">
                Storage (GB) *
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
                placeholder="e.g., 1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="e.g., US-East, Europe"
                maxLength={50}
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 mb-4">
            Pricing
          </h3>
          <div className="max-w-xs">
            <div className="form-group">
              <label className="form-label" htmlFor="pricePerHour">
                Price per Hour (USDC) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-sm text-neutral-500">$</span>
                <input
                  id="pricePerHour"
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleInputChange}
                  className="form-input pl-6"
                  required
                  min="0.01"
                  max="1000"
                  step="0.01"
                  placeholder="0.50"
                />
                <span className="absolute right-3 top-2 text-sm text-neutral-500">USDC</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Set competitive pricing based on your hardware capabilities
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-neutral-200">
          <Button
            type="submit"
            loading={loading}
            disabled={!primaryWallet?.address}
            className="w-full sm:w-auto"
            icon={Server}
          >
            {loading ? 'Submitting Offer...' : 'Submit Supply Offer'}
          </Button>
          
          {!primaryWallet?.address && (
            <p className="text-sm text-neutral-500">
              Connect your wallet to submit a supply offer
            </p>
          )}
        </div>
      </form>
    </Card>
  );
}