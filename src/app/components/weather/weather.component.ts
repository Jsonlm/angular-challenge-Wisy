import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { WeatherService } from 'src/app/core/services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.sass']
})
export class WeatherComponent {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  public zone!: string;
  public data: any; // Adjust this based on the API response structure
  public lineChart!: Chart;
  public periods: [] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private weatherService: WeatherService
  ) { }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this.zone = params['zone'];
      this.fetchdata();
    });
  }

  fetchdata() {
    try {
      this.weatherService.getWeatherForecast(this.zone).subscribe(
        (data: any) => {
          this.data = data;
          this.renderChart();
        }
      );
      
    } catch (error) {
      
      console.error('Error fetching weather data:', error);
    }
  }

  renderChart() {
    const chartData = this.extractChartData();

    if (this.lineChart) {
      this.lineChart.destroy();
    }

    this.lineChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Temperature Forecast',
          data: chartData.temperatures,
          borderColor: '#36A2EB',
          backgroundColor: '#9BD0F5'
        }]
      }
    });
  }

  extractChartData() {
    const labels: string[] = [];
    const temperatures: number[] = [];
  
    if (this.data && this.data.properties && this.data.properties.periods) {
      const periods = this.data.properties.periods;
  
      periods.forEach((period: any) => {
        labels.push(period.name || '');
        temperatures.push(this.convertTemperature(period.temperature, period.temperatureUnit));
      });
    }
  
    return { labels, temperatures };
  }
  
  convertTemperature(temperature: number, unit: string): number {
    if (unit === 'F') {
      return temperature;
    } else if (unit === 'C') {
      return (temperature * 9) / 5 + 32;
    }
    return temperature;
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
