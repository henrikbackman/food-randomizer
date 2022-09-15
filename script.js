let recipes,
    results,
    btn;

const changeAmountOfDays = () => {
  let form    = document.getElementById('settings'),
      radios  = form.querySelectorAll('input[type="radio"]'),
      ranges  = form.querySelectorAll('input[type="range"]'),
      elem,
      i;

  for (i = 0; i < radios.length; i++) {
    radios[i].addEventListener('click', (e) => {
      elem = e.target;

      if (!elem.checked) {
        return;
      }

      if (elem.id === 'day') {
        disable(ranges);
      } else {
        enable(ranges);
      }
    });
  }
};

const disable = (elems) => {
  let i;

  for (i = 0; i < elems.length; i++) {
    elems[i].setAttribute('disabled', 'disabled');
  }
};

const enable = (elems) => {
  let i;

  for (i = 0; i < elems.length; i++) {
    elems[i].removeAttribute('disabled');
  }
};

const generateRecipes = () => {
  btn = document.getElementById('generate');

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    handle(getData());
  }, false);
};

const getData = () => {
  let form    = document.getElementById('settings'),
      elems   = form.elements,
      checked = form.querySelector('input[type="radio"]:checked'),
      data    = {},
      input,
      i;

  for (i = 0; i < elems.length; i++) {
    input = elems[i];

    if (input.type !== 'radio' && input.nodeName !== 'BUTTON') {
      data[input.name] = parseInt(input.value);
    }
  }

  data.checked = checked.id;

  return data;
};

const handle = (data) => {
  if (!recipes.length) {
    btn.setAttribute('disabled', 'disabled');
    results.innerHTML = '<em>Inga fler recept</em> ☹️';
    return;
  }

  if (data.checked === 'day') {
    getOneDay();
  } else {
    getWeek(data);
  }
};

const getOneDay = (fromWeek) => {
  let result = Math.floor(Math.random() * recipes.length);

  if (fromWeek) {
    return recipes.splice(result, 1);
  }

  results.innerHTML = `<ol><li>${getContent(recipes[result])}</li></ol>`;

  // recipes.splice(result, 1);
};

const getWeek = (data) => {
  let nrOfDays  = 7,
      menu      = [],
      code      = '<ol>',
      i;

  for (i = 0; i < nrOfDays; i++) {
    menu.push(getOneDay(true));
  }
  // Get 7 recipes based on the settings/data
  // { vegitarian: "5", pasta: "1", bread: "2" }

  for (i = 0; i < menu.length; i++) {
    code += `<li>${getContent(menu[i][0])}</li>`;
  }

  code += '</ol>';

  results.innerHTML = code;
};

const getContent = (result) => {
  const bg = document.getElementById('background');

  let ingredients = '',
      book        = '',
      link        = '',
      ingredient,
      i;

  // if (result.image) {
  //   bg.style.backgroundImage = `url(${result.image})`;
  // } else {
  //   bg.removeAttribute('style');
  // }

  if (result.vegitarian) {
    ingredients += '<i class="fa-solid fa-carrot ingredient"></i>';
  }

  if (result.ingredients) {
    for (i = 0; i < result.ingredients.length; i++) {
      ingredient = result.ingredients[i];

      if (ingredient === 'meat') {
        ingredient = 'bacon';
      } else if (ingredient === 'pasta') {
        ingredient = 'plate-wheat';
      } else if (ingredient === 'bread') {
        ingredient = 'bread-slice';
      } else if (ingredient === 'rice') {
        ingredient = 'bowl-rice';
      } else if (ingredient === 'chicken') {
        ingredient = 'drumstick-bite';
      }

      ingredients += `<i class="fa-solid fa-${ingredient} ingredient"></i>`;
    }
  }

  if (result.url) {
    link = `<a href="${result.url}" target="blank">
              ${result.url.replace('https://', '').replace('www.', '')}
              <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>`;
  } else if (result.book) {
    book = `<i class="fa-solid fa-book"></i>
            <em>${result.book}</em>`;
  }

  return `<h2>${result.title}</h2>
          ${book}
          ${link}
          <div class="ingredients">
            ${ingredients}
          </div>`;
};

window.onload = () => {
  results = document.getElementById('result')

  fetch(`./recipes.json?v=${Date.now()}`).then(response => {
    return response.json();
  }).then(data => {
    recipes = data.recipes;
  });

  changeAmountOfDays();
  generateRecipes();
};