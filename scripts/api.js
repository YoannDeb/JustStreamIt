const API_URL = "https://ocmovies.debinformatique.fr"
const baseURL = API_URL + "/api/v1/titles/?format=json&sort_by=-imdb_score&genre="

/**
 * Completes movie list until the end of the movies provided or
 * the list lenght is equal to the quantity desired.
 * @param {Object}  json      Parsed response of the API.
 * @param {Array}   movies    A table of movies object we want to fill.
 * @param {Number}  quantity  Quantity of movies desired in the final list.
 */
async function completeMovieList(json, movies, quantity){
    for (let result of await json.results){
        if (movies.length < quantity){
            movies.push(result);
        }
    }
}

/**
 * Makes a list with movies' objects fetched from API server.
 * Depends of genre and number of movies required.
 * @param {String} genre     If genre is an empty string, API will return best movies in all categories.
 * @param {Number} quantity  Quantity of movies desired in the final list.
 * @returns                  A list of movies' objects.
 */
export async function fetchMovies(genre, quantity){
    let movies = []
    let response = await fetch(baseURL + genre);
    let json = await response.json();
    completeMovieList(json, movies, quantity);
    while (movies.length < quantity){
        response = await fetch(await json.next);
        json = await response.json();
        completeMovieList(json, movies, quantity);
    }
    return movies;
}

/**
 * Take a movie object and return an other movie object, more detailed, from the API.
 * @param   {Object} movie  A movie's object.
 * @returns {Object}        A movies' object more detailed, from the specific API's movie's pages.
 */
export async function fetchMovieDetailed(movie){
    let response = await fetch(movie.url);
    return await response.json();
}
