// All HTTP response status codes are used from MDN Web Docs (2023c)

// Load ingredients and recipes (W3Schools, 2023c)
let ingredients, recipes;
try {
    ingredients = require('./ingredients');
    recipes = require('./recipes');
} catch (err) {
    console.error('Error loading ingredients and recipes, data will be empty and may not be saved', err);
    ingredients = [
        { ingredient: 'potato' }
    ];
    recipes = [
        { test: 'test' }
    ];
};

// Set up express and file system
const express = require('express');
const app = express();
const fs = require('fs');

// Load pages statically from client folder and use JSON
app.use(express.static('client'));
app.use(express.json());

// Write to file function (MDN Web Docs, 2023a, 2023b) (StackAbuse, 2023) (DigitalOcean, 2020)
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

// Add new recipes and ingredients
app.post('/new-recipe', (req, res) => {
    // Duplicate recipe check has not been implemented as the same recipe can have different ingredients/instructions/servings
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const servings = req.body.servings;
    const instructions = req.body.instructions;
    recipes.push({ title, servings, ingredients, instructions });
    write('./recipes.json', recipes, res);
});

app.post('/new-ingredient', (req, res) => {
    // Check if ingredient is empty
    if (!req.body.ingredient) {
        res.status(400).send('Ingredient cannot be empty');
        return;
    }
    // Check if ingredient already exists
    for (const i in ingredients) {
        if (ingredients[i].ingredient === req.body.ingredient) {
            res.status(400).send('Ingredient already exists');
            return;
        }
    }
    // If not, add the ingredient
    ingredients.push({ ingredient: req.body.ingredient });
    write('./ingredients.json', ingredients, res);
});

// Initialise ingredients and recipes
app.post('/initialise', (req, res) => {
    console.log('IMPLEMENT ME');
});

// Look for recipes that use specific ingredients (NEEDS TO BE IMPLEMENTED PROPERLY)
app.get('/match-recipes', (req, res) => {
    const ingredientssearch = req.query.ingredients;
    const matchingrecipes = [];
    for (const i in recipes) {
        if (recipes[i].ingredients.includes(ingredientssearch)) {
            matchingrecipes.push(recipes[i]);
        }
    }
    res.send(matchingrecipes);
});

module.exports = app;
