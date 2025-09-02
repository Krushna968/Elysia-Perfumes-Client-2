import { useState, useEffect } from 'react';
import apiService from '../services/api.js';
import productService from '../services/productService.js';
import paymentService from '../services/paymentService.js';

export const useApiTest = () => {
  const [apiStatus, setApiStatus] = useState({
    isConnected: false,
    testing: true,
    endpoints: {
      health: { status: 'testing', data: null, error: null },
      paymentMethods: { status: 'testing', data: null, error: null },
      categories: { status: 'testing', data: null, error: null },
      products: { status: 'testing', data: null, error: null }
    }
  });

  const testEndpoint = async (name, testFn) => {
    try {
      setApiStatus(prev => ({
        ...prev,
        endpoints: {
          ...prev.endpoints,
          [name]: { status: 'testing', data: null, error: null }
        }
      }));

      const data = await testFn();
      
      setApiStatus(prev => ({
        ...prev,
        endpoints: {
          ...prev.endpoints,
          [name]: { status: 'success', data, error: null }
        }
      }));

      return { success: true, data };
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      
      setApiStatus(prev => ({
        ...prev,
        endpoints: {
          ...prev.endpoints,
          [name]: { status: 'error', data: null, error: errorMessage }
        }
      }));

      return { success: false, error: errorMessage };
    }
  };

  const testApiConnection = async () => {
    setApiStatus(prev => ({ ...prev, testing: true, isConnected: false }));

    // Test health endpoint
    const healthResult = await testEndpoint('health', async () => {
      const response = await fetch('http://localhost:5000/health');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    });

    // Test payment methods
    await testEndpoint('paymentMethods', () => paymentService.getPaymentMethods());

    // Test categories
    await testEndpoint('categories', () => productService.getCategories());

    // Test products (might fail without database)
    await testEndpoint('products', () => productService.getProducts({ limit: 5 }));

    // Determine overall connection status
    const isConnected = healthResult.success;

    setApiStatus(prev => ({
      ...prev,
      testing: false,
      isConnected
    }));

    return isConnected;
  };

  const getConnectionStatus = () => {
    if (apiStatus.testing) return 'Testing...';
    if (apiStatus.isConnected) return 'Connected ✅';
    return 'Disconnected ❌';
  };

  const getEndpointSummary = () => {
    const endpoints = apiStatus.endpoints;
    const total = Object.keys(endpoints).length;
    const successful = Object.values(endpoints).filter(ep => ep.status === 'success').length;
    const failed = Object.values(endpoints).filter(ep => ep.status === 'error').length;
    const testing = Object.values(endpoints).filter(ep => ep.status === 'testing').length;

    return {
      total,
      successful,
      failed,
      testing,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0
    };
  };

  useEffect(() => {
    // Auto-test on mount
    testApiConnection();
  }, []);

  return {
    apiStatus,
    testApiConnection,
    getConnectionStatus,
    getEndpointSummary,
    testEndpoint
  };
};

export default useApiTest;
