
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js';
import {crudlify} from 'codehooks-crudlify';
import { object,date, number, string, bool } from 'yup';

const toDoYup = object({
    userId: string().required(),
    description: string().required(),
    checked: bool().required(),
    category: string(),
    date: date().default(() => new Date()),
})

// async function updateChecked(req, res) {
//     const datastore = await Datastore.open();
//     const result = await datastore.updateOne('todos', req.query._id, req.description);
//     res.json(result);
// }
// app.put("/updateChecked", updateChecked);
app.put('/updateTodoItem', updateCheckBox)
async function updateCheckBox(req, res) {
    const database = await Datastore.open();
    const data = await database.updateOne('toDoItem', req.query._id, req.body);
    res.json(data);
}


crudlify(app, {toDoItem: toDoYup})

// bind to serverless runtime
export default app.init();
