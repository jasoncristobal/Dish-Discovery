const FILTER_URL = 'https://www.themealdb.com/api/json/v1/1/filter.php';

const LOOKUP_MEAL_URL = 'https://www.themealdb.com/api/json/v1/1/lookup.php';

let country = null; 
let food = null;

function watchSubmit() {
  $('.js-search-form').submit(event => {
    resultsTotal = 0;
    $('h2, .append-results, .error, .lowerHeadings').empty();
    $('section').removeClass('section-padding');
    $('h2').removeClass('lowerHeadings');
    $('section').removeAttr('hidden');
    event.preventDefault();
    const targetFood = $(event.currentTarget).find('.js-query');
    food = targetFood.val();
    const targetCountry = $(event.currentTarget).find('.js-query-country');
    country = targetCountry.val();
    targetCountry.val('');
    targetFood.val('');
    if (food === "" && country === "") {
      $('.error').html('<p>Make at least one selection</p>');
    } else if (food === "" && country !== "") {
      getCountryData(country, mealIDsForCountryOnlyQuery) 
    } else {
      getFoodData(food, mealIDsForFoodQuery);
    }
  });
}

function getCountryData(country, callback) {
  const query = {
    a: `${country}`
  }
  $.getJSON(FILTER_URL, query, callback);
}

function getFoodData(food, callback) {
  const query = {
    c: `${food}`
  }
  $.getJSON(FILTER_URL, query, callback);
}

function mealIDsForCountryOnlyQuery(countryData) {
  countItems = 0;
  itemsTotal = countryData.meals.length;
  for (let i = 0; i < countryData.meals.length; i++) {
    const mealID = countryData.meals[i].idMeal; 
    lookupMealID(mealID, filterResult); 
  }
}

function mealIDsForFoodQuery(foodData) {
  countItems = 0;
  itemsTotal = foodData.meals.length;
  for (let i = 0; i < foodData.meals.length; i++) {
    const mealID = foodData.meals[i].idMeal; 
    lookupMealID(mealID, filterResult); 
  }
}

function lookupMealID(mealID, callback) {
  const query = {
    i: `${mealID}`
  }
  $.getJSON(LOOKUP_MEAL_URL, query, callback);
}

let countItems = 0;
let itemsTotal = 0;
let resultsTotal = 0;
let description = null;

function filterResult(mealData) {
  countItems++;
  if (country !== '' && food === '' && `${mealData.meals[0].strCategory}` === "Desert") {
    description = 'Dessert';
    printResult(mealData);
  }
  else if (country !== '' && food === '' && `${mealData.meals[0].strCategory}` !== "Desert") {
    description = `${mealData.meals[0].strCategory}`;
    printResult(mealData);
  }
  else if (country === '' && food !== '') {
    description = `${mealData.meals[0].strArea}`;
    printResult(mealData);
  }
  else if (country !== '' && food === '') {
    description = `${mealData.meals[0].strCategory}`;
    printResult(mealData);
  } 
  else if (country === `${mealData.meals[0].strArea}` && food === `${mealData.meals[0].strCategory}`) {
    description = '';
    printResult(mealData);
  } else {
  checkIfZeroResults();
  }
}

function printResult(mealData) {
    resultsTotal++;
    $('.append-results').append(`
    <div class="col-4">
      <div class="card">
        <a href="${mealData.meals[0].strSource}" target="new"><img class="card-image" alt="${mealData.meals[0].strMeal}" src="${mealData.meals[0].strMealThumb}"></a>
        <div class="card-content">
          <h3>${mealData.meals[0].strMeal}</h3>
          <p>${description}</p>
          <p><a href="${mealData.meals[0].strYoutube}" class="youtube" target="new">How to make it (YouTube)</a></p>
        </div>
      </div>
    </div>
  `);
  checkIfZeroResults();
}

let zeroResults = null;

function checkIfZeroResults() {
  if (countItems === itemsTotal && $('.append-results').html() === '' && food !== "Desert" && country !== '') {
    zeroResults = `${country} ${food} Dishes`;
    printZeroResults();
  } else if (countItems === itemsTotal && $('.append-results').html() === '' && food === "Desert") {
    zeroResults = `${country} Desserts`;
    printZeroResults();    
  } else {
    checkNumberOfResults();
  }
}  

function printZeroResults() {
  $('h2').html(`No ${zeroResults} in <a href="https://www.themealdb.com" class="light" target="new">The Meal Database</a>`);
  $('.append-results').append(`<p>Change selections. Or try food only, or country only.</p>`);
}

let resultsType = null;

function checkNumberOfResults() {
  $('section').addClass('section-padding');
  if (resultsTotal === 1 && food !== "Desert") {
    resultsType = `${country} ${food} Dish`;
  } else if (resultsTotal === 1 && food === "Desert") {
    resultsType = `${country} Dessert`;
  } else if (resultsTotal > 1 && food === "Desert") {
    resultsType = `${country} Desserts`;
  } else if (resultsTotal > 1 && food !== "Desert") {
    resultsType = `${country} ${food} Dishes`;
  } if (countItems === itemsTotal) {
    $('h2').addClass('lowerHeadings');
  } printNumberOfResults();
}

function printNumberOfResults() {
  $('h2').html(`${resultsTotal} ${resultsType} in <a href="https://www.themealdb.com" class="light" target="new">The Meal Database</a>`);
}

$(watchSubmit);