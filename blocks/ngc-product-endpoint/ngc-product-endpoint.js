import { addToShoppingCart } from '../ngc-endpoint/ngc-endpoint.js';

async function getProducts(uri) {
  const results = await fetch("https://catalog-service.adobe.io/graphql",{method: "POST", headers:{
    "Magento-Environment-Id": "baa3bab3-9c8b-45f0-b977-7a2d051debfb",
    "Magento-Website-Code": "base",
    "Magento-Store-Code": "main_website_store",
    "Magento-Store-View-Code": "default",
    "X-Api-Key": "639cd72448fe462ca0f59f30f1b20259",
    "Content-Type": "application/json"
  },
    body: JSON.stringify({"query":"query quickSearch( $phrase: String! $pageSize: Int = 20 $currentPage: Int = 1 $filter: [SearchClauseInput!] $sort: [ProductSearchSortInput!] $context: QueryContextInput ) { productSearch( phrase: $phrase page_size: $pageSize current_page: $currentPage filter: $filter sort: $sort context: $context ){ items { ...Product } page_info { current_page page_size total_pages } } }  fragment Product on ProductSearchItem { product { __typename sku name description { html } canonical_url small_image { url } image { url } thumbnail { url } price_range { minimum_price { fixed_product_taxes { amount { value currency } label } regular_price { value currency } final_price { value currency } discount { percent_off amount_off } } maximum_price { fixed_product_taxes { amount { value currency } label } regular_price { value currency } final_price { value currency } discount { percent_off amount_off } } } } } ","variables":{"phrase":"Duffle","pageSize":8,"filter":[{"attribute":"visibility","in":["Search","Catalog, Search"]},{"attribute":"inStock","eq":"true"}],"context":{"customerGroup":"b6589fc6ab0dc82cf12099d1c2d40ab994e8410c","userViewHistory":[{"sku":"24-WB07","dateTime":"2024-02-26T15:16:01.236Z"}]}}})
  }) 
  const prod = await results.json();
  return prod;
}

const productDetailsMarkup = async (product) => {
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="prod-page-container">
      <div class="prod-image">
        <img src="${product.image.url}" title="${product.image.url}" />
      </div>
      <div class="prod-name">
        <h1>${product.name}</h1>
        <span>$${product.price_range.minimum_price.final_price.value}</span>
      </div>
      <div class="prod-add-to-cart">
        <div class="prod-quantity">
          <span>Quantity</span>
          <div class="counter">
              <button class="plusminus minus" >-</button>
              <input class="form-control" value="0" disabled>
              <button class="plusminus plus">+</button>
          </div>
        </div>
        <div class="prod-btn-cart">
          <button class="btn-cart disabled">ADD TO CART</button>
          <button class="btn-favorites">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-icon-_rq">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            Add to Favorites
          </button>
        </div>
      </div>
      <div class="prod-desc">
          ${product.description.html}
      </div>
    </div>
    `;
  return container;
};

let currentQuantity = 0;
function sumOrSubstractQuantity(event, quantityItem, addBtn){
  if(event.target.classList.contains('minus')) { //if minus has been click, substract quantity
    if(+quantityItem.value !== 0) quantityItem.value = +quantityItem.value - 1;
  }
  else if(event.target.classList.contains('plus')){ //if plus has been click, sum quantity
    quantityItem.value = +quantityItem.value + 1;
  }
  //disable or not the add to cart button depending of quantity
  if(+quantityItem.value > 0){
    addBtn.classList.remove('disabled');
  } else if(+quantityItem.value === 0){
    addBtn.classList.add('disabled');
  }
  
  currentQuantity = +quantityItem.value;
}

function addItemsToCart(selectedProduct){
  const minus = document.querySelector('.plusminus.minus');
  const plus = document.querySelector('.plusminus.plus');
  const quantityItem = document.querySelector('.counter .form-control');
  const addProdBtn = document.querySelector('.prod-btn-cart .btn-cart');
  minus.addEventListener('click', (event) => sumOrSubstractQuantity(event, quantityItem, addProdBtn));
  plus.addEventListener('click', (event) => sumOrSubstractQuantity(event, quantityItem, addProdBtn));
  addProdBtn.addEventListener('click', () => addToShoppingCart(selectedProduct.sku, currentQuantity));
}

export default async function decorate(block) {
  const hash = window.location.hash;
  const productSku = hash.replaceAll(".", " ");
  const endPoint = document.querySelector(".ngc-product-endpoint a").href;
  const products = await getProducts(endPoint);
  const productData = products?.data?.productSearch?.items;
  const productDataNew = productData.map((item) => {
    return item?.product
  });
  const selectedProduct = productDataNew.filter((product) => product.sku === productSku.replace("#", ""))[0];
  const productMarkup = await productDetailsMarkup(selectedProduct);
  block.innerHTML = productMarkup.outerHTML;
  addItemsToCart(selectedProduct);
}
