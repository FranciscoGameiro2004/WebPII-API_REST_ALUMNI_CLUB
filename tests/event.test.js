const axios = require("axios");

const API_BASE_URL = "http://127.0.0.1:3000";

let JWT_TOKEN_ADMIN = "";
let adminId = 0;

let JWT_TOKEN_NORMAL = "";
let normalId = 0;

beforeAll(async () => {
  return (async () => {
    const response_admin = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        username: "admin",
        password: "admin",
      },
    });

    JWT_TOKEN_ADMIN = response_admin.data.accessToken;
    adminId = response_admin.data.userToLogin.id;

    const response_normal = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        username: "franciscogameiro",
        password: "Passw0rd",
      },
    });

    JWT_TOKEN_NORMAL = response_normal.data.accessToken;
    normalId = response_normal.data.userToLogin.id;
  })();
});

afterAll(async () => {
  //! Fazer querie
});

test("Criar evento", async () => {
  const response = await axios({
    method: "post",
    url: `${API_BASE_URL}/events`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    data: {
      name: "TSIW Event Test 2024",
      description:
        "A cool meeting for every student and alumnus from TSIW degree",
      dates: [
        { date: "2024-06-17", startTime: "10:00:00", endTime: "16:00:00" },
        { date: "2024-06-18", startTime: "10:00:00", endTime: "16:00:00" },
      ],
    },
  });
  expect(response.status).toBe(201);
});

test("Criar evento sem fornecer nome", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/events`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
      data: {
        description:
          "A coding competition where only the best of the best gan participate",
        dates: [
          { date: "2024-06-20", startTime: "15:00:00", endTime: "19:00:00" },
        ],
      },
    });
  } catch (error) {
    expect(error.message).toBe('Request failed with status code 400')
  }
});

test("Criar evento sem fornecer descrição", async () => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/events`,
        headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
        data: {
          name: "Torneio de código 2024",
          dates: [
            { date: "2024-06-20", startTime: "15:00:00", endTime: "19:00:00" },
          ],
        },
      });
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 400')
    }
  });

  test("Criar evento sem fornecer token", async () => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/events`,
        data: {
          name: "Torneio de código 2024",
          description:
          "A coding competition where only the best of the best gan participate",
          dates: [
            { date: "2024-06-20", startTime: "15:00:00", endTime: "19:00:00" },
          ],
        },
      });
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  });

  test("Criar evento com um utilizador normal", async () => {
    try {
      const response = await axios({
        method: "post",
        url: `${API_BASE_URL}/events`,
        headers: { Authorization: `Bearer ${JWT_TOKEN_NORMAL}` },
        data: {
          name: "Torneio de código 2024",
          description:
          "A coding competition where only the best of the best gan participate",
          dates: [
            { date: "2024-06-20", startTime: "15:00:00", endTime: "19:00:00" },
          ],
        },
      });
    } catch (error) {
      expect(error.message).toBe('Request failed with status code 401')
    }
  });