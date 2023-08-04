import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import style from '../styles/favourites.module.css'
import MyButton from "./UI/MyButton";

const ItemFav = ({ device, basket }) => {
    const [count, setCount] = useState(device.count)
    const router = useRouter()
    console.log(getCookie('basket'))

    const changeCount = async (id, goodId, count) => {
        await axios.post('http://localhost:3000/api/basket/updateItem', {
            id,
            goodId,
            count
        }).then(res => {
            if (count <= 0) {
                setCookie('basket', getCookie('basket').replace(`${goodId}`, ''))
                if (getCookie('basket').trim() === '') {
                    setCookie('basket', '')
                }
                router.replace(router.asPath);
            }
            setCount(count)
        }).catch(err => {
            console.log(err)
        })
    }

    const deleteItem = async (id, goodId) => {
        await axios.delete('http://localhost:3000/api/basket/updateItem', {
            id,
            goodId
        }).then(res => {
            setCookie('basket', getCookie('basket').replace(`${goodId}`, ''))
            router.replace(router.asPath);
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <div key={device.good.id} className={style.item}>
                <Link className={style.item__href} href={(`/goods/${device.good.id}`)}>
                    <div className={style.item__content}>
                        <div className={style.item__img_container}>
                            <img className={style.item__img} src={device.good.img} />
                        </div>
                        <div className={style.item__name}>
                            {device.good.isDel && <p className={style.item__del}>Нет в наличии</p>}
                            <strong>{device.good.name}</strong>
                            <br />
                            <h5>Характеристики: {device.good.description}</h5>
                        </div>
                        {device.good.priceDiscount != null
                            ? <div className={style.item__price}>
                                <span>{device.good.priceDiscount} Руб</span>
                                <span className={style.item__discount}>{device.good.price} Руб</span>
                            </div>
                            : <div className={style.item__price}>
                                {device.good.price} Руб
                            </div>
                        }
                    </div>
                </Link>
                <div className={style.item__count}>
                    <MyButton onClick={() => changeCount(basket.id, device.good.id, (count - 1))}>
                        -
                    </MyButton>
                    <p>{count}</p>
                    <MyButton onClick={() => changeCount(basket.id, device.good.id, (count + 1))}>
                        +
                    </MyButton>
                </div>
                <div>
                    <MyButton onClick={() => deleteItem(basket.id, device.good.id)}>
                        Удалить
                    </MyButton>
                </div>
            </div>
        </>
    );
};

export default ItemFav;