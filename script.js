const inputValue = document.getElementById("my_search");
const weatherCity = document.querySelector(".weather-city");
const searchBtn = document.querySelector(".btn");
const fadeClass = document.querySelector(".fade");
const currentDate = document.querySelector(".todays-date");
const weatherIcon = document.querySelector(".weather-icon");
const currentTemp = document.querySelector("[data-current-temp]");
const weatherDescription = document.querySelector(".data-current-description");
const currentHigh = document.querySelector("[data-current-high]");
const currentFeel = document.querySelector("[data-current-real-feel]");
const currentPressure = document.querySelector("[data-current-pressure]");
const currentLow = document.querySelector("[data-current-low]");
const currentHumid = document.querySelector("[data-current-humid]");
const currentWind = document.querySelector("[data-current-wind]");
const forecastDay = document.querySelectorAll(".forecast-day");
const prevSearch = document.querySelector(".previousSearches");
let srchedCities = localStorage.getItem("srchedCities")
  ? JSON.parse(localStorage.getItem("srchedCities"))
  : [];

const months = [
  "Jan",
  "Feb",
  "March",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function reset() {
  prevSearch.innerHTML = "";
  fadeClass.classList.remove("opaque");
}

function searchCity() {
  getForecast(inputValue.value.toLowerCase());
  reset();
}

function inputResult(e) {
  if (e.key != "Enter") return;
  searchCity();
}

function getSearchItems() {
  prevSearch.innerHTML = srchedCities.map((el) => `<li>${el}</li>`).join("");
  fadeClass.classList.add("opaque");

  prevSearch.querySelectorAll("li").forEach((item) =>
    item.addEventListener("click", function (e) {
      getForecast(e.target.innerHTML);
      reset();
    })
  );
}

function addValuesToDom(dataObject) {
  // weatherCity.innerText = `Weather in ${dataObject.city.toUpperCase()[0] + dataObject.city.slice(1)}`;
  weatherCity.innerText = `Weather in ${dataObject.city}`;
  currentDate.innerText = `Today,${new Date().getDate()} ${months[new Date().getMonth()]}`;
  weatherIcon.src = `http://openweathermap.org/img/wn/${dataObject.icon}@4x.png`;
  weatherDescription.innerText = `${dataObject.description}`;
  currentTemp.innerHTML = `${Math.round(dataObject.temp - 273)}&deg;`;
  currentHigh.innerHTML = `${Math.round(dataObject.temp_max - 273)}&deg;`;
  currentFeel.innerHTML = `${Math.round(dataObject.feels_like - 273)}&deg;`;
  currentPressure.innerText = `${dataObject.pressure}`;
  currentLow.innerHTML = `${Math.round(dataObject.temp_min - 273)}&deg;`;
  currentHumid.innerText = `${dataObject.humidity}`;
  currentWind.innerText = `${dataObject.wind_speed}`;
}

async function getJSON(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=f5f3b3e49956eeaeddcfd9a034c13e36`
    );
    if (!response.ok) throw new Error("Something went wrong");
    return await response.json();
  } catch (err) {
    throw err;
  }
}

function setValues(res) {
  let dataObject = res.list[0].main;
  dataObject.city = res.city.name;
  dataObject.wind_speed = res.list[0].wind.speed;
  dataObject.description = res.list[0].weather[0].main;
  dataObject.icon = res.list[0].weather[0].icon;
  return dataObject;
}

function updateForecast(day, index) {
  forecastDay[index].innerHTML = `
  <p class="day">${new Date(day.dt_txt).getDate() +" " +months[new Date(day.dt_txt).getMonth()]}</p>
  <img class="forecast-icon" src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="">
  <div class="temp">
    <div class="maxTemp">${Math.round(day.main.temp_max - 273)}&deg;</div>
    <div class="minTemp">${Math.round(day.main.temp_min - 273)}&deg;</div>
  </div>`;
}

const getForecast = async function (city) {
  try {
    const response = await getJSON(city);

    inputValue.value = "";
    let flag = 0;
    if (srchedCities.find((el) => el === city)) flag = 1;
    if (!flag) srchedCities.push(city);
    localStorage.setItem("srchedCities", JSON.stringify(srchedCities));

    addValuesToDom(setValues(response));

    const forecastArray = response.list.filter((_, idx) => idx % 8 ? false : true);
    forecastArray.forEach((day, i) => {
      forecastDay[i].innerHTML = "";
      updateForecast(day, i);
    });
  } catch (err) {
    console.log(err);
  }
};

inputValue.addEventListener("keydown", inputResult);
searchBtn.addEventListener("click", searchCity);
inputValue.addEventListener("click", getSearchItems);
window.addEventListener("load", (e) => {
  getForecast("delhi");
});
fadeClass.addEventListener("click", reset);
