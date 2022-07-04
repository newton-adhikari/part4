const http = require("http");
const app = require("./app");
const PORT = require("./utils/config").PORT;
const info = require("./utils/logger").info;

const server = http.createServer(app);
server.listen(PORT, () => info(`listening on PORT ${PORT}`))