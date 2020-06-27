import axios from 'axios';

// DOM variables
var vehicleContainer = find('.container__vehicles');
var loader = find('.loader');
var proxyURL = `https://cors-anywhere.herokuapp.com/`;
var baseURL = `https://swapi.dev/api/vehicles/?pages=`;

// functions

function find(selector) {
  return document.querySelector(selector);
}

function findAll(selector) {
  return document.querySelectorAll(selector);
}

// function to render html

const renderHTML = (swVehicles) => {
  for (let vehicle of swVehicles) {
    let vehicleHTML = `<div data-name=${vehicle.name} class="container__vehicle container__vehicle--1">
    <p class="container__vehicle-name">
      <span>Name:</span> ${vehicle.name}
    </p>
    <p class="container__vehicle-model">
      <span>Model:</span> ${vehicle.model}
    </p>
    <p class="container__vehicle-manufacturer">
      <span>Manufacturer:</span> ${vehicle.manufacturer}
    </p>
    <p class="container__vehicle-cargo">
      <span>Cargo-capacity:</span> ${vehicle.cargo_capacity}
    </p>
    <p class="container__vehicle-url">
      ${vehicle.url}
    </p>
  </div>`;
    // console.log(vehicle);
    vehicleContainer.insertAdjacentHTML('beforeend', vehicleHTML);
  }
};

const renderSingleHTML = (vehicle) => {
  let vehicleHTML = `<div data-name=${vehicle.name} class="container__vehicle container__vehicle--1">
    <p class="container__vehicle-name">
      <span>Name:</span> ${vehicle.name}
    </p>
    <p class="container__vehicle-model">
      <span>Model:</span> ${vehicle.model}
    </p>
    <p class="container__vehicle-manufacturer">
      <span>Manufacturer:</span> ${vehicle.manufacturer}
    </p>
    <p class="container__vehicle-cargo">
      <span>Cargo-capacity:</span> ${vehicle.cargo_capacity}
    </p>
    <p class="container__vehicle-url">
      ${vehicle.url}
    </p>
  </div>`;
  // console.log(vehicle);
  vehicleContainer.insertAdjacentHTML('beforeend', vehicleHTML);
};
function fetchSWVehicles() {
  // loader.style.display = 'block';
  // const vehicles = localStorage.getItem('vehicles');
  // if (vehicles) {
  //   return Promise.resolve(JSON.parse(vehicles));
  // }
  const swPromise = fetch(baseURL)
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((res) => {
      const constructedData = [];
      let swVehicles = res.results;
      // console.log('Something', swVehicles);
      for (var vehicle of swVehicles) {
        // console.log(vehicle);
        var vehicleObj = {
          name: vehicle.name,
          model: vehicle.model,
          manufacturer: vehicle.manufacturer,
          cargo_capacity: vehicle.cargo_capacity,
          url: vehicle.url,
        };
        constructedData.push(vehicleObj);
      }
      // localStorage.setItem('vehicles', JSON.stringify(constructedData));
      return constructedData;
    })
    .catch((err) => {
      console.log(err);
    });

  return swPromise;
}

const fetchSWSingleVehicle = (vehicleName, cb) => {
  const indiSection = find('#individual');
  loader.style.display = 'block';
  // console.log(vehicleName.url.length);
  // console.log(JSON.stringify(vehicleName.url));
  // console.log(typeof vehicleName.url);
  // console.log(`http://swapi.dev/api/vehicles/7/`.length);
  fetch(`${vehicleName.url}`)
    // fetch(`http://swapi.dev/api/vehicles/7/`)
    .then(function (response) {
      return response.text();
    })
    .then(function (data) {
      cb(JSON.parse(data));
      return JSON.parse(data); // this will be a string
    });

  // console.log(typeof vehicleName);
  // return fetch(`${proxyURL}${vehicleName.url}`).then(function (response) {
  //   console.log('Responseeeee', response);
  //   return response.json();
  // });
};

const checkForHash = () => {
  if (
    window.location.hash !== '#home' &&
    window.location.hash !== '#individual'
  ) {
    window.location.hash = '#home';
  }
};

const renderPage = (hashValue) => {
  // section visible
  find(hashValue).style.display = 'block';
  if (hashValue === '#home') {
    fetchSWVehicles().then((vehicles) => {
      loader.style.display = 'none';
      renderHTML(vehicles);
    });
  }
};

const init = () => {
  checkForHash();
  // rendering that page alone
  renderPage(window.location.hash);
};

window.addEventListener('hashchange', (event) => {
  // check and redirect the correct hash
  checkForHash();
  // resetting the style property
  find('#home').style.display = 'none';
  find('#individual').style.display = 'none';
  // rendering that page alone
  renderPage(window.location.hash);
});

// To select a individual card,
vehicleContainer.addEventListener('click', function () {
  const isCardClicked = event.target.matches(
    '.container__vehicle, .container__vehicle *'
  );
  // If the selection is inside a card,
  if (isCardClicked) {
    const containerCard = event.target.closest('.container__vehicle');
    // console.log('Akash', containerCard);
    // const vehicleName = containerCard.dataset.name;
    const vehicleName = {
      url: containerCard.querySelector('.container__vehicle-url').textContent,
    };
    // console.log('DDDDDDD', vehicleName);
    window.location.hash = '#individual';
    let result;
    fetchSWSingleVehicle(vehicleName, (data) => {
      result = data;
      console.log(result);
      renderSingleHTML(result);
    });
  }
});

// start of program
init();
