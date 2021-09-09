import { fetchMovieDetailed } from "./models";

export async function modifyBestFilm(movieDetailed){
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

export async function modifyCategoryFilmsImage(movies, selector){
    document.querySelector(selector + " div").removeChild(document.querySelector(selector + " div figure"));
    for(let movie of movies){
        let imageElement = createImageElement(movie)
        document.querySelector(selector + " div").appendChild(imageElement);
        imageElement.onclick = async function(){
            let movieDetailed = await fetchMovieDetailed(movie);
            fillModal(movieDetailed);
            let modal = document.getElementsByClassName("modal")[0];
            modal.style.display = "block";
        }
    }
}

export function fillModal(detailedMovie) {
    let titleElement = document.createElement("h2");
    titleElement.innerText = detailedMovie.title;
    document.querySelector(".modal-header").appendChild(titleElement);
    
    document.querySelector(".modal-body").appendChild(createImageElement(detailedMovie));
    
    let infoElement = document.createElement("div");

    let genresElement = document.createElement("p");
    var genres = detailedMovie.genres;
    let genresString = "";
    if (genres.length == 1){
        genresString = "Genre : " + genres[0];
    }else{
        genresString = "Genres : " + genres.shift();
        for (let genre of genres){
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
    var directors = detailedMovie.directors;
    let directorsString = ""
    if (directors.length = 1){
        directorsString = "Réalisateur : " + directors[0];
    }else{
        directorsString = "Réalisateurs : " + directors.shift();
        for (let director of directors){
            directorsString = directorsString + ", " + director;
        }
    }
    directorsElement.innerText = directorsString;
    infoElement.appendChild(directorsElement);

    let actorsElement = document.createElement("p");
    var actors = detailedMovie.actors;
    let actorsString = "";
    if (actors.length == 1){
        actorsString = "Acteur : " + actors[0];
    }else{
        actorsString = "Acteurs : " + actors.shift();
        for (let actor of actors){
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
    var countries = detailedMovie.countries;
    let countriesString = "Pays d'origine : " + countries.shift();
    for (let country of countries){
        countriesString = countriesString + ", " + country;
    }
    countriesElement.innerText = countriesString;
    infoElement.appendChild(countriesElement);

    let descriptionElement = document.createElement("p");
    descriptionElement.innerText = detailedMovie.long_description;
    infoElement.appendChild(descriptionElement);

    document.querySelector(".modal-body").appendChild(infoElement);
}


export function emptyModal() {
    document.querySelector(".modal-header").removeChild(document.querySelector(".modal-header h2"));
    document.querySelector(".modal-body").removeChild(document.querySelector(".modal-body img"));
    document.querySelector(".modal-body").removeChild(document.querySelector(".modal-body div"));
}

export function initiateAllCarouselsContents(){
    let carouselSectionElements = document.getElementsByClassName("carousel");
    for (let element of carouselSectionElements) {
        let imgElement = element.getElementsByTagName("img");
        for (let i = 0; i < 4; i++){
            imgElement[i].classList.add("view");
        }
    };
}

export function carouselHandler(previousButton, nextButton, carouselId){
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