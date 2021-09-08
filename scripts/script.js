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
    // let buttonElement = document.createElement("button");
    let imageElement = document.createElement("img");
    imageElement.setAttribute( "src", movie.image_url);
    imageElement.setAttribute("alt", movie.title + " poster");
    imageElement.setAttribute("class", "movieImage" + movie.id)
    // buttonElement.appendChild(imageElement);
    return imageElement;
}

async function modifyCategoryFilmsImage(movies, selector){
    document.querySelector(selector).removeChild(document.querySelector(selector + " figure"));
    for(let movie of movies){
        let imageElement = createImageElement(movie)
        document.querySelector(selector).appendChild(imageElement);
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



// Controllers

async function main(){
    let bestMovies = await fetchMovies("", 8);
    let bestMovieDetailed = await fetchMovieDetailed(await bestMovies.shift())
    let sciFiMovies = await fetchMovies("sci-fi", 7);
    let comedyMovies = await fetchMovies("comedy", 7);
    let musicMovies = await fetchMovies("music", 7);
    await modifyBestFilm(bestMovieDetailed);
    await modifyCategoryFilmsImage(bestMovies, "#best_films")
    await modifyCategoryFilmsImage(sciFiMovies, "#Sci-Fi")
    await modifyCategoryFilmsImage(comedyMovies, "#Comedy")
    await modifyCategoryFilmsImage(musicMovies, "#Music");

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
