import { faker } from '@faker-js/faker';
import {expect, test} from '@playwright/test';


test.describe('HerokuAppAPITest @API', async () => {

    let Token;
    let id;

    test.beforeAll('User Authentication', async ({ request}) => {

        const userAuth = await request.post(process.env.URL + 'users/login', {
            data: { "email": "sankara.narayanan@landservices.com.au", "password": process.env.PASSWORD }
        });

        const ResponseBody = JSON.stringify(await userAuth.json());
        Token = JSON.parse(ResponseBody).token;
        console.log("BearerToken : ", Token);
        expect(userAuth.status()).toEqual(200);

    })

    test('Add contact', async({ request }) => {

        const addContact = await request.post(process.env.URL + 'contacts', {

            headers: {"Authorization": "Bearer " + Token},
            data: {
                "firstName": faker.person.firstName(),
                "lastName": faker.person.lastName(),
                "birthdate": "1992-08-08",
                "email": faker.internet.email(),
                "phone": "476489203",
                "street1": faker.location.streetAddress(),
                "street2": faker.location.secondaryAddress(),
                "city": faker.location.city(),
                "stateProvince": faker.location.state(),
                "postalCode": faker.location.zipCode(),
                "country": faker.location.countryCode()
            }

        });
        expect(addContact.status()).toEqual(201);
    })

    test('Get user contact', async({ request }) => {

        const getcontactList = await request.get(process.env.URL + 'contacts', {
            headers: {"Authorization": "Bearer " + Token}
        });

        expect(getcontactList.status()).toEqual(200);
        const contactList = JSON.stringify(await getcontactList.json());
        const parsedJson = JSON.parse(contactList);
        console.log(parsedJson)
        id = parsedJson[0]._id; 
        console.log(id)
    })

    test('Delete user contact', async({ request }) => {

        console.log('Request URL:', process.env.URL + 'contacts/' + id);
        console.log('Request headers:', { "Authorization": "Bearer " + Token });

        const getcontactList = await request.delete(process.env.URL + 'contacts/' +id, {
            headers: {"Authorization": "Bearer " + Token} 
        });

        expect(getcontactList.status()).toEqual(200);

    })

    test.afterAll('User Logout', async({ request }) => {
        const logout = await request.post(process.env.URL + 'users/logout', {
            headers : {"Authorization" : "Bearer " + Token}
        })

        expect(logout.status()).toEqual(200)

    })

})