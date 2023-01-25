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
import axios from "axios";
import restoreCache from "./utils/restoreCahce";

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

// interface IPhoto {
//   albumId: number;
//   id: number;
//   title: string;
//   url: string;
//   thumbnailUrl: string;
// }

// app.get("/", async (req: any, res: any) => {
//   const data = await restoreCache<IPhoto[], IPhoto | null>("photos", async () => {
//     const { data } = await axios.get(
//       `https://jsonplaceholder.typicode.com/photos`
//     );
//     return data as IPhoto[];
//   });

//   res.json(data);
// });

app.use(notFound);
app.use(errorHandler);

export default app;
