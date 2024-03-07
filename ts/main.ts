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

const $form = document.querySelector('form');
const $healthLabelDD = document.querySelector(
  '#health-label',
) as HTMLSelectElement;
const $dietLabelDD = document.querySelector('#diet-label') as HTMLSelectElement;
const $cuisineTypeDD = document.querySelector(
  '#cuisine-type',
) as HTMLSelectElement;
const $mealTypeDD = document.querySelector('#meal-type') as HTMLSelectElement;
const $ul = document.querySelector('ul');

const $dialog = document.querySelector('dialog');
const $dismissModal = document.querySelector('.dismiss-modal');

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
  return $li;
}
