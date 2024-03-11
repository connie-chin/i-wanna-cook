'use strict';
let dataFromApi;
const $form = document.querySelector('form');
const $healthLabelDD = document.querySelector('#health-label');
const $dietLabelDD = document.querySelector('#diet-label');
const $cuisineTypeDD = document.querySelector('#cuisine-type');
const $mealTypeDD = document.querySelector('#meal-type');
const $ul = document.querySelector('ul');
const $dialog = document.querySelector('dialog');
const $dismissModal = document.querySelector('.dismiss-modal');
const $recipeContainer = document.querySelector('.recipe-container');
const $homeView = document.querySelector('[data-view="home"]');
const $wantToTryView = document.querySelector('[data-view="want-to-try"]');
// const $wantToTryContainer = document.querySelector('.want-to-try-container') as HTMLDivElement;
const $utensilsIcon = document.querySelector('.fa-utensils');
const $homeIcon = document.querySelector('.fa-house');
const $ulForSavedRecipes = document.querySelector('#for-want-to-try');
async function getRecipes(event) {
  event.preventDefault();
  const healthLabelChosen = $healthLabelDD?.value.toLowerCase();
  const dietLabelChosen = $dietLabelDD?.value.toLowerCase();
  const cuisineTypeChosen = $cuisineTypeDD?.value.toLowerCase();
  const mealTypeChosen = $mealTypeDD?.value.toLowerCase();
  if (
    !healthLabelChosen ||
    !dietLabelChosen ||
    !cuisineTypeChosen ||
    !mealTypeChosen
  ) {
    return;
  }
  try {
    const response = await fetch(
      `https://api.edamam.com/api/recipes/v2?type=public&app_id=4cb55ace&app_key=81856863fef105aa81633e75ce29cc63&diet=${dietLabelChosen}&health=${healthLabelChosen}&cuisineType=${cuisineTypeChosen}&mealType=${mealTypeChosen}&dishType=Main%20course&imageSize=SMALL`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    dataFromApi = await response.json();
    $ul.textContent = '';
    if (dataFromApi.hits.length > 0) {
      for (let i = 0; i < dataFromApi.hits.length; i++) {
        $ul?.append(renderRecipes(dataFromApi.hits[i]));
      }
    } else {
      $dialog?.removeAttribute('class');
    }
  } catch (error) {
    console.log('error fetching recipes: ', error);
  }
  // clear the search field here?
  $healthLabelDD.value = '';
  $dietLabelDD.value = '';
  $cuisineTypeDD.value = '';
  $mealTypeDD.value = '';
}
$form?.addEventListener('submit', getRecipes);
function forRecipeContainer(event) {
  if (event.target?.tagName === 'BUTTON') {
    const li = event.target.closest('li');
    const recipeLabel = li.querySelector('a').textContent;
    for (let i = 0; i < dataFromApi.hits.length; i++) {
      if (recipeLabel === dataFromApi.hits[i].recipe.label) {
        dataFromObject.savedRecipes.push(dataFromApi.hits[i].recipe);
      }
    }
  }
  savedRecipesGenerator();
}
$recipeContainer?.addEventListener('click', forRecipeContainer);
function viewSwap(view) {
  if (view === 'home') {
    $homeView.className = '';
    $wantToTryView.className = 'hidden';
  } else if (view === 'want-to-try') {
    $homeView.className = 'hidden';
    $wantToTryView.className = '';
  }
}
function forHomeIconClick() {
  dataFromObject.view = 'home';
  viewSwap('home');
}
$homeIcon?.addEventListener('click', forHomeIconClick);
function forUtensilsIconClick() {
  dataFromObject.view = 'want-to-try';
  viewSwap('want-to-try');
}
$utensilsIcon?.addEventListener('click', forUtensilsIconClick);
function savedRecipesGenerator() {
  $ulForSavedRecipes.textContent = '';
  for (let i = 0; i < dataFromObject.savedRecipes.length; i++) {
    const $liNew = document.createElement('li');
    $liNew.setAttribute('class', 'column-one-fifth');
    const newImgUrl = dataFromObject.savedRecipes[i].images.SMALL.url;
    const $newImg = document.createElement('img');
    $newImg.setAttribute('src', newImgUrl);
    $liNew.append($newImg);
    const $pNew = document.createElement('p');
    const $aNew = document.createElement('a');
    const newA = dataFromObject.savedRecipes[i].url;
    $aNew.setAttribute('href', `${newA}`);
    $aNew.setAttribute('target', 'blank');
    $aNew.textContent = dataFromObject.savedRecipes[i].label;
    $pNew.append($aNew);
    $liNew.append($pNew);
    $ulForSavedRecipes?.append($liNew);
  }
}
document.addEventListener('DOMContentLoaded', function () {
  savedRecipesGenerator();
});
function forClosingModal() {
  $dialog?.setAttribute('class', 'hidden');
}
$dismissModal?.addEventListener('click', forClosingModal);
function renderRecipes(entry) {
  const $li = document.createElement('li');
  $li.setAttribute('class', 'column-one-fifth');
  const $img = document.createElement('img');
  $img.setAttribute('src', `${entry.recipe.images.SMALL.url}`);
  $li.append($img);
  const $p = document.createElement('p');
  $p.setAttribute('class', 'label');
  const $a = document.createElement('a');
  $a.setAttribute('href', `${entry.recipe.url}`);
  $a.setAttribute('target', '_blank');
  $a.textContent = `${entry.recipe.label}`;
  $p.append($a);
  $li.append($p);
  const $button = document.createElement('button');
  $button.setAttribute('id', 'save-button');
  $button.innerHTML = `<i class="fa-solid fa-bookmark" style="color: rgb(52, 154, 213)"></i>Save`;
  $li.append($button);
  return $li;
}
