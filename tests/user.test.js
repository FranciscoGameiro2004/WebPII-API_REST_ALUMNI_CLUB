const axios = require('axios');

const API_BASE_URL = 'http://127.0.0.1:3000'

test('Criar conta com todos os dados preenchidos', async () => {
    const response = await axios({
        method: 'post',
        url: `http://127.0.0.1:3000/users`,
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

//? CONTINUAR