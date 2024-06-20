const axios = require("axios");

const API_BASE_URL = "http://127.0.0.1:3000";
let JWT_TOKEN_1 = "";
let JWT_TOKEN_2 = "";
let JWT_TOKEN_ADMIN = "";
let userId1 = 1;
let userId2 = 1;

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
    expect(error.message).toBe("Request failed with status code 405");
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
  const params1 = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
    ["search", "j0hnDo3"],
  ]);
  const response1 = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/`,
    params: params1,
  });
  userId1 = response1.data.data[0].id;
  const params2 = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
    ["search", "j0hnDo3"],
  ]);
  const response2 = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/`,
    params: params2,
  });
  userId2 = response2.data.data[0].id;
  expect(response1.status).toBe(200);
  expect(
    response1.data.data.some((user) => user.username == "j0hnDo3")
  ).toBeTruthy();
  expect(response2.status).toBe(200);
  expect(
    response2.data.data.some((user) => user.username == "j0hnDo3")
  ).toBeTruthy();
});

test("Obtenção de um utilizador espcífico através do seu ID", async () => {
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/users/${userId1}`,
  });
  //console.log(`Status code: ${response.status}`);
  //console.log(response.data);
  expect(response.status).toBe(200);
  expect(response.data.userId).toBe(userId1);
});

test("Obtenção de um utilizador não existente", async () => {
  try {
    const nonExistantuserId1 = 9999;
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/users/${nonExistantuserId1}`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
});

test("Obtenção de um utilizador com um id inválido", async () => {
  try {
    const invaliduserId1 = "user";
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/users/${invaliduserId1}`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
});

test("Atualizar dados de um utilizador", async () => {
  const response1 = await axios({
    method: "patch",
    url: `${API_BASE_URL}/users/${userId1}`,
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
      url: `${API_BASE_URL}/users/${userId1}`,
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
      url: `${API_BASE_URL}/users/${userId1}`,
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
    url: `${API_BASE_URL}/users/${userId1}`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    data: {
      name: "John Template Doe",
    },
  });
  expect(response1.status).toBe(200);
});

//? CONTINUAR

test('Seguir um utilizador', async () => { 
  const response = await axios({
    method: 'post',
    url: `${API_BASE_URL}/users/${userId2}/followers`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
  })
  expect(response.status).toBe(202);
})

test('Seguir um utilizador que já o seguia', async () => { 
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/users/${userId2}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 405");
  }
})

test('Seguir um utilizador sem token', async () => { 
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/users/${userId2}/followers`,
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
})

test('Seguir um utilizador que não existe', async () => { 
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/users/${9999999}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
})

test('Seguir um utilizador com id inválido', async () => { 
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/users/${'user'}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
})

test('Seguir o próprio utilizador', async () => { 
  try {
    const response = await axios({
      method: 'post',
      url: `${API_BASE_URL}/users/${userId1}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 405");
  }
})

test('Deixar de seguir um utilizador', async () => { 
  const response = await axios({
    method: 'delete',
    url: `${API_BASE_URL}/users/${userId2}/followers`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
  })
  expect(response.status).toBe(202);
})

test('Deixar de seguir um utilizador que já o seguia', async () => { 
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/${userId2}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 405");
  }
})

test('Deixar de seguir um utilizador sem token', async () => { 
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/${userId2}/followers`,
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
})

test('Deixar de seguir um utilizador que não existe', async () => { 
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/${9999999}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
})

test('Deixar de seguir um utilizador com id inválido', async () => { 
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/${'user'}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 400");
  }
})

test('Deixar de seguir o próprio utilizador', async () => { 
  try {
    const response = await axios({
      method: 'delete',
      url: `${API_BASE_URL}/users/${userId1}/followers`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    })
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 405");
  }
})

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
