import './util/object-assign';
import merge from './util/merge';
import defaultSettings, { syncSettings, syncControlInputs, controlInputs } from './defaultSettings';
import { createControls, createChart } from 'webcharts';
import onInit from './onInit';
import onLayout from './onLayout';
import onPreprocess from './onPreprocess';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';

export default function safetyResultsOverTime(element, settings) {
    const mergedSettings = merge(defaultSettings, settings), //Merge user settings onto default settings.
        syncedSettings = syncSettings(mergedSettings), //Sync properties within merged settings, e.g. data mappings.
        syncedControlInputs = syncControlInputs(controlInputs, syncedSettings), //Sync merged settings with controls.
        controls = createControls(element, { location: 'top', inputs: syncedControlInputs }), //Define controls.
        chart = createChart(element, mergedSettings, controls); //Define chart.

    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
