import React from 'react';
import ApiStatus from '../components/ApiStatus.jsx';

const ApiTestPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Connection Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This page tests the connection between the React frontend and the Node.js backend. 
            Make sure your backend server is running on port 5000 for all endpoints to work properly.
          </p>
        </div>

        <div className="space-y-8">
          {/* API Status Component */}
          <ApiStatus className="mx-auto max-w-2xl" />

          {/* Instructions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              🚀 Getting Started
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</span>
                <div>
                  <strong>Start your backend:</strong> Navigate to your backend directory and run <code className="bg-gray-100 px-2 py-1 rounded text-sm">npm run dev</code>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</span>
                <div>
                  <strong>Check connection:</strong> The component above will automatically test your API endpoints
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</span>
                <div>
                  <strong>Debug issues:</strong> If endpoints fail, check your server logs and ensure MongoDB is configured
                </div>
              </div>
            </div>
          </div>

          {/* Backend Endpoints Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              📋 Available Endpoints
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="font-medium text-green-800">Authentication</div>
                <div className="text-green-600 mt-1">
                  • Login/Register<br />
                  • Admin Auth<br />
                  • Password Reset
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <div className="font-medium text-blue-800">Products</div>
                <div className="text-blue-600 mt-1">
                  • Product CRUD<br />
                  • Categories<br />
                  • Search & Filter
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded p-3">
                <div className="font-medium text-purple-800">Payments</div>
                <div className="text-purple-600 mt-1">
                  • Payment Methods<br />
                  • Order Processing<br />
                  • COD Support
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3">
                <div className="font-medium text-orange-800">Admin</div>
                <div className="text-orange-600 mt-1">
                  • Order Management<br />
                  • Analytics<br />
                  • User Management
                </div>
              </div>
            </div>
          </div>

          {/* Tech Stack Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⚡ Tech Stack
            </h2>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Frontend</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• React 18</li>
                  <li>• Redux Toolkit</li>
                  <li>• React Router</li>
                  <li>• Tailwind CSS</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Backend</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Node.js & Express</li>
                  <li>• MongoDB & Mongoose</li>
                  <li>• JWT Authentication</li>
                  <li>• Bcrypt Security</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTestPage;
