import axios from "axios";
import Layout from "../components/layout";
import Content from "../components/content";
import ItemCategory from "../components/itemCategory";
import { getCookie } from "cookies-next";

const categories = ({ categories }) => {

    return (
        <Layout>
            <Content>
                {categories.map((category, idx) => (
                    idx % 2 == 0 &&
                    <ItemCategory key={idx} category={category} nextCategory={categories[idx + 1]} />
                ))}
            </Content>
        </Layout>
    );
};

export default categories;

export const getServerSideProps = async (context) => {
    const authToken = context.req.cookies['authToken']
    if (!authToken) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const response = await axios.post("http://localhost:3000/api/goods/getCategories");
    return {
        props: {
            categories: response.data,
        }
    }
}