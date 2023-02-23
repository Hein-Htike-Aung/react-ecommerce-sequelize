import "dotenv/config";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import CategoryRouter from "./api/v1/products/routes/category.routes";
import ProductRouter from "./api/v1/products/routes/product.routes";
import AuthRouter from "./api/v1/auth/routes/auth.routes";
import SubscriberRouter from "./api/v1/new_letter/routes/subscriber.routes";
import UserRouter from "./api/v1/users/routes/user.routes";
import NewLetterRoute from "./api/v1/new_letter/routes/newLetter.routes";
import RatingRoute from "./api/v1/products/routes/rating.routes";
import OrdersRoute from "./api/v1/orders/routes/orders.routes";
import AdminDashboardRoute from "./api/v1/admin/routes/adminDashboard.routes";

const app = express();

// const whitelist = [process.env.WLIST];
// const corsOptions = {
//   origin: (origin: any, callback: any) => {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

app.use(session({ resave: true, secret: "123456", saveUninitialized: true }));

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/subscribers", SubscriberRouter);
app.use("/api/v1/newLetters", NewLetterRoute);
app.use("/api/v1/rating", RatingRoute);
app.use("/api/v1/orders", OrdersRoute);
app.use("/api/v1/admin_dashboard", AdminDashboardRoute);

app.use(notFound);
app.use(errorHandler);

export default app;
