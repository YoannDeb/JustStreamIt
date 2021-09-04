//fetch examples for API OCMovies:
//fetch("http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score");
//fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=music");
//fetch("http://localhost:8000/api/v1/titles/499549")

function bestFilm(){
    fetch("http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score")
        .then(function(resolution){
            if(resolution.ok){
                return resolution.json();
            }
        })
        .then(function(json){
            return json.results[0].id;
    })
    .then(function(id){
        fetch("http://localhost:8000/api/v1/titles/" + id + "?format=json")
        .then(function(resolution){
            if(resolution.ok){
                return resolution.json();
            }
        })
        .then(function(json){
            document.querySelector("#best_film h1").innerText = json.title;
            document.querySelector("#best_film img").setAttribute("src", json.image_url);
            document.querySelector("#best_film p").innerText = json.description;
        })
    })
    .catch(function(e){
        console.error(e);
    });
}

// async function bestFilmDescription(){
//     const id = await bestFilmId()
//     console.log("http://localhost:8000/api/v1/titles/" + id + "/?format=json")
// }

async function bestFilmsIdsPage1(genre){
    let ids = [];
    await fetch("http://localhost:8000/api/v1/titles/?format=json&sort_by=-imdb_score&genre=" + genre)
        .then(function(resolution){
            if(resolution.ok){
                return resolution.json();
            }
        })
        .then(function(json){
            for(result of json.results){
                ids.push(result.id);
            }
    })
    .catch(function(e){
        console.error(e);
    });
    return ids;
}

async function bestFilmsIdsPage2(genre){
    let ids = [];
    await fetch("http://localhost:8000/api/v1/titles/?format=json&page=2&sort_by=-imdb_score&genre=" + genre)
        .then(function(resolution){
            if(resolution.ok){
                return resolution.json();
            }
        })
        .then(function(json){
            for(let i = 0; i < 2; i++){
                ids.push(json.results[i].id);
            }
    })
    .catch(function(e){
        console.error(e);
    });
    return ids;
}

async function bestFilmsIds(genre){
    let idsPage1 = await bestFilmsIdsPage1(genre);
    let idsPage2 = await bestFilmsIdsPage2(genre);
    return idsPage1.concat(idsPage2);
}

async function modifyCategoryFilmsImage(ids, selector){
    let links = document.querySelectorAll(selector + " a");
    for(let i = 0; i < ids.length; i++){
        fetch("http://localhost:8000/api/v1/titles/" + ids[i] + "?format=json")
        .then(function(resolution){
            if(resolution.ok){
                return resolution.json();
            }
        })
        .then(function(json){
            links[i].innerHTML = '<img src="' + json.image_url + '" alt="' + json.title + ' poster" />'
            links[i].setAttribute("href", json.url);
        })
        .catch(function(e){
            console.error(e);
        })
    }
}

// let selector = "#best_films";
// console.log(selector);
// let links = document.querySelectorAll(selector + " a")[0].innerHTML = '<img src="img/logo.png" alt="" />';

// let links = document.querySelector(selector);
// console.log("links" + links);
// window.addEventListener('load', function(){
//     bestFilm();
//     bestFilmsIds()
//     .then(function(e){
//         console.log(e)
//         modifyCategoryFilmsImage(e, "#best_films")
//     })
//     .catch(function(e){
//         console.error(e);
//     });
// });
async function main(){
    bestFilm();
    modifyCategoryFilmsImage(await bestFilmsIds(""), "#best_films")
    modifyCategoryFilmsImage(await bestFilmsIds("sci-fi"), "#Sci-Fi")
    modifyCategoryFilmsImage(await bestFilmsIds("comedy"), "#Comedy")
    modifyCategoryFilmsImage(await bestFilmsIds("music"), "#Music");
}

main()