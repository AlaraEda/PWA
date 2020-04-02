# PWA

Docent Bob:
Misschien werken met een versienummer op je app-shell cache?
Je zet nu alle projecten in 1 rij van indexedDb, misschien verdelen over meerdere rijen.

Alle onderdelen verder aanwezig

resultaat: 2 punten.

-------------------------------------------------------------------------------------------

Alara zegt:
Versienummering is belangerijk omdat momenteel in je sw.js-bestand, dit stukje code hebt:

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

Deze code checkt of de naam van je cache "veranderd", als het veranderd delete die de oude cache. 
Maar aangezien de naam van je cache altijd het zelfde blijft delete die je oude cache niet.
Om versiebeheer werkend te krijgen zou je er dus voor moeten zorgen dat er een versienummer achter komt te staan. 

In mijn indexedDB zitten al mijn projecten in een rij. Het is beter als ik dit verdeel over meerdere rijen
en daardoor heen loop. Want als ik dat doe kan ik doormiddel van de id van elk project, op een project klikken
en doorgestuurd worden naar de detail-pagina van dat project. 

Project Werkt door op Lifeserver te klikken!

-----------------------------------------------------------------------------------------
Manifest.json
Provides info about app to the browsor: 
- Name of the app
- Homescreen Icon for mobile
- Color Theme's
- Etc.

Native Apps:
Houd in dat je toegang kan krijgen tot smart phone features zoals bijvoorbeeld de camera. 
Kan je vinden in de app  store. Houd in dat je de content van een app kan gebruiken zonder wifi. 

Hulpmiddelen: https://www.youtube.com/watch?v=4XT23X0Fjfk&list=PL4cUxeGkcC9gTxqJBcDmoi5Q2pzDusSL7

![alt text](https://github.com/AlaraEdda/PWA/blob/Finished/img/PWI%20uitleg%20instructies.jpeg "PWA UITLEG")
