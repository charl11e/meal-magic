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
        const response = await fetch('/get-recipes');
        const recipes = await response.json();
        let recipelist = '';
        for (const recipe in recipes) {
            recipelist += '<ul>' + capitalise(recipes[recipe].title) + '</ul>';
        }
        sidebar.innerHTML = '<h3>Recipes</h3> <p>' + recipelist + '</p>';
    } catch (error) {
        console.log(error);
    }
}
