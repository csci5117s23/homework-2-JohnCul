const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

//fetch data for /todo/:id
export async function fetchItemData(itemId,userId, setData, authToken) {
  if(userId && itemId){
    const response = await fetch(backend_base+`/toDoItem?userId=${userId}&_id=${itemId}`, {
      'method':'GET',
      'headers': {'Authorization': 'Bearer ' + authToken, 'Accept': 'application/json'}
    })
    const data = await response.json()
    setData(data[0]);
  }
}

// fetch data for /todos
export async function fetchDataUnchecked(setData, setLoading, userId, authToken) {
    const response = await fetch(backend_base+`/toDoItem?userId=${userId}&checked=false`, {
      'method':'GET',
      'headers': {'Authorization': 'Bearer ' + authToken, 'Accept': 'application/json'}
    })
    const data = await response.json()
    setData(data);
    setLoading(false);
  }

// fetch data for /done
export async function fetchDataChecked(setData, setLoading, userId, authToken) {
  const response = await fetch(backend_base+`/toDoItem?userId=${userId}&checked=true`, {
    'method':'GET',
    'headers': {'Authorization': 'Bearer ' + authToken}
  })
  const data = await response.json()
  setData(data);
  setLoading(false);
}

//fetch category list for all items
export async function fetchCategories(setCategories, userId, authToken) {
  const response = await fetch(backend_base+`/toDoItem?userId=${userId}`, {
    'method':'GET',
    'headers': {'Authorization': 'Bearer ' + authToken}
  })
  const data = await response.json()
  let newCats = [""];
    newCats=newCats.concat("New Category");
    data.map(data => {
      if(!newCats.includes(data.category)){
        newCats = newCats.concat(data.category);
      }
    });
  setCategories(newCats);
}

// send a post to the backend
export async function postDataUnchecked(authToken,newGet, setNewGet,userId,newName,selectedCategory) {
  const response = await fetch(backend_base+'/toDoItem', {
    'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify({'userId':userId,'description':newName,'checked':false,'category':selectedCategory})
  }); 
  setNewGet(!newGet);
  return response;
}

// send a post to the backend with checked
export async function postDataChecked(authToken,newGet, setNewGet,userId,newName,selectedCategory) {
  const response = await fetch(backend_base+'/toDoItem', {
    'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify({'userId':userId,'description':newName,'checked':true,'category':selectedCategory})
  }); 
  setNewGet(!newGet);
  return response;
}

// update todoitem to have the opposite "checked" boolean and remove cateogry
export async function updateCheckBox(newPost, authToken){
  const response = await fetch(backend_base+'/updateTodoItem?_id='+newPost._id, {
    'method':'PUT',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(newPost)
  }); 
  return await response.json();
}

// fetch data with a specific category
export async function fetchDataCategory(setItemCatDelList, category, userId, authToken) {
  const response = await fetch(backend_base+`/toDoItem?userId=${userId}&category=${category}`, {
    'method':'GET',
    'headers': {'Authorization': 'Bearer ' + authToken}
  })
  const data = await response.json()
  setItemCatDelList(data);
}

// fetch unchecked data of a specific category
export async function fetchDataForCategory(setPosts, category,  userId, authToken, checked) {
  const response = await fetch(backend_base+`/toDoItem?userId=${userId}&category=${category}&checked=${checked}`, {
    'method':'GET',
    'headers': {'Authorization': 'Bearer ' + authToken}
  })
  const data = await response.json()
  setPosts(data);
}