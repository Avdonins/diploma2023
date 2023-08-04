import axios from "axios";
import { useRouter } from "next/router"
import Content from "../../components/content";
import Layout from '../../components/layout'
import MyButton from "../../components/UI/MyButton";
import PriceChart from "../../components/UI/priceChart";
import * as ExcelJS from "exceljs";
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from "cookies-next";


export default function Good({ good }) {
    let blobType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const datesDNS = []
    const datesMV = []
    const pricesDNS = []
    const pricesMV = []
    for (let item of good.OldPrices.massDates) {
        if (item.shop == 'dns') {
            datesDNS.push(new Date(item.createdAt).toLocaleDateString())
            pricesDNS.push(item.price)
        } else {
            datesMV.push(new Date(item.createdAt).toLocaleDateString())
            pricesMV.push(item.price)
        }
    }
    let urls = good.url.split(' ')
    console.log(good.url)
    let urlDNS = urls[0]
    let urlMV = urls[1]

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Me';
        workbook.created = new Date();
        const worksheet = workbook.addWorksheet('Sensor Data');
        const fakeData = {
            name: good.name,
            description: good.description,
            urlDNS: urlDNS,
            urlMV: urlMV ? urlMV : "Отсутствует"
        };
        worksheet.columns = [
            { header: 'Наименование', key: 'name', width: 30 },
            { header: 'Характеристики', key: 'description', width: 42 },
            { header: 'Ссылка на магазин DNS', key: 'urlDNS', width: 25, style: { alignment: { horizontal: 'center' } } },
            { header: 'Ссылка на магазин Mvideo', key: 'urlMV', width: 25, style: { alignment: { horizontal: 'center' } } },
        ];
        worksheet.addRow(fakeData).commit()
        worksheet.addRow({}).commit()

        worksheet.addRow({ description: "Цены в магазине DNS", urlDNS: "Цена", urlMV: "Дата" }).commit()
        pricesDNS.map((priceDNS, idx) => {
            worksheet.addRow({ urlDNS: priceDNS, urlMV: datesDNS[idx] }).commit();
        })
        worksheet.addRow({ description: "Цены в магазине Mvideo", urlDNS: "Цена", urlMV: "Дата" }).commit()
        pricesMV.map((priceMV, idx) => {
            worksheet.addRow({ urlDNS: priceMV, urlMV: datesMV[idx] }).commit();
        })

        workbook.xlsx.writeBuffer().then(data => {
            const blob = new Blob([data], { type: blobType });
            saveAs(blob, `Динамика_цены_${good.name}.xlsx`);
            toast.success('Сохранено!', {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }).catch((err) => {
            toast.error(`Ошибка при экспорта Excel файла: ${err}`, {
                position: "bottom-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            console.log(`Ошибка при экспорта Excel файла: ${err}`)
        });
    }

    return (
        <Layout title={"Информация о товаре " + good.id}>
            <Content>
                <div className="good_id__wrapper">
                    <div className="good_id__content">
                        <h1>{good.name}</h1>
                        <div className="good_id__img">
                            <img src={good.img} />
                        </div>
                        <div className="good_id__info">
                            <p>Характеристики: {good.description}</p>
                            {good.isDel && <p className="good_id__isDel">Нет в наличии</p>}
                        </div>
                        <div className="good_id__price">
                            <p>Цена: {good.price} Руб</p>
                        </div>
                    </div>
                    <div className="good_id__chart_wrapper">
                        <div className="good_id__chart">
                            <PriceChart labels={{ datesDNS, datesMV }} data={{ pricesDNS, pricesMV }} />
                        </div>
                        <MyButton onClick={() => window.open(urlDNS)}>Перейти в магазин DNS</MyButton>
                        {urlMV &&
                            <MyButton onClick={() => window.open(urlMV)}>Перейти в магазин Mvideo</MyButton>
                        }
                        <MyButton onClick={() => exportToExcel()}>Загрузить в Excel</MyButton>
                    </div>
                </div>
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="dark"
                />
            </Content>
        </Layout>
    )
};

export async function getServerSideProps({ params, req }) {
    const authToken = req.cookies['authToken']
    if (authToken == undefined || authToken == "") {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }
    const response = await axios.post("http://localhost:3000/api/goods/getForId/", params)
    const good = response.data

    return {
        props: { good },
    }

}