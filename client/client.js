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
        // Add all recipes to the sidebar
        for (const recipe in recipes) {
            recipelist += '<ul class="recipe click">' + capitalise(recipes[recipe].title) + '</ul>';
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

        // Display the recipe
        const recipeDetails = document.getElementById('recipe-details');
        let ingredients = '';
        for (const ingredient of recipes[0].ingredients) {
            ingredients += '<li>' + capitalise(ingredient) + '</li>';
        }
        recipeDetails.innerHTML = '<h3>' + capitalise(recipes[0].title) + '</h3><p>Servings: ' + recipes[0].servings + '</p><p>Ingredients:</p><ul>' + ingredients + '</ul><p>Instructions:</p><p>' + recipes[0].instructions + '</p>';
    } catch (error) {
        document.getElementById('errormessage').innerHTML = `<div class="alert alert-danger error" role="alert">Error occured while getting recipes from server: ${error}</div>`;
    }
}
