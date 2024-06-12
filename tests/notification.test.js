const axios = require("axios");
const { notifications } = require("../models");

const API_BASE_URL = "http://127.0.0.1:3000";

let JWT_TOKEN_ADMIN = ''
let adminId = 0

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
      adminId = response_admin.data.userToLogin.id
      //db.sequelize.query(`INSERT INTO Notifications (UserId, message, type) VALUES (${adminId}, "Lorem ipsium sit amet", "test")`)
    })();
  });

afterAll(async () => {
    //! Fazer querie
})

test('Obter lista de notificações', async () => { 
      const response = await axios({
        method: 'get',
        url: `${API_BASE_URL}/notifications`,
        headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
      })
    expect(response.status).toBe(200)
})

test('Obter lista de notificações lidas', async () => {
    const params = new URLSearchParams([
        ["readState", 1],
      ]);
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/notifications`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
      params: params
    })
  expect(response.status).toBe(200)
  expect(response.data.notifications.some(notification => notification.readState == 1) || response.data.notifications.length == 0).toBeTruthy()
})

test('Obter lista de notificações sem token', async () => { 
    try {
        const response = await axios({
            method: 'get',
            url: `${API_BASE_URL}/notifications`,
            headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
          })
    } catch (error) {
        expect(error.message).toBe("Request failed with status code 401");
    }
})