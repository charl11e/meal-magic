// All HTTP response status codes are used from MDN Web Docs (2023c)

// Load ingredients and recipes (W3Schools, 2023c)
let ingredients, recipes;
try {
    ingredients = require('./ingredients');
    recipes = require('./recipes');
} catch (err) {
    console.error('Error loading ingredients and recipes, data will be empty and may not be saved', err);
    initalise();
};

// Set up express and file system
const express = require('express');
const app = express();
const fs = require('fs');

// Load pages statically from client folder and use JSON
app.use(express.static('client'));
app.use(express.json());

// Function to initialise ingredients and recipes (either used on demand or if there is an error loading the files)
function initalise () {
    ingredients = [
        { ingredient: 'potato' },
        { ingredient: 'butter' },
        { ingredient: 'milk' }
    ];
    recipes = [
        {
            title: 'mashed potatoes',
            servings: 4,
            ingredients: ['potato', 'butter', 'milk'],
            instructions: '1) Boil potatoes 2) Mash them with the butter and milk until desired consistency'
        }
    ];
    write('./ingredients.json', ingredients);
    write('./recipes.json', recipes);
}

// Function to write to file (MDN Web Docs, 2023a, 2023b) (StackAbuse, 2023) (DigitalOcean, 2020)
function write (filename, data, res) {
    fs.writeFile(filename, JSON.stringify(data), (err) => {
        if (err) {
            console.error('Error writing to file', err);
            res.status(500).send('Error writing to file');
            return;
        }
    res.send('Successfully added!');
    });
}

// Add new recipes
app.post('/new-recipe', (req, res) => {
    // Check if ingredients parameter is an array (MDN Web Docs, 2023d)
    if (!Array.isArray(req.body.ingredients)) {
        res.status(400).send('Ingredients must be sent in an array');
        return;
    }
    // Put all ingredients in lowercase
    for (const i in req.body.ingredients) {
        req.body.ingredients[i] = req.body.ingredients[i].toLowerCase();
    }
    // Duplicate recipe check has not been implemented as the same recipe can have different ingredients/instructions/servings
    const title = req.body.title.toLowerCase();
    const ingredients = req.body.ingredients;
    const servings = req.body.servings;
    const instructions = req.body.instructions;
    recipes.push({ title, servings, ingredients, instructions });
    write('./recipes.json', recipes, res);
});

// Add new ingredients
app.post('/new-ingredient', (req, res) => {
    // Check if ingredient is empty
    if (!req.body.ingredient) {
        res.status(400).send('Ingredient cannot be empty');
        return;
    }
    // Check if ingredient already exists
    for (const i in ingredients) {
        if (ingredients[i].ingredient === req.body.ingredient.toLowerCase()) {
            res.status(400).send('Ingredient already exists');
            return;
        }
    }
    // If not, add the ingredient
    ingredients.push({ ingredient: req.body.ingredient.toLowerCase() });
    write('./ingredients.json', ingredients, res);
});

// Initialise ingredients and recipes
app.delete('/initialise/', (req, res) => {
    initalise();
    res.send('Data has been initialised');
});

// Get ingredients
app.get('/get-ingredients/', (req, res) => {
    res.send(ingredients);
});

// Get recipes
app.get('/get-recipes/', (req, res) => {
    res.send(recipes);
});

// Search for ingredients
app.get('/search-ingredients/', (req, res) => {
    // Check if search parameter is empty
    if (!req.query.search) {
        res.status(400).send('Search cannot be empty');
        return;
    }
    // If not, put parameter into lowercase and search for it
    const query = req.query.search.toLowerCase();
    const results = [];
    for (const i in ingredients) {
        if (ingredients[i].ingredient.includes(query)) {
            results.push(ingredients[i]);
        }
    }
    res.send(results);
});

// Search for recipes (based on title/servings)
app.get('/search-recipes/', (req, res) => {
    // Check if search parameter is empty
    if (!req.query.search) {
        res.status(400).send('Search cannot be empty');
        return;
    }

    // If search query is a number, search based on servings (GeekforGeeks, 2024)
    const results = [];
    if (typeof (Number(req.query.search)) === 'number') {
        const query = Number(req.query.search);
        for (const i in recipes) {
            if (recipes[i].servings === query) {
                results.push(recipes[i]);
            }
        }
    }
    // No matter whether the search query is a number or not, search based on title
    const query = req.query.search.toLowerCase();
    for (const i in recipes) {
        if (recipes[i].title.includes(query)) {
            results.push(recipes[i]);
        }
    }

    // Return results
    res.send(results);
});

// Look for recipes that use specific ingredients
app.get('/match-recipes/', (req, res) => {
    // Check if search parameter is empty
    if (!req.query.search) {
        res.status(400).send('Search cannot be empty');
        return;
    }

    // Split the search query into an array of ingredients (W3Schools, 2023d)
    const query = req.query.search.split(',');
    for (const i in query) {
        query[i] = query[i].toLowerCase();
    }

    // Search for recipes that use the ingredients (must contain ALL ingredients)
    const results = [];
    for (const recipe of recipes) {
        if (query.filter(ingredient => recipe.ingredients.includes(ingredient)).length === recipe.ingredients.length) {
            results.push(recipe);
        }
    }

    // Return results
    res.send(results);
});

// Remove ingredients

// Remove recipes

// Edit recipes
module.exports = app;
