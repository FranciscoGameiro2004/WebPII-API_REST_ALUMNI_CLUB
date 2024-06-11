const axios = require("axios");

const API_BASE_URL = "http://127.0.0.1:3000";
let JWT_TOKEN_ADMIN = "";
let JWT_TOKEN_NORMAL = "";

let degreeId = 0;
let institutionId = 0;

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

    const response_normal = await axios({
      method: "post",
      url: `${API_BASE_URL}/users/login`,
      data: {
        username: "franciscogameiro",
        password: "Passw0rd",
      },
    });

    JWT_TOKEN_ADMIN = response_admin.data.accessToken;
    JWT_TOKEN_NORMAL = response_normal.data.accessToken;

    try {
      await axios({
        method: "post",
        url: `${API_BASE_URL}/institutions`,
        headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
        data: {
          designation: "Roblox Institute of Virtual Technology",
          address: "Avenida Do Bloco 46",
          zipCode: "4480-876",
          url: "https://www.rivt.edu/",
          email: "information@rivt.org",
          phone: "912345678",
          logoUrl:
            "https://scontent.flis7-1.fna.fbcdn.net/v/t31.18172-8/10661688_10152456904378580_4662786894953904517_o.png?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=oZSe3_yNklcQ7kNvgGf4SaY&_nc_ht=scontent.flis7-1.fna&oh=00_AYA1TiRuftZK-hgN6tDwHV3imjSSgljWBwNPNAJ4CZ4TWw&oe=66892310",
        },
      });
    } catch (error) {
      
    }

    const params = new URLSearchParams([
      ["limit", 5],
      ["page", 0],
      ["search", "Roblox"],
    ]);
    const response_institution = await axios({
      method: "get",
      url: `${API_BASE_URL}/institutions`,
      params: params,
    });
    institutionId = response_institution.data.data[0].id;
  })();
});



test("Inserir Curso", async () => {
  const response = await axios({
    method: "post",
    url: `${API_BASE_URL}/degrees`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
    data: {
      designation: "Desenvolvimento em Roblox Studio",
      institutionId: institutionId,
      degreeType: 2,
    },
  });
  console.log(response.data);
  expect(response.status).toBe(201);
});

test("Inserir Curso já existente", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/degrees`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
      data: {
        designation: "Desenvolvimento em Roblox Studio",
        institutionId: institutionId,
        degreeType: 2,
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});

test("Inserir Curso através de um utilizador comum", async () => {
  try {
    const response = await axios({
      method: "post",
      url: `${API_BASE_URL}/degrees`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_NORMAL}` },
      data: {
        designation: "Moderação em Experiências",
        institutionId: institutionId,
        degreeType: 1,
      },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 403");
  }
});

test("Obter cursos", async () => {
  const params = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
  ]);
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/degrees`,
    params: params,
  });
  expect(response.status).toBe(200);
});

test("Obter Curso através da pesquisa de uma lista", async () => {
  const params = new URLSearchParams([
    ["limit", 5],
    ["page", 0],
    ["search", "Roblox"],
  ]);
  const response = await axios({
    method: "get",
    url: `${API_BASE_URL}/degrees`,
    params: params,
  });
  degreeId = response.data.data[0].id;
  console.log(degreeId);
  expect(response.status).toBe(200);
  expect(
    response.data.data.some(
      (degree) =>
        degree.designation == "Desenvolvimento em Roblox Studio"
    )
  ).toBeTruthy();
});

test("Obter Curso não existente", async () => {
  try {
    const params = new URLSearchParams([
      ["limit", 5],
      ["page", 0],
      ["search", "Bloxburg"],
    ]);
    const response = await axios({
      method: "get",
      url: `${API_BASE_URL}/degrees`,
      params: params,
    });
    //degreeId = response.data.data[0].id
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 404");
  }
});

test("Remover Curso sem token", async () => {
  try {
    const response1 = await axios({
      method: "delete",
      url: `${API_BASE_URL}/degrees/${degreeId}`,
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 401");
  }
});

test("Remover Curso através de um utilizador comum", async () => {
  try {
    const response1 = await axios({
      method: "delete",
      url: `${API_BASE_URL}/degrees/${degreeId}`,
      headers: { Authorization: `Bearer ${JWT_TOKEN_NORMAL}` },
    });
  } catch (error) {
    expect(error.message).toBe("Request failed with status code 403");
  }
});

test("Remover Curso", async () => {
  const response1 = await axios({
    method: "delete",
    url: `${API_BASE_URL}/degrees/${degreeId}`,
    headers: { Authorization: `Bearer ${JWT_TOKEN_ADMIN}` },
  });
  console.log(degreeId);
  expect(response1.status).toBe(204);
});
