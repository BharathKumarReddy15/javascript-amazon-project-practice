import {cart, removefromcart, calculatecartquantity, updateQuantity} from '../data/cart.js';
import {products} from '../data/products.js';


let checkoutHTMLsummary = '';

cart.forEach((cartitem) => {
   const productId = cartitem.productId;
   
   let matcheditem;
   
   products.forEach((product) => {
      if (productId === product.id) {
         matcheditem = product;
      }
   })
   console.log(matcheditem);

   checkoutHTMLsummary += `<div class="cart-item-container js-cart-item-container-${productId}">
   <div class="delivery-date">
     Delivery date: Tuesday, June 21
   </div>

   <div class="cart-item-details-grid">
     <img class="product-image" src="${matcheditem.image}">

     <div class="cart-item-details">
       <div class="product-name">
         ${matcheditem.name}
       </div>
       <div class="product-price">
         $${(matcheditem.priceCents / 100).toFixed(2)}
       </div>
       <div class="product-quantity">
         <span>
           Quantity: <span class="quantity-label js-quantity-label-${matcheditem.id}">${cartitem.Quantity}</span>
         </span>
         <span class="update-quantity-link link-primary js-update-link" data-product-id=${matcheditem.id}>
           Update 
         </span>
         <input class="quantity-input js-quantity-input-${matcheditem.id}">
         <span class="save-quantity-link link-primary" data-product-id="${matcheditem.id}">Save</span>
         <span class="delete-quantity-link link-primary js-delete-link" data-product-id=${matcheditem.id}>
           Delete
         </span>
       </div>
     </div>

     <div class="delivery-options">
       <div class="delivery-options-title">
         Choose a delivery option:
       </div>
       <div class="delivery-option">
         <input type="radio" checked
           class="delivery-option-input"
           name="delivery-option-${matcheditem.id}">
         <div>
           <div class="delivery-option-date">
             Tuesday, June 21
           </div>
           <div class="delivery-option-price">
             FREE Shipping
           </div>
         </div>
       </div>
       <div class="delivery-option">
         <input type="radio"
           class="delivery-option-input"
           name="delivery-option-${matcheditem.id}">
         <div>
           <div class="delivery-option-date">
             Wednesday, June 15
           </div>
           <div class="delivery-option-price">
             $4.99 - Shipping
           </div>
         </div>
       </div>
       <div class="delivery-option">
         <input type="radio"
           class="delivery-option-input"
           name="delivery-option-${matcheditem.id}">
         <div>
           <div class="delivery-option-date">
             Monday, June 13
           </div>
           <div class="delivery-option-price">
             $9.99 - Shipping
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>`
})

document.querySelector('.order-summary').innerHTML = checkoutHTMLsummary;

document.querySelectorAll('.js-delete-link')
   .forEach((link) => {
      link.addEventListener('click', () => {
         const productId = link.dataset.productId
         removefromcart(productId);

         const container = document.querySelector(`.js-cart-item-container-${productId}`);
         container.remove();
         updatecheckoutquantity();
      })
   })

document.querySelectorAll('.js-update-link')
   .forEach((link) => {
      link.addEventListener('click', () => {
         const productId = link.dataset.productId;
         document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
         console.log(productId);
      })
   })

document.querySelectorAll('.save-quantity-link')
   .forEach((link) => {
      link.addEventListener('click', () => {
         const productId = link.dataset.productId;
         const container = document.querySelector(`.js-cart-item-container-${productId}`);
         container.classList.remove('is-editing-quantity');
         const newquantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);
         updateQuantity(productId,newquantity);
         const quantityLabel = document.querySelector(
            `.js-quantity-label-${productId}`
          );
          quantityLabel.innerHTML = newquantity;
    
          updatecheckoutquantity();
      })
   })


   function updatecheckoutquantity() {
   
      document.querySelector('.return-to-home-link').innerHTML = `${calculatecartquantity()} items`;
   }
   
   updatecheckoutquantity();

   