//Support the browsor service workers?
if('serviceWorker' in navigator){               //Navigator is an object that represents the browsor
    navigator.serviceWorker.register('sw.js')   //Register service worker. 
     
    //Promise Syntax
    .then((reg) => console.log('service worker registered', reg))        //registration word door gestuurd. 
    .catch((err)=> console.log("service worker not registered", err))  //Of Errors worden opgevangen.
}

const main = document.querySelector('main');

window.addEventListener('load', e => {
    updateNews();
});

async function updateNews() {
    const res = await fetch(`https://cmgt.hr.nl:8000/api/projects/`);
    const json = await res.json();
    console.log(json)
    // res.then(data => {                      
    //     console.log(data)
    // });                                         

    main.innerHTML = json.projects.map(createArticle).join('\n');           //Plek waar ik de opgehaalde Json data zie.
                                                                            //Join houd in dat je een nieuwe aanmaakt. Ik roep de template beneden op.
}

function createArticle(project){
    return `
    <div class="row">
      <div class="col s12 m6">
        <a href="${project.url}">
            <div class="card">
                <div class="card-image">
                    <img src="https://cmgt.hr.nl:8000/${project.headerImage}">
                    <span class="card-title">${project.title}</span>
                </div>
                <div class="card-content">
                    <p>${project.description}</p>
                </div>
            </div>
        </a>
      </div>
    </div>
    `;
}