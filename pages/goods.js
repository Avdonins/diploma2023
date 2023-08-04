import axios from "axios";
import Layout from "../components/layout";
import Content from "../components/content";
import ListItem from "../components/ListItem";
import Loader from "../components/UI/loader";
import { useEffect, useState } from "react";
import { getPagesCount } from '../utils/pages'
import Pagination from "../components/UI/pagination";
import { getCookie } from "cookies-next";

const goods = ({ totalCount, category }) => {
    const [items, setItems] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const changePage = (page) => {
        setItems([]);
        setPage(page);
    }

    useEffect(() => {
        setTotalPages(getPagesCount(totalCount, limit));
    }, [])

    useEffect(() => {
        const get_items = async () => {
            setIsLoading(true);
            const response = await axios.post('http://localhost:3000/api/goods/getGoods/', {
                skip: (page - 1) * limit,
                take: limit,
                category
            }).then(response => {
                setItems([...response.data]);
            }).catch(error => {
                console.log(error);
            }).finally(() => {
                setIsLoading(false);
            })
        }
        get_items();
    }, [page])

    return (
        <Layout>
            <Content>
                <div>
                    <h2>{category}</h2>
                </div>
                <ListItem items={items} />
                {isLoading && <Loader />}
                <Pagination
                    totalPages={totalPages}
                    page={page}
                    changePage={changePage}
                />
            </Content>
        </Layout>
    );
};

export default goods;

export const getServerSideProps = async ({ query, req }) => {
    const authToken = req.cookies['authToken']
    if (authToken == undefined || authToken == "") {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const response = await axios.post("http://localhost:3000/api/goods/getGoods", {
        category: query.category
    });
    return {
        props: {
            totalCount: response.data.length,
            category: query.category
        }
    }
}