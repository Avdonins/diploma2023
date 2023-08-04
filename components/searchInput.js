import { useEffect, useState } from "react";
import MyInput from "./UI/myInput";
import style from '../styles/searchInput.module.css'
import axios from "axios";
import Link from "next/link";

const SearchInput = () => {
    const [query, setQuery] = useState('');
    const [searchResponse, setSearchResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await axios.post("http://localhost:3000/api/goods/getGoodsByName", {
                name: query.toLocaleLowerCase()
            }).then(res => {
                setSearchResponse(res.data)
            }).catch(error => {
                setSearchResponse([])
                console.log(error)
            }).finally(() => {
                setIsLoading(false);
            })
        }
        if (query.length > 0) {
            fetchData()
        } else {
            setSearchResponse([])
        }
    }, [query])

    return (
        <>
            <div className={style.search__input}>
                <MyInput type='text' placeholder='Поиск' onChange={() => setQuery(event.target.value)} />
                <ul className={style.search__list}>
                    {isLoading
                        ? <li className={style.search__item}>Загрузка...</li>
                        :
                        searchResponse.map((elem) => {
                            return (
                                <Link key={elem.id} className={style.search__link} onClick={() => setQuery('')} href={(`/goods/${elem.id}`)}>
                                    <li className={style.search__item}>
                                        {elem.name}
                                    </li>
                                </Link>
                            )
                        })
                    }
                </ul>
            </div>
        </>
    );
};

export default SearchInput;