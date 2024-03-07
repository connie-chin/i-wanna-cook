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
  savedRecipes: Hit[];
}

let data: Data = {
  savedRecipes: [],
};

const previousDataJSON = localStorage.getItem('i-wanna-cook-local-storage');
function forBeforeUnload(): void {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('i-wanna-cook-local-storage', dataJSON);
}
window.addEventListener('beforeunload', forBeforeUnload);
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}
