import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "express-flash";
import session from "express-session";

// Router import
import router from "./routes/routes.js";

// App instance
const app = express();

// initialise session middleware - flash-express depends on it
app.use(session({
    secret: "codeXer",
    resave: false,
    saveUninitialized: true
}));

// initialise the flash middleware
app.use(flash());

app.use(express.static("public"));

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: "./views",
    layoutsDir: "./views/layouts",
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");
app.set("views", "./views");

// Routes middlewares
app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("🚀 app started at PORT", PORT);
});