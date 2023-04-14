import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState, createElement} from 'react'
import CategorySelector from '@/components/CategorySelector.js'
import ToDoItem from '@/components/ToDoItem.js'
import { useAuth, SignIn, UserButton } from "@clerk/nextjs";
import {postDataUnchecked, fetchCategories, fetchDataForCategory} from '@/modules/Data.js'
import {useRouter} from 'next/router'
import CategorySidebar from '@/components/CategorySidebar.js'

const inter = Inter({ subsets: ['latin'] })

export default function TodosCategory() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading]=useState(true);
  const [newName, setNewName]=useState("");
  const [newGet, setNewGet] = useState(false);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [newChecked, setNewChecked] = useState(false);
  const [category, setCategory] = useState("");
  const [newCatDeleted, setNewCatDeleted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if(isLoaded && !userId) {
      router.push("/");
      }
  }, [isLoaded, userId])
 
    useEffect(() => {
        setCategory(router.query.category);
    },[router.query]);

  // get data from the database
  useEffect(() => {
    async function loadToDoDataCategory(){
      if(userId && category != ""){
        const token = await getToken({template: "codehooks"});
        fetchDataForCategory(setPosts, category, userId, token, false);
      }
    }
    loadToDoDataCategory();
    setNewChecked(false);
    setLoading(false);
  }, [newGet, isLoaded, newChecked, category]);

  // post data to the database
  async function postData() {
    if(userId){
      const token = await getToken({template: "codehooks"});
      postDataUnchecked(token, newGet, setNewGet, userId, newName, category);
      setNewCatDeleted(true);
    }
  }

  // if valid name, add to database
  function addName() {
    if(newName!=""){
      postData(category);
    }
  }

  if(loading){
    return(<span>loading...</span>)
  }else{
  return (
    <>
      <Head>
        <title>{category}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className="pure-g" id="menu">
          <div className="pure-u-3-4">
            <h1 className={styles.header}>TODOS: {category}</h1>
          </div>
          <div className="pure-u-1-4">
            <div className={styles.userButton}>
              <UserButton></UserButton>
            </div>
          </div>
        </div>
        <div className={styles.todoitem}>
          <p>New To Do Item: 
            <input className={styles.newtodoitem} value={newName} onChange={(e=>setNewName(e.target.value))}>
            </input> 
            <span className={styles.categoryLabel}>Category: {category}</span>
            <span className={styles.newtodosubmit}>
              <button className="pure-button" onClick={addName}>Add Item</button> 
            </span>
            
          </p>
        </div>
        <div className="pure-g">
          <div key="categorySidebar" className="pure-u-1-5">
            <CategorySidebar reloader={newCatDeleted} setReloader={setNewCatDeleted} isChecked={true} initPath="/todos/"/>
          </div>
          <div key="iteminfo" className="pure-u-4-5">
            <div className={styles.todoitem}>
              <div className="pure-g">
                <div key="category" className="pure-u-1-4 categoryDisplayed">
                  <div className={styles.headerLabelCategory}>Category</div>
                </div>
                <div key="content" className="pure-u-3-4">
                  <div className={styles.headerLabels}>Description</div>
                </div>
              </div>
              <div className={styles.todoitem}>
                {posts.map( (post) => <ToDoItem key={post.date} post={post} setNewChecked={setNewChecked}/>)}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
  }
}
