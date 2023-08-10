const searchInput = document.querySelector('.searchInput');
const autocompleteList = document.querySelector('.autocompleteList');
const repositoryList = document.querySelector('.repositoryList');

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function searchRepositories(query) {
    if (!query) {
        autocompleteList.classList.remove('autocompleteList-visible');
        return;
    }
    fetch(`https://api.github.com/search/repositories?q=${query}&per_page=5`)
        .then(response => response.json())
        .then(data => {
            autocompleteList.textContent = '';
            data.items.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name;
                div.addEventListener('click', () => addRepository(item));
                autocompleteList.appendChild(div);
            });
            autocompleteList.classList.add('autocompleteList-visible');
        });
}

function addRepository(repository) {
    const li = document.createElement('li');
    li.innerText = `Name: ${repository.name}<br>Owner: ${repository.owner.login}<br>Stars: ${repository.stargazers_count}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '';
    deleteButton.classList.add('btn-delete');
    deleteButton.addEventListener('click', () => li.remove());
    li.appendChild(deleteButton);
    repositoryList.appendChild(li);
    searchInput.value = '';
    autocompleteList.classList.remove('autocompleteList-visible');
}

searchInput.addEventListener('input', debounce((event) => searchRepositories(event.target.value), 500));
