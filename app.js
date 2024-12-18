const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");

let nextId = 3;

let db = [
  {
    id: 1,
    latitude: 40.7128,
    longitude: -74.006,
  },
  {
    id: 2,
    latitude: 10.7128,
    longitude: -54.006,
  },
];

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/locations", (req, res) => {
  res.send(db);
});

app.get("/api/locations/:urlId([0-9]+)", (req, res) => {
  const id = Number(req.params.urlId); //
  const temp = db.find((location) => location.id === id);
  if (temp) {
    res.send(temp);
  } else {
    res.status(404).send(`Location with ID ${id} not found`);
  }
});

app.post("/api/locations", (req, res) => {
  const newLocation = {
    id: nextId++,
    latitude: Math.random() * 180 - 90, // Random latitude between -90 and 90
    longitude: Math.random() * 360 - 180, // Random longitude between -180 and 180
  };
  db.push(newLocation);
  res.status(201).send(newLocation);
});

app.delete("/api/locations/:urlId([0-9]+)", (req, res) => {
  const id = Number(req.params.urlId); //
  const locationExists = db.some((location) => location.id === id);
  if (!locationExists) {
    return res.status(404).send(`Location with ID ${id} not found`);
  }
  db = db.filter((location) => location.id !== id);
  res.status(204).end();
});

const server = app.listen(port, () => {
  console.log(`My app listening on port ${port}`);
});

process.on("SIGINT", () => {
  console.log("Gracefully shutting down Express.js server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
});
