import removeYAxisTicks from './onResize/removeYAxisTicks';
import addYAxisTicks from './onResize/addYAxisTicks';
import clearCanvas from './onResize/clearCanvas';
import drawPlots from './onResize/drawPlots';
import addMouseoverToOutliers from './onResize/addMouseoverToOutliers';
import rotateXAxisTickLabels from './onResize/rotateXAxisTickLabels';
import removeLegend from './onResize/removeLegend';

export default function onResize() {
    removeYAxisTicks.call(this);
    addYAxisTicks.call(this);
    clearCanvas.call(this);
    drawPlots.call(this);
    addMouseoverToOutliers.call(this);
    rotateXAxisTickLabels.call(this);
    removeLegend.call(this);
}
