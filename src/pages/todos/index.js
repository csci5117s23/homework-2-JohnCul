import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState, createElement} from 'react'
import CategorySelector from '@/components/CategorySelector.js'
import ToDoItem from '@/components/ToDoItem.js'
import CategorySidebar from '@/components/CategorySidebar.js'
import { useAuth, SignIn, UserButton } from "@clerk/nextjs";
import {fetchDataUnchecked, postDataUnchecked, fetchCategories} from '@/modules/Data.js'
import {useRouter} from 'next/router'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading]=useState(true);
  const [newName, setNewName]=useState("");
  const [newCategoryHidden, setNewCategoryHidden] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newGet, setNewGet] = useState(false);
  const [categories, setCategories] = useState([]);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [newChecked, setNewChecked] = useState(false);
  const [newCatDeleted, setNewCatDeleted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if(isLoaded && !userId) {
      router.push("/");
    }
}, [isLoaded, userId])

  // get data from the database
  useEffect(() => {
    async function loadToDoData(){
      if(userId){
        const token = await getToken({template: "codehooks"});
        fetchDataUnchecked(setPosts, setLoading, userId, token);
      }
    }
    loadToDoData();
    setNewChecked(false);
    setNewCatDeleted(false);  
  }, [newGet, isLoaded, newChecked, newCatDeleted]);

  // post data to the database
  async function postData(selectedCategory) {
    if(userId){
      const token = await getToken({template: "codehooks"});
      postDataUnchecked(token, newGet, setNewGet, userId, newName, selectedCategory);
      setNewCatDeleted(true);
    }
  }

  //set category list whenever a new post comes in
  useEffect(() => {
    async function loadCategories(){
      if(userId){
        const token = await getToken({template: "codehooks"});
        fetchCategories(setCategories, userId, token);
      }
    }
    loadCategories()
  }, [posts]);

  // if valid name, add to database
  function addName() {
    let index = document.getElementById("categoriesSelector").selectedIndex;
    let curCategory = categories[index];
    if(index == 1){
      curCategory = newCategory;
    }
    if(newName!=""){
      postData(curCategory);
    }
  }

  if(loading){
    return(<span>loading...</span>)
  }else{
  return (
    <>
      <Head>
        <title>Todos</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pure-g" id="menu">
            <div className="pure-u-3-4">
                <h1 className={styles.header}>TODOS</h1>
            </div>
            <div className="pure-u-1-4">
                <div className={styles.userButton}>
                    <UserButton></UserButton>
                </div>
            </div>
        </div>
      <main className={styles.main}>
        <div className={styles.todoitem}>
          <p>New To Do Item: 
            <input className={styles.newtodoitem} value={newName} onChange={(e=>setNewName(e.target.value))}>
            </input> 
            <span className={styles.categoryLabel}>Category:</span>
            <CategorySelector loading={loading} categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
            <input id="newCategoryInput" maxLength="20" hidden={newCategoryHidden} className={styles.newtodoitem} value={newCategory} onChange={(e=>setNewCategory(e.target.value))}>
            </input> 
            <span className={styles.newtodosubmit}>
              <button className="pure-button" onClick={addName}>Add Item</button> 
            </span>
            
            </p>
          </div>
          <div className="pure-g">
            <div key="categorySidebar" className="pure-u-1-5">
              <CategorySidebar reloader={newCatDeleted} setReloader={setNewCatDeleted} isChecked={false} initPath="/todos/"/>
            </div>
            <div key="info" className="pure-u-4-5">
              <div className={styles.todoitem}>
              <div className="pure-g">
                  <div key="category" className="pure-u-1-4 categoryDisplayed">
                    <div className={styles.headerLabelCategory}>Category</div>
                  </div>
                  <div key="content" className="pure-u-3-4">
                    <div className={styles.headerLabels}>Description</div>
                  </div>
                  <div className={styles.todoitem}>
                    {posts.map( (post) => <ToDoItem key={post.date} post={post} setNewChecked={setNewChecked}/>)}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </main>
    </>
  )
  }
}
