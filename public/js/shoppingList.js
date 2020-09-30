
$(document).ready(function () {
   initializePage();
})

function initializePage() {
   $('.listitem').click(itemClick);
}

async function itemClick(e) {
   e.preventDefault();
   var id = e.target.id;
   var modal = document.getElementById("itemClick");
   console.log("item clicked: " + id);

   modal.style.display = "block";

   //Delete item if button is clicked
   $('#deleteItemBtn').click(async function(e)  {
      const temp = {};
      temp.id = id;
      console.log("delete " + id);

      const result = await fetch("/items", { method: "DELETE", headers: {"content-type": "application/json"}, body: JSON.stringify(temp)});
      window.location = "/shoppingList";
   });
}

window.onload = function () {
   var item = document.getElementById("itemClick");
   var cancel = document.getElementById("cancel");
   var close = document.getElementById("close");

   cancel.onclick = function () {
      item.style.display = "none";
   }

   close.onclick = function () {
      item.style.display = "none";
   }

   window.onclick = function (event) {
      if(event.target == item) {
         item.style.display = "none";
      }
   }
}
