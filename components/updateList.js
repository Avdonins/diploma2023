import style from '../styles/updateListItem.module.css'
import Rating from './UI/raiting';

const UpdateList = ({ items, title }) => {

    if (title == 'Обновленные товары'){
        return (
            <>
                <div className={style.header}>
                    <h2>{title}: {items.length / 2}</h2>
                </div>
                <div>
                    {items.map((item, idx) => (
                        idx % 2 == 0 &&
                        <div key={idx} className={style.item}>
                            <div className={style.item__content}>
                                <div className={style.item__img_container}>
                                    <img className={style.item__img} src={item.img} />
                                </div>
                                <div className={style.item__name}>
                                    <strong>{item.name}</strong>
                                </div>
                                <div className={style.item__description}>
                                    <strong>{item.description}</strong>
                                </div>
                                {item.priceDiscount != null 
                                    ?
                                    <div className={style.item__price}>
                                        <span>Новая цена</span>
                                        <span>{item.priceDiscount} Руб</span>
                                        <span>Старая цена</span>
                                        <span>{items[idx + 1].price} Руб</span>
                                    </div>
                                    :
                                    <div className={style.item__price}>
                                        <span>Новая цена</span>
                                        {item.price} Руб
                                        <span>Старая цена</span>
                                        <span>{items[idx + 1].price} Руб</span>
                                    </div>
                                }
                                <div className={style.item__rating}>
                                    <Rating title={item.raiting} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
    else {
        return (
            <>
                <div className={style.header}>
                    <h2>{title}: {items.length}</h2>
                </div>
                <div>
                    {items.map((item, idx) => (
                        <div key={idx} className={style.item}>
                            <div className={style.item__content}>
                                {/* <div className={style.item__img_container}>
                                    <img className={style.item__img} src={item.img} />
                                </div> */}
                                <div className={style.item__name}>
                                    <strong>{item.name}</strong>
                                </div>
                                <div className={style.item__description}>
                                    <strong>{item.description}</strong>
                                </div>
                                {item.priceDiscount != null 
                                    ?
                                    <div className={style.item__price}>
                                        <span>{item.priceDiscount} Руб</span>
                                        <span className={style.item__discount}>{item.price} Руб</span>
                                    </div>
                                    :
                                    <div className={style.item__price}>
                                        {item.price} Руб
                                    </div>
                                }
                                <div className={style.item__rating}>
                                    <Rating title={item.raiting} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
};

export default UpdateList;