var section;

$(document).ready(function () {
   initializePage();
})

function initializePage() {
   $('.sections').click(SectionClick);
}

function SectionClick(e) {
   e.preventDefault();
   section = e.target.id;
   window.location.href = 'items' + '#' + e.target.id;
}

window.onload = function () {

   var modal = document.getElementById("myModal");

   // Get the button that opens the modal
   var btn = document.getElementById("addSectionbtn");
   document.getElementById("addSectionbtn").onclick = function () { myfunction() };

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];

   // When the user clicks the button, open the modal 
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
};