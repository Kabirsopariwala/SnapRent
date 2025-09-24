// seedProducts.js
const { MongoClient } = require("mongodb");

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const products = [
  { name: "Canon DSLR Camera", image: "videoeqp.jpeg", category: "Photography", price: 499, location: "Mumbai" },
  { name: "GoPro Hero 11", image: "audioeqp.jpeg", category: "Video", price: 699, location: "Delhi" },
  { name: "DJI Drone Mini 4", image: "videoeqp.jpeg", category: "Video", price: 899, location: "Bangalore" },
  { name: "Tripod Stand", image: "officeeqp.jpeg", category: "Office", price: 199, location: "Pune" },
  { name: "Boom Mic Stand", image: "audioeqp.jpeg", category: "Audio", price: 149, location: "Hyderabad" },
];

async function seed() {
  await client.connect();
  const db = client.db("snaprent");
  await db.collection("products").deleteMany({});
  await db.collection("products").insertMany(products);
  console.log("Products seeded ✅");
  client.close();
}

seed();
