import ChartConfig from './ChartConfig'

export default abstract class CharOption extends ChartConfig {
    protected line(): {} {
        return this.publicOptions()
    }

    protected bar(): {} {
        return this.publicOptions()
    }

    protected pie(): object {
        return {
            title: this.getPieTitle(),
            tooltip: this.getPieTooltip(),
            legend: this.getPieLegend(),
            series: this.getPieSeries()
        }
    }

    protected publicOptions():object {
        return {
            title: this.getLineTitle(),
            legend: this.getLineLegend(),
            tooltip: this.getLineTooltip(),
            grid: this.getLineGrid(),
            xAxis: this.getLineXAxis(),
            yAxis: this.getLineYAxis(),
            series: this.getLineSeries(),
            color: this.getLineColor()
        }
    }
}
