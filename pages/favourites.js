import axios from "axios";
import Layout from "../components/layout";
import Content from "../components/content";
import style from '../styles/favourites.module.css'
import ItemFav from "../components/itemFav";
import { getCookie } from "cookies-next";

const favourites = ({ basket }) => {
    const { devices } = basket;

    return (
        <Layout title="Избранное">
            <Content>
                {basket.devices.length == 0
                    ? <h1 style={{ textAlign: 'center' }}>Упс... Кажется, тут пусто</h1>
                    : <h1>Избранное</h1>}
                <div className={style.container}>
                    <div className={style.item__wrapper}>
                        {devices.map((device) =>
                            <ItemFav key={device.good.id} device={device} basket={basket} />
                        )}
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default favourites;

export const getServerSideProps = async (context) => {
    // const cookies = getCookie('authToken');
    const authToken = context.req.cookies['authToken']
    if (!authToken){
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const response = await axios.post("http://localhost:3000/api/basket/getBasket", {
        authToken
    });
    return {
        props: {
            basket: response.data
        }
    }
}