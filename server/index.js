require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use("/auth", require("./routes/authRoutes"));
app.use("/advertisers", require("./routes/advertiserRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/tags", require("./routes/tagRoutes"));
app.use("/tourguides", require("./routes/tourguideRoutes"));
app.use("/itineraries", require("./routes/itineraryRoutes"));
app.use("/categories", require("./routes/categoryRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/activities", require("./routes/activityRoutes"));
app.use("/sellers", require("./routes/sellerRoutes"));
app.use("/places", require("./routes/placeRoutes"));
app.use("/tourists", require("./routes/touristRoutes"));
app.use("/tourism-governors", require("./routes/tourismGovernorRoutes"));
app.use("/profile", require("./routes/profileRoutes"));
app.use("/admins", require("./routes/adminRoutes"));
app.use("/bookings", require("./routes/bookingRoutes"));
app.use("/hotels", require("./routes/hotelRoutes"));
app.use("/reviews", require("./routes/reviewRoutes"));
app.use("/complaints", require("./routes/complaintRoutes"));
app.use("/flights", require("./routes/flightRoutes"));
app.use("/transportations", require("./routes/transportationRoutes"));
// app.use("/users", require("./routes/userRoutes"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
