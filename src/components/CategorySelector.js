import styles from '@/styles/Home.module.css'
import {useEffect, useState} from 'react'

export default function CategorySelector(props) {
    const [categoriesLocal, setCategoriesLocal] = useState([]);
    const [selectedIndex, setSelectedIndex]=useState(-1);
 
    let loading = props.loading;
    let categories = props.categories;
    let selectedCategory = props.selectedCategory;
    let setSelectedCategory = props.setSelectedCategory;
    useEffect(() => {
        setCategoriesLocal(props.categories);
        props.setSelectedCategory(props.selectedCategory);
        // set index to display correct category in dropdown
        categories.map((cat,index )=> {
            if(cat==selectedCategory){
                setSelectedIndex(index);
            }
        });
            
    }, [categories, loading]);

    if(!loading){
        function checkSelectedCategory(event){
            props.setSelectedCategory(event.target.value);
            setSelectedIndex(event.target.value);
            let newCatBox = document.getElementById("newCategoryInput");
            if(event.target.value == 1){
            // show the new input box
                newCatBox.hidden = false;
            }else{
                newCatBox.hidden = true;
            }
        }
        
        function Category(props){
            let name = props.name;
            let index = props.index;
            return(
            <option value={index}>{name}</option>
            );
        }

        let mappedCats = categoriesLocal.map((cat,index )=> {
            return(
            <Category key={cat} name={cat} index={index}/>
            )
        })

        return (
            <select className={styles.todoCategorySelector} name="categoriesSelector" id="categoriesSelector" onChange={checkSelectedCategory} value={selectedIndex} defaultValue={selectedIndex}>
                {mappedCats}
            </select>
        )
    
    }   
}

