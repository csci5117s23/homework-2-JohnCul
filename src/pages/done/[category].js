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
  const API_ENDPOINT = 'https://backend-9f6j.api.codehooks.io/dev/toDoItem'
  const API_KEY = '271f7152-88ba-4d48-bc2d-f433a2c6d37d'

  const [posts, setPosts] = useState([]);
  const [loading, setLoading]=useState(true);
  const [newName, setNewName]=useState("");
  const [newGet, setNewGet] = useState(false);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [newChecked, setNewChecked] = useState(false);
  const [category, setCategory] = useState("");

  let router = useRouter();

  function RedirectToHome(){
    router.push('/');
  }
 
    useEffect(() => {
        setCategory(router.query.category);
    },[router.query]);

  let listItems=posts.map( (post) => <ToDoItem key={post.date} post={post} newChecked={newChecked} setNewChecked={setNewChecked}/>);

  // get data from the database
  useEffect(() => {
    async function loadToDoDataCategory(){
      if(userId && category != ""){
        const token = await getToken({template: "codehooks"});
        fetchDataForCategory(setPosts, category, userId, token, true);
      }
    }
    loadToDoDataCategory();
    setNewChecked(false);
    setLoading(false);
  }, [newGet, isLoaded, newChecked, category]);


  if(loading){
    if(!userId){
      return <>
          <RedirectToHome/>
      </>
  }
    return(<span>loading...</span>)
  }else{
    if(!userId){
      return <>
          <RedirectToHome/>
      </>
    }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pure-g" id="menu">
            <div className="pure-u-3-4">
                <h1 className={styles.header}>DONE : {category}</h1>
            </div>
            <div className="pure-u-1-4">
                <div className={styles.userButton}>
                    <UserButton></UserButton>
                </div>
            </div>
        </div>
      <main className={styles.main}>
          <div className="pure-g">
            <div key="categorySidebar" className="pure-u-1-5">
              <CategorySidebar reloader={newGet} setReloader={setNewGet} isChecked={true} initPath="/done/"/>
            </div>
            <div key="todoList" className="pure-u-4-5">
              <div className={styles.todoitem}>
              <div className="pure-g">
                  <div key="category" className="pure-u-1-4 categoryDisplayed"><div className={styles.headerLabelCategory}>Category</div></div>
                  <div key="content" className="pure-u-3-4"><div className={styles.headerLabels}>Description</div></div>
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