import "source-map-support/register";

import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";

//are we in development?
const isDevelopment = process.env.NODE_ENV !== "production";

// ---------------
// Setup
const app = express();
const server = new http.Server(app);
const io = socketIo(server);

// ---------------
// Client Webpack
if (process.env.USE_WEBPACK === "true") {
	var webpackMiddleware = require("webpack-dev-middleware"),
		webpackHotMiddleware = require("webpack-hot-middleware"),
		webpack = require("webpack"),
		clientConfig = require("../../webpack.client");

	const compiler = webpack(clientConfig);
	app.use(webpackMiddleware(compiler, {
		publicPath: "/build/",
		stats: {
			colors: true,
			chunks: false,
			assets: false,
			timings: false,
			modules: false,
			hash: false,
			version: false
		}
	}));

	app.use(webpackHotMiddleware(compiler));
	
	console.log(chalk.bgRed("Using Webpack Dev MiddleWare! This is for DEV ONLY!"));
}

// ---------------
// Express
//  set view engine
app.set("view engine", "jade");
//  set root folder for server
app.use(express.static("public"));

const useExternalStyles = !isDevelopment;
// handle the root request
app.get("/", (req, res) => {
	res.render("index", {
		useExternalStyles
	});
});

// ---------------
// Modules

// ---------------
// Socket
io.on("connection", socket => {
	console.log(`Got connection from ${socket.request.connection.remoteAddress}`);
});

// ---------------
// Startup
const port = process.env.PORT || 3000;
function startServer() {
	server.listen(port, () => {
		console.log(`Started the HTTP Server on ${port}!`);
	});
}

startServer();