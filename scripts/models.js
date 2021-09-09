const baseURL = "http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre="

/**
 * 
 * @param {string} genre 
 * @param {number} quantity 
 * @returns a list of movies
 */
export async function fetchMovies(genre, quantity){
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

export async function fetchMovieDetailed(movie){
    let response = await fetch(movie.url);
    return await response.json();
}