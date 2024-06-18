const axios = require("axios");

const API_BASE_URL = "http://127.0.0.1:3000";

let JWT_TOKEN_ADMIN = "";
let adminId = 0;

let JWT_TOKEN_NORMAL = "";
let normalId = 0;

let eventId = 0;
let clean = true

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


afterAll(async ()=>{
  
  const params = new URLSearchParams([
    ["limit", 3],
    ["page", 0],
    ["search", ""]
  ]);
  const response_event = await axios({
    method: "get",
    url: `${API_BASE_URL}/events`,
    params: params,
  });//console.log(response_event.data);

  if(clean == true) {
    response_event.data.data.forEach( event => {
      let command = axios({
        method: "delete",
        url: `${API_BASE_URL}/events/${event.id}`,
        params: params,
      });
    })
  }
})

/*---------------------------GET-------------------------------------*/
test("Get events", async () => {
  const params = new URLSearchParams([
    ["limit", 3],
    ["page", 0],
    ["search", ""]
  ]);
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/events`,
    params: params,
  });//console.log(response);
  expect(response.status).toBe(200);
})

test("Get one event", async () => {
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/events/${eventId}`,
  });//console.log(response);
  expect(response.status).toBe(200);
})
/*---------------------------GET-------------------------------------*/

/*---------------------------POST------------------------------------*/
test("Criar evento", async () => {
  const response = await axios({
    method: "post",
    url: `${API_BASE_URL}/events`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    data: {
      name: "TSIW Event Test 2024 via Test",
      description:
        "A cool meeting via Test",
      dates: [
        { date: "2024-06-17", startTime: "10:00:00", endTime: "16:00:00" }
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
/*---------------------------POST------------------------------------*/

/*---------------------------PUT-------------------------------------*/
test("Put one event", async () => {

  const params = new URLSearchParams([
    ["limit", 3],
    ["page", 0],
    ["search", ""]
  ]);
  let response = await axios({
    method: "get",
    url: `${API_BASE_URL}/events`,
    params: params,
  });//console.log(response.data.data);

  let eventId = response.data.data[0].id; //console.log(eventId);

  const currentDateTime = new Date();
  const hours = currentDateTime.getHours();
  const minutes = currentDateTime.getMinutes();
  const seconds = currentDateTime.getSeconds();

  response = await axios({
    method: "put",
    url: `${API_BASE_URL}/events/${eventId}`,
    data: {
      name: `TSIW Event Test 2024 ${hours}:${minutes}:${seconds}`,
      description:
        "Teste put via test",
      addDates: [],
      removeDates: [], 
      addParticipants: [], 
      removeParticipants: [],
    }
  });//console.log(response.status)

  expect(response.status).toBe(201);
})