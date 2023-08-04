import style from '../styles/item.module.css'
import MyButton from './UI/MyButton';
import Link from 'next/link';
import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import Rating from './UI/raiting';
import { useState, useEffect } from 'react';

const Item = ({ item }) => {
    const name = item.name.substr(item.name.indexOf(" ") + 1);
    const [favCookie, setFavCookie] = useState([])
    const [basket, setBasket] = useState([])
    const router = useRouter()
    // console.log(favCookie)

    useEffect(() => {
        if(getCookie('basket')){
            setFavCookie(getCookie('basket').trimEnd().split(' '))
        }
    }, [])

    const addToFavourite = async (goodId, authToken) => {
        const basket = await axios.post('http://localhost:3000/api/basket/addItem', {
            authToken,
            goodId
        }).then((basket) => {
            setCookie('basket', `${getCookie('basket')} ${goodId}`)
            setFavCookie(getCookie('basket'))
            console.log(basket)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <>
            <div className={style.item}>
                <Link className={style.item__href} href={(`/goods/${item.id}`)}>
                    <div className={style.item__content}>
                        <div className={style.item__img_container}>
                            <img className={style.item__img} src={item.img} />
                        </div>
                        <div className={style.item__name}>
                            <strong>{item.name}</strong>
                        </div>
                        <div className={style.item__description}>
                            {item.isDel && <p className={style.item__del}>Нет в наличии</p>}
                            <strong>{item.description}</strong>
                        </div>
                        {item.priceDiscount != null
                            ? <div className={style.item__price}>
                                <span>От {item.priceDiscount} Руб</span>
                                <span className={style.item__discount}>{item.price} Руб</span>
                            </div>
                            : <div className={style.item__price}>
                                От {item.price} Руб
                            </div>
                        }
                        <div className={style.item__rating}>
                            <Rating title={item.raiting} />
                        </div>
                    </div>
                </Link>
                <div className={style.item__btn}>
                    <MyButton
                        onClick={favCookie.includes(item.id.toString()) ? () => router.push('/favourites') : () => addToFavourite(item.id, getCookie("authToken"))}
                    >
                        {favCookie.includes(item.id.toString()) ? 'Добавлено' : 'Добавить'}
                    </MyButton>
                </div>
            </div>
        </>
    );
};

export default Item;