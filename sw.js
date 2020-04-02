/*
Serves Worker zorgt ervoor dat wanneer er een fetch-request is, de browsor niet helemaal
naar de Server toe hoeft te gaan om die op te vragen. Namelijk kan die een kortere route nemen
En gaan kijken in wat de sw.js-file had gecached/opgeslagen en daar zijn fetch-request uit ophalen.
Hierdoor kan de app zonder wifi werken. 

* Using cashed assets results in a much quicker loading time, even if you do have (verbinding) to the internet.
*/


importScripts('/js/localforage.js')
const staticCacheName = 'site-static';                                  //Static recources/The shell resources.
const assets = [                                                        //Possible request that users can make to the PWA;
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/localforage.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

//Install service worker event handler
self.addEventListener('install', evt => {
  // console.log("Service worker has been installed or re-installed to the browsor, maybe bc a file has changed");

  // Wacht totdat alles is opgeslagen in de cache. 
  // Wacht totdat promise is resolved before finishing the installation event. 
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {                    //Open a cach with the name 'site-static' if it exists, if it doesn't the browsor will create one.
      // If cash has been opened: Add items to cache
      console.log('caching shell assets');
      cache.addAll(assets);                                           //Add array of items to cache. Reach out to the server & grab all the resources in the array.
    })
  );
});

// activate service worker/event
self.addEventListener('activate', evt =>{
    // console.log('service worker has been activated');
    evt.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(keys
            .filter(key => key !== staticCacheName)
          .map(key => caches.delete(key)))
      })
    )
});

//Fetch Events, luister naar wanneer de browsor iets wil op halen van de server;
self.addEventListener('fetch', evt=> {                                  //Call-back function takes as a parameter de event object with information about the fetch request.. 
  //console.log('fetch event has occured', evt)                         //log the event object everytime there is some kind of fetch-event.             
  
  /* 
  Intercept any fetch request for assets/resources and check to see 
  if those resources/assets match with what is in our cache. 
  If it does, return the cached resource to the app.
  If it doesn't match your fetch request, continue trying to fetch data from server. 
  */

  let fetchUrl = 'https://cmgt.hr.nl:8000/api/projects/'

  //NetwerkFirstThenCache, je slaat hier je projecten op in LocalForage.
  if (evt.request.url == fetchUrl){                                      //Als de request een Url is, en die hetzelfde is als fetchUrl
      evt.respondWith(
        networkFirst(fetchUrl)                                           //Voer alleen uit voor de networkFirst uit. 
      );
  }

  //CacheFirstThenNetwork, je slaat hier je overige data op in je cache
  //Onderdelen van de app shell worden altijd eerst van uit de cache geladen. 
  else {
    evt.respondWith(                                                     //Pause the fetch event, respond with our own custome event.//Response from our own cash, don't go all the way to the server. 
      caches.match(evt.request).then(cacheRes => {                       //Look in our own caches (form assets) and see if you match something that has this event.request.             
      //Cash response
        //Return the response that we stored in the cache to the browsor.
        //Or return the actual fetch request from the server. 
        return cacheRes || fetch(evt.request);                               
      })
    );
  }

});

//NetworkFirstThenCache
async function networkFirst(req){
  //Kijk of je het netwerk kan bereiken, laad data altijd eerst in vanuit de API. 
  try {
    const res = await fetch(req);                                       // Const want we gaan het niet meer aanpassen. 
    const data = await res.clone().json();                              // In de variabele res zit de json. Clone die data. Want de originele data raakt het programma kwijt, nadat het een keer gebruikt is.

    localforage.setItem('projects', data);                              //Zet de data die je krijgt in je localforage-database
    return res;

  //Kan je niet netwerk bereiken, want geen internet, haal data op uit de localforage-cache. 
  } catch (error) {
    // console.error(error);
    const storage = await localforage.getItem('projects');
    return new Response(storage)                                        //Pak de data van localforage van projects. Dit is json.
  }
}
