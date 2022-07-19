const feed = document.getElementById('feed-recipe')

const url = 'https://lud-recipe-app.herokuapp.com/api/recipes'

fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      data.forEach(recipe => {
        const recipeRep = `<h3> ${recipe.name}</h3>`
        feed.innerHTML += recipeRep
      })
    })
    .catch(err => console.log(err))