import {fetchMovies, fetchMovieDetailed} from '/scripts/api.js';

import {
    modifyBestFilm,
    modifyCategoryFilmsImage,
    fillModal,
    emptyModal,
    initiateAllCarouselsContents,
    carouselHandler} from './views.js';

/**
 * Main controller function: 
 * - Retrieves movies wanted.
 * - Modify HTML and CSS of the page to show info.
 * - In the same time creates modal listening events for movies poster created.
 * - Starts carousel.
 * - Creates modal listening event for the best film.
 * - Creates modal closing handlers. 
 */
export async function main(){
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
    let span = document.getElementsByClassName("modal__content__header__close")[0];

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
