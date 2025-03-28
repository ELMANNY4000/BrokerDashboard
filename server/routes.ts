import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTransactionSchema, insertEmailNotificationSchema } from "@shared/schema";
import { ZodError } from "zod";
import nodemailer from "nodemailer";

// Configure a test nodemailer transporter (for development only)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "ethereal.user@ethereal.email",
    pass: process.env.SMTP_PASS || "ethereal_pass"
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API Routes - Prefix all routes with /api
  
  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // For simplicity, admin login is hardcoded
      // In a real app, this would check against a database
      if (username === "admin" && password === "admin123") {
        return res.status(200).json({
          id: 0,
          username: "admin",
          name: "John Doe",
          role: "admin"
        });
      }
      
      // Check if it's a regular user
      const user = await storage.getUserByUsername(username);
      
      if (user && user.password === password) {
        return res.status(200).json({
          id: user.id,
          username: user.username,
          name: user.fullName,
          role: "user"
        });
      }
      
      return res.status(401).json({ message: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error during login" });
    }
  });
  
  // User routes
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      const existingEmail = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      return res.status(201).json(newUser);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Failed to create user" });
    }
  });
  
  // Transaction routes
  app.get("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactions = await storage.getAllTransactions();
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });
  
  app.get("/api/users/:id/transactions", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const transactions = await storage.getTransactionsByUserId(userId);
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return res.status(500).json({ message: "Failed to fetch user transactions" });
    }
  });
  
  app.post("/api/transactions", async (req: Request, res: Response) => {
    try {
      const transactionData = insertTransactionSchema.parse(req.body);
      
      // Verify user exists
      const user = await storage.getUser(transactionData.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Create the transaction
      const newTransaction = await storage.createTransaction(transactionData);
      
      // Update user balance
      const currentBalance = parseFloat(user.balance);
      const transactionAmount = parseFloat(transactionData.amount);
      const newBalance = currentBalance + transactionAmount;
      
      await storage.updateUserBalance(user.id, newBalance);
      
      // Send email notification if requested
      if (req.body.sendEmail) {
        try {
          await transporter.sendMail({
            from: '"Broker Admin" <admin@brokerapp.com>',
            to: user.email,
            subject: transactionData.type === "deposit" ? 
              "Funds Added to Your Account" : 
              `Transaction: ${transactionData.type}`,
            html: `
              <h2>Transaction Notification</h2>
              <p>Dear ${user.fullName},</p>
              <p>A ${transactionData.type} of $${Math.abs(transactionAmount).toFixed(2)} has been ${
                transactionData.type === "deposit" ? "added to" : "processed on"
              } your account.</p>
              <p>Current balance: $${newBalance.toFixed(2)}</p>
              <p>Transaction notes: ${transactionData.notes || "N/A"}</p>
              <p>Thank you for using our brokerage services.</p>
            `
          });
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Continue with the transaction even if email fails
        }
      }
      
      return res.status(201).json(newTransaction);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid transaction data", errors: error.errors });
      }
      
      console.error("Error creating transaction:", error);
      return res.status(500).json({ message: "Failed to create transaction" });
    }
  });
  
  // Email notification routes
  app.get("/api/email-notifications", async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getEmailNotifications();
      return res.status(200).json(notifications);
    } catch (error) {
      console.error("Error fetching email notifications:", error);
      return res.status(500).json({ message: "Failed to fetch email notifications" });
    }
  });
  
  app.post("/api/email-notifications", async (req: Request, res: Response) => {
    try {
      const notificationData = insertEmailNotificationSchema.parse(req.body);
      
      // Create the email notification record
      const newNotification = await storage.createEmailNotification(notificationData);
      
      // Send the actual emails
      try {
        let recipients: string[] = [];
        
        if (notificationData.recipientType === "custom" && notificationData.recipientIds) {
          // Send to specific users
          const userIds = notificationData.recipientIds.split(",").map(id => parseInt(id.trim()));
          const users = await Promise.all(userIds.map(id => storage.getUser(id)));
          recipients = users.filter(user => user !== undefined).map(user => user!.email);
        } else {
          // Send to all users or filtered by status
          const allUsers = await storage.getAllUsers();
          const filteredUsers = allUsers.filter(user => {
            if (notificationData.recipientType === "active") return user.status === "active";
            if (notificationData.recipientType === "inactive") return user.status === "inactive";
            return true; // "all" type
          });
          recipients = filteredUsers.map(user => user.email);
        }
        
        // Don't actually send emails in development mode
        console.log(`Would send email "${notificationData.subject}" to ${recipients.length} recipients`);
        
        // In a real app, you would send actual emails to each recipient
        /*
        for (const recipient of recipients) {
          await transporter.sendMail({
            from: '"Broker Admin" <admin@brokerapp.com>',
            to: recipient,
            subject: notificationData.subject,
            html: notificationData.content
          });
        }
        */
        
        return res.status(201).json(newNotification);
      } catch (emailError) {
        console.error("Failed to send emails:", emailError);
        return res.status(500).json({ message: "Failed to send emails" });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Invalid notification data", errors: error.errors });
      }
      
      console.error("Error creating email notification:", error);
      return res.status(500).json({ message: "Failed to create email notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
