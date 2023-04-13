const backend_base = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

// fetch data for /todos
export async function fetchDataUnchecked(setData, setLoading, userId, authToken) {
    const response = await fetch(backend_base+`/toDoItem?userId=${userId}&checked=false`, {
      'method':'GET',
      'headers': {'Authorization': 'Bearer ' + authToken, 'Accept': 'application/json'}
    })
    const data = await response.json()
    // update state -- configured earlier.
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
  // update state -- configured earlier.
  setData(data);
  setLoading(false);
}

// send a post to the backend
export async function postDataUnchecked(authToken,newGet, setNewGet,userId,newName,selectedCategory) {
  // Default options are marked with *
  const response = await fetch(backend_base+'/toDoItem', {
    'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify({'userId':userId,'description':newName,'checked':false,'category':selectedCategory})
  }); 
  setNewGet(!newGet);
  return response; // parses JSON response into native JavaScript objects
}

// send a post to the backend with checked
export async function postDataChecked(authToken,newGet, setNewGet,userId,newName,selectedCategory) {
  // Default options are marked with *
  const response = await fetch(backend_base+'/toDoItem', {
    'method':'POST',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify({'userId':userId,'description':newName,'checked':true,'category':selectedCategory})
  }); 
  setNewGet(!newGet);
  return response; // parses JSON response into native JavaScript objects
}

// update todoitem to have the opposite "checked" boolean
export async function updateCheckBox(newPost, authToken){
  const response = await fetch(backend_base+'/updateTodoItem?_id='+newPost._id, {
    'method':'PUT',
        'headers': {'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'},
        'body': JSON.stringify(newPost)
  }); 
  return await response.json();
}