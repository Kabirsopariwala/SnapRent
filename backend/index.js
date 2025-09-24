// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const { MongoClient, ObjectId } = require("mongodb");
const Razorpay = require("razorpay");

const app = express();
const port = 5000;

// -------------------
// Middleware
// -------------------
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // ✅ send cookies
  })
);

app.use(bodyParser.json());

app.use(
  session({
    secret: "snaprent-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24h
    },
  })
);

// -------------------
// MongoDB Connection
// -------------------
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("snaprent");
    console.log("Connected to MongoDB ✅");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
connectDB();

// -------------------
// Update lastActive timestamp middleware
// -------------------
app.use(async (req, res, next) => {
  if (req.session.user && req.session.user.role === "user") {
    try {
      await db.collection("users").updateOne(
        { _id: new ObjectId(req.session.user.id) },
        { $set: { lastActive: new Date() } }
      );
    } catch (err) {
      console.error("Failed to update lastActive:", err);
    }
  }
  next();
});

// -------------------
// Traffic Tracking Middleware
// -------------------
// -------------------
// Traffic Tracking Middleware
// -------------------
app.use(async (req, res, next) => {
  try {
    if (req.path.startsWith("/api/admin") || req.path.startsWith("/api/"))
      return next();

    const trafficEntry = {
      path: req.path,
      method: req.method,
      timestamp: new Date(),   // ✅ fixed field name
      userId: req.session.user ? req.session.user.id : null,
      ip: req.ip,
    };

    await db.collection("traffic").insertOne(trafficEntry);
  } catch (err) {
    console.error("Traffic logging failed:", err);
  }
  next();
});


// -------------------
// Razorpay Setup (Test Mode)
// -------------------
const razorpay = new Razorpay({
  key_id: "rzp_test_RKGbaa9R2w58t5",
  key_secret: "2q1rWM7iTBmIJsxat6fi8amr",
});

// -------------------
// Middleware helpers
// -------------------
function isUser(req, res, next) {
  if (req.session.user && req.session.user.role === "user") return next();
  return res.status(403).json({ error: "Access denied. Users only" });
}

function isAdmin(req, res, next) {
  if (req.session.admin && req.session.admin.role === "admin") return next();
  return res.status(403).json({ error: "Access denied. Admins only" });
}

// -------------------
// Auth Routes
// -------------------
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const existing = await db.collection("users").findOne({ email });
  if (existing)
    return res.status(400).json({ error: "Email already registered" });

  const result = await db.collection("users").insertOne({
    name,
    email,
    password,
    cart: [],
    active: true,
    role: "user",
    theme: "Light",
    currency: "INR",
    emailNotifications: false,
    smsNotifications: false,
    
  });

  res.json({ message: "Signup successful", userId: result.insertedId });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password required" });

  const user = await db.collection("users").findOne({ email });
  if (!user) return res.status(400).json({ error: "Email not registered" });

  if (!user.active)
    return res
      .status(403)
      .json({ error: "Your account has been deactivated." });
  if (user.password !== password)
    return res.status(400).json({ error: "Invalid password" });

  req.session.user = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: "user",
  };

  res.json({ message: "Login successful", user: req.session.user });
});

app.post("/api/logout", async (req, res) => {
  if (req.session.user) {
    // Clear lastActive on logout
    await db.collection("users").updateOne(
      { _id: new ObjectId(req.session.user._id) },
      { $set: { lastActive: null } }
    );

    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  } else {
    res.status(400).json({ error: "No active session" });
  }
});

// -------------------
// Products
// -------------------
app.get("/api/products", async (req, res) => {
  try {
    const products = await db.collection("products").find().toArray();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching products" });
  }
});

// -------------------
// Cart
// -------------------
app.post("/api/cart", isUser, async (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart))
    return res.status(400).json({ error: "Cart must be an array" });

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { cart } });

  res.json({ message: "Cart saved" });
});

app.get("/api/cart", isUser, async (req, res) => {
  const user = await db
    .collection("users")
    .findOne({ _id: new ObjectId(req.session.user.id) });
  res.json(user.cart || []);
});

// -------------------
// Orders
// -------------------
app.post("/api/orders", isUser, async (req, res) => {
  const { productId, qty, total, paymentMethod, paymentId } = req.body;
  if (!productId || !qty || !total)
    return res.status(400).json({ error: "Invalid order data" });

  const dbProduct = await db
    .collection("products")
    .findOne({ _id: new ObjectId(productId) });
  if (!dbProduct) return res.status(404).json({ error: "Product not found" });

  const order = {
    product: {
      _id: dbProduct._id,
      name: dbProduct.name,
      image: dbProduct.image,
      price: dbProduct.price,
    },
    qty,
    total,
    date: new Date(),
    status: paymentMethod === "Razorpay" ? "Paid" : "Placed",
    paymentMethod: paymentMethod || "COD",
    paymentId: paymentId || null,
    userId: req.session.user.id,
  };

  const result = await db.collection("orders").insertOne(order);
  res.json({
    message: "Order placed successfully",
    order: { ...order, _id: result.insertedId },
  });
});

app.get("/api/orders", isUser, async (req, res) => {
  try {
    const orders = await db
      .collection("orders")
      .find({ userId: req.session.user.id })
      .sort({ date: -1 })
      .toArray();
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete("/api/orders/:id", isUser, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await db
      .collection("orders")
      .findOne({ _id: new ObjectId(id) });

    if (!order) return res.status(404).json({ error: "Order not found" });
    if (order.userId !== req.session.user.id)
      return res.status(403).json({ error: "You cannot cancel this order" });
    if (order.status === "Delivered")
      return res
        .status(400)
        .json({ error: "Delivered orders cannot be cancelled" });

    await db
      .collection("orders")
      .updateOne({ _id: new ObjectId(id) }, { $set: { status: "Cancelled" } });

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel order" });
  }
});

// -------------------
// Razorpay Order Route
// -------------------
app.post("/api/create-razorpay-order", isUser, async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  if (!amount) return res.status(400).json({ error: "Amount required" });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      payment_capture: 1,
    });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err) {
    console.error("Razorpay order creation error:", err);
    res
      .status(500)
      .json({ error: err.message || "Failed to create Razorpay order" });
  }
});

// -------------------
// Categories
// -------------------
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await db.collection("categories").find().toArray();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// -------------------
// User Preferences, Notifications, Password, Profile, Delete
// -------------------
app.put("/api/users/preferences", isUser, async (req, res) => {
  try {
    const allowedKeys = [
      "theme",
      "showTips",
      "enableSounds",
      "compactView",
      "emailNotifications",
      "smsNotifications",
    ];
    const prefsToUpdate = {};

    for (let key of allowedKeys) {
      if (key in req.body) prefsToUpdate[key] = req.body[key];
    }

    if (Object.keys(prefsToUpdate).length === 0)
      return res.status(400).json({ error: "No valid preferences provided" });

    await db.collection("users").updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: prefsToUpdate }
    );

    res.json({
      message: "Preferences updated successfully",
      preferences: prefsToUpdate,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

app.put("/api/users/notifications", isUser, async (req, res) => {
  try {
    const { emailNotifications, smsNotifications } = req.body;

    if (
      typeof emailNotifications !== "boolean" ||
      typeof smsNotifications !== "boolean"
    ) {
      return res.status(400).json({ error: "Invalid notification values" });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { emailNotifications, smsNotifications } }
    );

    res.json({
      message: "Notifications updated successfully",
      preferences: { emailNotifications, smsNotifications },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update notifications" });
  }
});

app.put("/api/users/password", isUser, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old and new password required" });
    }

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.session.user.id) });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.password !== oldPassword) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    await db.collection("users").updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { password: newPassword } }
    );

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update password" });
  }
});

app.put("/api/users/profile", isUser, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email)
      return res.status(400).json({ error: "Name and email required" });

    const existing = await db
      .collection("users")
      .findOne({
        email,
        _id: { $ne: new ObjectId(req.session.user.id) },
      });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    await db.collection("users").updateOne(
      { _id: new ObjectId(req.session.user.id) },
      { $set: { name, email } }
    );

    req.session.user.name = name;
    req.session.user.email = email;

    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

app.delete("/api/users/delete", isUser, async (req, res) => {
  try {
    await db
      .collection("users")
      .deleteOne({ _id: new ObjectId(req.session.user.id) });

    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Failed to delete session" });
      res.json({ message: "Account deleted successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete account" });
  }
});

// -------------------
// Admin Auth
// -------------------
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await db.collection("users").findOne({ email, role: "admin" });
  if (!admin) return res.status(400).json({ error: "Admin not found" });
  if (admin.password !== password)
    return res.status(400).json({ error: "Invalid password" });

  req.session.admin = {
    id: admin._id.toString(),
    email: admin.email,
    name: admin.name,
    role: "admin",
  };
  res.json({ message: "Admin login successful", user: req.session.admin });
});

app.get("/api/admin/me", (req, res) => {
  if (req.session.admin) return res.json({ user: req.session.admin });
  res.status(401).json({ error: "Not logged in" });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.admin = null;
  res.json({ message: "Admin logged out" });
});

// -------------------
// Admin Dashboard
// -------------------
app.get("/api/admin/stats", isAdmin, async (req, res) => {
  try {
    const totalProducts = await db
      .collection("products")
      .countDocuments({ deleted: { $ne: true } });
    const totalUsers = await db
      .collection("users")
      .countDocuments({ role: "user" });
    const totalCategories = await db.collection("categories").countDocuments();
    const totalOrders = await db.collection("orders").countDocuments();

    res.json({
      totalProducts,
      totalUsers,
      totalCategories,
      totalOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Products CRUD
app.get("/api/admin/products", isAdmin, async (req, res) => {
  const products = await db.collection("products").find({}).toArray();
  res.json(products);
});

// POST product
app.post("/api/admin/products", isAdmin, async (req, res) => {
  const { name, price, image, category, location } = req.body;
  if (!name || !price || !category)
    return res.status(400).json({ error: "All fields required" });

  const result = await db.collection("products").insertOne({
    name,
    price,
    image: image || "",
    category,
    location: location || "", // ✅ new field
    deleted: false,
    createdAt: new Date(),
  });

  res.json({
    message: "Product added",
    product: { _id: result.insertedId, name, price, category, location },
  });
});

// PUT product
app.put("/api/admin/products/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, image, category, location } = req.body;

  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    { $set: { name, price, image, category, location } } // ✅ include location
  );

  res.json({ message: "Product updated" });
});


app.delete("/api/admin/products/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });

  res.json({ message: "Product deleted permanently" });
});


// Users Management
app.get("/api/admin/users", isAdmin, async (req, res) => {
  const users = await db
    .collection("users")
    .find({ role: "user" })
    .project({ password: 0 })
    .toArray();
  res.json(users);
});

app.put("/api/admin/users/:id/status", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { active } = req.body;

  await db
    .collection("users")
    .updateOne({ _id: new ObjectId(id), role: "user" }, { $set: { active } });
  res.json({ message: `User ${active ? "activated" : "deactivated"}` });
});

// Categories CRUD
app.get("/api/admin/categories", isAdmin, async (req, res) => {
  const categories = await db.collection("categories").find({}).toArray();
  res.json(categories);
});

app.post("/api/admin/categories", isAdmin, async (req, res) => {
  const { name } = req.body;
  const result = await db.collection("categories").insertOne({ name });
  res.json({
    message: "Category added",
    category: { _id: result.insertedId, name },
  });
});

app.put("/api/admin/categories/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  await db
    .collection("categories")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name } });
  res.json({ message: "Category updated" });
});

app.delete("/api/admin/categories/:id", isAdmin, async (req, res) => {
  const { id } = req.params;
  await db.collection("categories").deleteOne({ _id: new ObjectId(id) });
  res.json({ message: "Category deleted" });
});

// Orders
app.get("/api/admin/orders", isAdmin, async (req, res) => {
  try {
    const orders = await db.collection("orders").find({}).toArray();

    // Fetch user names
    const userIds = orders.map(order => new ObjectId(order.userId));
    const users = await db
      .collection("users")
      .find({ _id: { $in: userIds } })
      .project({ name: 1 })
      .toArray();

    const usersMap = {};
    users.forEach(user => {
      usersMap[user._id.toString()] = user.name;
    });

    const ordersWithUserName = orders.map(order => ({
      ...order,
      userName: usersMap[order.userId] || "Unknown",
    }));

    res.json(ordersWithUserName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

app.delete("/api/admin/orders/:id", isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.status === "Delivered") {
      return res.status(400).json({ error: "Delivered orders cannot be deleted" });
    }

    await db.collection("orders").deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "Order removed completely" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete order" });
  }
});


// Update order status
app.put("/api/admin/orders/:id/status", isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});


// Traffic logs
app.get("/api/admin/stats/product-orders", isAdmin, async (req, res) => {
  const pipeline = [
    { $match: {} }, // add date filters if needed
    { $group: {
        _id: "$product.name",
        totalOrders: { $sum: "$qty" },
        timestamps: { $push: "$date" }
    }},
    { $sort: { totalOrders: -1 } }
  ];
  const result = await db.collection("orders").aggregate(pipeline).toArray();
  res.json(result);
});

// Daily traffic (last 7 days)
app.get("/api/admin/traffic", isAdmin, async (req, res) => {
  try {
    const data = await db.collection("traffic").aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          visits: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 7 }
    ]).toArray();

    res.json(data.map(d => ({ day: d._id, visits: d.visits })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch daily traffic" });
  }
});

// Hourly traffic (today)
app.get("/api/admin/traffic/hourly", isAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const data = await db.collection("traffic").aggregate([
      { $match: { timestamp: { $gte: today } } },
      {
        $group: {
          _id: { $hour: "$timestamp" },
          visits: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    res.json(data.map(d => ({ hour: d._id, visits: d.visits })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch hourly traffic" });
  }
});


// -------------------
// Server
// -------------------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
