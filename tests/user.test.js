const axios = require("axios");

const API_BASE_URL = "http://127.0.0.1:3000";
let JWT_TOKEN_1 = "";
let JWT_TOKEN_2 = "";
let JWT_TOKEN_ADMIN = "";
let userId = 1;

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
  })();
});

test("Criar conta com todos os dados preenchidos", async () => {
  const response = await axios({
    method: "post",
    url: `${API_BASE_URL}/users`,
    data: {
      name: "John Doe",
      username: "j0hnDo3",
      email: "johnDoe@email.com",
      password: "Not4Pa55",
      address: "Rua do Bairro",
      nationality: "EN",
    },
  });
  expect(response.status).toBe(201);
});

test("Criar conta com dados não requiridos por preencher", async () => {
  const response = await axios({
    method: "post",
    url: `${API_BASE_URL}/users`,
    data: {
      name: "Jane Doe",
      username: "j4neDo3",
      email: "janeDoe@email.com",
      password: "Not4Pa55",
    },
  });
  expect(response.status).toBe(201);
});

test("Criar conta com dados requiridos por preencher", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/users`,
      data: {
        name: "Johnny Appleseed",
        username: "appleseed_john",
        password: "Not4Pa55",
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});

test("Criar conta com dados repetidos", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/users`,
      data: {
        name: "John Doe",
        username: "john_doe_2004",
        email: "johnDoe@email.com",
        password: "Not4Pa55",
        address: "Rua do Bairro",
        nationality: "EN",
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});

test("Início de sessão", async () => {
  const response1 = await axios({
    method: "post",
    url: `${API_BASE_URL}/users/login`,
    data: {
      username: "j0hnDo3",
      password: "Not4Pa55",
    },
  });
  JWT_TOKEN_1 = response1.data.accessToken;

  const response2 = await axios({
    method: "post",
    url: `${API_BASE_URL}/users/login`,
    data: {
      username: "j4neDo3",
      password: "Not4Pa55",
    },
  });
  JWT_TOKEN_2 = response2.data.accessToken;
  expect(response1.status).toBe(200);
  expect(response2.status).toBe(200);
});

test("Início de sessão sem username fornecido", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        password: "Not4Pa55",
      },
    });
    JWT_TOKEN_1 = response.data.accessToken;
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});

test("Início de sessão sem password fornecida", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        username: "j0hnDo3",
      },
    });
    JWT_TOKEN_1 = response.data.accessToken;
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});

test("Início de sessão com credenciais erradas", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        username: "j0hnDo3",
        password: "Wr0ngP4ss",
      },
    });
    JWT_TOKEN_1 = response.data.accessToken;
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});

test("Obtenção de uma lista de utilizadores", async () => {
  const params = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
  ]);
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/`,
    params: params,
  });
  expect(response.status).toBe(200);
});

test("Obtenção de um utilizador através da lista de utilizadores", async () => {
  const params = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
    ["search", "j0hnDo3"],
  ]);
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/`,
    params: params,
  });
  userId = response.data.data[0].id;
  expect(response.status).toBe(200);
  expect(
    response.data.data.some((user) => user.username == "j0hnDo3")
  ).toBeTruthy();
});

test("Obtenção de um utilizador espcífico através do seu ID", async () => {
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/${userId}`,
  });
  expect(response.status).toBe(200);
  expect(response.data.userId).toBe(userId);
});

test("Obtenção de um utilizador não existente", async () => {
  try {
    const nonExistantUserId = 9999;
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/users/${nonExistantUserId}`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
});

test("Obtenção de um utilizador com um id inválido", async () => {
  try {
    const invalidUserId = "user";
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/users/${invalidUserId}`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});

//? CONTINUAR

test("Atualizar dados de um utilizador", async () => {
  const response1 = await axios({
    method: "patch",
    url: `${API_BASE_URL}/users/${userId}`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_1}` },
    data: {
      name: "John Placeholder Doe",
      consentJobs: false,
    },
  });
  expect(response1.status).toBe(200);
});

test("Atualizar dados de um utilizador sem dados fornecidos", async () => {
  try {
    const response1 = await axios({
      method: "patch",
      url: `${API_BASE_URL}/users/${userId}`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_1}` },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});
test("Atualizar dados de um utilizador sem o especificar", async () => {
  try {
    const response1 = await axios({
      method: "patch",
      url: `${API_BASE_URL}/users/`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_1}` },
      data: {
        name: "John Template Doe",
        consentJobs: true,
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
});

test("Atualizar dados de um utilizador através de um token de um outro utilizador", async () => {
  try {
    const response1 = await axios({
      method: "patch",
      url: `${API_BASE_URL}/users/${userId}`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_2}` },
      data: {
        name: "John Template Doe",
        consentJobs: true,
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});

test("Atualizar dados de um utilizador através de um token de um administrador", async () => {
  const response1 = await axios({
    method: "patch",
    url: `${API_BASE_URL}/users/${userId}`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    data: {
      name: "John Template Doe",
      consentJobs: true,
    },
  });
  expect(response1.status).toBe(200);
});

test("Remover conta de um utilizador", async () => {
  const response1 = await axios({
    method: "delete",
    url: `${API_BASE_URL}/users/`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_1}` },
  });
  expect(response1.status).toBe(204);
  const response2 = await axios({
    method: "delete",
    url: `${API_BASE_URL}/users/`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_2}` },
  });
  expect(response2.status).toBe(204);
});

test("Remover conta de um utilizador sem token", async () => {
  try {
    const response = await axios({
      method: "delete",
      url: `${API_BASE_URL}/users/`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});
