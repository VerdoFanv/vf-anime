const currentLocation = window.location.host + (window.location.port === '') ? '' : `:${window.location.port}`;

const toggleClass = ({ btn, element, className }) => {
    btn.addEventListener('click', () => {
        element.classList.toggle(className);
    });
};

const createButton = ({
    buttonText, buttonClass = '', buttonId = '', customAtribute = '', eventListener,
}) => {
    const button = document.createElement('button');
    button.innerText = buttonText;

    if (buttonClass !== '') {
        button.classList.add(buttonClass);
    }

    if (buttonId !== '') {
        button.setAttribute('id', buttonId);
    }

    if (customAtribute !== '') {
        button.setAttribute(customAtribute.name, customAtribute.value);
    }

    button.addEventListener('click', function (event) {
        let data;
        if (this.dataset !== undefined) {
            data = this.dataset;
        }

        eventListener(event, data);
        event.stopPropagation();
        event.preventDefault();
    });

    return button;
};

const trashButton = () => {
    return createButton({
        buttonText: 'x',
        buttonClass: 'cancelAddGenreBtn',
        eventListener: (event) => {
            event.preventDefault();
            event.target.parentElement.remove();
        },
    });
};

const deleteButton = (animeId, image) => {
    return createButton({
        buttonText: 'Delete',
        buttonId: 'deleteBtn',
        customAtribute: {
            name: 'data-animeid',
            value: animeId,
        },
        eventListener: (e, data) => {
            console.log(image);
            const getAnimeId = data.animeid;
            fetch(`${currentLocation}/deleteAnime/${getAnimeId}/${image}`, {
                method: 'DELETE',
            })
                .then(() => window.location.reload())
                .catch((error) => console.log(error));
        },
    });
};

const editButton = (animeId) => {
    return createButton({
        buttonText: 'Edit',
        buttonId: 'editBtn',
        customAtribute: {
            name: 'data-animeid',
            value: animeId,
        },
        eventListener: (e, data) => {
            const getAnimeId = data.animeid;
            fetch(`${currentLocation}/editAnime?id=${getAnimeId}`, {
                method: 'PUT',
            });
        },
    });
};

document.querySelectorAll('.open-modal').forEach((openModal) => {
    openModal.addEventListener('click', function () {
        const animeId = this.dataset.animeid;

        fetch(`${currentLocation}/anime?id=${animeId}`)
            .then((response) => response.json())
            .then((responseJSON) => {
                const {
                    img, title, year, genres, desc, rate,
                } = responseJSON.body;

                const modalHeaderWhenLoggedIn = document.getElementById('modalHeader');
                const modalBodyWhenLoggedIn = document.getElementById('modalBody');
                const modalHeaderWhenNotLoggedIn = document.getElementById('modalHeaderGeneral');
                const modalBodyWhenNotLoggedIn = document.getElementById('modalBodyGeneral');

                if (modalBodyWhenLoggedIn && modalHeaderWhenLoggedIn !== undefined) {
                    let animeGenre = '';
                    genres.forEach((genre) => {
                        animeGenre += `<p class="anime-genre">#${genre}</p>`;
                    });

                    modalHeaderWhenLoggedIn.innerHTML = `
                        <img src="upload/${img}" alt="Anime Picture" title="Anime Picture">
                    `;

                    modalBodyWhenLoggedIn.innerHTML = `
                        <h2 class="anime-title">${title}</h2>
                        <p class="anime-year">${year}</p>
                        <p class="anime-rate-modal">&#9733; ${rate}</p>
                        <p class="anime-desc">${desc}</p>
                        <div class="anime-tags">
                            ${animeGenre}
                        </div>
                        <div class="action-button">
                            
                        </div>
                    `;

                    document.querySelector('.action-button').append(
                        editButton(animeId, img),
                        deleteButton(animeId, img),
                    );
                } else {
                    let animeGenre = '';
                    genres.forEach((genre) => {
                        animeGenre += `<p class="anime-genre">#${genre}</p>`;
                    });

                    modalHeaderWhenNotLoggedIn.innerHTML = `
                        <img src="upload/${img}" alt="Anime Picture" title="Anime Picture">
                    `;

                    modalBodyWhenNotLoggedIn.innerHTML = `
                        <h2 class="anime-title">${title}</h2>
                        <p class="anime-year">${year}</p>
                        <p class="anime-rate-modal">&#9733; ${rate}</p>
                        <p class="anime-desc">${desc}</p>
                        <div class="anime-tags">
                            ${animeGenre}
                        </div>
                    `;
                }
            });
    });

    toggleClass({
        btn: openModal,
        element: document.getElementById('detailAnimeModal'),
        className: 'show',
    });
});

document.querySelectorAll('.close-btn-modal').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
        document.getElementById('detailAnimeModal').classList.remove('show');
    });

    closeBtn.addEventListener('click', (event) => {
        document.getElementById('addAnimeModal').classList.remove('show');
        event.preventDefault();
    });
});

toggleClass({
    btn: document.getElementById('filterAnimeBtn'),
    element: document.getElementById('detailAnimeModal'),
    className: 'show',
});

document.getElementById('filterAnimeBtn').addEventListener('click', () => {
    const modalBodyWhenLoggedIn = document.getElementById('modalBody');
    const modalBodyWhenNotLoggedIn = document.getElementById('modalBodyGeneral');
    const modalHeaderWhenLoggedIn = document.getElementById('modalHeader');
    const modalHeaderWhenNotLoggedIn = document.getElementById('modalHeaderGeneral');

    fetch(`${currentLocation}/getGenres`)
        .then((responseJSON) => responseJSON.json())
        .then((response) => {
            let animeGenre = '';
            response.body.forEach((genre) => {
                animeGenre += `<option value="${genre}">${genre}</option>`;
            });
            const contents = `
                <label for="alphabet">Alphabet</label>
                <select name="alphabet">
                    <option>A - Z</option>
                    <option>Z - A</option>
                </select>
                <label for="year">Tahun</label>
                <select name="year">
                    <option>Terbaru</option>
                    <option>Terlama</option>
                </select>
                <label for="genre">Genre</label>
                <select name="genre">
                    <option value="Pilih Genre">-- Pilih Genre --</option>
                    ${animeGenre}
                </select>
            `;

            if (modalBodyWhenLoggedIn !== undefined && modalBodyWhenLoggedIn !== null) {
                modalHeaderWhenLoggedIn.classList.add('hide');
                modalBodyWhenLoggedIn.classList.add('expand');
                modalBodyWhenLoggedIn.innerHTML = contents;
            }

            modalHeaderWhenNotLoggedIn.classList.add('hide');
            modalBodyWhenNotLoggedIn.classList.add('expand');
            modalBodyWhenNotLoggedIn.innerHTML = contents;
        });

    document.querySelectorAll('.close-btn-modal').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => {
            if (modalBodyWhenLoggedIn !== undefined && modalBodyWhenLoggedIn !== null) {
                modalHeaderWhenLoggedIn.classList.remove('hide');
                modalBodyWhenLoggedIn.classList.remove('expand');
            }

            modalHeaderWhenNotLoggedIn.classList.remove('hide');
            modalBodyWhenNotLoggedIn.classList.remove('expand');
        });
    });
});

if (document.getElementById('addAnime') !== null) {
    toggleClass({
        btn: document.getElementById('addAnime'),
        element: document.getElementById('addAnimeModal'),
        className: 'show',
    });
}

document.getElementById('btnAddGenre').addEventListener('click', () => {
    const getValueAddGenreOptions = document.getElementById('addGenreOptions').value;

    if (getValueAddGenreOptions === 'Pilih Genre') {
        return;
    }

    const textGenre = document.createElement('p');
    textGenre.classList.add('anime-genre');
    textGenre.classList.add('genre-data');
    textGenre.innerText = `#${getValueAddGenreOptions}`;
    textGenre.appendChild(trashButton());

    document.getElementById('animeTags').append(
        textGenre,
    );
});

document.getElementById('addAnimeBtn').addEventListener('click', () => {
    const arr = [];
    const genres = document.querySelectorAll('.genre-data');

    if (genres !== undefined) {
        genres.forEach((animeGenre) => {
            const animeGenreJammed = (animeGenre.innerText).slice(1, animeGenre.innerText.length - 1).toLowerCase();
            arr.push(animeGenreJammed);
        });
    }

    fetch(`${currentLocation}/addGenres`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            anime_genres: arr,
        }),
    })
        .then((reponse) => console.log(reponse))
        .catch(() => console.log('Gagal'));
});
