import {
   cart,
   removefromcart,
   calculatecartquantity,
   updateQuantity,
   updatedeliveryoption,
} from "../data/cart.js";
import { getproducts } from "../data/products.js";
import {
   deliveryoptions,
   getdeliveryoption,
   deliverydate,
} from "../../data/deliveryoptions.js";

let checkoutHTMLsummary = "";

cart.forEach((cartitem) => {
   const productId = cartitem.productId;

   let matcheditem = getproducts(productId);

   let deliveryoption = getdeliveryoption(cartitem);

   deliverydate(deliveryoption);

   console.log(matcheditem);

   checkoutHTMLsummary += `<div class="cart-item-container js-cart-item-container-${
      matcheditem.id
   }">
   <div class="delivery-date js-delivery-date-${
      matcheditem.id
   }" data-delivery-id="${deliveryoptions.id}">
     Delivery date: ${deliverydate(deliveryoption)}
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
           Quantity: <span class="quantity-label js-quantity-label-${
              matcheditem.id
           }">${cartitem.Quantity}</span>
         </span>
         <span class="update-quantity-link link-primary js-update-link" data-product-id=${
            matcheditem.id
         }>
           Update 
         </span>
         <input class="quantity-input js-quantity-input-${matcheditem.id}">
         <span class="save-quantity-link link-primary" data-product-id="${
            matcheditem.id
         }">Save</span>
         <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
            matcheditem.id
         }">
           Delete
         </span>
       </div>
     </div>

     <div class="delivery-options">
       <div class="delivery-options-title">
         Choose a delivery option:
       </div>
       ${updatedeliveryoptions(matcheditem, cartitem)}
       </div>
   </div>
 </div>`;
   paymentsummary();
   updatecheckoutquantity();
});

function updatedeliveryoptions(matchingproduct, cartitem) {
   let html = "";
   deliveryoptions.forEach((deliveryoption) => {
      const priceString =
         deliveryoption.priceCents === 0
            ? "FREE"
            : `$${(deliveryoption.priceCents / 100).toFixed(2)} -`;

      const ischecked = deliveryoption.id === cartitem.deliveryoptionsId;

      html += `
         <div class="delivery-option js-delivery-option"
          data-product-id="${matchingproduct.id}"
          data-delivery-option-id="${deliveryoption.id}">
          <input type="radio"
            ${ischecked ? "checked" : ""}
            class="delivery-option-input"
            name="delivery-option-${matchingproduct.id}">
          <div>
            <div class="delivery-option-date">
              ${deliverydate(deliveryoption)}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`;
   });
   return html;
}

document.querySelector(".order-summary").innerHTML = checkoutHTMLsummary;

document.querySelectorAll(".js-delete-link").forEach((link) => {
   link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removefromcart(productId);

      const container = document.querySelector(
         `.js-cart-item-container-${productId}`
      );
      container.remove();
      updatecheckoutquantity();
      paymentsummary();
   });
});

document.querySelectorAll(".js-update-link").forEach((link) => {
   link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      document
         .querySelector(`.js-cart-item-container-${productId}`)
         .classList.add("is-editing-quantity");
      console.log(productId);
   });
});

document.querySelectorAll(".save-quantity-link").forEach((link) => {
   link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
         `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-quantity");
      const newquantity = Number(
         document.querySelector(`.js-quantity-input-${productId}`).value
      );
      updateQuantity(productId, newquantity);
      const quantityLabel = document.querySelector(
         `.js-quantity-label-${productId}`
      );
      quantityLabel.innerHTML = newquantity;
      if (newquantity === 0) {
         const productId = link.dataset.productId;
         removefromcart(productId);
         const container = document.querySelector(
            `.js-cart-item-container-${productId}`
         );
         container.remove();
      }
      updatecheckoutquantity();
      paymentsummary();
   });
});

document.querySelectorAll(".js-delivery-option").forEach((element) => {
   element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      updatedeliveryoption(productId, deliveryOptionId);
      paymentsummary();
   });
});

function updatecheckoutquantity() {
   document.querySelector(
      ".return-to-home-link"
   ).innerHTML = `${calculatecartquantity()} items`;
}

function paymentsummary() {
   let productpricecents = 0;
   let shippingpricecents = 0;
   cart.forEach((cartitem) => {
      const productId = cartitem.productId;
      let product = getproducts(productId);
      productpricecents += product.priceCents * cartitem.Quantity;
      const deliveryoptionid = cartitem.deliveryoptionsId;
      let deliveryoption;
      deliveryoptions.forEach((option) => {
         if (option.id === deliveryoptionid) {
            deliveryoption = option;
         }
      });
      shippingpricecents += deliveryoption.priceCents;

      const totalbeforecents = productpricecents + shippingpricecents;

      const taxCents = totalbeforecents * 0.1;
      const totalcents = totalbeforecents + taxCents;

      const paymentsummaryhtml = `
         <div class="payment-summary-title">
            Order Summary
         </div>

         <div class="payment-summary-row">
            <div>Items (${calculatecartquantity()}):</div>
            <div class="payment-summary-money">$${(
               Math.round(productpricecents) / 100
            ).toFixed(2)}</div>
         </div>

         <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${(
               Math.round(shippingpricecents) / 100
            ).toFixed(2)}</div>
         </div>

         <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${(
               Math.round(totalbeforecents) / 100
            ).toFixed(2)}</div>
         </div>

         <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${(
               Math.round(taxCents) / 100
            ).toFixed(2)}</div>
         </div>

         <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${(
               Math.round(totalcents) / 100
            ).toFixed(2)}</div>
         </div>

         <button class="place-order-button button-primary">
            Place your order
         </button>
      `;

      document.querySelector(".payment-summary").innerHTML = paymentsummaryhtml;
   });
}
