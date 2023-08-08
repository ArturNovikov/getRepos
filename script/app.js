const searchInput = document.getElementById('searchInput');
const autocompleteList = document.getElementById('autocompleteList');
const repositoryList = document.getElementById('repositoryList');

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function searchRepositories(query) {
    if (!query) {
        autocompleteList.style.display = 'none';
        return;
    }
    fetch(`https://api.github.com/search/repositories?q=${query}`)
        .then(response => response.json())
        .then(data => {
            autocompleteList.innerHTML = '';
            data.items.slice(0, 5).forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name;
                div.addEventListener('click', () => addRepository(item));
                autocompleteList.appendChild(div);
            });
            autocompleteList.style.display = 'block';
        });
}

function addRepository(repository) {
    const li = document.createElement('li');
    li.innerHTML = `Name: ${repository.name}<br>Owner: ${repository.owner.login}<br>Stars: ${repository.stargazers_count}`;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '';
    deleteButton.classList.add('btn-delete');
    deleteButton.addEventListener('click', () => li.remove());
    li.appendChild(deleteButton);
    repositoryList.appendChild(li);
    searchInput.value = '';
    autocompleteList.style.display = 'none';
}

searchInput.addEventListener('keyup', debounce(() => searchRepositories(searchInput.value), 500));
