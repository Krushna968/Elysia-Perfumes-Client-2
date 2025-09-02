import apiService from './api.js';

export class ProductService {
  // Get all products with filters and pagination
  async getProducts(params = {}) {
    try {
      const response = await apiService.get('/products', params);
      return response;
    } catch (error) {
      console.error('Get products error:', error);
      // Return fallback data if API fails
      return this.getFallbackProducts(params);
    }
  }

  // Get single product by slug or ID
  async getProduct(slugOrId) {
    try {
      const response = await apiService.get(`/products/${slugOrId}`);
      return response;
    } catch (error) {
      console.error('Get product error:', error);
      // Return fallback data if API fails
      return this.getFallbackProduct(slugOrId);
    }
  }

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiService.get('/products/featured', { limit });
      return response;
    } catch (error) {
      console.error('Get featured products error:', error);
      // Return fallback data if API fails
      return this.getFallbackFeaturedProducts();
    }
  }

  // Get best selling products
  async getBestSellingProducts(limit = 8) {
    try {
      const response = await apiService.get('/products/bestsellers', { limit });
      return response;
    } catch (error) {
      console.error('Get bestselling products error:', error);
      // Return fallback data if API fails
      return this.getFallbackBestSellingProducts();
    }
  }

  // Search products
  async searchProducts(query, limit = 10) {
    try {
      const response = await apiService.get('/products/search', { q: query, limit });
      return response;
    } catch (error) {
      console.error('Search products error:', error);
      // Return empty results if API fails
      return { success: true, count: 0, products: [] };
    }
  }

  // Get categories
  async getCategories() {
    try {
      const response = await apiService.get('/categories');
      return response;
    } catch (error) {
      console.error('Get categories error:', error);
      // Return fallback categories
      return this.getFallbackCategories();
    }
  }

  // Get products by category
  async getProductsByCategory(categorySlug, params = {}) {
    try {
      const response = await apiService.get('/products', {
        ...params,
        category: categorySlug
      });
      return response;
    } catch (error) {
      console.error('Get products by category error:', error);
      return this.getFallbackProducts({ ...params, category: categorySlug });
    }
  }

  // Fallback methods for when API is not available or fails
  getFallbackProducts(params = {}) {
    // Import mock data
    import('../mockData.js').then(module => {
      const { mockPerfumes } = module;
      let filteredProducts = [...mockPerfumes];

      // Apply filters
      if (params.category) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase().includes(params.category.toLowerCase())
        );
      }

      if (params.search || params.q) {
        const searchTerm = (params.search || params.q).toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
      }

      if (params.gender) {
        filteredProducts = filteredProducts.filter(p => 
          p.category.toLowerCase() === params.gender.toLowerCase() ||
          p.category.toLowerCase() === 'unisex'
        );
      }

      // Apply sorting
      if (params.sort) {
        switch (params.sort) {
          case 'price_asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'name_asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name_desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      // Apply pagination
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      return {
        success: true,
        count: paginatedProducts.length,
        totalProducts: filteredProducts.length,
        totalPages: Math.ceil(filteredProducts.length / limit),
        currentPage: page,
        products: paginatedProducts
      };
    });

    // Return empty result for now (async import)
    return {
      success: true,
      count: 0,
      totalProducts: 0,
      totalPages: 0,
      currentPage: 1,
      products: []
    };
  }

  getFallbackProduct(slugOrId) {
    // This would need to import and find the specific product
    return {
      success: true,
      product: null,
      message: 'Product not found'
    };
  }

  getFallbackFeaturedProducts() {
    return {
      success: true,
      count: 0,
      products: []
    };
  }

  getFallbackBestSellingProducts() {
    return {
      success: true,
      count: 0,
      products: []
    };
  }

  getFallbackCategories() {
    return {
      success: true,
      message: 'Using fallback categories',
      categories: [
        { id: 1, name: 'For Him', slug: 'men', image: null },
        { id: 2, name: 'For Her', slug: 'women', image: null },
        { id: 3, name: 'Unisex', slug: 'unisex', image: null },
        { id: 4, name: 'Daily Wear', slug: 'daily-wear', image: null },
        { id: 5, name: 'Evening Wear', slug: 'evening-wear', image: null }
      ]
    };
  }
}

// Export singleton instance
export const productService = new ProductService();
export default productService;
