require("dotenv").config(); // to read '.env' file
const express = require("express");
const app = express();
const port = 8000;
const { default: mongoose } = require("mongoose");
const bodyParser = require("body-parser");
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// DB Connection
mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log("Success! MongodbAtlas DB Connected");
    }
  }
);

// use index router
app.use("/", require("./routes"));

app.listen(port, function (err) {
  if (err) {
    console.log(`Error in running server: `, err);
  }
  console.log(`Success! Server running on port ${port}`);
});
