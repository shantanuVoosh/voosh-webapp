const express = require("express");
const cors = require("cors");
const allRoutes = require("./routes");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", allRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(process.cwd(), "frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(process.cwd(), "frontend/build/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}!`);
});
