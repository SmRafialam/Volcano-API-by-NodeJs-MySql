const to = require("./lib/to");
const { instance, userOne, userTwo, nonExistantUser } = require("./lib/setup");
const { v4: uuid } = require("uuid");

/* ======================= Countries ======================= */
describe("countries", () => {
  describe("with no query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`countries`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a list of all countries", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should contain 76 countries", () =>
      expect(response.data.length).toBe(76));
    test("should have first country of Algeria", () =>
      expect(response.data[0]).toBe("Algeria"));
    test("should have last country of Yemen", () =>
      expect(response.data[75]).toBe("Yemen"));
  });
});

/* ======================= User Registration & Login ======================= */
let userOneToken;
let userTwoToken;

describe("user", () => {
  describe("registration", () => {
    describe("with missing email", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            password: userOne.password,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            email: userOne.email,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing email and password", () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`user/register`, {}));
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with valid email and password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            email: userOne.email,
            password: userOne.password,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 201", () =>
        expect(response.status).toBe(201));
      test("should return status text - Created", () =>
        expect(response.statusText).toBe("Created"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });
  });
});

describe("login", () => {
  describe("with missing email", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          password: userOne.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with missing password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, { email: userOne.email })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });
    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with non-existing user (email)", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: nonExistantUser.email,
          password: nonExistantUser.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with invalid password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: userOne.email,
          password: "invalid-password",
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
  });

  describe("with valid email and password", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.post(`user/login`, {
          email: userOne.email,
          password: userOne.password,
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should contain token property", () =>
      expect(response.data).toHaveProperty("token"));
    test("should contain token_type property", () =>
      expect(response.data).toHaveProperty("token_type"));
    test("should contain expires_in property", () =>
      expect(response.data).toHaveProperty("expires_in"));
    test("should contain correct token_type", () =>
      expect(response.data.token_type).toBe(`Bearer`));
    test("should contain correct expires_in", () =>
      expect(response.data.expires_in).toBe(86400));
  });
});

/* ======================= Volcanoes ======================= */
describe("volcanoes", () => {
  describe("with invalid query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes?country=Japan&name=a`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("invalid populatedWithin query", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes?populatedWithin=fivekm`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no query parameters", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcanoes`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid country query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcanoes?country=Japan`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return an array", () =>
      expect(response.data.length).toBe(122));
    test("should contain correct first id property", () =>
      expect(response.data[0].id).toBe(1));
    test("should contain correct first name property", () =>
      expect(response.data[0].name).toBe("Abu"));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("Japan"));
    test("should contain correct first region property", () =>
      expect(response.data[0].region).toBe("Japan, Taiwan, Marianas"));
    test("should contain correct first subregion property", () =>
      expect(response.data[0].subregion).toBe("Honshu"));
  });

  describe("with country that doesn't exist", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes?country=NotARealCountry`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return 0 results", () => expect(response.data.length).toBe(0));
  });

  describe("with valid populatedWithin query parameter", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes?country=United States&populatedWithin=5km`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(response.data).toBeInstanceOf(Array));
    test("should return an array", () => expect(response.data.length).toBe(38));
    test("should contain correct first id property", () =>
      expect(response.data[0].id).toBe(27));
    test("should contain correct first name property", () =>
      expect(response.data[0].name).toBe("Crater Lake"));
    test("should contain correct first country property", () =>
      expect(response.data[0].country).toBe("United States"));
    test("should contain correct first region property", () =>
      expect(response.data[0].region).toBe("Canada and Western USA"));
    test("should contain correct first subregion property", () =>
      expect(response.data[0].subregion).toBe("USA (Oregon)"));
  });

  describe("with populatedWithin that doesn't exist", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes?populatedWithin=25km`)
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 400", () =>
      expect(response.status).toBe(400));
    test("should return status text - Bad Request", () =>
      expect(response.statusText).toBe("Bad Request"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });
});

/* ======================== Volcano ======================== */
describe("volcano", () => {
  beforeAll(async () => {
    const login = await instance.post(`user/login`, {
      email: userOne.email,
      password: userOne.password,
    });
    userOneToken = login.data.token;
  });

  describe("with no authorisation header", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcano/57`, {
          headers: {},
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an object", () =>
      expect(response.data).toBeInstanceOf(Object));
    test("should contain correct id property", () =>
      expect(response.data.id).toBe(57));
    test("should contain correct name property", () =>
      expect(response.data.name).toBe("Arjuno-Welirang"));
    test("should contain correct country property", () =>
      expect(response.data.country).toBe("Indonesia"));
    test("should contain correct region property", () =>
      expect(response.data.region).toBe("Indonesia"));
    test("should contain correct subregion property", () =>
      expect(response.data.subregion).toBe("Java"));
    test("should contain correct last eruption property", () =>
      expect(response.data.last_eruption).toBe("1952 CE"));
    test("should contain correct summit property", () =>
      expect(response.data.summit).toBe(3343));
    test("should contain correct elevation property", () =>
      expect(response.data.elevation).toBe(10968));
    test("should contain correct latitude property", () =>
      expect(response.data.latitude).toBe("-7.7330"));
    test("should contain correct longitude property", () =>
      expect(response.data.longitude).toBe("112.5750"));
  });

  describe("with invalid bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcano/57`, {
          headers: { Authorization: `Bearer notARealToken` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain message property", () =>
      expect(response.data.message).toBe("Invalid JWT token"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with malformed bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcano/57`, {
          headers: { Authorization: `notBearer ` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain specific message for 'Authorization header is malformed'", () =>
      expect(response.data.message).toBe("Authorization header is malformed"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no auth - volcano that does not exist (99999) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcano/99999`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - volcano that does not exist (99999) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcano/99999`, {
          headers: { Authorization: `Bearer ${userOneToken}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no auth - volcano that does exist (66)", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcano/66`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct name property", () =>
      expect(response.data.name).toBe("Cumbres,  Las"));
    test("should contain correct country property", () =>
      expect(response.data.country).toBe("Mexico"));
    test("should contain correct region property", () =>
      expect(response.data.region).toBe("Mexico and Central America"));
    test("should contain correct subregion property", () =>
      expect(response.data.subregion).toBe("Mexico"));
    test("should contain correct last_eruption property", () =>
      expect(response.data.last_eruption).toBe("3920 BCE"));
    test("should contain correct summit property", () =>
      expect(response.data.summit).toBe(3940));
    test("should contain correct elevation property", () =>
      expect(response.data.elevation).toBe(12927));
    test("should contain correct latitude property", () =>
      expect(response.data.latitude).toBe("19.1500"));
    test("should contain correct longitude property", () =>
      expect(response.data.longitude).toBe("-97.2700"));
  });

  describe("with valid auth - volcano that does exist (66)", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcano/66`, {
          headers: { Authorization: `Bearer ${userOneToken}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(response.data).toBeInstanceOf(Object));

    test("should contain correct name property", () =>
      expect(response.data.name).toBe("Cumbres,  Las"));
    test("should contain correct country property", () =>
      expect(response.data.country).toBe("Mexico"));
    test("should contain correct region property", () =>
      expect(response.data.region).toBe("Mexico and Central America"));
    test("should contain correct subregion property", () =>
      expect(response.data.subregion).toBe("Mexico"));
    test("should contain correct last_eruption property", () =>
      expect(response.data.last_eruption).toBe("3920 BCE"));
    test("should contain correct summit property", () =>
      expect(response.data.summit).toBe(3940));
    test("should contain correct elevation property", () =>
      expect(response.data.elevation).toBe(12927));
    test("should contain correct latitude property", () =>
      expect(response.data.latitude).toBe("19.1500"));
    test("should contain correct longitude property", () =>
      expect(response.data.longitude).toBe("-97.2700"));

    test("should contain correct population_5km property", () =>
      expect(response.data.population_5km).toBe(113));
    test("should contain correct population_10km property", () =>
      expect(response.data.population_10km).toBe(1923));
    test("should contain correct population_30km property", () =>
      expect(response.data.population_30km).toBe(315004));
    test("should contain correct population_100km property", () =>
      expect(response.data.population_100km).toBe(6365085));
  });
});

/* ======================= Profile ======================= */
describe("profile", () => {
  beforeAll(async () => {
    const request = await to.object(
      instance.post(`user/register`, {
        email: userTwo.email,
        password: userTwo.password,
      })
    );

    const login = await instance.post(`user/login`, {
      email: userTwo.email,
      password: userTwo.password,
    });
    userTwoToken = login.data.token;
  });

  describe("retrieval with default profile values", () => {
    describe("with unauthenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${uuid()}@email.com/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));
      test("should return status text - Not Found", () =>
        expect(response.statusText).toBe("Not Found"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with authenticated request for non existent user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${uuid()}@email.com/profile`, {
            headers: { Authorization: `Bearer ${userOneToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 404", () =>
        expect(response.status).toBe(404));
      test("should return status text - Not Found", () =>
        expect(response.statusText).toBe("Not Found"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
    });

    describe("with unauthenticated user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${userOneToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should return null for unset dob", () =>
        expect(response.data.dob).toBe(null));
      test("should return null for unset address", () =>
        expect(response.data.address).toBe(null));
    });

    describe("with authenticated non-matching user default profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${userTwoToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return null for unset firstName", () =>
        expect(response.data.firstName).toBe(null));
      test("should return null for unset lastName", () =>
        expect(response.data.lastName).toBe(null));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });

  describe("update of user profile", () => {
    describe("with unauthenticated user", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.put(`user/${userOne.email}/profile`, {
            firstName: userOne.firstName,
            lastName: userOne.lastName,
            address: userOne.address,
            dob: userOne.dob,
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 401", () =>
        expect(response.status).toBe(401));
      test("should return status text - Unauthorized", () =>
        expect(response.statusText).toBe("Unauthorized"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated non-matching user", () => {
      beforeAll(async () => {
        const login = await instance.post(`user/login`, {
          email: userTwo.email,
          password: userTwo.password,
        });
        userTwoToken = login.data.token;

        const request = await to.object(
          instance.put(
            `user/${userOne.email}/profile`,
            {
              firstName: userOne.firstName,
              lastName: userOne.lastName,
              address: userOne.address,
              dob: userOne.dob,
            },
            {
              headers: { Authorization: `Bearer ${userTwoToken}` },
            }
          )
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 403", () =>
        expect(response.status).toBe(403));
      test("should return status text - Forbidden", () =>
        expect(response.statusText).toBe("Forbidden"));
      test("should return error with boolean of true", () =>
        expect(response.data.error).toBe(true));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with authenticated matching user", () => {
      beforeAll(async () => {
        const login = await instance.post(`user/login`, {
          email: userOne.email,
          password: userOne.password,
        });
        userOneToken = login.data.token;
      });

      describe("with missing body keys", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {},
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return specific message for 'Request body incomplete: firstName, lastName, dob and address are required.'", () =>
          expect(response.data.message).toBe(
            "Request body incomplete: firstName, lastName, dob and address are required."
          ));
      });

      describe("with invalid firstName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: 123,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid lastName", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: 987,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid address", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: true,
                dob: userOne.dob,
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Request body invalid: firstName, lastName and address must be strings only.'", () =>
          expect(response.data.message).toBe(
            "Request body invalid: firstName, lastName and address must be strings only."
          ));
      });

      describe("with invalid date format", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: new Date().toISOString(),
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (out of bounds check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-13-32",
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (JavaScript date rollover check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-04-31",
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input: dob must be a real date in format YYYY-MM-DD.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a real date in format YYYY-MM-DD."
          ));
      });

      describe("with valid formatted non-real date (non leap-year check)", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2021-02-29",
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
      });

      describe("with valid date in the future", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: "2031-05-31",
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 400", () =>
          expect(response.status).toBe(400));
        test("should return status text - Bad Request", () =>
          expect(response.statusText).toBe("Bad Request"));
        test("should return error with boolean of true", () =>
          expect(response.data.error).toBe(true));
        test("should contain message property", () =>
          expect(response.data).toHaveProperty("message"));
        test("should return a specific message for 'Invalid input, dob must be a date in the past.'", () =>
          expect(response.data.message).toBe(
            "Invalid input: dob must be a date in the past."
          ));
      });

      describe("with valid date in the past", () => {
        beforeAll(async () => {
          const request = await to.object(
            instance.put(
              `user/${userOne.email}/profile`,
              {
                firstName: userOne.firstName,
                lastName: userOne.lastName,
                address: userOne.address,
                dob: userOne.dob,
              },
              {
                headers: { Authorization: `Bearer ${userOneToken}` },
              }
            )
          );
          return (response = request.resolve
            ? request.resolve
            : request.reject.response);
        });

        test("should return status code 200", () =>
          expect(response.status).toBe(200));
        test("should return status text - OK", () =>
          expect(response.statusText).toBe("OK"));
        test("should be an object result", () =>
          expect(response.data).toBeInstanceOf(Object));
        test("should return user email property", () =>
          expect(response.data.email).toBe(userOne.email));
        test("should return updated firstName", () =>
          expect(response.data.firstName).toBe(userOne.firstName));
        test("should return updated lastName", () =>
          expect(response.data.lastName).toBe(userOne.lastName));
        test("should return updated dob", () =>
          expect(response.data.dob).toBe(userOne.dob));
        test("should return updated address", () =>
          expect(response.data.address).toBe(userOne.address));
      });
    });
  });

  describe("retrieval after update of user profile", () => {
    describe("with unauthenticated user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`)
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });

    describe("with authenticated matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${userOneToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should return updated dob", () =>
        expect(response.data.dob).toBe(userOne.dob));
      test("should return updated address", () =>
        expect(response.data.address).toBe(userOne.address));
    });

    describe("with authenticated non-matching user updated profile values", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.get(`user/${userOne.email}/profile`, {
            headers: { Authorization: `Bearer ${userTwoToken}` },
          })
        );

        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 200", () =>
        expect(response.status).toBe(200));
      test("should return status text - OK", () =>
        expect(response.statusText).toBe("OK"));
      test("should be an object result", () =>
        expect(response.data).toBeInstanceOf(Object));
      test("should return user email property", () =>
        expect(response.data.email).toBe(userOne.email));
      test("should return updated firstName", () =>
        expect(response.data.firstName).toBe(userOne.firstName));
      test("should return updated lastName", () =>
        expect(response.data.lastName).toBe(userOne.lastName));
      test("should not return dob property", () =>
        expect(response.data).not.toHaveProperty("dob"));
      test("should not return address property", () =>
        expect(response.data).not.toHaveProperty("address"));
    });
  });
});

/* ======================= Misc ======================= */
describe("Miscellaneous", () => {
  describe("with non-existent route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`${uuid()}`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 404", () => expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
  });

  describe("with swagger docs route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(``));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return Swagger UI", () =>
      expect(response.data).toContain("Swagger UI"));
  });

  describe("with cors header", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(``));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return access-control-allow-origin in headers", () =>
      expect(response.headers).toHaveProperty("access-control-allow-origin"));
  });
});

/* ======================= Misc ======================= */
describe("Miscellaneous", () => {
  describe("with non-existent route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`invalid-route`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 404", () => expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
  });

  describe("with swagger docs route", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get());
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return Swagger UI", () =>
      expect(response.data).toContain("Swagger UI"));
  });

  describe("with cors header", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get());
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("return a status of 200", () => expect(response.status).toBe(200));
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return access-control-allow-origin in headers", () =>
      expect(response.headers).toHaveProperty("access-control-allow-origin"));
  });
});

/* ======================= Me ======================= */
describe("Me", () => {
  describe("with student information", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get("me"));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return name property", () =>
      expect(response.data).toHaveProperty("name"));
    test("should return student_number property", () =>
      expect(response.data).toHaveProperty("student_number"));
  });
});
