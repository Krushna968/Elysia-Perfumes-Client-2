import apiService from './api.js';

export class AuthService {
  // User registration
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register', userData);
      
      if (response.success && response.token) {
        apiService.setToken(response.token);
        return response;
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // User login
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', credentials);
      
      if (response.success && response.token) {
        apiService.setToken(response.token);
        return response;
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Admin login
  async adminLogin(credentials) {
    try {
      const response = await apiService.post('/auth/admin/login', credentials);
      
      if (response.success && response.token) {
        apiService.setToken(response.token);
        return response;
      }
      
      throw new Error(response.message || 'Admin login failed');
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  }

  // User logout
  async logout() {
    try {
      await apiService.post('/auth/logout');
      apiService.removeToken();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Even if the API call fails, remove the token locally
      apiService.removeToken();
      console.error('Logout error:', error);
      return { success: true, message: 'Logged out successfully' };
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await apiService.get('/auth/me');
      return response;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, remove it
      if (error.status === 401) {
        apiService.removeToken();
      }
      throw error;
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await apiService.put('/auth/profile', profileData);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiService.put('/auth/password', passwordData);
      
      if (response.success && response.token) {
        apiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.put(`/auth/reset-password/${token}`, {
        password: newPassword,
        confirmPassword: newPassword
      });
      
      if (response.success && response.token) {
        apiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!apiService.getToken();
  }

  // Get stored user token
  getToken() {
    return apiService.getToken();
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await apiService.get(`/auth/verify-email/${token}`);
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Resend email verification
  async resendEmailVerification() {
    try {
      const response = await apiService.post('/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Resend email verification error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
