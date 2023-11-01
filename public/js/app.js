import { allProducts } from './products.js';
// Selectors
const searchBarInputElement = document.querySelector('.search-bar__input');
const categoriesListElement = document.querySelector('.categories__list');
const productsSectionElement = document.querySelector('.products');
const emptyStateParagraphElement = document.querySelector('.empty-state');
let basketAmountSpanElement;
let basketClearButtonElement;
// Variables
let displayedProducts = allProducts; // from "products.ts"
let productsInBasket = [];
// Functions
const getBasketAmount = (sum, product) => {
    if (product.sale) {
        return (sum += product.price - product.saleAmount);
    }
    else {
        return (sum += product.price);
    }
};
const addToBasket = (event) => {
    basketAmountSpanElement = document.querySelector('.header__basket-amount');
    basketClearButtonElement = document.querySelector('.header__basket-clear-button');
    const dataProductID = Number(event.target.dataset.productId);
    const productID = displayedProducts.findIndex(product => product.id === dataProductID);
    productsInBasket.push(displayedProducts.at(productID));
    const totalBasketAmount = productsInBasket.reduce(getBasketAmount, 0);
    basketAmountSpanElement.textContent = `${totalBasketAmount.toFixed(2)} zł`;
    basketClearButtonElement.classList.add('header__basket-clear-button--active');
    basketClearButtonElement.addEventListener('click', clearBasket);
};
const clearBasket = () => {
    basketAmountSpanElement.textContent = 'Koszyk';
    basketClearButtonElement.classList.remove('header__basket-clear-button--active');
    productsInBasket = [];
};
const renderCategories = () => {
    const productCategoriesSet = new Set();
    let productCategoriesArray;
    allProducts.forEach((product, index) => productCategoriesSet.add(displayedProducts[index].category));
    productCategoriesArray = ['Wszystkie', ...productCategoriesSet];
    productCategoriesArray.forEach((category, index) => {
        const newCategoryItemElement = document.createElement('li');
        newCategoryItemElement.className = 'categories__item';
        const newCategoryButtonElement = document.createElement('button');
        newCategoryButtonElement.className = `categories__button${Number(index) === 0 ? ' categories__button--active' : ''}`;
        newCategoryButtonElement.textContent = category;
        newCategoryButtonElement.dataset.category = category;
        newCategoryItemElement.appendChild(newCategoryButtonElement);
        categoriesListElement.appendChild(newCategoryItemElement);
    });
};
const renderProducts = (renderedProducts) => {
    productsSectionElement.textContent = '';
    renderedProducts.forEach((product, index) => {
        const newProductElement = document.createElement('div');
        newProductElement.className = `products__item${renderedProducts[index].sale ? ' products__item--on-sale' : ''}`;
        newProductElement.innerHTML = `
			<img class="products__image" src="${renderedProducts[index].image}" alt="${renderedProducts[index].name}">
			<p class="products__name">${renderedProducts[index].name}</p>
			<p class="products__description">${renderedProducts[index].description}</p>

			<div class="products__price">
				<span class="products__item-price">${renderedProducts[index].price.toFixed(2)} zł</span>
				<span class="products__item-sale">${(renderedProducts[index].price - renderedProducts[index].saleAmount).toFixed(2)} zł</span>
			</div>

			<button class="products__add-to-basket-button" data-product-id=${renderedProducts[index].id}>Dodaj do koszyka</button>
			<p class="products__item-sale-info">Promocja</p>
		`;
        productsSectionElement.appendChild(newProductElement);
    });
    const addToBasketButtons = document.querySelectorAll('.products__add-to-basket-button');
    addToBasketButtons.forEach(button => button.addEventListener('click', addToBasket));
};
const selectCategory = (event) => {
    const eventTarget = event.target;
    displayedProducts = allProducts;
    const categoriesButtonElements = document.querySelectorAll('.categories__button');
    categoriesButtonElements.forEach(button => button.classList.remove('categories__button--active'));
    eventTarget.classList.add('categories__button--active');
    const targetCategory = eventTarget.dataset.category;
    if (targetCategory !== 'Wszystkie') {
        displayedProducts = displayedProducts.filter(product => product.category === targetCategory);
    }
    renderProducts(displayedProducts);
};
const searchItems = (event) => {
    const searchedValue = event.target.value;
    const foundProducts = displayedProducts.filter(product => {
        if (product.name.toLowerCase().includes(searchedValue.toLowerCase())) {
            return product;
        }
    });
    foundProducts.length === 0
        ? emptyStateParagraphElement.classList.add('empty-state--active')
        : emptyStateParagraphElement.classList.remove('empty-state--active');
    renderProducts(foundProducts);
};
// Global listeners
categoriesListElement.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        selectCategory(event);
    }
});
searchBarInputElement.addEventListener('input', searchItems);
// Function calls
renderCategories();
renderProducts(displayedProducts);
