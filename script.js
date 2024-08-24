const apiKey = "1310bb05";
const baseURL = "https://www.omdbapi.com/";
const imgURL = "https://image.tmdb.org/t/p/w1280";

const form = document.getElementById("search-form");
const query = document.getElementById("query");
const root = document.getElementById("root");

let page = 1;
let inSearchPage = false;

// Fetch JSON data from URL
async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

const fetchAndShowResults = async (url) => {
    const data = await fetchData(url);
    if (data && data.Search) {
        showResults(data.Search);
    } else {
        root.innerHTML = "<p>Something went wrong!</p>";
    }
};

const getSpecificPage = (query, page) => {
    const url = `${baseURL}?apikey=${apiKey}&s=${query}&page=${page}`;
    fetchAndShowResults(url);
};

const movieCard = (movie) =>
    `<div class="col">
        <div class="card">
            <a class="card-media" href="${movie.Poster}">
                <img src="${movie.Poster}" alt="${movie.Title}" width="100%" />
            </a>
            <div class="card-content">
                <div class="card-cont-header">
                    <div class="cont-left">
                        <h3 style="font-weight: 600">${movie.Title}</h3>
                        <span style="color: #12efec">${movie.Year}</span>
                    </div>
                    <div class="cont-right">
                        <a href="${movie.Poster}" target="_blank" class="btn">See image</a>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

const showResults = (items) => {
    let content = !inSearchPage ? root.innerHTML : "";
    if (items && items.length > 0) {
        items.forEach((item) => {
            let { Title, Year, Poster } = item;

            if (!Poster || Poster === "N/A") {
                Poster = "./img-01.jpeg";
            }

            if (Title.length > 15) {
                Title = Title.slice(0, 15) + "...";
            }

            const movieItem = { Title, Year, Poster };

            content += movieCard(movieItem);
        });
    } else {
        content += "<p>No results found!</p>";
    }

    root.innerHTML = content;
};

const handleLoadMore = () => {
    getSpecificPage(query.value || "SPIDERMAN", ++page);
};

const detectEndAndLoadMore = () => {
    let el = document.documentElement;
    if (!inSearchPage && el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
        handleLoadMore();
    }
};

form.addEventListener("submit", async (e) => {
    inSearchPage = true;
    e.preventDefault();
    const searchTerm = query.value;
    if (searchTerm) {
        page = 1;  // Reset to the first page for new search
        fetchAndShowResults(`${baseURL}?apikey=${apiKey}&s=${searchTerm}`);
    }
    query.value = "";
});

window.addEventListener("scroll", detectEndAndLoadMore);

function init() {
    inSearchPage = false;
    fetchAndShowResults(`${baseURL}?apikey=${apiKey}&s=SPIDERMAN`);
}

init();
