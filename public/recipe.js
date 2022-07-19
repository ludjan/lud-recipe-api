const feed = document.getElementById('feed-recipe')

const url = 'https://lud-recipe-app.herokuapp.com/api/recipes'

fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err))