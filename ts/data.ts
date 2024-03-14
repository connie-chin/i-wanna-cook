/* exported data */
interface Hit {
  recipe: {
    images: {
      SMALL: {
        url: string;
      };
    };
    label: string;
    url: string;
    emoji: string | undefined;
  };
}

interface Data {
  view: string;
  savedRecipes: Hit[];
}

const dataFromObject: Data = {
  view: '',
  savedRecipes: [],
};

const previousRecipesJSON = localStorage.getItem('i-wanna-cook-local-storage');

if (previousRecipesJSON !== null) {
  dataFromObject.savedRecipes = JSON.parse(previousRecipesJSON);
}

function forBeforeUnload(): void {
  const recipesJSON = JSON.stringify(dataFromObject.savedRecipes);
  localStorage.setItem('i-wanna-cook-local-storage', recipesJSON);
}
window.addEventListener('beforeunload', forBeforeUnload);
