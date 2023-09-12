import { Doughnut } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,

} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
);

let beneficios = [0, 56, 82, 12, 10]
let meses = ["Enero", "Febrero", "Marzo", "Abril"]

let midata = {
  labels: meses,
  datasets: [
    {
      label: "Beneficios",
      data: beneficios,
      backgroundColor: [
        'rgba(255,99,132,0.2)',
        'rgba(255,99,86,0.2)',
        'rgba(54,99,192,0.2)',
        'rgba(153,99,255,0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(255,99,86,1)',
        'rgba(54,99,192,1)',
        'rgba(153,99,255,1)'
      ]
    }
  ]
}
/*
let mioptions = {

} 
*/

let mioptions = {
  responsive: true,
  maintainAspectRatio: false,


}



export default function Doughnuts() {
  return <Doughnut data={midata} options={mioptions} />
}