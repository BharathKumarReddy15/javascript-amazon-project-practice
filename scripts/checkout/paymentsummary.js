import { calculatecartquantity, cart } from "../../data/cart.js";
import { getproducts } from "../../data/products.js";
import { formatcurrency } from "../utils/money.js";
import { deliveryoptions } from "../../data/deliveryoptions.js";

export function paymentsummary() {
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
            <div class="payment-summary-money">$${formatcurrency(
               productpricecents
            )}</div>
         </div>

         <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatcurrency(
               shippingpricecents
            )}</div>
         </div>

         <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatcurrency(
               totalbeforecents
            )}</div>
         </div>

         <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatcurrency(
               taxCents
            )}</div>
         </div>

         <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatcurrency(
               totalcents
            )}</div>
         </div>

         <button class="place-order-button button-primary">
            Place your order
         </button>
      `;

      document.querySelector(".payment-summary").innerHTML = paymentsummaryhtml;
   });
}
