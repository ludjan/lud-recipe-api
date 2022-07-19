const feed = document.getElementById('recipe-feed')
const addRecipeBtn = document.getElementById('add-recipe-btn')

const url='https://lud-recipe-app.herokuapp.com/api/recipes'
// const url='http://localhost:3000/api/recipes'

addRecipeBtn.addEventListener("click", () => {
  console.log('addRecipeBtn was clicked')

  // create the new entry
  const newRecipe = {
    name: "newRecipe"
  }
  
  // async add, then re-render
  addRecipe(newRecipe).then(data => {
    console.log(data)
    render()
  })
})

async function addRecipe(recipe) {

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
  return response.json()
}

async function render() {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      feed.innerHTML = `<ul>`
      data.forEach(recipe => {
        feed.innerHTML += `<li>${recipe.name}</li>`
      })
      feed.innerHTML += `</ul>`
    })
    .catch(err => console.log(err))
}

render()