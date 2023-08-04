import Link from 'next/link';
import style from '../styles/mainPage.module.css';
import MyButton from './UI/MyButton';

const MainPage = () => {
    const goToPage = (url) => {
        window.scrollBy({
            top: 500,
            behavior: 'smooth'
        })
    }
    return (
        <>
            <div className={style.wrapper}>
                <div className={style.content}>
                    <div className={style.content__main_text}>
                        <div className={style.content_header}>
                            <p>КОМПЬЮТЕРНАЯ ТЕХНИКА</p>
                        </div>
                        <div className={style.content_text}>
                            <p>Сайт онлайн мониторинга цен</p>
                        </div>
                        <div className={style.content_button}>
                            <MyButton onClick={() => goToPage('/categories')} style={{ borderRadius: '20px' }}>Подробнее</MyButton>
                        </div>
                    </div>
                    <div className={style.content__images}>
                        <div className={style.content__images_container}>
                            <img className={style.image} src='/monitor.png' />
                            <img className={style.image} src='/cpu.png' />
                            <img className={style.image} src='/oper.png' />
                            <img className={style.image} src='/other.png' />
                        </div>
                        <div className={style.content__images_container}>
                            <p>Мониторы</p>
                            <p>Процессоры</p>
                            <p>Оперативная память</p>
                            <p>Прочие товары</p>
                        </div>
                    </div>
                </div>
                <div className={style.content__image_comp_wrapper}>
                    <div className={style.ellipse} />
                    <div className={style.ellipse__line_1}></div>
                    <div className={style.ellipse__line_2}></div>
                    <div className={style.ellipse__line_3}></div>
                    <div className={style.ellipse__line_4}></div>
                    <div>
                        <img className={style.content__comp_image} src='/comp.png' />
                    </div>
                </div>
            </div>
            <div className={style.block__info}>
                <p className={style.block__info_text}>
                    Сайт онлайн мониторинга цен на компьютерные комплектующие. Информация о ценах собрана с популярных магазинов и их онлайн-каталогов. Сервис предназначен для комфортного выбора товаров со значительной экономией времени и средств. Для компаний доступен просмотр цен конкурентов, графики динамики цен, для последующей загрузки и анализа действий конкурентов.
                </p>
                <br/>
                <br/>
                <p className={style.block__info_text}>
                    Информация на сайте обновляется ежедневно.
                </p>

            </div>
        </>
    );
}

export default MainPage;