window.onload = function () {

   var invited = document.getElementById("invited");
   var modal = document.getElementById("myModal");

   invited.style.display = "block";

   // Get the <span> element that closes the modal
   var span = document.getElementsByClassName("close")[0];
   var x = document.getElementById("x");

   // When the user clicks on <span> (x), close the modal
   span.onclick = function () {
      modal.style.display = "none";
   }
   x.onclick = function () {
      invited.style.display = "none";
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

if ("serviceWorker" in navigator) {
   send().catch(err => console.error(err));
}

//Register SW, Register Push, Send Push
async function send() {
   console.log('Registering service worker...');
   const register = await navigator.serviceWorker.register('/sw.js');
   console.log('Service worker registered.');

   console.log('Registering push...');
   const sub = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BO2WyM2viPQsPp8cwRS7ulL7ANw07BQpsYkD_cLpmUPxYS2QPZW6Ilb-RDCiQLUM0josK97O8MlLDRwFj3LW89E')
   });

   console.log('Push registered');

   //Send push notification
   console.log('Sending push...');
   await fetch('/subscribe', {
      method: 'POST',
      body: JSON.stringify(sub),
      headers: {'content-type': 'application/json'}
   });
   console.log('Push sent.');
}

function urlBase64ToUint8Array(base64String) {
   const padding = "=".repeat((4 - base64String.length % 4) % 4);
   const base64 = (base64String + padding)
     .replace(/\-/g, "+")
     .replace(/_/g, "/");

   const rawData = window.atob(base64);
   const outputArray = new Uint8Array(rawData.length);

   for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
   }
   return outputArray;
}