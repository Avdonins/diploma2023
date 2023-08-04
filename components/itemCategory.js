import Image from 'next/image';
import Router from 'next/router';
import style from '../styles/itemCategory.module.css'

const ItemCategory = ({ category, nextCategory }) => {

    return (
        <>
        <div className={style.item__block}>
            <div className={style.item__wrapper}>
                <div className={style.item_category}>
                    <a className={style.item_link} onClick={() => Router.push({
                        pathname: '/goods',
                        query: { category }
                    })}>
                        {category}
                        <Image src='/arrow_right.png' width={30} height={30} alt="Arrow go to category" />
                    </a>
                </div>
            </div>
            <div className={style.item__wrapper}>
                <div className={style.item_category}>
                    <a className={style.item_link} onClick={() => Router.push({
                        pathname: '/goods',
                        query: { category: nextCategory }
                    })}>
                        {nextCategory}
                        <Image src='/arrow_right.png' width={30} height={30} alt="Arrow go to category" />
                    </a>
                </div>
            </div>
        </div>
        </>
    );
};

export default ItemCategory;