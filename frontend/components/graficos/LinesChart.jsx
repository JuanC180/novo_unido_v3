import { Line } from 'react-chartjs-2';



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




let beneficios = [0, 56, 82, 12, 10]
let meses = ["Enero", "Febrero", "Marzo", "Abril"]

let midata = {
  labels: meses,
  datasets: [
    {
      label: "Beneficios",
      data: beneficios,
      tension: 0.5,
      fill: true,
      borderColor: 'rgb(255,99,132)',
      backgroundColor: 'rgba(255,99,132,0.5',
      pointRadius: 5,
      pointBorderColor: 'rgba(255,99,132)',
      pointBackgroundColor: 'rgba(255,99,132'
    }
  ]
}
/*
let mioptions = {

} 
*/

let mioptions = {
  responsive: true,
  animation: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scale: {
    y: {
      min: -25,
      max: 100
    },
    x: {
      tick: { color: 'rgba(0,220,195)' }
    }
  },

}



export default function LinesChart() {
  return <Line data={midata} options={mioptions} />
}