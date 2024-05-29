import postgres from "postgres";

/* export default postgres({
     host: "localhost",
     port: 5432,
     database: "",
     username: "",
     password: "", 

}) */

const db = postgres({
  host: "localhost",
  port: 5432,
});

export async function createCitiesTable() {
  await db`CREATE TABLE IF NOT EXISTS cities 
    (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        population INTEGER
    )
    `;
}

export async function createInterestPointsTable() {
  await db`CREATE TABLE IF NOT EXISTS points 
    (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        city_id INTEGER REFERENCES cities(id)
    )
    `;
}

export async function getCities() {
  return await db`
  Select * FROM cities 
  ORDER BY id;`;
}

export async function getCityById(id) {
  return await db`
    Select * FROM cities
    WHERE id = ${id}
    `;
}

export async function createCity(name, description, population) {
  await db`INSERT INTO cities(name, description, population) 
    VALUES (${name}, ${description}, ${population})`;
}

export async function updateCity(id, name, description, population) {
  await db`
    UPDATE cities
    SET name = ${name}, description = ${description}, population = ${population}
    WHERE id = ${id} 
    `;
}

export async function deleteCityById(id) {
  await db`
    DELETE FROM cities
    WHERE id=${id}
    `;
}

export async function createPoint(name, description, city_id) {
  await db`INSERT INTO points(name, description, city_id) 
    VALUES (${name}, ${description}, ${city_id})`;
}

export async function getPoints() {
  return await db`Select * 
    FROM points
    ORDER BY id`;
}

export async function getExtendedPoints() {
  return await db`Select 
    points.id, points.name, points.description, points.city_id, cities.name AS city_name
    FROM points LEFT JOIN cities ON points.city_id = cities.id
    ORDER BY id`;
}

export async function getPointById(id) {
  return await db`
    Select * FROM points
    WHERE id = ${id}
    `;
}

export async function updatePoint(id, name, description, city_id) {
  await db`
    UPDATE points
    SET name = ${name}, description = ${description}, city_id = ${city_id}
    WHERE id = ${id} 
    `;
}

export async function deletePoint(id) {
  await db`
  DELETE FROM points
  WHERE id=${id}
  `;
}

export async function getPointsOfCity(id) {
  return await db`
  Select * 
  FROM points
  WHERE city_id=${id};
  `;
}

export async function createMapsTableForCities() {
  await db`CREATE TABLE IF NOT EXISTS citymaps 
    (
        id SERIAL PRIMARY KEY,
        maproute TEXT NOT NULL,
        city_id INTEGER REFERENCES cities(id)
    )
    `;
}
