import { users, type User, type InsertUser, transactions, type Transaction, type InsertTransaction, emailNotifications, type EmailNotification, type InsertEmailNotification } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserBalance(userId: number, newBalance: number): Promise<User | undefined>;
  
  // Transaction methods
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  getAllTransactions(): Promise<Transaction[]>;
  
  // Email notifications methods
  createEmailNotification(notification: InsertEmailNotification): Promise<EmailNotification>;
  getEmailNotifications(): Promise<EmailNotification[]>;
}

export class MemStorage implements IStorage {
  private usersStore: Map<number, User>;
  private transactionsStore: Map<number, Transaction>;
  private emailsStore: Map<number, EmailNotification>;
  private userIdCounter: number;
  private transactionIdCounter: number;
  private emailIdCounter: number;

  constructor() {
    this.usersStore = new Map();
    this.transactionsStore = new Map();
    this.emailsStore = new Map();
    this.userIdCounter = 1;
    this.transactionIdCounter = 1;
    this.emailIdCounter = 1;
    
    // Add some initial data
    this.seedInitialData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersStore.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersStore.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      balance: "0", 
      status: "active", 
      createdAt: now 
    };
    this.usersStore.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.usersStore.values());
  }
  
  async updateUserBalance(userId: number, newBalance: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user, 
      balance: newBalance.toString() 
    };
    this.usersStore.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Transaction methods
  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      createdAt: now,
      notes: insertTransaction.notes || null 
    };
    this.transactionsStore.set(id, transaction);
    return transaction;
  }
  
  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactionsStore.values())
      .filter(transaction => transaction.userId === userId);
  }
  
  async getAllTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactionsStore.values());
  }
  
  // Email notifications methods
  async createEmailNotification(insertNotification: InsertEmailNotification): Promise<EmailNotification> {
    const id = this.emailIdCounter++;
    const now = new Date();
    const notification: EmailNotification = { 
      ...insertNotification, 
      id, 
      sentAt: now,
      recipientIds: insertNotification.recipientIds || null,
      openRate: 0 
    };
    this.emailsStore.set(id, notification);
    return notification;
  }
  
  async getEmailNotifications(): Promise<EmailNotification[]> {
    return Array.from(this.emailsStore.values());
  }
  
  // Seed initial data for demonstration
  private seedInitialData() {
    // Add sample users
    const users = [
      { username: 'john_smith', password: 'password', email: 'john.smith@example.com', fullName: 'John Smith', balance: "12456.00", status: "active", createdAt: new Date(2023, 5, 15) },
      { username: 'emma_watson', password: 'password', email: 'emma.watson@example.com', fullName: 'Emma Watson', balance: "1850.00", status: "active", createdAt: new Date(2023, 5, 16) },
      { username: 'robert_johnson', password: 'password', email: 'robert.j@example.com', fullName: 'Robert Johnson', balance: "3720.50", status: "pending", createdAt: new Date(2023, 5, 17) },
      { username: 'mary_parker', password: 'password', email: 'mary.p@example.com', fullName: 'Mary Parker', balance: "8125.75", status: "inactive", createdAt: new Date(2023, 5, 19) },
      { username: 'tom_wilson', password: 'password', email: 'tom.wilson@example.com', fullName: 'Tom Wilson', balance: "5750.25", status: "active", createdAt: new Date(2023, 5, 20) }
    ];
    
    users.forEach(user => {
      const id = this.userIdCounter++;
      this.usersStore.set(id, { ...user, id });
    });
    
    // Add sample transactions
    const transactions = [
      { userId: 1, amount: "2500.00", type: "deposit", status: "completed", notes: "Initial deposit", createdAt: new Date(2023, 5, 19, 14, 32, 45) },
      { userId: 2, amount: "-750.00", type: "withdrawal", status: "completed", notes: "", createdAt: new Date(2023, 5, 19, 12, 15, 22) },
      { userId: 3, amount: "1200.00", type: "deposit", status: "pending", notes: "", createdAt: new Date(2023, 5, 18, 18, 45, 10) },
      { userId: 4, amount: "3500.00", type: "deposit", status: "completed", notes: "Bonus payment", createdAt: new Date(2023, 5, 18, 10, 12, 33) },
      { userId: 5, amount: "-1800.00", type: "withdrawal", status: "failed", notes: "Insufficient funds", createdAt: new Date(2023, 5, 17, 16, 50, 27) }
    ];
    
    transactions.forEach(transaction => {
      const id = this.transactionIdCounter++;
      this.transactionsStore.set(id, { ...transaction, id });
    });
    
    // Add sample email notifications
    const emails = [
      { subject: "Welcome to our broker platform", content: "Welcome email content...", recipientType: "all", recipientIds: null, sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), openRate: 87 },
      { subject: "Important Security Update", content: "Security update content...", recipientType: "all", recipientIds: null, sentAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), openRate: 92 },
      { subject: "Funds Added Notification", content: "Your funds have been added...", recipientType: "custom", recipientIds: "4", sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), openRate: 100 },
      { subject: "New Feature Announcement", content: "We've added new features...", recipientType: "active", recipientIds: null, sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), openRate: 78 }
    ];
    
    emails.forEach(email => {
      const id = this.emailIdCounter++;
      this.emailsStore.set(id, { ...email, id });
    });
  }
}

export const storage = new MemStorage();
