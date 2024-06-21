import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryoptions = [
   {
      id: "1",
      deliverydays: 7,
      priceCents: 0,
   },
   {
      id: "2",
      deliverydays: 3,
      priceCents: 499,
   },
   {
      id: "3",
      deliverydays: 1,
      priceCents: 999,
   },
];

export function getdeliveryoption(cartitem) {
   const deliveryoptionid = cartitem.deliveryoptionsId;
   let deliveryoption;
   deliveryoptions.forEach((option) => {
      if (option.id === deliveryoptionid) {
         deliveryoption = option;
      }
   });
   return deliveryoption;
}

export function deliverydate(deliveryoption) {
   const today = dayjs();
   const deliverydate = today.add(deliveryoption.deliverydays, "days");
   const dateString = deliverydate.format("dddd, MMMM D");
   return dateString;
}
