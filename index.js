// fetch
const API = 'https://rickandmortyapi.com/api/character/';

function fetchData(url) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.open('GET', url, true);

    xhttp.onreadystatechange = () => {
      if (xhttp.readyState === 4) {
        xhttp.status === 200
          ? resolve(JSON.parse(xhttp.responseText))
          : reject(new Error('Error', url));
      }
    };
    xhttp.send();
  });
}

// classLists
const characterStatus = document.querySelectorAll('.character-status');
const characterImage = document.querySelectorAll('.character-image');
const characterName = document.querySelectorAll('.character-name');
const characterDimension = document.querySelectorAll('.character-dimension');
const prevBtn = document.querySelectorAll('.button-container-prev');
const nextBtn = document.querySelectorAll('.button-container-next');

const maxCharacters = 12;
const characterBase = {
  status: 'None',
  image: 'none',
  name: 'None',
  species: 'None',
};

let characterId = new Array(maxCharacters)
  .fill(0)
  .map((val, character) => character + 1);
const lastCharacterID = Infinity;

// functions

function showCharacterInfo(character) {
  for (let i = 0; i < character.length; i++) {
    characterStatus[i].innerHTML = character[i].status;
    addColorToStatus(characterStatus[i], character[i]);

    characterImage[i].style.backgroundImage = `url(${character[i].image})`;
    characterName[i].innerHTML = character[i].name;
    characterDimension[i].innerHTML = character[i].species;
  }
}

function addColorToStatus(characterStatus, { status }) {
  if (characterStatus.classList.length === 2) {
    let lastStatus = characterStatus.classList[1];
    characterStatus.classList.remove(lastStatus);
  }
  characterStatus.classList.add(`character-status--${status.toLowerCase()}`);
}

function nextIdS() {
  if (!characterId.some((id) => id === lastCharacterID)) {
    characterId = characterId.map((id) => id + maxCharacters);
  }
}

function prevIdS(j) {
  if (characterId[0] > maxCharacters) {
    characterId = characterId.map((id) => id - maxCharacters);
  }
}

function nextPage() {
  nextIdS();
  startPage();
}

function prevPage() {
  prevIdS();
  startPage();
}

async function startPage() {
  let characterList = null;
  try {
    characterList = await fetchData(`${API}${characterId}`);
    characterList = await fillCharacterListEmptySpace(characterList);
    showCharacterInfo(characterList);
  } catch (err) {
    console.error(new Error(`${err}`));
  }
}

function nextAndPrevBtns() {
  for (let button of prevBtn) {
    button.addEventListener('click', prevPage);
  }
  for (let button of nextBtn) {
    button.addEventListener('click', nextPage);
  }
}

async function getLastCharacterId() {
  try {
    let data = await fetchData(API);
    data = data.info.count;
  } catch (err) {
    console.error(new Error(`${err}`));
  }
}

function fillCharacterListEmptySpace(characterList) {
  if (characterList.length < maxCharacters) {
    characterList.push(
      ...new Array(maxCharacters - characterList.length).fill(characterBase)
    );
  }
  return characterList;
}

getLastCharacterId();
nextAndPrevBtns();
startPage();
