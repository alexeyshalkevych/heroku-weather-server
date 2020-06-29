const express = require("express");
const morgan = require("morgan");
const Joi = require("joi");
const fetch = require("node-fetch");

const PORT = process.env.PORT || 5000;

require("dotenv").config();

const app = express();

app.use(express.json());

app.get("/api/weather", validateWeatherQueryParams, async (req, res) => {
  const { lat, lon } = req.query;

  const response = await fetch(
    `https://api.darksky.net/forecast/${process.env.DARK_SKY_API_SECRET_KEY}/${lat},${lon}?exclude=hourly,minutely,daily`
  );

  const responseBody = await response.json();

  if (responseBody.error) {
    return res.status(responseBody.code).send(responseBody.error);
  }

  res.status(200).send(responseBody);
});

function validateWeatherQueryParams(req, res, next) {
  const weatherRulesSchema = Joi.object({
    lat: Joi.string().required(),
    lon: Joi.string().required(),
  });

  const validationResult = Joi.validate(req.query, weatherRulesSchema);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

app.listen(PORT, (err) =>
  err
    ? console.log(err)
    : console.log(`Server has been started on port ${PORT}...`)
);
