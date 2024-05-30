const axios = require('axios');
const { search, use } = require('../routes/users.routes');

const API_BASE_URL = 'http://127.0.0.1:3000'
let JWT_TOKEN = ''

test('Criar conta com todos os dados preenchidos', async () => {
    const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/users`,
        data: {
            "name": "John Doe",
            "username": "j0hnDo3",
            "email": "johnDoe@email.com",
            "password": "Not4Pa55",
            "address": "Rua do Bairro",
            "nationality": "EN"
        }
      });
    console.log(response);
    expect(response.status).toBe(201)
})

test('Criar conta com dados não requiridos por preencher', async () => {
    const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/users`,
        data: {
            "name": "Jane Doe",
            "username": "j4neDo3",
            "email": "janeDoe@email.com",
            "password": "Not4Pa55",
        }
      });
    console.log(response);
    expect(response.status).toBe(201)
})

test('Criar conta com dados requiridos por preencher', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/users`,
            data: {
                "name": "Johnny Appleseed",
                "username": "appleseed_john",
                "password": "Not4Pa55",
            }
          });
        console.log(response);
    } catch (error) {
        expect(error.message).toBe('Request failed with status code 400')
    }
    
})

test('Criar conta com dados repetidos', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/users`,
            data: {
                "name": "John Doe",
                "username": "john_doe_2004",
                "email": "johnDoe@email.com",
                "password": "Not4Pa55",
                "address": "Rua do Bairro",
                "nationality": "EN"
            }
          });
        console.log(response);
    } catch (error) {
        expect(error.message).toBe('Request failed with status code 401')
    }
})

test('Início de sessão', async () => {
    const response = await axios({
        method: 'post',
        url: `${API_BASE_URL}/users/login`,
        data: {
            "username": "j0hnDo3",
            "password": "Not4Pa55"
        }
    })
    JWT_TOKEN = response.data.accessToken
    expect(response.status).toBe(200)
})

test('Início de sessão sem username fornecido', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/users/login`,
            data: {
                "password": "Not4Pa55"
            }
        })
        JWT_TOKEN = response.data.accessToken
    } catch (error) {
        expect(error.message).toBe('Request failed with status code 400')
    }
})

test('Início de sessão sem password fornecida', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/users/login`,
            data: {
                "username": "j0hnDo3",
            }
        })
        JWT_TOKEN = response.data.accessToken
    } catch (error) {
        expect(error.message).toBe('Request failed with status code 400')
    }
})

test('Início de sessão com credenciais erradas', async () => {
    try {
        const response = await axios({
            method: 'post',
            url: `${API_BASE_URL}/users/login`,
            data: {
                "username": "j0hnDo3",
                "password": "Wr0ngP4ss"
            }
        })
        JWT_TOKEN = response.data.accessToken
    } catch (error) {
        expect(error.message).toBe('Request failed with status code 401')
    }
})

test('Obtenção de uma lista de utilizadores', async () => {
    const params = new URLSearchParams([['limit', 5], ['page', 0]])
    const response = await axios({
        method: 'get',
        url: `${API_BASE_URL}/users/`,
        params: params
    })
    expect(response.status).toBe(200)
})

test('Obtenção de um utilizador através da lista de utilizadores', async () => {
    const params = new URLSearchParams([['limit', 5], ['page', 0], ['search', 'j0hnDo3']])
    const response = await axios({
        method: 'get',
        url: `${API_BASE_URL}/users/`,
        params: params
    })
    console.log(response.data.data);
    expect(response.status).toBe(200)
    expect(response.data.data.some(user => user.username == 'j0hnDo3')).toBeTruthy()
})
//! Acrecentar testes de início de sessão

//? CONTINUAR