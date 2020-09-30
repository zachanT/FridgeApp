window.onload = function () {

   var invited = document.getElementById("invited");
   var modal = document.getElementById("myModal");

   if(invited){
      invited.style.display = "block";
   }

   // Get the button that opens the modal
   var btn = document.getElementById("addSectionbtn");
   document.getElementById("addSectionbtn").onclick = function () { myfunction() };

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];
   var x = document.getElementById("x");

   // When the user clicks the button, open the modal 
   btn.onclick = function () {
      modal.style.display = "block";
   }

   // When the user clicks on <span> (x), close the modal
   span.onclick = function () {
      modal.style.display = "none";
   }
   if (x) {
      x.onclick = function () {
         invited.style.display = "none";
      }
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function (event) {
      if (event.target == modal) {
         modal.style.display = "none";
      } else if (event.target == invited) {
         invited.style.display = "none";
      }
   }
};