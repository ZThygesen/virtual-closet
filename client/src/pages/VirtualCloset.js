import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useError } from '../components/ErrorContext';
import styled from 'styled-components';
import axios from 'axios';
import ClosetNavigation from '../components/ClosetNavigation';
import CategoriesSidebar from '../components/CategoriesSidebar';
import Loading from '../components/Loading';

const Container = styled.div`
    flex: 1;
    font-family: 'Fashion';
    display: flex;
`;

export default function VirtualCloset() {
    const { setError } = useError();

    const { client } = useLocation().state;
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 800 ? true : false);
    const [closeSidebarOnSelect, setCloseSidebarOnSelect] = useState(window.innerWidth > 800 ? false : true);
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const sidebarRef = useRef();
    
    useEffect(() => {
        function handleResize() {
            if (window.innerWidth <= 800) {
                setCloseSidebarOnSelect(true);

                if (sidebarOpen) {
                    setSidebarOpen(false);
                }
            } else {
                setCloseSidebarOnSelect(false);
            }
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [sidebarOpen]);
    
    const getCategories = useCallback(async (updateCat = undefined, animateLoad = false) => {
        if (animateLoad) {
            setLoading(true);
        }
        
        let categories;
        // get all categories and their data for the current client
        try {
            const response = await axios.get(`/files/${client._id}`);
            categories = response.data;
        } catch (err) {
            setError({
                message: 'There was an error fetching client items.',
                status: err.response.status
            });
            setLoading(false);
            return;
        }

        // filter out the other category
        const otherCategoryIndex = categories.findIndex(category => category._id === 0);
        const otherCategory = categories.splice(otherCategoryIndex, 1)[0];
        
        const allCategory = {
            _id: -1,
            name: 'All',
            items: []
        }

        // filter out categories with and without items
        const catsWithItems = [];
        const catsWithoutItems = [];
        if (categories.length > 0) {
            categories.forEach(category => {
                if (category.items.length > 0) {
                    catsWithItems.push(category);
                } else {
                    catsWithoutItems.push(category);
                }
            });

            // sort category names alphabetically
            catsWithItems.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } 
                else if (a.name > b.name) {
                    return 1;
                }
                else {
                    return 0;
                }
            });

            catsWithoutItems.sort(function(a, b) {
                if (a.name < b.name) {
                    return -1;
                } 
                else if (a.name > b.name) {
                    return 1;
                }
                else {
                    return 0;
                }
            });

            // create all items category
            let catItems = [];
            catsWithItems.forEach(cat => {
                catItems.push(...cat.items)
            });
            const allItems = [...otherCategory.items, ...catItems];

            allCategory.items = allItems;

            // compile all the categories together
            categories = [allCategory, otherCategory, ...catsWithItems, ...catsWithoutItems];
        } else {
            allCategory.items = otherCategory.items;
            categories = [allCategory, otherCategory];
        }

        setCategories(categories);

        // if the current category was recently updated, need to re-render
        if (updateCat) {
            setCategory(categories.filter(category => category._id === updateCat._id)[0]);
        }

        setLoading(false);
    }, [client, setError]);

    useEffect(() => {
        getCategories(undefined, true);
    }, [getCategories]);

    async function addCategory(newCategory) {
        setLoading(true);

        try {
            await axios.post('/categories', { category: newCategory });
            await getCategories();
        } catch (err) {
            setError({
                message: 'There was an error adding the category.',
                status: err.response.status
            });
        } finally {
            setLoading(false);
        }
    }

    async function editCategory(category, newName) {
        setLoading(true);
        if (category.name === newName) {
            setLoading(false);
            return;
        }

        try {
            await axios.patch(`/categories/${category._id}`, { newName: newName });
            await getCategories(category);
        } catch (err) {
            setError({
                message: 'There was an error editing the category.',
                status: err.response.status
            });
        } finally {
            setLoading(false);
        }
    }
    
    async function deleteCategory(category) {
        setLoading(true);
        
        try {
            await axios.delete(`/categories/${category._id}`);
            await getCategories();
        } catch (err) {
            setError({
                message: 'There was an error adding the category.',
                status: err.response.status
            });
        } finally {
            setLoading(false);
        }
        
    }

    function openSidebar() {
        setSidebarOpen(true);
    }

    function closeSidebar() {
        setSidebarOpen(false);
    }

    return (
        <>
            <Container>
                <CategoriesSidebar
                    sidebarRef={sidebarRef}
                    open={sidebarOpen}
                    closeSidebar={closeSidebar}
                    closeSidebarOnSelect={closeSidebarOnSelect}
                    categories={categories}
                    activeCategory={category}
                    setCategory={setCategory}
                    addCategory={addCategory}
                    updateCategories={getCategories}
                    editCategory={editCategory}
                    deleteCategory={deleteCategory}
                />
                <ClosetNavigation
                    sidebarRef={sidebarRef}
                    open={sidebarOpen}
                    openSidebar={openSidebar}
                    client={client}
                    category={category}
                    getCategories={getCategories}
                />
            </Container>
            <Loading open={loading} />
        </>
    )
}
