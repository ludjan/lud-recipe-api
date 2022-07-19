const feed = document.getElementById('feed-recipe')

const url = 'https://lud-recipe-app.herokuapp.com/api/recipes'

fetch(url)
    .then(response => response.json())
    .then(data => {
        data.forEach(recipe => {
            console.log(recipe)
        })
    })
    .catch(err => console.log(err))