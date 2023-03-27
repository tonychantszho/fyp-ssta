import { IonLabel } from '@ionic/react';
import _ from 'lodash';
import { ReactElement, useContext, useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import StorageContext from '../contexts/StorageContext';
interface Props {
    month: Date;
}

const PieeChart: React.FC<Props> = ({ month }) => {
    interface pieFormat {
        title: string;
        value: number;
        color: string;
    }
    let pieData: pieFormat[] = [];
    type PieColor = { [propKey: string]: string };
    const pieColor: PieColor = {};
    pieColor.Shopping = '#5bb5b2';
    pieColor.Income = '#C13C37';
    pieColor.Diet = '#6A2135';
    pieColor.Loan = '#D03030';
    pieColor.Revoke = '#5B0005';
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const storageContext = useContext(StorageContext);
    const createPieChart = () => {
        const listData: pieFormat[] = [];
        storageContext.state.list.map((item) => {
            if (new Date(item.date).getMonth() === month.getMonth()) {
                const data = {
                    title: item.type,
                    value: item.total,
                    color: "",
                };
                listData.push(data);
            }
        });
        storageContext.state.bookKeeping.map((item) => {
            if (new Date(item.date).getMonth() === month.getMonth()) {
                const data = {
                    title: "Loan",
                    value: item.price,
                    color: "",
                };
                listData.push(data);
            }
        });
        const result = _.chain(listData).groupBy("title").map((value, key: string) => ({ title: key, value: Math.abs(_.sumBy(value, "value")), color: pieColor[key] })).value();
        console.log(result);

        pieData = result;
    }
    createPieChart();
    return (
        <div className='h-[calc(100%_-_6rem)] overflow-hidden'>
            <div className='text-center mt-24'>
                <IonLabel className='bg-orange-300 text-amber-800 p-1.5 rounded-lg font-bold text-xl'>{month.getFullYear() + " -  " + monthNames[month.getMonth()]}</IonLabel>
            </div>
            <PieChart
                data={pieData}
                lineWidth={40}
                paddingAngle={15}
                startAngle={40}
                segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                center={[90, 0]}
                viewBoxSize={[180, 90]}
                onClick={(_, index) => {
                    console.log(index);
                }}
                onMouseOver={(_, index) => {
                    console.log(index);
                }}
                animate={true}
                label={({ x, y, dx, dy, dataEntry }) => (
                    <text
                        x={x}
                        y={y}
                        dx={dx}
                        dy={dy}
                        dominant-baseline="central"
                        text-anchor="middle"
                        style={{
                            fill: '#000',
                            opacity: 0.75,
                            fontWeight: 'bold',
                            fontSize: '7px',
                            pointerEvents: 'none',
                        }}>
                        <tspan x={x} y={y - 7} dx={dx} dy={dy} style={{ fill: pieColor[dataEntry.title] }}>{dataEntry.title}</tspan>
                        <tspan className=' text-xs' x={x} y={y + 5} dx={dx} dy={dy}>${dataEntry.value}</tspan>
                    </text>
                )}
                labelPosition={135}
                labelStyle={{
                    fill: '#000',
                    opacity: 0.75,
                    fontSize: '10px',
                    pointerEvents: 'none',
                }}
            />
        </div>
    );
};
export default PieeChart