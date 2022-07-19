const feed = document.getElementById('recipe-feed')

const url='https://lud-recipe-app.herokuapp.com/api/recipes'
// const url='http://localhost:3000/api/recipes'

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))