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

// interface RecipeObject {
//   label: string;
//   imgUrl: string;
//   recipeUrl: string;
// }

// console.log('datafromobject', dataFromObject);

// interface Values {
//   dietLabelDD: string;
//   cuisineTypeDD: string;
//   mealTypeDD: string;
//   healthLabelDD: string;
// }

let dataFromApi: any;
const $form = document.querySelector('form');
const $healthLabelDD = document.querySelector(
  '#health-label',
) as HTMLSelectElement;
const $dietLabelDD = document.querySelector('#diet-label') as HTMLSelectElement;
const $cuisineTypeDD = document.querySelector(
  '#cuisine-type',
) as HTMLSelectElement;
const $mealTypeDD = document.querySelector('#meal-type') as HTMLSelectElement;
const $ul = document.querySelector('ul') as HTMLUListElement;

const $dialog = document.querySelector('dialog') as HTMLDialogElement;
const $dismissModal = document.querySelector('.dismiss-modal') as HTMLElement;

const $recipeContainer = document.querySelector(
  '.recipe-container',
) as HTMLDivElement;

const $homeView = document.querySelector(
  '[data-view="home"]',
) as HTMLDivElement;
const $wantToTryView = document.querySelector(
  '[data-view="want-to-try"]',
) as HTMLDivElement;
// const $wantToTryContainer = document.querySelector('.want-to-try-container') as HTMLDivElement;
const $utensilsIcon = document.querySelector('.fa-utensils') as HTMLElement;

const $homeIcon = document.querySelector('.fa-house') as HTMLElement;
const $ulForSavedRecipes = document.querySelector('#for-want-to-try');

async function getRecipes(event: Event): Promise<void> {
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
    // console.log('dataFromApi:', dataFromApi);

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

function forRecipeContainer(event: Event): void {
  // console.log('recipe container clicked');
  if (event.target?.tagName === 'BUTTON') {
    console.log('save button was clicked');
    const li = event.target.closest('li');
    // console.log('li', li);
    const recipeLabel = li.querySelector('a').textContent;
    console.log('recipe label:', recipeLabel);

    for (let i = 0; i < dataFromApi.hits.length; i++) {
      if (recipeLabel === dataFromApi.hits[i].recipe.label) {
        console.log('datafrom api hits', dataFromApi.hits[i].recipe);
        dataFromObject.savedRecipes.push(dataFromApi.hits[i].recipe);
      }
    }
  }
  // console.log('here once');
  // console.log('datafromObject:', dataFromObject.savedRecipes);
  savedRecipesGenerator();
  // const newImgUrl = dataFromObject.savedRecipes[9].images.SMALL.url;
  // console.log('newimg', newImgUrl);
}

$recipeContainer?.addEventListener('click', forRecipeContainer);

function viewSwap(view: string): void {
  if (view === 'home') {
    $homeView.className = '';
    $wantToTryView.className = 'hidden';
  } else if (view === 'want-to-try') {
    $homeView.className = 'hidden';
    $wantToTryView.className = '';
  }
}

function forHomeIconClick(): void {
  console.log('home clicked');
  dataFromObject.view = 'home';
  viewSwap('home');
}

$homeIcon?.addEventListener('click', forHomeIconClick);

function forUtensilsIconClick(): void {
  console.log('utensils clicked');
  dataFromObject.view = 'want-to-try';
  viewSwap('want-to-try');
}
$utensilsIcon?.addEventListener('click', forUtensilsIconClick);

function savedRecipesGenerator(): void {
  for (let i = 0; i < dataFromObject.savedRecipes.length; i++) {
    const $liNew = document.createElement('li') as HTMLLIElement;
    $liNew.setAttribute('class', 'column-one-fifth');
    const newImgUrl = dataFromObject.savedRecipes[i].images.SMALL.url;
    const $newImg = document.createElement('img') as HTMLImageElement;
    $newImg.setAttribute('src', newImgUrl);
    $liNew.append($newImg);
    const $pNew = document.createElement('p') as HTMLParagraphElement;
    const $aNew = document.createElement('a') as HTMLAnchorElement;
    const newA = dataFromObject.savedRecipes[i].url;
    $aNew.setAttribute('href', `${newA}`);
    $aNew.setAttribute('target', 'blank');
    $aNew.textContent = dataFromObject.savedRecipes[i].label;
    $pNew.append($aNew);
    $liNew.append($pNew);
    $ulForSavedRecipes?.append($liNew);
  }
}

function forClosingModal(): void {
  $dialog?.setAttribute('class', 'hidden');
}
$dismissModal?.addEventListener('click', forClosingModal);

function renderRecipes(entry: Hit): HTMLLIElement {
  const $li = document.createElement('li') as HTMLLIElement;
  $li.setAttribute('class', 'column-one-fifth');
  const $img = document.createElement('img') as HTMLImageElement;
  $img.setAttribute('src', `${entry.recipe.images.SMALL.url}`);
  $li.append($img);
  const $p = document.createElement('p') as HTMLParagraphElement;
  const $a = document.createElement('a') as HTMLAnchorElement;
  $a.setAttribute('href', `${entry.recipe.url}`);
  $a.setAttribute('target', '_blank');
  $a.textContent = `${entry.recipe.label}`;
  $p.append($a);
  $li.append($p);
  const $button = document.createElement('button') as HTMLButtonElement;
  // $button.setAttribute('class', 'hidden');
  $button.setAttribute('id', 'save-button');

  // const $i = document.createElement('i') as HTMLElement; //why is this not appending??!
  // $i.setAttribute('class', 'fa-solid fa-bookmark');
  // $i.setAttribute('style', 'color: rbg(52, 154, 213)');
  // $button.append($i);
  $button.innerHTML = `<i class="fa-solid fa-bookmark" style="color: rgb(52, 154, 213)"></i>Save`;
  // $button.textContent = 'Save';
  $li.append($button);
  return $li;
}

// const $recipeCard = document.querySelector('li');
// function forMouseOverOnRecipeCard (event: Event) {
//   console.log('mouseoverevent triggered');
//   const $saveButton = document.querySelector('#save-button');
//   if ($saveButton) $saveButton.className =''; //if save button is truthy
// }

// function forMouseOverExit (event: Event) {
//   console.log('mouseoveexit triggered');
//   const $saveButton = document.querySelector('#save-button');
//   if ($saveButton) $saveButton.className ='hidden'; //if save button is truthy
// }

// $recipeCard?.addEventListener('mouseleave', forMouseOverExit);

// $recipeCard?.addEventListener('mouseenter', forMouseOverOnRecipeCard);
