const baseURL = "http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre="

async function buildMovieList(json, movies, quantity){
    for (let result of await json.results){
        if (movies.length < quantity){
            movies.push(result);
        }
    }
}

/**
 * Makes a list with objects fetched from API server.
 * Depends of genre and number of films required.
 * @param {string} genre: If genre is an empty string, API will return best films in all categories.
 * @param {number} quantity: quantity of films desired in the final list.
 * @returns a list of movies
 */
export async function fetchMovies(genre, quantity){
    let movies = []
    let response = await fetch(baseURL + genre);
    let json = await response.json();
    buildMovieList(json, movies, quantity);
    while (movies.length < quantity){
        response = await fetch(await json.next);
        json = await response.json();
        buildMovieList(json, movies, quantity);
    }
    return movies;
}

export async function fetchMovieDetailed(movie){
    let response = await fetch(movie.url);
    return await response.json();
}
