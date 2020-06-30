/* Global Variables */
// Base URL and API Key for OpenWeatherMap API
const baseURL = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&APPID=84b379cb9ec28aaca002d6de5f4d7c07';

//Get the date
let d = new Date();
let newDate = d.getDate() + '.' + d.getMonth() + '.' + d.getFullYear();

// Event listener to add function to existing HTML DOM element
document.getElementById('generate').addEventListener('click', performAction);

/* Function called by event listener */
function performAction(e) {
  e.preventDefault();
  // get user input values
  const newZip = document.getElementById('zip').value;
  const content = document.getElementById('feelings').value;
  
  getWeather(baseURL, newZip, apiKey)
    .then(function (userData) {
      // add data to POST request
      console.log(userData);
           
      postData('http://localhost:8000/add', { date: newDate, 
      temp: userData.main.temp, 
      content, 
      description: userData.weather[0].description,
      city: userData.name,  
      country: userData.sys.country, 
      iconID: userData.weather[0].icon })
    }).then(function () {
      // call updateUI to update browser content
      updateUI();
    })
}

/* Function to GET Web API Data---------------------------------------*/
const getWeather = async (baseURL, newZip, apiKey) => {
  // res equals to the result of fetch function
  const api =`${baseURL}${newZip}&units=metric${apiKey}`;
  const res = await fetch(api);
  try {
    // userData equals to the result of fetch function
    const userData = await res.json();
    return userData;
  } catch (error) {
    console.log("error", error);
  }
}

/* Function to POST data-------------------------------------------- */
const postData = async (url ='', data = {}) => {
  const req = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    },
    body: JSON.stringify(data)
  })
  try {
    const newData = await req.json();
    console.log(newData)
    return newData; 
  }catch (error) {
    console.log(error);
  }
};

const updateUI = async () => {
  const request = await fetch('http://localhost:8000/all');
  try {
    const allData = await request.json()
    document.getElementById('date').innerHTML = allData.date;
    document.getElementById('temp').innerHTML = allData.temp+` °C`;
    document.getElementById('content').innerHTML = allData.content;
    document.getElementById('description').innerHTML = allData.description;
    document.getElementById('iconID').innerHTML = `<img src="icons/${allData.iconID}.png"/>`;
    document.getElementById('city').innerHTML = allData.city;
    document.getElementById('country').innerHTML = allData.country;
  }catch (error) {
    console.log("error", error);
  }
};