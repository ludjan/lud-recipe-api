const feed = document.getElementById('recipe-feed')
const addRecipeForm = document.getElementById('add-recipe-form')
const recipeNameInput = document.getElementById('recipe-name')


const url='https://lud-recipe-app.herokuapp.com/api/recipes'

addRecipeForm.addEventListener("submit", () => {
  
  // create the new entry
  const newRecipe = {
    name: recipeNameInput.value
  }
  console.log(newRecipe.name)

  // clear the input field
  recipeNameInput.innerText = ""

  // async add, then re-render
  addRecipe(newRecipe).then(data => {
    if (!data.ok) {
      const errorMsg = `Error ${data.status} - ${data.statusText}`
      console.log(errorMessage)
      alert(errorMessage)
      return
    }
    render()
  })
})

async function addRecipe(recipe) {

  // fetch the post 
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recipe)
  })
  return response
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

// render the page on first load
render()