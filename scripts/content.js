function chromeStorageAddCompany(companyName) {
  chrome.storage.local.get().then((data) => {
    const isBlacklistedAlready = (data.blacklistedCompanies || []).includes(
      companyName
    );
    if (isBlacklistedAlready) {
      return;
    }
    chrome.storage.local.set({
      blacklistedCompanies: [...(data.blacklistedCompanies || []), companyName],
    });
  });
}

async function chromeStorageGetCompanies() {
  const data = await chrome.storage.local.get();
  return data.blacklistedCompanies || [];
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

function blacklistCompany(companyName) {
  chromeStorageAddCompany(companyName);
}

async function getBlacklistedCompanies() {
  return await chromeStorageGetCompanies();
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

function getJobsListUI() {
  return document.querySelectorAll(".jobs-search-results-list > ul > li > div").values();
}

function getCompanyNameFromJobContainer(jobContainer) {
  return jobContainer.querySelector(".job-card-container__primary-description")
    ?.innerText;
}

function createBlacklistBtnUI() {
  const blacklistBtn = document.createElement("button");
  blacklistBtn.setAttribute("class", "blacklist-btn");
  const text = document.createTextNode("Blacklist");
  blacklistBtn.appendChild(text);
  return blacklistBtn;
}

function blacklistBtnClickHandler(event) {
  const companyName = getCompanyNameFromJobContainer(
    event.target.parentElement
  );
  blacklistCompany(companyName);
}

function addBlacklistButton(jobContainer) {
  const isBlacklistButtonExist = !!jobContainer.querySelector(".blacklist-btn");
  if (isBlacklistButtonExist) {
    return;
  }

  const blacklistBtnUI = createBlacklistBtnUI();
  blacklistBtnUI.addEventListener("click", blacklistBtnClickHandler);
  jobContainer.appendChild(blacklistBtnUI);
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

async function updateContent() {
  const jobsListUI = getJobsListUI();
  const blacklistedCompanies = await getBlacklistedCompanies();

  const jobsListFilteredUI = jobsListUI.filter((jobContainer) => {
    const companyName = getCompanyNameFromJobContainer(jobContainer);
    if (blacklistedCompanies.includes(companyName)) {
      jobContainer.remove();
      return false;
    }
    return true;
  });

  jobsListFilteredUI.forEach(addBlacklistButton);
}

//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################
//################################################################################################

let oldQueryParams = "";

function isJobsPageChanged(queryParams) {
  const start = Number(queryParams.split("start=")[1]);
  const oldStart = Number(oldQueryParams.split("start=")[1]);
  if (isNaN(oldStart) || isNaN(start)) {
    return false;
  }
  return oldStart !== start;
}

function isShouldUpdateContent() {
  return isJobsPageChanged(window.location.search);
}

function updateContentWhenScroll() {
  document
    .querySelector(".jobs-search-results-list")
    .addEventListener("scrollend", () => {
      updateContent();
    });
}

function updateWhenNavigate() {
  window.navigation.addEventListener("navigate", () => {
    if (isShouldUpdateContent()) {
      updateContent();
      updateContentWhenScroll();
    }
  });
}

function updateWhenLoadPage() {
  window.addEventListener("load", () => {
    oldQueryParams = window.location.search;
    setTimeout(() => {
      updateContent();
      updateContentWhenScroll();
    }, 2000);
  });
}

function setTriggersUpdateContent() {
  updateWhenNavigate();
  updateWhenLoadPage();
}

setTriggersUpdateContent();
