/*
Serves Worker zorgt ervoor dat wanneer er een fetch-request is, de browsor niet helemaal
naar de Server toe hoeft te gaan om die op te vragen. Namelijk kan die een kortere route nemen
En gaan kijken in wat de sw.js-file had gecached/opgeslagen en daar zijn fetch-request uit ophalen.
Hierdoor kan de app zonder wifi werken. 

* Using cashed assets results in a much quicker loading time, even if you do have (verbinding) to the internet.
*/
const staticCacheName = 'site-static';                                  //Static recources/The shell resources.
const assets = [                                                        //Possible request that users can make to the PWA;
  '/',
  '/index.html',
  '/js/app.js',
  '/js/ui.js',
  '/js/materialize.min.js',
  '/css/styles.css',
  '/css/materialize.min.css',
  '/img/dish.png',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v50/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
];

//Install service worker event handler
self.addEventListener('install', evt => {
  //console.log("Service worker has been installed or re-installed to the browsor, maybe bc a file has changed");

  //Wacht totdat alles is opgeslagen in de cache. 
  //Wacht totdat promise is resolved before finishing the installation event. 
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {          //Open a cach with the name 'site-static' if it exists, if it doesn't the browsor will create one.
      //If cash has been opened: Add items to cache
      console.log('caching shell assets');
      cache.addAll(assets);                                 //Add array of items to cache. Reach out to the server & grab all the resources in the array.
    })
  );
});

// activate service worker/event
self.addEventListener('activate', evt =>{
    //console.log('service worker has been activated');
});

//Fetch Events, luister naar wanneer de browsor iets wil op halen van de server;
self.addEventListener('fetch', evt=>{                                   //Call-back function takes as a parameter de event object with information about the fetch request.. 
    //console.log('fetch event has occured', evt)                         //log the event object everytime there is some kind of fetch-event.             
    
    const req = evt.request;
    const url = new URL(req.url);                                       //Get the URL out of the request

    if(url.orgin == location.origin){                                   //If we fetch the URL from our own site.
        evt.respondWith(cacheFirst(req));
    }else {
        evt.respondWith(networkFirst(req));
    }

    async function cacheFirst(req) {
        const cachedResponse = await caches.match(req);
        return cachedResponse || fetch(req);
    }

    //Probeer eerst het network te bereiken. 
    async function networkFirst(req) {
        const cache = await caches.open('news-dynamic');                //Get a new cache. 

        try {
            const res = await fetch(req);                               //Go to the network and fetch news.
            cache.put(req, res.clone());                                //Store the fetch in the cache. Clone the result. 
            return res;
        } catch (error){                                                //Als het niet lukt om naar het netwerk te gaan (offline)
            return await cache.match(req);                              
        }
    }
});
