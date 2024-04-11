const request = require('supertest');
const app = require('./app');

// References used throughout:
// Medium, 2022a - Used to access the body of the response from a request
// Jest, 2023a - Used for additional matchers such as .toEqual

// Test /initialise path (also initialises everything ready for testing) - the result of initialising is indirectly tested in the other tests (see get-ingredients and get-recipes)
describe('DELETE /initialise', () => {
    test('DELETE /initialise returns status 200', () => {
        return request(app).delete('/initialise').expect(200);
    });

    test('DELETE /initialise returns HTML', () => {
        return request(app).delete('/initialise').expect('Content-Type', /html/);
    });
});

// Test /get-ingredients path
describe('GET /get-ingredients', () => {
    test('GET /get-ingredients returns status 200', () => {
        return request(app).get('/get-ingredients').expect(200);
    });

    test('GET /get-ingredients returns JSON', () => {
        return request(app).get('/get-ingredients').expect('Content-Type', /json/);
    });

    test('GET /get-ingredients correctly returns list of ingredients', () => {
            return request(app).get('/get-ingredients').then(response => {
                expect(response.body).toEqual([{ ingredient: 'potato' }, { ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'onion' }]);
            });
    });
});

// Test /get-recipes path
describe('GET /get-recipes', () => {
    test('GET /get-recipes returns status 200', () => {
        return request(app).get('/get-recipes').expect(200);
    });

    test('GET /get-recipes returns JSON', () => {
        return request(app).get('/get-recipes').expect('Content-Type', /json/);
    });

    test('GET /get-recipes correctly returns list of recipes', () => {
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }, { title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }, { title: 'omelettes', servings: 2, ingredients: ['eggs', 'salt', 'pepper', 'oil', 'onion'], instructions: '1) Beat eggs and add salt and pepper 2) Fry in a pan with oil and onion' }]);
        });
    });
});

// Test /search-ingredients path
describe('GET /search-ingredients', () => {
    test('GET /search-ingredients returns status 200 if a search query is specified', () => {
        return request(app).get('/search-ingredients?search=test').expect(200);
    });

    test('GET /search-ingredients returns JSON if a search query is specified', () => {
        return request(app).get('/search-ingredients?search=test').expect('Content-Type', /json/);
    });

    test('GET /search-ingredients returns status 400 if a search query is not specified', () => {
        return request(app).get('/search-ingredients').expect(400);
    });

    test('GET /search-ingredients returns HTML if a search query is not specified', () => {
        return request(app).get('/search-ingredients').expect('Content-Type', /html/);
    });

    test('GET /search-ingredients returns status 400 if search query is empty', () => {
        return request(app).get('/search-ingredients?search=').expect(400);
    });

    test('GET /search-ingredients returns HTML if search query is empty', () => {
        return request(app).get('/search-ingredients?search=').expect('Content-Type', /html/);
    });

    test('GET /search-ingredients correctly returns list of ingredients that match the search query', () => {
        return request(app).get('/search-ingredients?search=onion').then(response => {
            expect(response.body).toEqual([{ ingredient: 'onion' }]);
        });
    });

    test('GET /search-ingredients will return multiple ingredients if the search query matches multiple ingredients', () => {
        return request(app).get('/search-ingredients?search=p').then(response => {
            expect(response.body).toEqual([{ ingredient: 'potato' }, { ingredient: 'pepper' }]);
        });
    });

    test('GET /search-ingredients returns partial matches', () => {
        return request(app).get('/search-ingredients?search=oni').then(response => {
            expect(response.body).toEqual([{ ingredient: 'onion' }]);
        });
    });

    test('GET /search-ingredients will return an empty array if the search query does not match any ingredients', () => {
        return request(app).get('/search-ingredients?search=test').then(response => {
            expect(response.body).toEqual([]);
        });
    });

    test('GET /search-ingredients is case-insensitive', () => {
        return request(app).get('/search-ingredients?search=OnIoN').then(response => {
            expect(response.body).toEqual([{ ingredient: 'onion' }]);
        });
    });
});

// Test /search-recipes path
describe('GET /search-recipes', () => {
    test('GET /search-recipes returns status 200 if a search query is specified', () => {
        return request(app).get('/search-recipes?search=test').expect(200);
    });

    test('GET /search-recipes returns JSON if a search query is specified', () => {
        return request(app).get('/search-recipes?search=test').expect('Content-Type', /json/);
    });

    test('GET /search-recipes returns status 400 if a search query is not specified', () => {
        return request(app).get('/search-recipes').expect(400);
    });

    test('GET /search-recipes returns HTML if a search query is not specified', () => {
        return request(app).get('/search-recipes').expect('Content-Type', /html/);
    });

    test('GET /search-recipes returns status 400 if search query is empty', () => {
        return request(app).get('/search-recipes?search=').expect(400);
    });

    test('GET /search-recipes returns HTML if search query is empty', () => {
        return request(app).get('/search-recipes?search=').expect('Content-Type', /html/);
    });

    test('GET /search-recipes correctly returns list of recipes that match the search query based on title', () => {
        return request(app).get('/search-recipes?search=pancakes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('GET /search-recipes correctly returns list of recipes that match the search query based on servings', () => {
        return request(app).get('/search-recipes?search=2').then(response => {
            expect(response.body).toEqual([{ title: 'omelettes', servings: 2, ingredients: ['eggs', 'salt', 'pepper', 'oil', 'onion'], instructions: '1) Beat eggs and add salt and pepper 2) Fry in a pan with oil and onion' }]);
        });
    });

    test('GET /search-recipes will return multiple recipes if the search query matches multiple recipes', () => {
        return request(app).get('/search-recipes?search=4').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }, { title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('GET /search-recipes returns partial matches', () => {
        return request(app).get('/search-recipes?search=ome').then(response => {
            expect(response.body).toEqual([{ title: 'omelettes', servings: 2, ingredients: ['eggs', 'salt', 'pepper', 'oil', 'onion'], instructions: '1) Beat eggs and add salt and pepper 2) Fry in a pan with oil and onion' }]);
        });
    });

    test('GET /search-recipes will return an empty array if the search query does not match any recipes', () => {
        return request(app).get('/search-recipes?search=test').then(response => {
            expect(response.body).toEqual([]);
        });
    });

    test('GET /search-recipes is case-insensitive', () => {
        return request(app).get('/search-recipes?search=PaNcAkEs').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });
});
