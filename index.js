import bodyParser from "body-parser";
import express from "express";
import {
  getCities,
  createCitiesTable,
  getCityById,
  createCity,
  updateCity,
  deleteCityById,
  createInterestPointsTable,
  createPoint,
  getPoints,
  getPointById,
  updatePoint,
  deletePoint,
  getPointsOfCity,
} from "./db/db.js";

const port = 3000;

const server = express();

//ez normál esetben nem biztonságos, mert így mindenki hozzáfér a szerverhez
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

server.use((req, res, next) => {
  console.log("Beerkezett egy keres");
  next();
});

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.get("/cities", async (req, res) => {
  const cities = await getCities();
  res.status(200).json(cities);
});

server.get("/cities/:id", async (req, res) => {
  const id = req.params.id;
  const cityById = await getCityById(id);
  console.log(`A lekért város id-je: ${id}`);
  res.status(200).json(cityById[0]);
});

server.post("/cities", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const population = req.body.population;
  await createCity(name, description, population);
  return res.status(200).json({
    name: name,
    description: description,
    population: population,
  });
});

server.put("/cities/:id", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const population = req.body.population;
  const id = req.params.id;
  await updateCity(id, name, description, population);
  const updatedCity = await getCityById(id);
  return res.status(200).json(updatedCity[0]);
});

server.delete("/cities/:id", async (req, res) => {
  const id = req.params.id;
  await deleteCityById(id);
  res.status(204).send("Torolve");
});

server.post("/points", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const city_id = req.body.city_id;
  await createPoint(name, description, city_id);
  return res.status(201).json({
    name: name,
    description: description,
    city_id: city_id,
  });
});

server.get("/points", async (req, res) => {
  const points = await getPoints();
  res.status(200).json(points);
});

server.get("/points/:id", async (req, res) => {
  const id = req.params.id;
  const pointById = await getPointById(id);
  res.status(200).json(pointById[0]);
});

server.put("/points/:id", async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const city_id = req.body.city_id;
  const id = req.params.id;
  await updatePoint(id, name, description, city_id);
  const updatedPoint = await getPointById(id);
  return res.status(200).json(updatedPoint[0]);
});

server.delete("/points/:id", async (req, res) => {
  const id = req.params.id;
  await deletePoint(id);
  return res.status(204).json({ messsage: "Torolve" });
});

server.get("/pointsofcity/:id", async (req, res) => {
  const id = req.params.id;
  const pointsOfCity = await getPointsOfCity(id);
  console.log(`A(z) ${id} id-jű város pontjainak lekérése`);
  res.status(200).json(pointsOfCity);
});

server.use((_req, res) => {
  res.json({ errorMesssage: "Can't find this page" }).status(404);
});

server.listen(port, async () => {
  console.log(`Elindult a szerverem: localhost: ${port}`);

  /* await createCitiesTable();
  await createInterestPointsTable(); */
});
