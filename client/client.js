// Capitalise first letter of each word (FreeCodeCamp 2024)
function capitalise (string) {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
}

// Get List of all recipes for sidebar
getRecipes();
async function getRecipes () {
    const sidebar = document.getElementById('recipes');
    try {
        // Fetch all recipes from the server
        const response = await fetch('/get-recipes');
        const recipes = await response.json();
        let recipelist = '';
        // Just in case a recipe is added more than once
        const recipesAdded = [];
        // Add all recipes to the sidebar
        for (const recipe in recipes) {
            // Checks so recipe is not added more than once
            if (recipesAdded.includes(recipes[recipe].title)) {
                continue;
            }
            recipelist += '<ul class="recipe click">' + capitalise(recipes[recipe].title) + '</ul>';
            recipesAdded.push(recipes[recipe].title);
        }
        sidebar.innerHTML = '<h3 class="click">Recipes</h3> <p>' + recipelist + '</p>';

        // Add an event listener for all recipes in the sidebar (MDN Web Docs 2023e)
        const recipeList = document.querySelectorAll('.recipe');
        for (const recipe of recipeList) {
            recipe.addEventListener('click', function () {
                getRecipe(recipe.textContent);
            });
        }
    } catch (error) {
        document.getElementById('errormessage').innerHTML = `<div class="alert alert-danger error" role="alert">Error occured while getting recipes from server: ${error}</div>`;
    }
}

// Get details of a single recipe
async function getRecipe (recipe) {
    try {
        // Fetch the recipe from the server
        const response = await fetch('/search-recipes?search=' + recipe);
        const recipes = await response.json();

        // Display the recipe(s)
        let details = '';
        for (const i in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[i].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            details += '<h3>' + capitalise(recipes[i].title) + '</h3><p>Servings: ' + recipes[i].servings + '</p><p>Ingredients:</p><ul>' + ingredients + '</ul><p>Instructions:</p><p>' + recipes[i].instructions + '</p>';
        }
        const recipeDetails = document.getElementById('recipe-details');
        recipeDetails.innerHTML = details;
    } catch (error) {
        document.getElementById('errormessage').innerHTML = `<div class="alert alert-danger error" role="alert">Error occured while getting recipes from server: ${error}</div>`;
    }
}
