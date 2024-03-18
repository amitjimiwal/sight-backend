import config from "./config/config.js";
import app from "./app.js";

app.listen(config.port, () => {
  console.log(` TS Server is running on port ${config.port}`);
});
