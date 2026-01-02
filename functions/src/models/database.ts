import type { User, Product, Category, Order, CreateUserDto, CreateProductDto, CreateCategoryDto, CreateOrderDto } from './types';
import bcrypt from 'bcryptjs';

// In-memory database (replace with actual database in production)
class Database {
  private users: User[] = [];
  private products: Product[] = [];
  private categories: Category[] = [];
  private orders: Order[] = [];
  private orderItems: Array<Order['items'][0] & { id: number }> = [];

  private userIdCounter = 1;
  private productIdCounter = 1;
  private categoryIdCounter = 1;
  private orderIdCounter = 1;
  private orderItemIdCounter = 1;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Create default admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    this.users.push({
      id: this.userIdCounter++,
      email: 'admin@almawrid.com',
      password: hashedPassword,
      fullName: 'Admin User',
      role: 'ADMIN',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create default categories
    const defaultCategories = [
      { name: 'Cardiovascular', description: 'Heart and cardiovascular health medications' },
      { name: 'Antibiotics', description: 'Antibacterial medications' },
      { name: 'Pain Relief', description: 'Analgesics and anti-inflammatory medications' },
      { name: 'Vitamins', description: 'Nutritional supplements and vitamins' },
      { name: 'Diabetes', description: 'Diabetes management medications' },
      { name: 'Respiratory', description: 'Respiratory system medications' },
    ];

    defaultCategories.forEach(cat => {
      this.categories.push({
        id: this.categoryIdCounter++,
        ...cat,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    // Create sample products
    const sampleProducts = [
      {
        name: 'Aspirin 100mg',
        description: 'Anti-inflammatory and pain relief medication',
        price: 25.99,
        stockQuantity: 500,
        brand: 'AL-MAWRID',
        categoryId: 3, // Pain Relief
        images: ['/products/aspirin.jpg'],
      },
      {
        name: 'Metformin 500mg',
        description: 'Type 2 diabetes management medication',
        price: 45.50,
        stockQuantity: 300,
        brand: 'AL-MAWRID',
        categoryId: 5, // Diabetes
        images: ['/products/metformin.jpg'],
      },
      {
        name: 'Vitamin D3 1000 IU',
        description: 'Essential vitamin D supplement',
        price: 35.00,
        stockQuantity: 800,
        brand: 'AL-MAWRID',
        categoryId: 4, // Vitamins
        images: ['/products/vitamin-d.jpg'],
      },
    ];

    sampleProducts.forEach(prod => {
      this.products.push({
        id: this.productIdCounter++,
        ...prod,
        ratingAvg: 4.5,
        enabled: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  }

  // User methods
  async createUser(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user: User = {
      id: this.userIdCounter++,
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      fullName: dto.fullName,
      role: dto.role || 'USER',
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return [...this.users];
  }

  updateUser(id: number, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.users[index];
  }

  // Product methods
  createProduct(dto: CreateProductDto): Product {
    const product: Product = {
      id: this.productIdCounter++,
      ...dto,
      ratingAvg: 0,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.products.push(product);
    return product;
  }

  findProductById(id: number): Product | undefined {
    return this.products.find(p => p.id === id && p.enabled);
  }

  getAllProducts(): Product[] {
    return this.products.filter(p => p.enabled);
  }

  updateProduct(id: number, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.products[index];
  }

  deleteProduct(id: number): boolean {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.products[index].enabled = false;
    this.products[index].updatedAt = new Date();
    return true;
  }

  // Category methods
  createCategory(dto: CreateCategoryDto): Category {
    const category: Category = {
      id: this.categoryIdCounter++,
      ...dto,
      enabled: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.categories.push(category);
    return category;
  }

  findCategoryById(id: number): Category | undefined {
    return this.categories.find(c => c.id === id && c.enabled);
  }

  getAllCategories(): Category[] {
    return this.categories.filter(c => c.enabled);
  }

  updateCategory(id: number, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return null;
    this.categories[index] = {
      ...this.categories[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.categories[index];
  }

  deleteCategory(id: number): boolean {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.categories[index].enabled = false;
    this.categories[index].updatedAt = new Date();
    return true;
  }

  // Order methods
  createOrder(userId: number, dto: CreateOrderDto): Order {
    const orderId = this.orderIdCounter++;
    const items: Order['items'] = [];

    let totalAmount = 0;

    for (const item of dto.items) {
      const product = this.findProductById(item.productId);
      if (!product) continue;

      const price = product.discount 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      const total = price * item.quantity;
      totalAmount += total;

      const orderItem: Order['items'][0] & { id: number } = {
        id: this.orderItemIdCounter++,
        orderId,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price,
        total,
      };

      this.orderItems.push(orderItem);
      items.push({
        id: orderItem.id,
        orderId: orderItem.orderId,
        productId: orderItem.productId,
        productName: orderItem.productName,
        quantity: orderItem.quantity,
        price: orderItem.price,
        total: orderItem.total,
      });

      // Update stock
      product.stockQuantity -= item.quantity;
    }

    const order: Order = {
      id: orderId,
      userId,
      status: 'PENDING',
      totalAmount,
      shippingAddress: dto.shippingAddress,
      shippingCity: dto.shippingCity,
      shippingState: dto.shippingState,
      shippingZipCode: dto.shippingZipCode,
      shippingCountry: dto.shippingCountry,
      createdAt: new Date(),
      updatedAt: new Date(),
      items,
    };

    this.orders.push(order);
    return order;
  }

  findOrderById(id: number): Order | undefined {
    const order = this.orders.find(o => o.id === id);
    if (!order) return undefined;
    order.items = this.orderItems.filter(item => item.orderId === id);
    return order;
  }

  findOrdersByUserId(userId: number): Order[] {
    return this.orders
      .filter(o => o.userId === userId)
      .map(order => ({
        ...order,
        items: this.orderItems.filter(item => item.orderId === order.id),
      }));
  }

  getAllOrders(): Order[] {
    return this.orders.map(order => ({
      ...order,
      items: this.orderItems.filter(item => item.orderId === order.id),
    }));
  }

  updateOrder(id: number, updates: Partial<Order>): Order | null {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.orders[index] = {
      ...this.orders[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.orders[index];
  }

  // Dashboard stats
  getDashboardStats() {
    const allOrders = this.getAllOrders();
    return {
      totalUsers: this.users.length,
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      pendingOrders: allOrders.filter(o => o.status === 'PENDING').length,
      processingOrders: allOrders.filter(o => o.status === 'PROCESSING').length,
      shippedOrders: allOrders.filter(o => o.status === 'SHIPPED').length,
      deliveredOrders: allOrders.filter(o => o.status === 'DELIVERED').length,
    };
  }

  getMonthlyRevenue() {
    const allOrders = this.getAllOrders();
    const revenueByMonth: Record<string, number> = {};

    allOrders.forEach(order => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM
      revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalAmount;
    });

    return Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12); // Last 12 months
  }

  getTopProducts(limit: number = 10) {
    const allOrders = this.getAllOrders();
    const productSales: Record<number, { productId: number; productName: string; totalSales: number; totalRevenue: number }> = {};

    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            productId: item.productId,
            productName: item.productName,
            totalSales: 0,
            totalRevenue: 0,
          };
        }
        productSales[item.productId].totalSales += item.quantity;
        productSales[item.productId].totalRevenue += item.total;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  getOrderStatusCounts() {
    const allOrders = this.getAllOrders();
    const statusCounts: Record<string, number> = {};

    allOrders.forEach(order => {
      statusCounts[order.status] = (statusCounts[order.status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count,
    }));
  }

  getLowStockProducts(threshold: number = 50) {
    return this.products
      .filter(p => p.enabled && p.stockQuantity <= threshold)
      .map(p => ({
        id: p.id,
        name: p.name,
        stockQuantity: p.stockQuantity,
        threshold,
      }));
  }
}

// Export singleton instance
export const db = new Database();

