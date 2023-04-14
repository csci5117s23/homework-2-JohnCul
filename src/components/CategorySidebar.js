import { useRouter } from 'next/router';
import {useState, useEffect}from 'react';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import CategorySelector from '@/components/CategorySelector.js'
import {fetchItemData, updateCheckBox, fetchCategories, fetchDataCategory} from '@/modules/Data.js'
import { useAuth, SignIn, UserButton } from "@clerk/nextjs";
import Link from 'next/link'


export default function CategorySidebar(props) {    
    const isChecked = props.isChecked;
    const initPath = props.initPath;
    const reloader = props.reloader;
    const setReloader= props.setReloader;

    const [categories, setCategories] = useState([]);
    const { isLoaded, userId, sessionId, getToken } = useAuth();
    const [loading, setLoading]=useState(true);
    const [deletedCategory, setDeletedCategory] = useState(false);
    const [itemCatDelList, setItemCatDelList] = useState([]);
    const [catToDel, setCatToDel] = useState("");

    const router = useRouter();

    function RedirectToHome(){
      router.push('/');
    }

    function deleteCategory(category){
        setCatToDel(category);
        async function getItems(){
            if(userId){
              const token = await getToken({template: "codehooks"});
              fetchDataCategory(setItemCatDelList, category, userId, token);

            }
          }
          getItems();

    }

    useEffect(() => {
        async function alterItems(){
            if(userId){
              const token = await getToken({template: "codehooks"});
              itemCatDelList.map(item => {
                async function alterItem(){
                    let newPost = { ...item}
                    newPost.category = "";
                    newPost = await updateCheckBox(newPost, token);
                }
                alterItem();
              });

            }
          }
          alterItems();
          setReloader(true);
          setDeletedCategory(true);
    }, [itemCatDelList, catToDel]);


    //set category list 
    useEffect(() => {
        async function loadCategories(){
        if(userId){
            const token = await getToken({template: "codehooks"});
            fetchCategories(setCategories, userId, token);
        }
        }
        loadCategories()
        setLoading(false);
        setDeletedCategory(false);
    }, [deletedCategory, reloader]);

    if(loading){
        if(!userId){
            RedirectToHome();
        }
        return(<span>loading...</span>)
    }
    if(!loading){
        if(!userId){
            RedirectToHome();
        }
        return(
            <>
            <div className={styles.todoitem}>Filter:
            {categories.map(cat => {
                if(cat!="" && cat!="New Category"){
                    const redirLink = initPath+""+cat
                    return (
                        <div key={cat} className={styles.todoitem}>
                            <div key={cat} className="pure-g" id="menu">
                                <div className="pure-u-1-2">
                                    <Link href={redirLink}>{cat}</Link>
                                </div>
                                <div className="pure-u-1-2">
                                    <span className={styles.deleteButton}>
                                        <button className="pure-button" onClick={() => deleteCategory(cat)}>X</button>
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }
            })}
            </div>
        </>

        )
    }
}