import "dotenv/config";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import session from "express-session";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/errorHandler";
import CategoryRouter from "./routes/category.routes";
import ProductRouter from "./routes/product.routes";
import AuthRouter from "./routes/auth.routes";
import SubscriberRouter from "./routes/subscriber.routes";
import UserRouter from "./routes/user.routes";
import NewLetterRoute from "./routes/newLetter.routes";

// import Category from "./models/Category";
// import NewLetter from "./models/NewLetter";
// import OrderItem from "./models/OrderItem";
// import Orders from "./models/Orders";
// import ParentCategory from "./models/ParentCategory";
// import Product from "./models/Product";
// import ProductImage from "./models/ProductImage";
// import Subscriber from "./models/Subscriber";
// import User from "./models/User";

const app = express();

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

app.use(notFound);
app.use(errorHandler);

export default app;
