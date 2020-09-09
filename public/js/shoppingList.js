
$(document).ready(function () {
   initializePage();
})

function initializePage() {
   
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
   $("#confirmItembtn").click(confirmItembtn);

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