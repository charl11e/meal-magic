// Alerts for all errors made with help from Bootstrap Team, 2024b

// Capitalise first letter of each word (FreeCodeCamp 2024)
function capitalise (string) {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
}

// Add error message
function displayError (err) {
    document.getElementById('errormessage').innerHTML = `<div class="alert alert-danger error" role="alert">${err}</div>`;
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

// Edit content of page
function changeContent (content) {
    const contentSpace = document.getElementById('content');
    contentSpace.innerHTML = content;
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
        displayError(`Error occured while getting recipes from server: ${error}`);
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
        changeContent(details);
    } catch (error) {
        displayError(`Error occured while getting recipe from server: ${error}`);
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
            changeContent('<h1>No results found</h1>');
            return;
        }

        let details = '<h1>Recipes</h1>';
        if (recipes.length === 0) {
            details += '<h3>No recipes found</h3>';
        }

        for (const i in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[i].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            details += '<h3>' + capitalise(recipes[i].title) + '</h3><p>Servings: ' + recipes[i].servings + '</p><p>Ingredients:</p><ul>' + ingredients + '</ul><p>Instructions:</p><p>' + recipes[i].instructions + '</p>';
        }

        details += '<h1>Ingredients</h1>';
        if (ingredients.length === 0) {
            details += '<h3>No ingredients found</h3>';
        }
        for (const i in ingredients) {
            details += '<li>' + capitalise(ingredients[i].ingredient) + '</li>';
        };

        changeContent(details);
    } catch (error) {
        displayError(`Error occured while searching for recipes and ingredients: ${error}`);
    }
});

// Get all recipes
const recipetag = document.getElementById('recipes-tag');
recipetag.addEventListener('click', async function (event) {
    // Change boldness on tags
    const alltags = document.querySelectorAll('.recipe');
    for (const tag of alltags) {
        tag.classList.remove('selected');
    }
    const hometag = document.getElementById('home-tag');
    hometag.classList.remove('active');
    recipetag.classList.add('active');

    // Get all recipes and display them
    try {
        const response = await fetch('/get-recipes');
        const recipes = await response.json();
        let content = '';
        for (const recipe in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[recipe].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            content += '<h3>' + capitalise(recipes[recipe].title) + '</h3><p>Servings: ' + recipes[recipe].servings + '</p><p>Ingredients:</p><ul>' + ingredients + '</ul><p>Instructions:</p><p>' + recipes[recipe].instructions + '</p>';
        }
        changeContent(content);
    } catch (error) {
        displayError(`Error occured while getting recipe from server: ${error}`);
    }
});
