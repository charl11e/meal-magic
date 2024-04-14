/* eslint-disable no-multiple-empty-lines */
// Disabled above rule as it allows me to separate out my code easier for different functions


// Alerts for all errors made with help from Bootstrap Team, 2024b



// Switch between light and dark mode (StackOverflow, 2020a) (W3Schools, 2024b)

// Check if a cookie exists for the theme
if (!document.cookie.includes('theme')) {
    document.cookie = 'theme=dark';
};

// Set theme to light or dark mode depending on the cookie
if (document.cookie.includes('theme=dark')) {
    goDark();
}

if (document.cookie.includes('theme=light')) {
    goLight();
}

// Functions for light and dark mode (StackOverflow, 2016a)
function goLight () {
    document.documentElement.setAttribute('data-bs-theme', 'light');
    document.getElementById('logo').setAttribute('src', '/assets/logo-dark.png');
    document.getElementById('logo-main').setAttribute('src', '/assets/logo-dark.png');
    document.getElementById('sidebar').classList.add('sidebar-light');
    document.getElementById('sidebar').classList.remove('sidebar-dark');
    document.documentElement.style.setProperty('--selected-color', 'black');
    document.body.style.backgroundColor = '#f2f3f4';
    document.cookie = 'theme=light';
}


function goDark () {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    document.getElementById('logo').setAttribute('src', '/assets/logo-light.png');
    document.getElementById('logo-main').setAttribute('src', '/assets/logo-light.png');
    document.getElementById('sidebar').classList.remove('sidebar-light');
    document.getElementById('sidebar').classList.add('sidebar-dark');
    document.documentElement.style.setProperty('--selected-color', 'white');
    document.body.style.backgroundColor = '';
    document.cookie = 'theme=dark';
}

// Switch between light and dark mode
document.getElementById('theme-toggle').addEventListener('click', function () {
    // Check if logo is on light or dark mode by checking cookies
    if (document.cookie.includes('theme=dark')) {
        goLight();
    } else {
        goDark();
    };
});



// Miscellaneous Functions

// Capitalise first letter of each word (FreeCodeCamp 2024)
function capitalise (string) {
    const words = string.split(' ');
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    return words.join(' ');
}

// Add error message (Bootstrap, 2024b)
function displayError (err) {
    document.getElementById('errormessage').innerHTML = `<div class="alert alert-danger error" role="alert">${err}. Please ensure the server is running/running with no errors.</div>`;
    tryConnection();
}

// Function to try connection on server disconnect/error (Bootstrap, 2024b) - Disabled ESLint rules as the responses are not used
async function tryConnection () {
    try {
        // eslint-disable-next-line no-unused-vars
        const response1 = await fetch('/get-ingredients');
        // eslint-disable-next-line no-unused-vars
        const response2 = await fetch('/get-recipes');
        document.getElementById('errormessage').innerHTML = '<div class="alert alert-success error" role="alert">Connection to server re-established</div>';
     } catch (err) {
        setTimeout(tryConnection, 2000);
     }
}

// Change the boldness on tags if they are clicked
function selected (tag) {
    const hometag = document.getElementById('home-tag');
    const recipetag = document.getElementById('recipes-tag');
    const matchtag = document.getElementById('match-tag');
    hometag.classList.remove('selected');
    recipetag.classList.remove('selected');
    matchtag.classList.remove('selected');
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



// Functions that get data from the server and set up the page with the data

// Get List of all recipes for sidebar (Also adds all recipes for the dropdown when removing a recipe - saves having to fetch twice)
getRecipes();
async function getRecipes () {
    const sidebar = document.getElementById('recipes');
    const removeDropdown = document.getElementById('remove-recipe-list');
    try {
        // Fetch all recipes from the server
        const response = await fetch('/get-recipes');
        const recipes = await response.json();
        let recipelist = '';
        let dropdownlist = '';
        // Just in case a recipe is added more than once
        const recipesAdded = [];
        // Add all recipes to the sidebar
        for (const recipe in recipes) {
            // Checks so recipe is not added more than once
            if (recipesAdded.includes(recipes[recipe].title)) {
                continue;
            }
            recipelist += '<ul class="recipe click">' + capitalise(recipes[recipe].title) + '</ul>';
            dropdownlist += '<a class="dropdown-item recipe-selector" href="#">' + capitalise(recipes[recipe].title) + '</a>';
            recipesAdded.push(recipes[recipe].title);
        }
        sidebar.innerHTML = recipelist;
        removeDropdown.innerHTML = dropdownlist;

        // Add an event listener for all recipes in the sidebar (MDN Web Docs 2023e)
        const recipeList = document.querySelectorAll('.recipe');
        for (const recipe of recipeList) {
            recipe.addEventListener('click', function () {
                // Change content to the recipe and update the sidebar
                getRecipe(recipe.textContent);
                selected(recipe);
            });
        }

        // Add event listener for all ingredients in the selector when adding a new recipe
        const recipeSelector = document.querySelectorAll('.recipe-selector');
        for (const selector of recipeSelector) {
            selector.addEventListener('click', function () {
                selector.classList.toggle('active');
            });
        };
    } catch (error) {
        displayError(`Error occured while getting recipes from server: ${error}`);
    }
}

// Get list of all ingredients for sidebar (Also adds all ingredients for the dropdown when adding a new recipe/removing recipe - saves having to fetch several times (W3Schools, 2023f) (Bootstrap Team, 2024g))
getIngredients();
async function getIngredients () {
    const sidebar = document.getElementById('ingredients');
    const ingredientDropdown = document.getElementById('ingredient-list');
    const ingredientDropdownRemove = document.getElementById('remove-ingredient-list');
    try {
        // Fetch all ingredients from the server
        const response = await fetch('/get-ingredients');
        const ingredients = await response.json();
        let ingredientlist = '';
        let ingredientListDropdown = '';
        let ingredientListDropdownRemove = '';
        for (const ingredient in ingredients) {
            ingredientlist += `<div class="form-check form-switch ingredient-list"> <input class="ingredient form-check-input" type="checkbox" role="switch" id="switch-${capitalise(ingredients[ingredient].ingredient)}"> <label class="form-check-label ingredient" for="switch-${capitalise(ingredients[ingredient].ingredient)}">${capitalise(ingredients[ingredient].ingredient)}</label></div>`;
            ingredientListDropdown += '<a class="dropdown-item ingredient-selector" href="#">' + capitalise(ingredients[ingredient].ingredient) + '</a>';
            ingredientListDropdownRemove += '<a class="dropdown-item ingredient-selector remove" href="#">' + capitalise(ingredients[ingredient].ingredient) + '</a>';
        }
        sidebar.innerHTML = ingredientlist;
        ingredientDropdown.innerHTML = ingredientListDropdown;
        ingredientDropdownRemove.innerHTML = ingredientListDropdownRemove;

        // Add event listener for all ingredients in the selector when adding a new recipe
        const ingredientSelector = document.querySelectorAll('.ingredient-selector');
        for (const selector of ingredientSelector) {
            selector.addEventListener('click', function () {
                selector.classList.toggle('active');
            });
        };
    } catch (error) {
        displayError(`Error occured while getting ingredients from server: ${error}`);
    }
}



// Functions that get details of specific elements to display on the page

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
            details += '<h3 class="recipe-title">' + capitalise(recipes[i].title) + '</h3><p class="recipe-servings">Servings: ' + recipes[i].servings + '</p><p class="recipe-ingredients">Ingredients:</p><ul>' + ingredients + '</ul><p class="recipe-instructions">Instructions:</p><p class="recipe-instruction-content">' + recipes[i].instructions + '</p>';
        }
        changeContent(details);
    } catch (error) {
        displayError(`Error occured while getting recipe from server: ${error}`);
    }
}

// Get all recipes
const recipetag = document.getElementById('recipes-tag');
recipetag.addEventListener('click', async function (event) {
    // Change boldness on tags
    selected(document.getElementById('recipes-tag'));
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
            content += '<h3 class="recipe-title">' + capitalise(recipes[recipe].title) + '</h3><p class="recipe-servings">Servings: ' + recipes[recipe].servings + '</p><p class="recipe-ingredients">Ingredients:</p><ul>' + ingredients + '</ul><p class="recipe-instructions">Instructions:</p><p class="recipe-instruction-content">' + recipes[recipe].instructions + '</p>';
        }
        changeContent(content);
    } catch (error) {
        displayError(`Error occured while getting recipes from server: ${error}`);
    }
});

// Match Recipes based on ingredients (StackOverflow, 2020b) (MDN Web Docs, 2023f)
const matchtag = document.getElementById('match-tag');
matchtag.addEventListener('click', async function (event) {
    // Get a list of ingredients that are toggled on and send a request to the server to match the recipes
    try {
        // Get all selected ingredients
        const selectedIngredients = document.querySelectorAll('.ingredient-list');
        const toggled = [];
        for (const ingredient of selectedIngredients) {
            if (ingredient.querySelector('.ingredient').checked) {
                toggled.push(ingredient.textContent.slice(2));
            }
        }
        // Check if any ingredients are selected
        if (toggled.length === 0) {
            changeContent('<h1>Please select at least one ingredient to match recipes</h1>');
            return;
        }
        // Send the list of ingredients to the server (W3Schools, 2024c)
        const response = await fetch('/match-recipes?search=' + toggled.toString());
        const recipes = await response.json();
        if (recipes.length === 0) {
            changeContent('<h1>No recipes found</h1>');
            return;
        }
        let content = '';
        for (const recipe in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[recipe].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            content += '<h3 class="recipe-title">' + capitalise(recipes[recipe].title) + '</h3><p class="recipe-servings">Servings: ' + recipes[recipe].servings + '</p><p class="recipe-ingredients">Ingredients:</p><ul>' + ingredients + '</ul><p class="recipe-instructions">Instructions:</p><p class="recipe-instruction-content">' + recipes[recipe].instructions + '</p>';
        }
        changeContent(content);
    } catch (error) {
        displayError(`Error occured while getting recipes for specific ingredients: ${error}`);
    }
});


// Function to make search bar work

// Make Search Bar work
const search = document.getElementById('searchbox');
search.addEventListener('submit', async function (event) {
    event.preventDefault();
    selected(document.getElementById('home-tag'));
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

        let details = '<h1 class="search-header">Recipes</h1>';
        if (recipes.length === 0) {
            details += '<h3>No recipes found</h3>';
        }

        for (const i in recipes) {
            let ingredients = '';
            for (const ingredient of recipes[i].ingredients) {
                ingredients += '<li>' + capitalise(ingredient) + '</li>';
            }
            details += '<h3 class="recipe-title">' + capitalise(recipes[i].title) + '</h3><p class="recipe-servings">Servings: ' + recipes[i].servings + '</p><p class="recipe-ingredients">Ingredients:</p><ul>' + ingredients + '</ul><p class="recipe-instructions">Instructions:</p><p class="recipe-instruction-content">' + recipes[i].instructions + '</p>';
        }

        details += '<h1 class="search-header">Ingredients</h1>';
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



// Functions that are used within the modify tab

// Initialise function
document.getElementById('initialise-button').addEventListener('click', async function () {
    try {
        const response = await fetch('/initialise', { method: 'DELETE' });
        if (response.status !== 200) {
            displayError('Error occured while initialising the data');
            return;
        }
        // eslint-disable-next-line no-undef
        location.reload();
    } catch (error) {
        displayError(`Error occured while initialising the data: ${error}`);
    }
});

// New Ingredient Function
const newIngredient = document.getElementById('add_ingredient');

newIngredient.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(newIngredient);
    const formDataJSON = JSON.stringify(Object.fromEntries(formData));
    const response = await fetch('/new-ingredient',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: formDataJSON
    });
    if (response.ok) {
        window.location.reload();
    } else {
        displayError('Error occured while adding the ingredient. Please ensure field has been filled out and ingredient does not already exist');
    }
});

// New Recipe Function (MDN Web Docs, 2023e) (W3Schools, 2024a)
const newRecipe = document.getElementById('add_recipe');
newRecipe.addEventListener('submit', async function (event) {
    event.preventDefault();
    const formData = new FormData(newRecipe);
    let formDataJSON = JSON.stringify(Object.fromEntries(formData));

    // Get all selected ingredients
    const selectedIngredients = document.querySelectorAll('.ingredient-selector.active');
    const ingredients = [];
    for (const ingredient of selectedIngredients) {
        ingredients.push(ingredient.textContent);
    }
    formDataJSON = formDataJSON.slice(0, -1) + ',"ingredients":' + JSON.stringify(ingredients) + '}';

    // Send the data to the server
    const response = await fetch('/new-recipe',
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: formDataJSON
    });
    if (response.ok) {
        window.location.reload();
    } else {
        displayError('Error occured while adding the recipe. Please ensure all fields have been filled out and ingredients have been selected');
    }
});

// Remove Recipe/Ingredient Function
document.getElementById('remove-button').addEventListener('click', async function () {
    const recipesSelected = document.querySelectorAll('.recipe-selector.active');
    const ingredientsSelected = document.querySelectorAll('.ingredient-selector.remove.active');
    if (recipesSelected.length === 0 && ingredientsSelected.length === 0) {
        displayError('Please select a recipe or ingredient to remove');
    } else {
        // Iterate over all selected recipes
        for (const recipe of recipesSelected) {
            // Send a delete request to the server
            const response = await fetch('/remove-recipe/' + recipe.textContent, { method: 'DELETE' });
            if (!response.ok) {
                displayError('Error occured while removing the recipe');
            }
        }

        // Iterate over all selected ingredients
        for (const ingredient of ingredientsSelected) {
            // Send a delete request to the server
            const response = await fetch('/remove-ingredient/' + ingredient.textContent, { method: 'DELETE' });
            if (!response.ok) {
                displayError('Error occured while removing the ingredient');
            }
        }

        // Reload the page
        window.location.reload();
    }
});
