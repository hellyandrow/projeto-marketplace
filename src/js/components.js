$(document).ready(function () {
    configNavBarComponent();
    configNavLinkComponent();

    $('#toast-component').html(`
        <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11;">
            <div id="toast" class="toast hide" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-body">
                    <span id="toastBody"></span>
                </div>
            </div>
        </div>
    `);

    function configNavLinkComponent() {
        $('#nav-links-component').html(`
            <ul class="nav container mb-3">
                <li class="nav-item">
                    <div class="dropdown">
                        <a class="nav-link active dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                            Lojas
                        </a>
                        <ul class="dropdown-menu" id="categoriesShop"></ul>
                    </div>
                </li>
                <li class="nav-item">
                    <div class="dropdown">
                        <a class="nav-link active dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown">
                            Produtos
                        </a>
                        <ul class="dropdown-menu" id="categoriesProduct"></ul>
                    </div>
                </li>
            </ul>
        `);
        configItemsCategoriesShopNavLinkComponent();
        configItemsCategoriesProductNavLinkComponent();
    }

    async function configItemsCategoriesShopNavLinkComponent() {
        const categories = await firebaseDatabase.list("categories");
        let htmlAppend = categories.reduce((acc, category) => {
            return acc += `
                    <li>
                        <a class="dropdown-item" href="${CONSTANTS.SITE.PAGES.LIST_SHOPS}.html?${CONSTANTS.URL_PARAMS.CATEGORY_ID}=${category.id}">
                            ${category.name.toCapitalize()}
                        </a>
                    </li>`;
        }, '');

        $("#categoriesShop").append(htmlAppend);
    }

    async function configItemsCategoriesProductNavLinkComponent() {
        const categories = await categoryProductFacade.list();
        let htmlAppend = categories.reduce((acc, category) => {
            return acc += `
                    <li>
                        <a class="dropdown-item" href="${CONSTANTS.SITE.PAGES.LIST_PRODUCTS}.html?${CONSTANTS.URL_PARAMS.CATEGORY_ID}=${category.id}">
                            ${category.name}
                        </a>
                    </li>`;
        }, '');

        $("#categoriesProduct").append(htmlAppend);
    }

    function configNavBarComponent() {
        $('#navbar-component').html(`
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <div class="container">
                    <a class="navbar-brand" href="${CONSTANTS.SITE.PAGES.HOME}.html"><i class="bi bi-bag-check navbar__icon"></i></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navBarTarget">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navBarTarget">
                        <form class="d-flex ms-auto me-3" id="formSearch">                                            
                            <div class="input-group">
                                <input class="form-control" type="search" id="formSearchInput" placeholder="Procurar..." />                       
                                <button class="btn btn-outline-primary" type="submit">
                                    <i class="bi bi-search"></i>
                                </button>
                            </div>
                        </form>
                        <ul class="navbar-nav mb-2 mb-lg-0 align-items-lg-center" id="ul-nav-item"></ul>
                    </div>
                </div>
            </nav>
        `);

        configFormSearchNavBarComponent();
        configBtnLogoutNavBarComponent();
        configShowBtnLoginNavBarComponent();
    }

    async function configShowBtnLoginNavBarComponent() {
        if (await firebaseAuth.getUid()) {
            const user = await firebaseDatabase.loadUserData();
            $('#ul-nav-item').append(`
                <li class="nav-item">
                    <a class="nav-link py-0 my-0 mx-2" href="profile-user.html" title="Meu perfil">
                        <img class="img-min-profile" src="${user.profile ?? './src/images/default-avatar.jpg'}" />
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" title="Sair" href="#" id="btn-logout">
                        <i class="bi bi-box-arrow-right"></i>
                    </a>
                </li>;
            `);
        } else {
            $('#ul-nav-item').append(`
                <li class= "nav-item" >
                    <a class="nav-link" href="${CONSTANTS.SITE.PAGES.LOGIN}.html">Entrar</a>
                </li >
                `);
        }
    }

    function configFormSearchNavBarComponent() {
        $("#formSearch").on("submit", function (ev) {
            ev.preventDefault();
            sessionStorage.setItem(sessionStoraageSearch, $("#formSearchInput").val());
            UTIL.redirectTo(CONSTANTS.SITE.PAGES.HOME, 0);
        });
    }

    function configBtnLogoutNavBarComponent() {
        $('#btn-logout').on('click', async function () {
            try {
                UTIL.showToast("Saindo...", ENUMERATIONS.COLORS.WARN);
                await firebaseAuth.signOut();
                UTIL.redirectTo(CONSTANTS.SITE.PAGES.LOGIN);
            } catch (error) {
                UTIL.showToastTreatError(error);
            }
        });
    }
});
