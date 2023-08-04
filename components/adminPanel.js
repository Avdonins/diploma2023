import axios from "axios";
import { useEffect, useState } from "react";
import Loader from './UI/loader'
import UpdateList from "./updateList";
import MyButton from "./UI/MyButton";

const AdminPanel = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [data, setData] = useState([]);
    const [loadedData, setLoadedData] = useState([]);
    const [date, setDate] = useState(new Date());

    const [newData, setNewData] = useState([]);
    const [updatedData, setUpdatedData] = useState([]);
    const [deletedData, setDeletedData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            await axios.post('http://localhost:3000/api/goods/getGoods').then(res => {
                setData(res.data)
            })
            await axios.post('http://localhost:3000/api/updateBD', {
                func: 'getData'
            }).then(res => {
                setLoadedData(res.data.goods)
            })
            await axios.post('http://localhost:3000/api/updateBD', {
                func: 'getDate'
            }).then(res => {
                setDate(res.data)
            })
        }
        getData().then(() => {
            console.log("Done preload!")
        })
    }, [])


    const showUpdates = async () => {
        setIsLoading(true)

        await axios.post('http://localhost:3000/api/goods/getSortedData', {
            data,
            loadedData
        }).then(res => {
            console.log(res.data)
            setNewData(res.data.nData)
            setUpdatedData(res.data.uData)
            setDeletedData(res.data.dData)
            setLoadedData([])
            let normalDate = new Date(date).toLocaleDateString()
            setDate(normalDate)
        }).then(() => {
            setIsLoading(false)
            setIsUpdate(true)
        }).catch(err => {
            console.log(`$Ошибка: ${err}`)
        })
    }

    const confirmData = async () => {
        if (newData.length > 0) {
            console.log('add new')
            for (let item of newData) {
                await axios.post('http://localhost:3000/api/goods/setGoods', {
                    item,
                    func: 'add'
                }).then(res => {
                    console.log(res.data)
                }).catch(err => {
                    console.log(err)
                })
            }
        }
        if (updatedData.length > 0) {
            updatedData.map(async (item, idx) => {
                if (idx % 2 == 0) {
                    await axios.post('http://localhost:3000/api/goods/setGoods', {
                        item,
                        func: 'update'
                    }).then(res => {
                        console.log(res.data)
                    }).catch(err => {
                        console.log(err)
                    })
                }
            })
        }
        if (deletedData.length > 0) {
            for (let item of deletedData) {
                await axios.delete('http://localhost:3000/api/goods/setGoods', {
                    item
                }).then(res => {
                    console.log(res.data)
                }).catch(err => {
                    console.log(err)
                })
            }
        }
        window.location.reload()
    }

    return (
        <>
            <div>
                {!isUpdate &&
                    <MyButton onClick={() => showUpdates()}>Проверить актульность БД</MyButton>
                }

                {isUpdate && (newData.length > 0 || updatedData.length > 0 || deletedData.length > 0) &&
                    <MyButton onClick={() => confirmData()}>Загрузить изменения в БД</MyButton>
                }
                <div>
                    {isLoading && <div> Собираются данные. Не уходите с страницы <Loader /> </div>}
                    {isUpdate && !isLoading &&
                        <>
                            <h3>Дата обновления: {date}</h3>
                            {<UpdateList title={"Новые товары"} items={newData} />}
                            {<UpdateList title={"Обновленные товары"} items={updatedData} />}
                            {<UpdateList title={"Удаленные товары"} items={deletedData} />}
                        </>
                    }
                </div>
            </div>
        </>
    );
};



export default AdminPanel;