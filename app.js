let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = "876fb301-6a71-4dae-9723-8c2a6e7a0f91"
let notFound = document.querySelector('.not_found');
let def = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');

searchBtn.addEventListener('click', function(e) {
    e.preventDefault();

    //Clear data 
    audioBox.innerHTML = "";
    notFound.innerText = "";
    def.innerText = "";

    //Get Data
    let query = input.value;

    //Call API and recieve info
    if(query === ""){
        alert("Word is required");
        return;
    }

    getData(query);
})

async function getData(query) {

    loading.style.display= "block";
    //Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${query}?key=${apiKey}`)
    
    const data = await response.json();
    
    //if result is empty
    if(!data.length){
        loading.style.display= "none";

        notFound.style.display = 'block';
        return;
    }

    //if having suggestions 

    if(typeof data[0] === 'string'){
        loading.style.display= "none";

        let didYouMean = document.createElement("h3");
        didYouMean.innerText = "Did you mean";

        notFound.style.display = 'block';
        notFound.appendChild(didYouMean);

        data.forEach(element => {
            let suggestions = document.createElement("span");
            suggestions.classList.add("suggestions");
            suggestions.innerText = element;
            notFound.appendChild(suggestions);
        })
        return;
    }

    //If result found
    loading.style.display= "none";

    let definaiton = data[0].shortdef[0];
    if(definaiton === undefined){
        definaiton = data[0].shortdef[2];
        def.innerText = definaiton;
    }
    else{
        def.innerText = definaiton;
    }
    

    //Sound
    const sound = data[0].hwi.prs[0].sound.audio;
    if(sound){
        renderSound(sound);
    }else {
        return;
    }

    console.log(data);
}

function renderSound(sound){
    //
    let subFolder = sound.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subFolder}/${sound}.mp3?key=${apiKey}`;

    let audio = document.createElement("audio");
    audio.src = soundSrc;
    audio.controls = true;

    audioBox.appendChild(audio);
}