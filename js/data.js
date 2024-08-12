"use strict";
const dataFromObject = {
    view: '',
    savedRecipes: [],
};
const previousRecipesJSON = localStorage.getItem('i-wanna-cook-local-storage');
if (previousRecipesJSON !== null) {
    dataFromObject.savedRecipes = JSON.parse(previousRecipesJSON);
}
function forBeforeUnload() {
    const recipesJSON = JSON.stringify(dataFromObject.savedRecipes);
    localStorage.setItem('i-wanna-cook-local-storage', recipesJSON);
}
window.addEventListener('beforeunload', forBeforeUnload);
