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
  };
}

interface Data {
  entryId: number;
  view: string;
  // editing: null;
  savedRecipes: Hit[];
}

const dataFromObject: Data = {
  entryId: 1,
  view: '',
  // editing: null,
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
