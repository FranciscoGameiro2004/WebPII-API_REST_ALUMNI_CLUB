const axios = require('axios');

const API_BASE_URL = 'http://127.0.0.1:3000'
const JWT_TOKEN = ''

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

//? CONTINUAR