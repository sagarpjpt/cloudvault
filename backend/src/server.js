// entry point of backend
// keeps server start separate from app config

const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
