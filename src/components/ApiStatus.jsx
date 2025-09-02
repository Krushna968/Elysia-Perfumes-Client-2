import React from 'react';
import useApiTest from '../hooks/useApiTest.js';

const ApiStatus = ({ className = "" }) => {
  const { apiStatus, testApiConnection, getConnectionStatus, getEndpointSummary } = useApiTest();
  const summary = getEndpointSummary();

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '🔄';
      default: return '⚪';
    }
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Backend API Status</h3>
        <button
          onClick={testApiConnection}
          disabled={apiStatus.testing}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {apiStatus.testing ? 'Testing...' : 'Retest'}
        </button>
      </div>

      {/* Overall Status */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">Connection Status:</span>
          <span className={`font-semibold ${apiStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
            {getConnectionStatus()}
          </span>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          {summary.successful}/{summary.total} endpoints working ({summary.successRate}%)
        </div>
      </div>

      {/* Endpoint Details */}
      <div className="space-y-2">
        <h4 className="font-medium text-gray-700 mb-2">Endpoint Status:</h4>
        
        {Object.entries(apiStatus.endpoints).map(([name, endpoint]) => (
          <div key={name} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getStatusIcon(endpoint.status)}</span>
              <span className="font-medium text-gray-700 capitalize">
                {name.replace(/([A-Z])/g, ' $1')}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${getStatusColor(endpoint.status)}`}>
                {endpoint.status}
              </span>
              {endpoint.error && (
                <div className="text-xs text-red-500 max-w-xs truncate">
                  {endpoint.error}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* API URL Display */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <strong>API URL:</strong> http://localhost:5000/api
        </div>
        <div className="text-xs text-gray-500 mt-1">
          <strong>Health Check:</strong> http://localhost:5000/health
        </div>
      </div>

      {/* Success Message */}
      {apiStatus.isConnected && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          🎉 Backend is connected! Your frontend can now communicate with the API.
        </div>
      )}

      {/* Error Message */}
      {!apiStatus.testing && !apiStatus.isConnected && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          ⚠️ Backend is not responding. Please make sure your server is running on port 5000.
        </div>
      )}
    </div>
  );
};

export default ApiStatus;
