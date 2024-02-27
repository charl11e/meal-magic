// Load ingredients and recipes
const ingredients = require('./ingredients');
const recipes = require('./recipes');

// Set up express and file system
const express = require('express');
const app = express();
const fs = require('fs');

// Load pages statically from client folder
app.use(express.static('client'));

// Add new recipes and ingredients
app.post('/new-recipe', (req, res) => {
    const title = req.body.title;
    const ingredients = req.body.ingredients;
    const servings = req.body.servings;
    const instructions = req.body.instructions;
    recipes.push({ title, servings, ingredients, instructions });
    fs.writeFileSync('./recipes.json', JSON.stringify(recipes));
    res.send('Recipe added!');
});

app.post('/new-ingredient', (req, res) => {
    // Check if ingredient already exists
    if (ingredients.includes(req.body.ingredient)) {
        res.send('Ingredient already exists');
    }
    ingredients.push(req.body.ingredient);
    fs.writeFileSync('./ingredients.json', JSON.stringify(ingredients));
    res.send('Ingredient added!');
});

module.exports = app;
