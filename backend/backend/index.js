
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'

import { date, object, string, bool, number } from 'yup';
const flashCardYup = object({
    front: string().required(),
    back: string().required(),
    category: string().required(),
    createdOn: date().default(() => new Date()),
})

const toDoItem = object({
    id: number().default(),
    description: string().required(),
    isDone: bool().required(),
    category: string(),
    date: date().default(() => new Date()),
})




// Use Crudlify to create a REST API for any collection
// crudlify(app)
// will be on /dev/test
//json avail in req.body
// app.get("/test", (req, res) => {
//     res.json({result: "you did it!"});
// });

crudlify(app, {flashCard: flashCardYup})

// bind to serverless runtime
export default app.init();
