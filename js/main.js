'use strict';
const $form = document.querySelector('form');
const $healthLabelDD = document.querySelector('#health-label');
const $dietLabelDD = document.querySelector('#diet-label');
const $cuisineTypeDD = document.querySelector('#cuisine-type');
const $mealTypeDD = document.querySelector('#meal-type');
const $ul = document.querySelector('ul');
const $dialog = document.querySelector('dialog');
const $dismissModal = document.querySelector('.dismiss-modal');
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
    const data = await response.json();
    if (data.hits.length > 0) {
      for (let i = 0; i < data.hits.length; i++) {
        $ul?.append(renderRecipes(data.hits[i]));
      }
    } else {
      $dialog?.removeAttribute('class');
    }
  } catch (error) {
    console.log('error fetching recipes: ', error);
  }
}
$form?.addEventListener('submit', getRecipes);
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
  const $a = document.createElement('a');
  $a.setAttribute('href', `${entry.recipe.url}`);
  $a.setAttribute('target', '_blank');
  $a.textContent = `${entry.recipe.label}`;
  $p.append($a);
  $li.append($p);
  return $li;
}
