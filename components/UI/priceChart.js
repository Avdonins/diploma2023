import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';


const PriceChart = ({ labels, data }) => {
    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        Filler
    );
    // console.log(labels['datesDNS'])
    // console.log(data)
    const lineChartDataDNS = {
        labels: labels["datesDNS"],
        datasets: [
            {
                data: data['pricesDNS'],
                radius: 5,
                label: "DNS",
                borderColor: "#3333ff",
                lineTension: 0.2
            }
        ]
    };

    const lineChartDataMV = {
        labels: labels["datesMV"],
        datasets: [
            {
                data: data['pricesMV'],
                radius: 5,
                label: "MVideo",
                borderColor: "#f52fff",
                lineTension: 0.2
            }
        ]
    };

    return (
        <>
            <Line
                type="line"
                width={400}
                height={150}
                data={lineChartDataDNS}
            />
            {labels['datesMV'].length > 0 &&
                <Line
                    type="line"
                    width={400}
                    height={150}
                    data={lineChartDataMV}
                />
            }
        </>
    );
}
export default PriceChart;