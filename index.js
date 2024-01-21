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
    "https://web-app-db686-default-rtdb.europe-west1.firebasedatabase.app/",
};

let deleteIcon = document.querySelector(".delete-icon");
const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "list");

const inputField = document.querySelector("#input-field");
const addButton = document.querySelector("#Add-button");
const shoppingList = document.querySelector(".shopping-list");
const img = document.querySelector(".image");

addButton.addEventListener("click", function () {
  let inputValue = inputField.value;
  if (inputValue.length > 0) {
    inputValue = inputValue.trim();
    push(shoppingListInDB, inputValue);
    clearInputField();
  } else {
    alert("YOU ARE PASSING AN EMPTY ARGUMENT");
  }
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    clearShoppingList();
    let listArray = Object.entries(snapshot.val());
    for (let i = 0; i < listArray.length; i++) {
      let currentItem = listArray[i];
      // console.log(currentItem);
      let [currentItemId, currentItemValue] = currentItem;
      // let  = currentItem[1];
      shoppingListInnerHTML(currentItemId, currentItemValue);
    }
  } else {
    shoppingList.innerHTML = "No Items Exist";
  }
});

function clearShoppingList() {
  shoppingList.innerHTML = "";
}

function clearInputField() {
  inputField.value = "";
}

function shoppingListInnerHTML(itemId, itemValue) {
  let newEl = document.createElement("li");
  let itemName = document.createElement("span");
  let deleteIcon = document.createElement("i");
  newEl.classList.add("list-item");
  itemName.textContent = itemValue;

  deleteIcon.className = "fa-solid fa-trash";
  newEl.append(itemName);
  newEl.append(deleteIcon);

  shoppingList.append(newEl);

  deleteIcon.addEventListener("click", function () {
    // Display the delete popup
    deletePopup.style.display = "block";

    // Set up event listeners for popup buttons
    closePopup.addEventListener("click", closePopupHandler);
    cancelDelete.addEventListener("click", cancelDeleteHandler);
    confirmDelete.addEventListener("click", confirmDeleteHandler);

    // Store the current item ID for later use
    deletePopup.setAttribute("waleed", itemId);
  });
}

function closePopupHandler() {
  // Close the delete popup
  deletePopup.style.display = "none";

  // Remove event listeners to prevent multiple bindings
  closePopup.removeEventListener("click", closePopupHandler);
  cancelDelete.removeEventListener("click", cancelDeleteHandler);
  confirmDelete.removeEventListener("click", confirmDeleteHandler);
}

function cancelDeleteHandler() {
  // Close the delete popup
  closePopupHandler();
}

function confirmDeleteHandler() {
  // Retrieve the item ID from the data attribute
  const itemId = deletePopup.getAttribute("waleed");
  // const itemId =  delete
  // Remove the item from the database
  let itemRef = ref(database, "list/" + itemId);
  remove(itemRef);

  // Close the delete popup
  closePopupHandler();
}

// let a = document.querySelector("h1");
// a.waleed = "shio";
// console.log(a);
