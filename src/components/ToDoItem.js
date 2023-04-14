import styles from '@/styles/Home.module.css';
import {useEffect, useState} from 'react';
import {updateCheckBox} from '@/modules/Data.js';
import {useAuth} from "@clerk/nextjs";
import Link from 'next/link';

export default function ToDoItem(props){
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  function handleChange(checkbox){
    const value = checkbox.target.checked;
    // need to update database: need ID of todo item and value of the checked item
    // also need to update the list of items
    async function updateItem(){
      if(props.post.userId){
        const token = await getToken({template: "codehooks"});
        let newPost = { ...props.post}
        newPost.checked = value;
        newPost = await updateCheckBox(newPost, token);
      }
    }
    updateItem();
    props.setNewChecked(true);
  }
  let toDoLink = "todo/"+props.post._id
    return (<>
          <div key="category" className="pure-u-1-4">
            <div className={styles.categoryDisplay}>{props.post.category}</div>
          </div>
          <div key="content" className="pure-u-3-4">
            <div className={styles.noWrap}>
              <input className = {styles.toDoCheckbox} type="checkbox" name="checkbox" id="checkboxOption" value={props.post.checked} defaultChecked={props.post.checked} onClick={handleChange.bind(this)}/>
              <Link href={toDoLink}>{props.post.description}</Link>
            </div>
          </div>
        </>
    );
  }
