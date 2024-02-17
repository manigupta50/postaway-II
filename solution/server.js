import app from "./index.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";

// Server initialization
app.listen(8000, () => {
  console.log("server is listening at port 8000");
  connectUsingMongoose();
});
