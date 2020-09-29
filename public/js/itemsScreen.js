

// Call this function when the page loads (the "ready" event)
$(document).ready(function () {
   initializePage();
})

/*
 * Function that is called when the document is ready.
 */
function initializePage() {

   $('input[name=showShared').click(shared);
   $('.item').click(itemClick);
   $('.close').click(close);
   $('#addCatbtn').click(analytics);
   //$('#addItemForm').on('submit', typed);
}

function close(e) {
   e.preventDefault();

   var modal = document.getElementById("myModal");
   var itemInfo = document.getElementById("itemClick");
   var catModal = document.getElementById("newCat");
   
   modal.style.display = "none";
   itemInfo.style.display = "none";
   catModal.style.display = "none";
}

function analytics(e) {
   e.preventDefault();
   ga("send", "event", 'add category', 'click');
}

function typed(e) {
   if ($('input[name=cat]').val().length != 0) {
      ga("send", "event", 'new category', 'typing');
   }   
}

function shared(e) {
   var shared = document.getElementsByClassName("on");
   if ($(this).is(":checked")) {
      console.log("showing shared items...");
      for (var i = 0; i < shared.length; i++) {
         console.log(shared[i]);
         shared[i].style.display = "block";
      }
   } else {
      console.log("showing my items...");
      initializePage();
   }
}

function confirmMemberbtn(e) {
   e.preventDefault();
   
   var modal = document.getElementById("myModal");
   var name = document.getElementsByName("itemName")[0].value;
   var category = document.getElementsByName("category")[0].value;
   var notification = document.getElementsByName("notification")[0].value;
   addItem(name, "1 day");
   modal.style.display = "none";
}

function itemClick(e) {
   e.preventDefault();
   var ind;
   var id = e.target.id;
   console.log("item clicked: " + id);
   var modal = document.getElementById("itemClick");

   //$('#itemClickHeader').html(itemName);
   /*$('input[name="itemName"]').val();
   $('input[name="category"]').val();
   $('input[name="expiration"]').val();
   $('input[name="notification"]').val();*/

   //Delete item if button is clicked
   $('#deleteItemBtn').click(async function(e)  {
      const temp = {};
      temp.id = id;
      console.log("delete " + id);

      const result = await fetch("/items", { method: "DELETE", headers: {"content-type": "application/json"}, body: JSON.stringify(temp)});
      //result = await results.json();
      window.location = "/items";
   });

   modal.style.display = "block";
   var span = document.getElementsByClassName("close")[1];
   span.onclick = function () {
      modal.style.display = "none";
   }
}

/*function deleteItem(e, id) {

   console.log("delete" + id);
}*/

window.onload = function () {

   var modal = document.getElementById("myModal");
   var itemInfo = document.getElementById("itemClick");
   var catModal = document.getElementById("newCat");

   // Get the button that opens the modal
   var itembtn = document.getElementById("addItembtn");
   var catbtn = document.getElementById("addCatbtn");

   // When the user clicks the button, open the modal 
   itembtn.onclick = function () {
      modal.style.display = "block";
   }
	
   if(catbtn){
	   catbtn.onclick = function () {
		  catModal.style.display = "block";
	   }
   }

   // When the user clicks anywhere outside of the modal, close it
   window.onclick = function (event) {
      if (event.target == modal) {
         modal.style.display = "none";
      } else if (event.target == itemInfo) {
         itemInfo.style.display = "none";
      } else if (event.target === catModal) {
         catModal.style.display = "none";
      }
   }

};

/*addEventListener('load', async() => {
   let sw = await navigator.serviceWorker.register('./sw.js');
   console.log(sw);
});

async function subscribe() {
   let sw = await navigator.serviceWorker.ready;
   let push await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BO2WyM2viPQsPp8cwRS7ulL7ANw07BQpsYkD_cLpmUPxYS2QPZW6Ilb-RDCiQLUM0josK97O8MlLDRwFj3LW89E'
   })
   console.log(JSON.stringify(push));
}*/
