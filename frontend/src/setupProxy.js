const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
  app.use(createProxyMiddleware("/api", { target: "http://localhost:5000/" }));
  app.use(createProxyMiddleware("/user", { target: "http://localhost:5000/" }));
};
