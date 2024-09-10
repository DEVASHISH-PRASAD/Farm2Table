import app from "./app.js";
import connectToDb from "./config/db.js";
const Port = process.env.PORT || 5003;

app.listen(Port, async () => {
  await connectToDb();
  console.log(`Server is listening on port:${Port}`);
});
