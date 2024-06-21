export let cart = JSON.parse(localStorage.getItem("cart"));

export function addtocart(productId) {
   let matchingitem;

   cart.forEach((item) => {
      if (item.productId === productId) {
         matchingitem = item;
      }
   });

   const quantityselector = document.querySelector(
      `.js-quantity-selector-${productId}`
   );

   const Quantity = Number(quantityselector.value);

   if (matchingitem) {
      matchingitem.Quantity += Quantity;
   } else {
      cart.push({
         productId,
         Quantity,
         deliveryoptionsId: "1",
      });
   }
   savetostorage();
}

function savetostorage() {
   localStorage.setItem("cart", JSON.stringify(cart));
}

export function removefromcart(productId) {
   const newcart = [];
   cart.forEach((cartitem) => {
      if (cartitem.productId !== productId) {
         newcart.push(cartitem);
      }
   });
   cart = newcart;
   savetostorage();
}

export function calculatecartquantity() {
   let totalquantity = Number();

   cart.forEach((item) => {
      totalquantity += item.Quantity;
   });
   return totalquantity;
}

export function updateQuantity(productId, newquantity) {
   let matchingitem;
   cart.forEach((cartitem) => {
      if (productId === cartitem.productId) {
         matchingitem = cartitem;
      }
   });
   matchingitem.Quantity = newquantity;
   console.log(matchingitem);
   console.log(matchingitem.Quantity);
   savetostorage();
}

export function updatedeliveryoption(productId, deliveryOptionid) {
   let matchingitem;

   cart.forEach((cartitem) => {
      if (cartitem.productId === productId) {
         matchingitem = cartitem;
         matchingitem.deliveryoptionsId = deliveryOptionid;
      }
   });
   savetostorage();
}
