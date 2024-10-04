/*Skapar en lista med lite fakta om varje stad. Implementerade sedan denna i min funktion som visar städerna */
const cityFacts = {

    1:{
        Grundades: " år 1252",
        Fakta: " Är Sveriges huvudstad & ligger vid Mälarens utlopp i östersjön. "
    },
    2:{
        Grundades: " år 1229",
        Fakta: " Är Finlands tredje största stad.",
    },
    3:{
        Grundades: " år 1384",
        Fakta: "Norrköping är en kommun i östragötalans län.",
    },
    4:{
        Grundades: " år 1567",
        Fakta: "Belägen på östra sidan om Oslofjorden.",
    },
    5:{
        Grundades: " år 997",
        Fakta: "Var norges huvudstad fram till 1217",
    },
    6:{
        Grundades: " år 1612 ",
        Fakta: " Nordens femte största stad.",
    },
    7:{
        Grundades: " år 990",
        Fakta: "Ligger vid Mälarens norra strand",
    },
    8:{
        Grundades: " år 1779",
        Fakta: "Är den största inlandsstaden i Norden",
    },
    9:{
        Grundades: " år 1070",
        Fakta: "Blev på 1200-talet Norges första riktiga huvudstad.",

    },
    10:{
        Grundades: " år 1275",
        Fakta: "Var sveriges huvudstad mellan 1806-1807",
    },
    11:{
        Grundades: " år 1048",
        Fakta: "Hette tidigare Kristiania",

    },
    12:{
        Grundades: " år 1550",
        Fakta: " Är känt för nordisk design och arkitektur",
    },
    13:{
        Grundades: " år 1605",
        Fakta: "Är den största kommunen i norra Finland",

    },
    14:{
        Grundades: " år 1286",
        Fakta: " Är en av sveriges äldsta städer",
    },
    15:{
        Grundades: " år 1837",
        Fakta: "Är känt för sina fina sjöar och nationalparker",
    }
};
// Skapar funktionen för att dölja och visa mina olika vyer.
function showView(viewId) {
    const views = document.querySelectorAll(".view"); 
    views.forEach(view => {
        view.classList.remove("active"); 
    });
    document.getElementById(viewId).classList.add("active"); 
}

//hämtar data från min Json.land-fil genom fetch. 
function printLand() {
    fetch("land.json")
    // res.json för att omvandla till javaScript
        .then(res => res.json())
        .then(data => {
            // Hämtar listan från min HTML.
            const landList = document.getElementById("land-list");
            // sätter listan till en tom sträng för att säkerställa att den är tom innan den fylls med länder.
            landList.innerHTML = '';
            // skapar listan för länderna.
            data.forEach(land => {
                let li = document.createElement("li");
                li.innerText = land.countryname;
                
                // skapar en eventlistener som gör att du kan klicka på städerna.
                li.addEventListener("click", () => {
                    showCities(land.id, land.countryname);
                    //När du klickar på länderna hamnar du sedan i city-view
                    showView("cityView");  
                });
                // För att visa mitt skapade listobjekt.
                landList.appendChild(li);
            });
        });
}

// Funktionen för min showCities-vy.
//Hämtar data från stad.json genom fetch.
function showCities(landId, countryname) {
    fetch("stad.json")
    // res.json för att omvandla till java.script
        .then(res => res.json())
        .then(data => {
            // Hämtar listan från HTML
            const cityDetails = document.getElementById("city-details");
            //laddar mitt HTML element med en ny rubrik med städer och det aktuella landets namn.
            cityDetails.innerHTML = `<h3>Städer i ${countryname}</h3>`;
            // Filtrerar det städer som tillhör landet, för att rätt städer ska visas under rätt land.
            data.filter(city => city.countryid === landId)
            // För varje stad som visas ska även fakta om staden visas.
            //Detta görs genom att hämta data från min lista med fakta.
                .forEach(city => {
                    let div = document.createElement("div");
                    const cityFactsData = cityFacts[city.id]; 

                    // Skriver ut rubrik med aktuell stad och fakta om varje stad.
                    div.innerHTML = `
                        <h4>${city.stadname}</h4>
                        <p><strong>Invånarantal:</strong> ${city.population}</p>
                        <p><strong>Grundades:</strong> ${cityFactsData.Grundades}</p>
                        <p><strong>Fakta:</strong> ${cityFactsData.Fakta}</p>
                    `;

                    // Skapar en besökt-knapp.
                    let visitButton = document.createElement("button");
                    visitButton.innerText = "Besök";
                    visitButton.addEventListener("click", () => markAsVisited(city));
                    // Lägger till min knapp och citydetails i DOM som gör det synligt på sidan.
                    div.appendChild(visitButton);
                    cityDetails.appendChild(div);
                });
        });
}

// Implementerar en localstorage när användaren markerar en stad som besökt.
function markAsVisited(city) {
    let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];
    // Skapar en if-sats för att se om staden redan är tillagd eller ej.
    //Kontrollerar om staden redan finns i min "besökt" lista.
    if (!visitedCities.some(c => c.id === city.id)) {
        //Om den inte finns pushar vi den i "besökt" listan.
        visitedCities.push(city);
        // sparar den i localstorage som en Json-sträng.
        localStorage.setItem("visitedCities", JSON.stringify(visitedCities));
        // Visar ett meddelande för användaren att tex. "stockholm har markerats som besökt!".
        alert(`${city.stadname} har markerats som besökt!`);
        // Anropar funktionen nedanför för att kunna visa vilka städer jag besökt.
        showVisitedCities();
    } else {
        // Felmeddelande om staden redan är besökt.
        alert("Denna stad har redan besökts.");
    }
}

// Skapar en funktion för att kunna visa vilka städer jag besökt.
function showVisitedCities() {
    // Hämtar listan från min localstorage.
    let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];
    //Hämtar med ID för att listan ska visas i rätt vy.
    const visitedList = document.getElementById("visited-list");
    // Tömmer min lista.
    visitedList.innerHTML = '';
    // Initierar variabeln totalpopulation för att hålla reda på invånare.
    let totalPopulation = 0;
    
    //Loopar igenom listan med besökta städer.
    visitedCities.forEach(city => {
        let li = document.createElement("li");
        // Lägger till stadens namn och invånarantal i listan
        li.innerText = `${city.stadname} - Invånarantal: ${city.population}`;
        // Lägger den skapade listan i visitedlist för att visa den på sidan.
        visitedList.appendChild(li);
        // Lägger till invånarantalet till den totala befolkningen som användaren träffat.
        totalPopulation += city.population;
    });

    // Skapar ett nytt element som jag lägger till i totalpopulationinfo.
    const totalPopulationInfo = document.createElement("p");
    // lägger till text i mitt nya element som läser ut den totala mängden människor som användaren träffat.
    totalPopulationInfo.innerText = `Totalt antal människor du har träffat: ${totalPopulation}`;
    // Lägger till elementet i besöktlistan så att det visas på sidan.
    visitedList.appendChild(totalPopulationInfo);
}

// Skapar en knapp som raderar städerna jag besökt från localstorage.
document.getElementById("clearVisited").addEventListener("click", () => {
    localStorage.removeItem("visitedCities");
    //Lägger till den i sidan på staäder jag besökt.
    showVisitedCities();
});

// För att visa mina vyer på sidan.
printLand();
showVisitedCities(); 
showView("landView");  