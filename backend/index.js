const connectTomongo = require("./db");
const express = require("express");
connectTomongo();
var cors = require('cors')

const app = express();
const port = 4000;


app.use(cors())
app.use(express.json());

app.use("/api/auth", require("./routers/auth"));
app.use("/api/note", require("./routers/notes"));

app.listen(port, () => {
  console.log(`iNoteBook app listening on port http:localhost:${port}`);
});
