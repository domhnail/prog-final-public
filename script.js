"use strict";
/*
Program Name: Country Displayer
Description: Displays all the pertinent info about a selected country.
Date: 05/12/2023
Author: Cole D. O'Donnell
*/

if(localStorage.ns == null) //check if localStorage is null
{ 
    var serverRequest = new XMLHttpRequest(); //variable for XHR object to request data from the server

    serverRequest.onreadystatechange = function() { //checking that request is ready to execute
        if (this.readyState == 4 && this.status == 200) { //check that request is complete and data has been retrieved, then call DisplayCountryData
            localStorage.ns = this.responseText; 
            DisplayCountryData();
        }
    };
    serverRequest.open("GET", "countries.json", true); //initializing the content of the request
    serverRequest.send(); //executing the request for the data
    console.log(localStorage.ns)
}
else //else if data is already in local storage then call ListCountries
{
    DisplayCountryData(); 
}
function FlagNamer(countrySel) { //function for writing the filename to point to the right flag image
  let flagName = ""; //declaring variable to store the filename
  for (let char = 0; char < countrySel.length; char++) { //looping through all the characters of the country's name
    if (countrySel[char] != " ") { //checking if the character is not a space
      flagName += countrySel[char]; //adding the character from the country name
    }
    else { //in cases where there is a space
      flagName += "_"; //replace with _
    }
  }
  return flagName; //return the new filename
}

function WikiButtoner() { //function for adding the right link to the wiki button
  let countryLabel = document.getElementById('nation'); //getting the displayed country's label tag
  let countrySelect = countryLabel.innerHTML; //getting the name of the country out of the tag
  let concatName = ""; //declaring variabe to store the name to add to the end of the link
  let hyperLink = "https://en.wikipedia.org/wiki/"; // storing the start of the link in a variable
  for (let char = 0; char < countrySelect.length; char++) { //looping through the name of the country
    if (countrySelect[char] != " ") { //checking if the character is not a space
      concatName += countrySelect[char]; //adding the character from the country name
    }
    else { //in cases where there is a space
      concatName += "_"; //replace with _
    }
  }
  hyperLink += concatName; //appending the modified name to the end of the link
  return hyperLink; //returning the link
} 

function HandleAreaLogic() { //function to handle the area displayed when the dropdown is changed
  let allCountries = JSON.parse(localStorage.ns); //reading the json, storing in a variable.
  let areaEntry = document.getElementById('area'); //get the container where the area is displayed
  let area = areaEntry.innerHTML; //getting the area currently displayed
  let newArea = ""; //declaring a variable to store the new area to be displayed
  let countryLabel = document.getElementById('nation'); //getting the country label
  let countrySelect = countryLabel.innerHTML; //getting the name of the country from the label
  let areaRadio = document.getElementById('areaRadio'); //geting the dropdown for the area
  for (let row = 0; row < allCountries.length; row++){ //looping through the JSON
  let select = allCountries[row]; //assigning the row in the JSON to a variable
  if (countrySelect === select["Name"]) { //checking that the row is the correct one for the country selected
    if (areaRadio.value === 'metric') { //checking if the option selected is metric
      newArea = CalculateAreaInKM(area); //passing area to function to calculate the area in KM, assigning to variable
      }
    else { //the only other option is miles
      newArea = select["Area"]; //assigning area to variable from JSON
    }
  }
}
  areaEntry.innerHTML = newArea; //inserting area to display
}

function DisplayCountryData() { //function to execute when a country is selected
let allCountries = JSON.parse(localStorage.ns);//parse countries.json from storage, assign to variable allCountries
let dropdown = document.getElementById('country'); //get the country dropdown selector
let currentFlag = document.getElementById('flagDis'); //get the element to display the flag
let populationEntry = document.getElementById('population'); //get the element to display the population
let percentEntry = document.getElementById('percent'); //get the element to display the percent of the world population the population makes up
let areaRadio = document.getElementById('areaRadio'); //get the dropdown selector for the area
let areaSelect = areaRadio.value; //get the option selected for area display
let areaEntry = document.getElementById('area'); //get the element to display the area
let wikiLink = document.getElementById('wikiLink'); //get the element to insert the hyp

let newHTML = `<option value="filler">Select a Country</option>`; //inserting the default selection
let countrySel = dropdown.value; //getting the country selected, assigning to a variable
let flagName = FlagNamer(countrySel); //getting the filename to point to the right flag
  currentFlag.innerHTML = `<h2>Flag</h2> 
  <label id="nation">${countrySel}</label>
  <img id="flag" src="/flags/${flagName}.png">`; //insert flag
  wikiLink.innerHTML = `<a id="wikiLink" href="${WikiButtoner()}"><button type="button">WikiCountry</button></a>` //insert wiki link

  let nationLabel = document.getElementById('nation'); //getting the label for the country
let nationCheck = nationLabel.innerHTML; //getting the country name from the label


for (let row = 0; row < allCountries.length; row++){ //looping through the JSON
  let select = allCountries[row]; //assigning the row to a variable
    newHTML += `<option value="${select["Name"]}">${select["Name"]}</option>
    `; //inserting that row's country as an option in the dropdown
  if (select["Name"] == countrySel){ //checking if the row is the right one for the selected country
    populationEntry.innerHTML = select["Population"]; //inserting the population from the JSON
    percentEntry.innerHTML = CalculateTotalWorldPopulation(select["Population"]); //passing the population to a function to calculate the percent of the world population, inserting into the display
    if (areaSelect === 'metric') { //checking if square KM was selected
      areaEntry.innerHTML = CalculateAreaInKM(select["Area"]); //passing the area from the JSON to a function to calculate the area in square KM, inserting it into the display
      }
      else if (areaSelect === 'imperial') { //checking if square miles was selected
        areaEntry.innerHTML = select["Area"]; //inserting the area from the JSON into the display
      }
  }
}

if (nationCheck == 'filler') { //adding a check for when the page is first loaded
  currentFlag.innerHTML = "<h2>Flag</h2>"; //blanking out the flag display when it is
}

dropdown.innerHTML = newHTML; //inserting all the options into the dropdown
}
function CalculateAreaInKM(countryAreaInMiles) { //function to calculate the area in KM
let areaKM = (parseFloat(countryAreaInMiles) * 1.609344).toFixed(0); //multiply countryAreaInMiles by 1.609344, store in variable areaKM
return areaKM; //returning the area in KM
}

function DisplayPopulationData() { //function to calculate and return population data
let allCountries = JSON.parse(localStorage.ns); //parse countries.json, assign to variable allCountries
let countryLabel = document.getElementById('nation'); //get the country label
let countrySelect = countryLabel.innerHTML; //get the country's name from the label, assign to countrySelect
let popdEntry = document.getElementById('popD'); //get the population density display
let mileRadio = document.getElementById('mileRadio'); //get the radio button for the density in square miles
let newDense = "" //declare a variable to store the density
for (let row = 0; row < allCountries.length; row++){ //loop through the JSON
let select = allCountries[row]; //assign the row in the JSON to a variable
let areaKM = CalculateAreaInKM(select["Area"]); //pass the area from the row to a function to calculate the area in KM, assign to a variable
if (countrySelect === select["Name"]) { //check for the right row of the country selected
  if (mileRadio.checked) { //check if the square miles radio button is ticked
    newDense = (parseFloat(select["Population"]) / parseFloat(select["Area"])).toFixed(2); //calculating the density in square miles
  }
  else { //in case the square KM radio button is ticked
    newDense = ((parseFloat(select["Population"])) / areaKM).toFixed(2); //calculating the density in square km
  }
}
}
popdEntry.innerHTML = newDense; //inserting the density into the display
}

function CalculateTotalWorldPopulation(countryPop) { //function to calculate the percentage of the world population number
let allCountries = JSON.parse(localStorage.ns);//parse countries.json from storage, assign to variable allCountries
let worldPop = 0; //declare a variable for the world population
let population = parseFloat(countryPop); //assign country population to variable
for (let row = 0; row < allCountries.length; row++){ //looping through the JSON
  let select = allCountries[row]; //assigning the row to a variable
  worldPop += parseFloat(select["Population"]); //adding all the populations from all the rows together
}
let percent = ((population /  worldPop) * 100).toFixed(3); //divide country population by world population, multiply by 100
return percent; //return the percentage
}
document.getElementById('country').addEventListener('change',DisplayCountryData); //event handler to update data
document.getElementById('areaRadio').addEventListener('change',HandleAreaLogic); //event handler to update area when new dropdown picked
document.getElementById('mileRadio').addEventListener('change',DisplayPopulationData); //event handler to update population density when mile radio is ticked
document.getElementById('KMRadio').addEventListener('change',DisplayPopulationData); //event handler to update population density when KM radio is ticked