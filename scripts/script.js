// Models
const baseURL = "http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre="

async function fetchMovies(genre, quantity){
    let movies = []
    let response = await fetch(baseURL + genre);
    let json = await response.json();
    for (let result of await json.results){
        if (movies.length < quantity){
            movies.push(result);
        }
    }
    while (movies.length < quantity){
        response = await fetch(await json.next);
        json = await response.json();
        for (let result of await json.results){
            if (movies.length < quantity){
                movies.push(result);
            }
        }
    }
    return movies;
}

async function fetchMovieDetailed(movie){
    let response = await fetch(movie.url);
    return await response.json();
}

// Views
async function modifyBestFilm(movieDetailed){
    document.querySelector("#best_film h1").innerText = movieDetailed.title;
    document.querySelector("#best_film figure img").setAttribute("src", movieDetailed.image_url);
    document.querySelector("#best_film p").innerText = movieDetailed.long_description;
}

function createImageElement(movie){
    let imageElement = document.createElement("img");
    imageElement.setAttribute("src", movie.image_url);
    imageElement.setAttribute("alt", movie.title + " poster");
    imageElement.setAttribute("class", "movieImage");
    imageElement.setAttribute("role", "button");
    imageElement.setAttribute("aria-haspopup", "dialog");
    imageElement.setAttribute("aria-controls", "dialog");
    return imageElement;
}

async function modifyCategoryFilmsImage(movies, selector){
    document.querySelector(selector + " div").removeChild(document.querySelector(selector + " div figure"));
    for(let movie of movies){
        let imageElement = createImageElement(movie)
        document.querySelector(selector + " div").appendChild(imageElement);
        imageElement.onclick = async function(){
            let movieDetailed = await fetchMovieDetailed(movie);
            fillModal(movieDetailed);
            let modal = document.getElementsByClassName("modal")[0];
            modal.style.display = "block";
            console.log("test");
        }
    }
}

function fillModal(detailedMovie) {
    let titleElement = document.createElement("h2");
    titleElement.innerText = detailedMovie.title;
    document.querySelector(".modal-header").appendChild(titleElement);
    
    document.querySelector(".modal-body").appendChild(createImageElement(detailedMovie));
    
    let infoElement = document.createElement("div");

    let genresElement = document.createElement("p");
    genres = detailedMovie.genres;
    let genreString = "";
    if (genres.length == 1){
        genresString = "Genre : " + genres[0];
    }else{
        genresString = "Genres : " + genres.shift();
        for (genre of genres){
            genresString = genresString + ", " + genre;
        }
    }
    genresElement.innerText = genresString;
    infoElement.appendChild(genresElement);

    let datePublishedElement = document.createElement("p");
    let datePublishedString = detailedMovie.date_published;
    datePublishedString = datePublishedString.substring(8,10) + "/" + datePublishedString.substring(5,7) + "/" + datePublishedString.substring(0,4);
    datePublishedElement.innerText = "Date de sortie : " + datePublishedString;
    infoElement.appendChild(datePublishedElement);

    let ratedElement = document.createElement("p");
    ratedElement.innerText = "Rated : " + detailedMovie.rated;
    infoElement.appendChild(ratedElement);

    let imdbScoreElement = document.createElement("p");
    imdbScoreElement.innerText = "Score IMDB : " + detailedMovie.imdb_score;
    infoElement.appendChild(imdbScoreElement);

    let directorsElement = document.createElement("p");
    directors = detailedMovie.directors;
    let directorsString = ""
    if (directors.length = 1){
        directorsString = "Réalisateur : " + directors[0];
    }else{
        directorsString = "Réalisateurs : " + directors.shift();
        for (director of directors){
            directorsString = directorsString + ", " + director;
        }
    }
    directorsElement.innerText = directorsString;
    infoElement.appendChild(directorsElement);

    let actorsElement = document.createElement("p");
    actors = detailedMovie.actors;
    let actorsString = "";
    if (actors.length == 1){
        actorsString = "Acteur : " + actors[0];
    }else{
        actorsString = "Acteurs : " + actors.shift();
        for (actor of actors){
            actorsString = actorsString + ", " + actor;
        }
    }
    actorsElement.innerText = actorsString;
    infoElement.appendChild(actorsElement);

    let durationElement = document.createElement("p");
    let durationString = detailedMovie.duration;
    durationElement.innerText = "Durée : " + durationString + " minutes";
    infoElement.appendChild(durationElement);

    let countriesElement = document.createElement("p");
    countries = detailedMovie.countries;
    let countriesString = "Pays d'origine : " + countries.shift();
    for (country of countries){
        countriesString = countriesString + ", " + country;
    }
    countriesElement.innerText = countriesString;
    infoElement.appendChild(countriesElement);

    let descriptionElement = document.createElement("p");
    descriptionElement.innerText = detailedMovie.long_description;
    infoElement.appendChild(descriptionElement);

    document.querySelector(".modal-body").appendChild(infoElement);
}


function emptyModal() {
    document.querySelector(".modal-header").removeChild(document.querySelector(".modal-header h2"));
    document.querySelector(".modal-body").removeChild(document.querySelector(".modal-body img"));
    document.querySelector(".modal-body").removeChild(document.querySelector(".modal-body div"));
}

function initiateAllCarouselsContents(){
    let carouselSectionElements = document.getElementsByClassName("carousel");
    for (let element of carouselSectionElements) {
        let imgElement = element.getElementsByTagName("img");
        for (i = 0; i < 4; i++){
            imgElement[i].classList.add("view");
        }
    };
}

function carouselHandler(previousButton, nextButton, carouselId){
    previousButton.addEventListener("click", function(){
        const displayedImages = document.querySelectorAll(carouselId + " div img.view");
        const previousImage = displayedImages[0].previousElementSibling
        if (previousImage){
            previousImage.classList.add("view");
            displayedImages[3].classList.remove("view");
            let previousPreviousImage = previousImage.previousElementSibling;
            if (previousPreviousImage){
            }else{
                previousButton.classList.remove("view");}
            nextButton.classList.add("view");
        }
    });

    nextButton.addEventListener("click", function(){
        const displayedImages = document.querySelectorAll(carouselId + " div img.view");
        const nextImage = displayedImages[3].nextElementSibling
        if (nextImage){
            nextImage.classList.add("view");
            displayedImages[0].classList.remove("view");
            let nextNextImage = nextImage.nextElementSibling 
            if (nextNextImage){
            }else{
                nextButton.classList.remove("view");
            }
            previousButton.classList.add("view");
        }
    });
}


// Controllers

async function main(){
    let bestMovies = await fetchMovies("", 8);
    let bestMovieDetailed = await fetchMovieDetailed(await bestMovies.shift());
    let sciFiMovies = await fetchMovies("sci-fi", 7);
    let comedyMovies = await fetchMovies("comedy", 7);
    let musicMovies = await fetchMovies("music", 7);
    await modifyBestFilm(bestMovieDetailed);
    await modifyCategoryFilmsImage(bestMovies, "#best_films");
    await modifyCategoryFilmsImage(sciFiMovies, "#Sci-Fi");
    await modifyCategoryFilmsImage(comedyMovies, "#Comedy");
    await modifyCategoryFilmsImage(musicMovies, "#Music");
    
    initiateAllCarouselsContents();

    const bestFilmsPreviousButton = document.getElementById("best_films__prev");
    const bestFilmsNextButton = document.getElementById("best_films__next");

    const sciFiPreviousButton = document.getElementById("Sci-Fi__prev");
    const sciFiNextButton = document.getElementById("Sci-Fi__next");

    const comedyPreviousButton = document.getElementById("Comedy__prev");
    const comedyNextButton = document.getElementById("Comedy__next");

    const musicPreviousButton = document.getElementById("Music__prev");
    const musicNextButton = document.getElementById("Music__next");

    carouselHandler(bestFilmsPreviousButton, bestFilmsNextButton, "#best_films")
    carouselHandler(sciFiPreviousButton, sciFiNextButton, "#Sci-Fi");
    carouselHandler(comedyPreviousButton, comedyNextButton, "#Comedy");
    carouselHandler(musicPreviousButton, musicNextButton, "#Music");


    let modal = document.getElementsByClassName("modal")[0];
    let button = document.getElementById("button");
    let span = document.getElementsByClassName("close")[0];

    button.onclick = function(){
        fillModal(bestMovieDetailed);
        modal.style.display = "block";
    }

    span.onclick = function(){
        emptyModal();
        modal.style.display = "none";
    }

    window.onclick = function(event){
        if (event.target == modal) {
            emptyModal();
            modal.style.display = "none";
        }
    }
}

// Possible event listener that must wrap function ?:
// window.addEventListener('load', function()
// document.addEventListener('DOMContentLoaded', () => {

document.addEventListener('DOMContentLoaded', function(){
    main();
})
