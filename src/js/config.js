$(document).ready(function () {
  const pages = Object.keys(ENUMERATIONS.SITE.TITLES); // ["profile-user", "profile-shop", "index", "home", "signup"];

  setTitlePage(window.location.pathname);
  setSelectState();
  setSelectCategories();

  function setTitlePage(url) {
    document.title = CONSTANTS.SITE.NAME;

    for (const page of pages) {
      const isInPage = url.split(page).length != 1;
      if (isInPage) {
        document.title += ` - ${ENUMERATIONS.SITE.TITLES[page]}`;
      }
    }
  }

  function setSelectState() {
    if ($('#selectState')) {
      $('#selectState').html(UTIL.domRender.getHtmlOptionsSelect(CONSTANTS.STATES, CONSTANTS.LABELS.SELECT_STATE));
    }
  }
  function setSelectCategories() {
    if ($('#selectCategory')) {
      $('#selectCategory').html(UTIL.domRender.getHtmlOptionsSelect(CONSTANTS.CATEGORIES, CONSTANTS.LABELS.SELECT_CATEGORY));
    }
  }
});


String.prototype.toCapitalize = function () {
  return this.charAt(0)?.toUpperCase() + this.slice(1);
};
