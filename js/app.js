// importScripts('/js/localforage.js')

//Support the browsor service workers?
if('serviceWorker' in navigator){               //Navigator is an object that represents the browsor
    navigator.serviceWorker.register('sw.js')   //Register service worker. 
     
    //Promise Syntax
    .then((reg) => console.log('service worker registered', reg))        //registration word door gestuurd. 
    .catch((err)=> console.log("service worker not registered", err))  //Of Errors worden opgevangen.
}

const projects = document.querySelector('projects');
const tag = document.querySelector('tag');
const status = document.getElementById('status');

//Window (Re-)Loaden:
window.addEventListener('load', e => {
    updateOnlineStatus();
    updatetags();
    updateNews();
});

window.addEventListener('online',   updateOnlineStatus);
window.addEventListener('offline',  updateOnlineStatus);

//NetwerkOnly voor tags. 
//Laat de tags alleen zien als je verbinding hebt met een netwerk. 
async function updatetags() {
    let json
    try {
        const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/tags`);
        json = await res.json();   
        tag.innerHTML = json.tags.map(tags).join('\n');                   //Plek waar ik de opgehaalde Json data zie.
                                                                          //Join houd in dat je een nieuwe aanmaakt. Ik roep de template beneden op.
    } catch (error) {
        console.log("Hier bij offline?")
        tag.innerHTML = offline();                                        //Voor als je geen wifi hebt. 
    }                             
}

//Show Projecten
/*
Promise: Het laat toe om handlers te associëren met het eventuele succes of falen van een asynchrone actie. 
Dit laat asynchrone methoden toe om waarden terug te geven zoals synchrone methoden:
in plaats van de uiteindelijke waarde geeft een asynchrone methode een promise (belofte) 
terug die in de toekomst een waarde zal hebben.
*/
async function updateNews() {
    let json
    try {
        const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
        json = await res.json();   
    } catch (error) {
        json = await localforage.getItem('projects');
    }     

    projects.innerHTML = json.projects.map(createArticle).join('\n');       //Plek waar ik de opgehaalde Json data zie.
                                                                            //Join houd in dat je een nieuwe aanmaakt. Ik roep de template beneden op.
}


function createArticle(project){
    return `
        <div class="card">
            <div class="card-image">
                <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
                <span class="card-title">${project.title}</span>
            </div>
            <div class="card-content">
                <p>${project.description}</p>
            </div>
        </div>
    `;
}

function tags(tags){
    return `
        <div>
        ${tags}
        </div>
    `;
}

function offline(offline){
    return `
        <div>
            You are Offline, have no WIFI and NO Tags. 
        </div>
    `;
}

function updateOnlineStatus(event) {
    var condition = navigator.onLine ? "online" : "offline";

    updatetags();

    status.className = condition;     
    status.innerHTML = condition.toUpperCase();
  }