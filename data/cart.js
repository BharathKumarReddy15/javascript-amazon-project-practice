export let cart = JSON.parse(localStorage.getItem('cart')) || [{
   productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
   Quantity : 2
},{
   productId:'15b6fc6f-327a-4ec4-896f-486349e85a3d',
   Quantity : 1
}];

export function addtocart(productId) {
   let matchingitem;

   cart.forEach((item) => {
      if(item.productId === productId) {
         matchingitem = item;
      }
   })

   const quantityselector = document.querySelector(`.js-quantity-selector-${productId}`)

   const Quantity = Number(quantityselector.value);

   if(matchingitem) {
      matchingitem.Quantity += Quantity;
   } else {
      cart.push({
         productId,
         Quantity
      })
   }
   savetostorage();
}

function savetostorage() {
   localStorage.setItem('cart', JSON.stringify(cart))
}

export function removefromcart(productId) {
   const newcart = [];
   cart.forEach((cartitem) => {
      if(cartitem.productId !== productId) {
         newcart.push(cartitem);
      }
   });
   cart = newcart;
   savetostorage();
}

export function calculatecartquantity() {
   let totalquantity = 0;

   cart.forEach ((item)=>{
         totalquantity+= item.Quantity;
   });
   return totalquantity;
}

export function updateQuantity(productId,newquantity) {
   let matchingitem;
   cart.forEach((cartitem) => {
      if(productId === cartitem.productId) {
         matchingitem = cartitem
      }
   })
   matchingitem.Quantity=newquantity;
   console.log(matchingitem);
   console.log(matchingitem.Quantity);
   savetostorage();
}
