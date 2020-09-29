
$(document).ready(function () {
   initializePage();
})

function initializePage() {
   $('.listitem').click(itemClick);
}

async function itemClick(e) {
   e.preventDefault();
   var id = e.target.id;
   console.log("item clicked: " + id);
   var modal = document.getElementById("itemClick");

   const temp = {};
   temp.id = id;
   console.log("delete " + id);

   const result = await fetch("http://localhost:3000/shoppingList", { method: "DELETE", headers: {"content-type": "application/json"}, body: JSON.stringify(temp)});
   //result = await results.json();
   window.location = "/shoppingList";
}

function confirmItembtn(e) {
   e.preventDefault();
   console.log("pressed");

   var item = {
      "itemName": $('input[name="itemName"]').val(),
      "member": $('select[name="member"]').val(),
   }

   items.push(item);
   var modal = document.getElementById("myModal");
   modal.style.display = "none";
   document.getElementById("addItem").reset();
   initializePage();
}

window.onload = function () {
   var modal = document.getElementById("myModal");
   var btn = document.getElementById("addSectionbtn");
   var span = document.getElementsByClassName("close")[0];
   //$("#confirmItembtn").click(confirmItembtn);

   btn.onclick = function () {
      modal.style.display = "block";
   }

   // When the user clicks on <span> (x), close the modal
   span.onclick = function () {
      modal.style.display = "none";
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function (event) {
      if (event.target == modal) {
         modal.style.display = "none";
      }
   }
}