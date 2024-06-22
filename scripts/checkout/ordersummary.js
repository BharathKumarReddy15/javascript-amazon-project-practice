import {
   cart,
   removefromcart,
   calculatecartquantity,
   updateQuantity,
   updatedeliveryoption,
} from "../../data/cart.js";
import { getproducts } from "../../data/products.js";
import { deliverydate } from "../../data/deliveryoptions.js";
import { formatcurrency } from "../utils/money.js";

import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import {
   deliveryoptions,
   getdeliveryoption,
} from "../../data/deliveryoptions.js";
import { paymentsummary } from "./paymentsummary.js";
import checkoutheaderhtml from "./checkoutheader.js";

export function ordersummary() {
   let checkoutHTML = "";

   cart.forEach((cartitem) => {
      const productId = cartitem.productId;

      let matchingproduct = getproducts(productId);

      let deliveryoption = getdeliveryoption(cartitem);

      deliverydate(deliveryoption);

      checkoutHTML += `
      <div class="cart-item-container js-cart-item-container-${
         matchingproduct.id
      }">
         <div class="delivery-date js-delivery-date-${
            matchingproduct.id
         }" data-delivery-id="${deliveryoptions.id}">
            Delivery date: ${deliverydate(deliveryoption)}
         </div>

         <div class="cart-item-details-grid">
            <img class="product-image"
            src="${matchingproduct.image}">

            <div class="cart-item-details">
               <div class="product-name">
                  ${matchingproduct.name}
               </div>
               <div class="product-price">
                  $${formatcurrency(matchingproduct.priceCents)}
               </div>
               <div class="product-quantity">
                  <span>
                     Quantity: <span class="quantity-label js-quantity-label-${productId}">${
         cartitem.Quantity
      }</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id=${
                     matchingproduct.id
                  }>
                     Update 
                  </span>
                  <input class="quantity-input js-quantity-input-${
                     matchingproduct.id
                  }">
                  <span class="save-quantity-link link-primary" data-product-id="${
                     matchingproduct.id
                  }">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${
                     matchingproduct.id
                  }">
                     Delete
                  </span>
               </div>
            </div>

            <div class="delivery-options">
               <div class="delivery-options-title">
                  Choose a delivery option:
               </div>
               ${updatedeliveryoptions(matchingproduct, cartitem)}
            </div>
         </div>
      </div>`;
   });

   document.querySelector(".js-order-summary").innerHTML = checkoutHTML;

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
         const buttonelement = document.querySelector(
            `.js-quantity-input-${productId}`
         );
         const newquantity = Number(buttonelement.value);
         updateQuantity(productId, newquantity);

         if (newquantity === 0) {
            const productId = link.dataset.productId;
            removefromcart(productId);
            const container = document.querySelector(
               `.js-cart-item-container-${productId}`
            );
            container.remove();
         }
         ordersummary();
         checkoutheaderhtml();
         paymentsummary();
      });
   });

   document.querySelectorAll(".js-delete-link").forEach((link) => {
      link.addEventListener("click", () => {
         const productId = link.dataset.productId;
         removefromcart(productId);
         checkoutheaderhtml();
         ordersummary();
         paymentsummary();
      });
   });

   function updatedeliveryoptions(matchingproduct, cartitem) {
      let html = "";
      deliveryoptions.forEach((deliveryoption) => {
         const priceString =
            deliveryoption.priceCents === 0
               ? "FREE"
               : `$${formatcurrency(deliveryoption.priceCents)} -`;

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

   document.querySelectorAll(".js-delivery-option").forEach((element) => {
      element.addEventListener("click", () => {
         const { productId, deliveryOptionId } = element.dataset;
         updatedeliveryoption(productId, deliveryOptionId);
         ordersummary();
         paymentsummary();
      });
   });
}
