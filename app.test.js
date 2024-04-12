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

    test('DELETE /initialise returns a message', () => {
        return request(app).delete('/initialise').expect('Data has been initialised');
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

    test('GET /search-ingredients returns a message if a search query is not specified', () => {
        return request(app).get('/search-ingredients').expect('Search cannot be empty');
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

    test('GET /search-recipes returns a message if a search query is not specified', () => {
        return request(app).get('/search-recipes').expect('Search cannot be empty');
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

// Test /match-recipes path
describe('GET /match-recipes', () => {
    test('GET /match-recipes returns status 200 if a search query is specified', () => {
        return request(app).get('/match-recipes?search=test').expect(200);
    });

    test('GET /match-recipes returns JSON if a search query is specified', () => {
        return request(app).get('/match-recipes?search=test').expect('Content-Type', /json/);
    });

    test('GET /match-recipes returns status 400 if a search query is not specified', () => {
        return request(app).get('/match-recipes').expect(400);
    });

    test('GET /match-recipes returns a message if a search query is not specified', () => {
        return request(app).get('/match-recipes').expect('Search cannot be empty');
    });

    test('GET /match-recipes returns HTML if a search query is not specified', () => {
        return request(app).get('/match-recipes').expect('Content-Type', /html/);
    });

    test('GET /match-recipes returns status 400 if search query is empty', () => {
        return request(app).get('/match-recipes?search=').expect(400);
    });

    test('GET /match-recipes returns HTML if search query is empty', () => {
        return request(app).get('/match-recipes?search=').expect('Content-Type', /html/);
    });

    test('GET /match-recipes correctly returns a list of recipes that can be made with the specified ingredients', () => {
        return request(app).get('/match-recipes?search=potato,butter,milk').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }]);
        });
    });

    test('GET /match-recipes will return multiple recipes if the search query matches multiple recipes', () => {
        return request(app).get('/match-recipes?search=potato,butter,milk,flour,sugar,eggs').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }, { title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('GET /match-recipes will return an empty array if the search query does not match any recipes', () => {
        return request(app).get('/match-recipes?search=test').then(response => {
            expect(response.body).toEqual([]);
        });
    });

    test('GET /match-recipes WILL NOT return partial matches', () => {
        return request(app).get('/match-recipes?search=potato,butter').then(response => {
            expect(response.body).toEqual([]);
        });
    });

    test('GET /match-recipes is case-insensitive', () => {
        return request(app).get('/match-recipes?search=PoTaTo,BuTtEr,MiLk').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }]);
        });
    });

    test('GET /match-recipes will still function correctly if the search query contains multiple instances of the same ingredient', () => {
        return request(app).get('/match-recipes?search=potato,potato,butter,milk').then(response => {
            expect(response.body).toEqual([{ title: 'mashed potatoes', servings: 4, ingredients: ['potato', 'butter', 'milk'], instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency' }]);
        });
    });
});

// Test /remove-ingredient path
describe('DELETE /remove-ingredient', () => {
    test('DELETE /remove-ingredient returns status 200 if an ingredient is specified', () => {
        return request(app).delete('/remove-ingredient/test').expect(200);
    });

    test('DELETE /remove-ingredient returns HTML if an ingredient is specified', () => {
        return request(app).delete('/remove-ingredient/test').expect('Content-Type', /html/);
    });

    test('DELETE /remove-ingredient returns status 400 if an ingredient is not specified', () => {
        return request(app).delete('/remove-ingredient').expect(400);
    });

    test('DELETE /remove-ingredient returns a message if an ingredient is not specified', () => {
        return request(app).delete('/remove-ingredient').expect('Ingredient must be specified');
    });

    test('DELETE /remove-ingredient returns HTML if an ingredient is not specified', () => {
        return request(app).delete('/remove-ingredient').expect('Content-Type', /html/);
    });

    test('DELETE /remove-ingredient correctly removes the specified ingredient', async () => {
        await request(app).delete('/remove-ingredient/potato');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'onion' }]);
        });
    });

    test('DELETE /remove-ingredient will not remove anything if the ingredient does not exist', async () => {
        await request(app).delete('/remove-ingredient/test');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'onion' }]);
        });
    });

    test('DELETE /remove-ingredient is case-insensitive', async () => {
        await request(app).delete('/remove-ingredient/OnIoN');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }]);
        });
    });

    test('DELETE /remove-ingredient will not remove any JSON characters', async () => {
        await request(app).delete('/remove-ingredient/{');
        await request(app).delete('/remove-ingredient/,');
        await request(app).delete('/remove-ingredient/}');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }]);
        });
    });

    test('DELETE /remove-ingredient will NOT remove based on partial matches', async () => {
        await request(app).delete('/remove-ingredient/su');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }]);
        });
    });

    test('DELETE /remove-ingredient will remove an ingredient that contains a space', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'test test' });
        await request(app).delete('/remove-ingredient/test test');
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }]);
        });
    });
});

// Test /remove-recipe path
describe('DELETE /remove-recipe', () => {
    test('DELETE /remove-recipe returns status 200 if a recipe is specified', () => {
        return request(app).delete('/remove-recipe/test').expect(200);
    });

    test('DELETE /remove-recipe returns HTML if a recipe is specified', () => {
        return request(app).delete('/remove-recipe/test').expect('Content-Type', /html/);
    });

    test('DELETE /remove-recipe returns status 400 if a recipe is not specified', () => {
        return request(app).delete('/remove-recipe').expect(400);
    });

    test('DELETE /remove-recipe returns a message if a recipe is not specified', () => {
        return request(app).delete('/remove-recipe').expect('Recipe must be specified');
    });

    test('DELETE /remove-recipe returns HTML if a recipe is not specified', () => {
        return request(app).delete('/remove-recipe').expect('Content-Type', /html/);
    });

    test('DELETE /remove-recipe correctly removes the specified recipe (including recipe with a space)', async () => {
        await request(app).delete('/remove-recipe/mashed potatoes');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }, { title: 'omelettes', servings: 2, ingredients: ['eggs', 'salt', 'pepper', 'oil', 'onion'], instructions: '1) Beat eggs and add salt and pepper 2) Fry in a pan with oil and onion' }]);
        });
    });

    test('DELETE /remove-recipe will not remove anything if the recipe does not exist', async () => {
        await request(app).delete('/remove-recipe/test');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }, { title: 'omelettes', servings: 2, ingredients: ['eggs', 'salt', 'pepper', 'oil', 'onion'], instructions: '1) Beat eggs and add salt and pepper 2) Fry in a pan with oil and onion' }]);
        });
    });

    test('DELETE /remove-recipe is case-insensitive', async () => {
        await request(app).delete('/remove-recipe/OmElEtTeS');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('DELETE /remove-recipe will not remove any JSON characters', async () => {
        await request(app).delete('/remove-recipe/{');
        await request(app).delete('/remove-recipe/,');
        await request(app).delete('/remove-recipe/}');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('DELETE /remove-recipe will NOT remove based on partial matches', async () => {
        await request(app).delete('/remove-recipe/pan');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('DELETE /remove-recipe will NOT remove based on servings/ingredients/instructions', async () => {
        await request(app).delete('/remove-recipe/4');
        await request(app).delete('/remove-recipe/flour');
        await request(app).delete('/remove-recipe/mix');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([{ title: 'pancakes', servings: 4, ingredients: ['flour', 'sugar', 'eggs', 'milk'], instructions: '1) Mix all ingredients together 2) Fry in a pan until golden brown 3) Top with sugar or other desired toppings' }]);
        });
    });

    test('DELETE /remove-recipe will remove multiple of the same recipe', async () => {
        await request(app).post('/new-recipe').send({ title: 'pancakes', servings: 4, ingredients: ['flour', 'eggs', 'milk'], instructions: 'The second amazing way to make pancakes!' });
        await request(app).delete('/remove-recipe/pancakes');
        return request(app).get('/get-recipes').then(response => {
            expect(response.body).toEqual([]);
        });
    });
});

// Test /new-ingredient path
describe('POST /new-ingredient', () => {
    test('POST /new-ingredient returns status 200 if an ingredient is specified', () => {
        return request(app).post('/new-ingredient').send({ ingredient: 'test1' }).expect(200);
    });

    test('POST /new-ingredient returns HTML if an ingredient is specified', () => {
        return request(app).post('/new-ingredient').send({ ingredient: 'test2' }).expect('Content-Type', /html/);
    });

    test('POST /new-ingredient returns status 400 if an ingredient is not specified', () => {
        return request(app).post('/new-ingredient').expect(400);
    });

    test('POST /new-ingredient returns HTML if an ingredient is not specified', () => {
        return request(app).post('/new-ingredient').expect('Content-Type', /html/);
    });

    test('POST /new-ingredient correctly adds the specified ingredient', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'test3' });
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'test1' }, { ingredient: 'test2' }, { ingredient: 'test3' }]);
        });
    });

    test('POST /new-ingredient will not add the same ingredient twice', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'test1' });
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'test1' }, { ingredient: 'test2' }, { ingredient: 'test3' }]);
        });
    });

    test('POST /new-ingredient returns status 400 if an ingredient already exists', () => {
        return request(app).post('/new-ingredient').send({ ingredient: 'test1' }).expect(400);
    });

    test('POST /new-ingredient returns a message if an ingredient already exists', () => {
        return request(app).post('/new-ingredient').send({ ingredient: 'test1' }).expect('Ingredient already exists');
    });

    test('POST /new-ingredient returns HTML if an ingredient already exists', () => {
        return request(app).post('/new-ingredient').send({ ingredient: 'test1' }).expect('Content-Type', /html/);
    });

    test('POST /new-ingredient is case-insensitive', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'TeSt4' });
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'test1' }, { ingredient: 'test2' }, { ingredient: 'test3' }, { ingredient: 'test4' }]);
        });
    });

    test('POST /new-ingredient will ignore any extra parameters if they are specified', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'test5', test: 'test' });
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'test1' }, { ingredient: 'test2' }, { ingredient: 'test3' }, { ingredient: 'test4' }, { ingredient: 'test5' }]);
        });
    });

    test('POST /new-ingredient handles spaces correctly', async () => {
        await request(app).post('/new-ingredient').send({ ingredient: 'test 6' });
        return request(app).get('/get-ingredients').then(response => {
            expect(response.body).toEqual([{ ingredient: 'butter' }, { ingredient: 'milk' }, { ingredient: 'flour' }, { ingredient: 'sugar' }, { ingredient: 'eggs' }, { ingredient: 'salt' }, { ingredient: 'pepper' }, { ingredient: 'oil' }, { ingredient: 'test1' }, { ingredient: 'test2' }, { ingredient: 'test3' }, { ingredient: 'test4' }, { ingredient: 'test5' }, { ingredient: 'test 6' }]);
        });
    });
});
