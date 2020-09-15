$(document).ready(function () {
   initializePage();
})

function initializePage() {
   //$('.sections').click(SectionClick);

   var ids = [];
   var temp = $('.names').each(function () {
      ids.push($(this).attr('action').substring(1));
   });
   console.log(JSON.parse(JSON.stringify(ids)));
   localStorage.setItem('ids', JSON.stringify(ids));
   return false;
}

function SectionClick(e) {
   e.preventDefault();
   localStorage.setItem('id', e.target.id);
   $('#id').val(e.target.id);

   //window.document.location = ('/items', e.target.id);
   //section = e.target.id;
   //window.location.href = 'items' + '#' + e.target.id;
   return false;
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