const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");
const tilDateInput = document.querySelector("#til-date");
const tilTitleInput = document.querySelector("#til-title");
const tilContentInput = document.querySelector("#til-content");

const TIL_STORAGE_KEY = "tilItems";

initialize();

function initialize() {
  setDefaultDate();
  renderSavedTilItems();
  bindEvents();
}

function bindEvents() {
  tilForm.addEventListener("submit", handleTilSubmit);
}

function handleTilSubmit(event) {
  event.preventDefault();

  const tilItem = readTilItem();
  if (!isValidTilItem(tilItem)) {
    alert("날짜, 제목, 내용을 모두 입력해주세요.");
    return;
  }

  prependTilItem(tilItem);
  saveTilItem(tilItem);
  tilForm.reset();
  setDefaultDate();
  tilTitleInput.focus();
}

function readTilItem() {
  return {
    date: tilDateInput.value,
    title: tilTitleInput.value.trim(),
    content: tilContentInput.value.trim(),
  };
}

function isValidTilItem(tilItem) {
  return tilItem.date !== "" && tilItem.title !== "" && tilItem.content !== "";
}

function prependTilItem(tilItem) {
  const tilItemElement = createTilItemElement(tilItem);
  tilList.prepend(tilItemElement);
}

function createTilItemElement(tilItem) {
  const article = document.createElement("article");
  article.className = "til-item";

  const time = document.createElement("time");
  time.dateTime = tilItem.date;
  time.textContent = tilItem.date;

  const title = document.createElement("h3");
  title.textContent = tilItem.title;

  const content = document.createElement("p");
  content.textContent = tilItem.content;

  article.append(time, title, content);
  return article;
}

function saveTilItem(tilItem) {
  const tilItems = loadTilItems();
  tilItems.unshift(tilItem);

  localStorage.setItem(TIL_STORAGE_KEY, JSON.stringify(tilItems));
}

function loadTilItems() {
  const savedTilItems = localStorage.getItem(TIL_STORAGE_KEY);
  if (savedTilItems === null) {
    return [];
  }

  try {
    return JSON.parse(savedTilItems);
  } catch (error) {
    return [];
  }
}

function renderSavedTilItems() {
  const tilItems = loadTilItems();
  const reversedTilItems = tilItems.slice().reverse();

  reversedTilItems.forEach(function (tilItem) {
    prependTilItem(tilItem);
  });
}

function setDefaultDate() {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  tilDateInput.value = `${year}-${month}-${day}`;
}