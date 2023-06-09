import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import {useEffect, useState} from 'react'
import CategorySelector from '@/components/CategorySelector.js'
import ToDoItem from '@/components/ToDoItem.js'
import { useAuth, SignIn, UserButton } from "@clerk/nextjs";
import {fetchDataChecked, postDataChecked, fetchCategories} from '@/modules/Data.js'
import {useRouter} from 'next/router'
import CategorySidebar from '@/components/CategorySidebar.js'

const inter = Inter({ subsets: ['latin'] })
export default function Done() {
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
        fetchDataChecked(setPosts, setLoading, userId, token);
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
      postDataChecked(token, newGet, setNewGet, userId, newName, selectedCategory);
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
        <title>Done</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="pure-g" id="menu">
            <div className="pure-u-3-4">
                <h1 className={styles.header}>DONE</h1>
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
              <CategorySidebar reloader={newCatDeleted} setReloader={setNewCatDeleted} isChecked={true} initPath="/done/"/>
            </div>
            <div key="information" className="pure-u-4-5">
              <div className={styles.todoitem}>
              <div className="pure-g">
                  <div key="category" className="pure-u-1-4 categoryDisplayed">
                    <div className={styles.headerLabelCategory}>Category</div></div>
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