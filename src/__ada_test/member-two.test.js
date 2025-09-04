const request = require("supertest");
const server = require("../app.js");

test("express install is correct", () => {
  const express = require("express");
  expect(express).not.toBeUndefined();
});

test("server run correct", async () => {
  const response = await request(server).get("/");
  expect(response.status).toBe(200);
});

test("medium clients routing implemented", async () => {
  const response = await request(server).get("/medium-clients");
  expect(response.text).toEqual("Ruta clientes medium");
});

test("premium clients routing implemented", async () => {
  const response = await request(server).get("/premium-clients");
  expect(response.text).toEqual("Ruta clientes premium");
});

test("medium clients methods validation middleware implemented", async () => {
  const response = await request(server).post("/medium-clients");
  expect(response.text).toEqual("Invalid http request method");
});

test("premium clients url addition middleware implemented", async () => {
  const response = await request(server).get("/premium-clients");
  console.log(response.headers);
  expect(response.headers.url).toEqual("/premium-clients");
});
