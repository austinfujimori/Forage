const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helpers/error-handler")

// require("dotenv/config")
const dotenv = require("dotenv");
dotenv.config();

mongoose.set("strictQuery", false);

const api = process.env.API_URL;

//import routers
const partiesRouter = require("./routers/parties");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const pastOrdersRouter = require("./routers/pastOrders")
const pastPartiesRouter = require("./routers/pastParties")
const authJwt = require("./helpers/jwt");
const paypalRoutes = require('./routers/paypal');


//Middleware
//replace body parser with express.json()
// app.use(cors());
app.use(cors({
  origin: "*"
}));
app.options("*", cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use(errorHandler)
// app.use("/public/uploads", express.static(__dirname + "/public/uploads"))





//Routers
app.use(`${api}/parties`, partiesRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/pastOrders`, pastOrdersRouter);
app.use(`${api}/pastParties`, pastPartiesRouter);
app.use(`${api}/paypal`, paypalRoutes);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB connection ready");
  })
  .catch((err) => {
    console.log(err);
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});

// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running on port ${PORT}`);
// });
