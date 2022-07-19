const feed = document.getElementById('recipe-feed')

const url = 'https://lud-recipe-app.herokuapp.com/api/recipes'

fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      var recipeLi = ""
      data.forEach(recipe => {
        recipeLi += `<h3> ${recipe.name}</h3>`
      })
      feed.innerHTML += recipeLi
    })
    .catch(err => console.log(err))