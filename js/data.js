'use strict';
let data = {
  savedRecipes: [],
};
const previousDataJSON = localStorage.getItem('i-wanna-cook-local-storage');
function forBeforeUnload() {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('i-wanna-cook-local-storage', dataJSON);
}
window.addEventListener('beforeunload', forBeforeUnload);
if (previousDataJSON !== null) {
  data = JSON.parse(previousDataJSON);
}
