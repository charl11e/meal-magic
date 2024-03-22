// TODO: Refactor code for editing content when adding recipes/ingredients
// TODO: Reformat search results
// TODO: Possibly refactor error function
// TODO: Add a catch for the search bar

// Alerts for all errors made with help from Bootstrap Team, 2024b

// Capitalise first letter of each word (FreeCodeCamp 2024)
function capitalise (string) {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
}

// Change the boldness on tags if they are clicked
function selected (tag) {
    const hometag = document.getElementById('home-tag');
    const recipetag = document.getElementById('recipes-tag');
    hometag.classList.remove('active');
    recipetag.classList.remove('active');
    const alltags = document.querySelectorAll('.recipe');
    for (const tag of alltags) {
        tag.classList.remove('selected');
    }
    tag.classList.add('selected');
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
        sidebar.innerHTML = recipelist;

        // Add an event listener for all recipes in the sidebar (MDN Web Docs 2023e)
        const recipeList = document.querySelectorAll('.recipe');
        for (const recipe of recipeList) {
            recipe.addEventListener('click', function () {
                // Change content to the recipe and update the sidebar
                getRecipe(recipe.textContent);
                selected(recipe);
            });
        }
    } catch (error) {
        document.getElementById('errormessage').innerHTML += `<div class="alert alert-danger error" role="alert">Error occured while getting recipes from server: ${error}</div>`;
    }
}

// Get details of a recipe
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
        const recipeDetails = document.getElementById('content');
        recipeDetails.innerHTML = details;
    } catch (error) {
        document.getElementById('errormessage').innerHTML += `<div class="alert alert-danger error" role="alert">Error occured while getting recipes from server: ${error}</div>`;
    }
}

// Make Search Bar work
const search = document.getElementById('searchbox');
search.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(search);
    const searchParams = new URLSearchParams(formData);

    if (searchParams.get('search') === '') {
        return;
    }

    try {
        const response1 = await fetch('/search-recipes?' + searchParams.toString());
        const response2 = await fetch('/search-ingredients?' + searchParams.toString());
        const recipes = await response1.json();
        const ingredients = await response2.json();

        if (recipes.length === 0 && ingredients.length === 0) {
            document.getElementById('content').innerHTML = '<h3>No search results found</h3>';
            return;
        }

        let details = '<h1>Recipes</h1>';
        for (const i in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[i].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            details += '<h3>' + capitalise(recipes[i].title) + '</h3><p>Servings: ' + recipes[i].servings + '</p><p>Ingredients:</p><ul>' + ingredients + '</ul><p>Instructions:</p><p>' + recipes[i].instructions + '</p>';
        }

        details += '<h1>Ingredients</h1>';
        for (const i in ingredients) {
            details += '<h3>' + capitalise(ingredients[i].ingredient) + '</h3>';
        };

        document.getElementById('content').innerHTML = details;
    } catch (error) {
        console.log(error);
    }
});
