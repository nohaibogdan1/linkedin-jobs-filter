async function chromeStorageGetCompanies() {
  const data = await chrome.storage.local.get();
  return (data.blacklistedCompanies || []).filter(Boolean);
}

async function chromeStorageRemoveCompany(companyName) {
  const data = await chrome.storage.local.get();
  return await chrome.storage.local.set({
    blacklistedCompanies: (data.blacklistedCompanies || []).filter(
      (company) => company !== companyName
    ),
  });
}

async function apiGetCompanies() {
  return chromeStorageGetCompanies();
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

function createElement(type) {
  return document.createElement(type);
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

async function removeClickHandler(event) {
  const companyName =
    event.target.parentElement.querySelector("span").textContent;
  await chromeStorageRemoveCompany(companyName);
  event.target.parentElement.remove();
}


function createRemoveButtonUI() {
  const removeButton = createElement("button");
  removeButton.classList = "remove-button";
  return removeButton;
}


function deleteListUI() {
  document.querySelector(".blacklisted-container")?.remove();
}


function showListUI(listUI) {
  document.querySelector("body").append(listUI);
}


function createEmptyListUI() {
  return document.createElement("ul");
}


function createCompanyUI(company) {
  const li = createElement("li");
  li.classList = "company-container";

  const companyText = createElement("span");
  companyText.textContent = company;

  const removeButton = createRemoveButtonUI();
  removeButton.addEventListener("click", removeClickHandler);

  li.append(removeButton);
  li.append(companyText);

  return li;
}


function buildListUI(companies) {
  const listContainerUI = createElement("div");
  listContainerUI.classList = "blacklisted-container";

  const title = createElement("p");
  title.textContent = "blacklisted";
  const listUI = createEmptyListUI();
  companies.forEach((company) => {
    listUI.appendChild(createCompanyUI(company));
  });

  listContainerUI.appendChild(title);
  listContainerUI.appendChild(listUI);

  return listContainerUI;
}


async function addBlacklistedCompanies() {
  deleteListUI();
  const companies = await apiGetCompanies();
  const listUI = buildListUI(companies);
  showListUI(listUI);
}


function buildPopup() {
  addBlacklistedCompanies();
}

buildPopup();
