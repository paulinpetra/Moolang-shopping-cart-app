import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-c442c-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputField = document.getElementById("input-field");
const addBtn = document.getElementById("add-button");
const shoppingList = document.getElementById("shopping-list");

addBtn.addEventListener("click", function () {
  let input = inputField.value;
  push(shoppingListInDB, input);

  clearInputField();
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let shoppingListArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < shoppingListArray.length; i++) {
      let currentItem = shoppingListArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];

      appendToShoppingList(currentItem);
    }
  } else {
    shoppingList.innerHTML = "no items here..yet";
  }
});

function clearShoppingListEl() {
  shoppingList.innerHTML = "";
}

function clearInputField() {
  inputField.value = "";
}

function appendToShoppingList(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");
  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });

  shoppingList.append(newEl);
}
