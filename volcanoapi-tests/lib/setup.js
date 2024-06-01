const axios = require("axios");
const https = require("https");
const REMOTE_API_URL = require("../api");
const { v4: uuid } = require("uuid");
const faker = require("faker");
const { DateTime } = require("luxon");

https.globalAgent.options.rejectUnauthorized = false;
const instance = axios.create({
  baseURL: REMOTE_API_URL,
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

const userOne = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing1",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  dob: DateTime.fromJSDate(faker.date.past()).toISODate(),
};

const userTwo = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing2",
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  address: faker.address.streetAddress(),
  dob: DateTime.fromJSDate(faker.date.past()).toISODate(),
};

const nonExistantUser = {
  email: `${uuid()}@fake-email.com`,
  password: "webcomputing2",
};

module.exports = {
  instance: instance,
  userOne: userOne,
  userTwo: userTwo,
  nonExistantUser: nonExistantUser,
};
