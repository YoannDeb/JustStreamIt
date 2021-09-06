// Models
const baseURL = "http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre="

async function fetchMovies(genre, quantity){
    let movies = []
    let response = await fetch(baseURL + genre);
    let json = await response.json();
    console.log(json)
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

async function fetchMovieDetailled(movie){
    let response = await fetch(movie.url);
    return await response.json();
}

// Views
async function modifyBestFilm(movieDetailled){
    document.querySelector("#best_film h1").innerText = movieDetailled.title;
    document.querySelector("#best_film img").setAttribute("src", movieDetailled.image_url);
    document.querySelector("#best_film p").innerText = movieDetailled.description;
}

function createImageElement(movie){
    let imageElement = document.createElement("img");
    imageElement.setAttribute( "src", movie.image_url);
    imageElement.setAttribute("alt", movie.title + " poster");
    return imageElement;
}

async function modifyCategoryFilmsImage(movies, selector){
    document.querySelector(selector).removeChild(document.querySelector(selector + " figure"));
    for(let movie of movies){
        document.querySelector(selector).appendChild(createImageElement(movie));
    }
}

// Controllers
// Possible event listener that must wrap function ?:
// window.addEventListener('load', function()
// document.addEventListener('DOMContentLoaded', () => {
async function main(){
    let bestFilms = await fetchMovies("", 8);
    let bestFilm = await bestFilms.shift();
    await modifyBestFilm(await fetchMovieDetailled(bestFilm));
    await modifyCategoryFilmsImage(bestFilms, "#best_films")
    await modifyCategoryFilmsImage(await fetchMovies("sci-fi", 7), "#Sci-Fi")
    await modifyCategoryFilmsImage(await fetchMovies("comedy", 7), "#Comedy")
    await modifyCategoryFilmsImage(await fetchMovies("music", 7), "#Music");
}

main()
