import './util/object-assign';
import defaultSettings from './defaultSettings';
import { syncSettings, syncControlInputs, controlInputs } from './defaultSettings';

import { createControls, createChart, createTable } from 'webcharts';

import onInit from './onInit';
import onLayout from './onLayout';
import onPreprocess from './onPreprocess';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';

export default function safetyResultsOverTime(element, settings) {
    //Merge user settings onto default settings.
    let mergedSettings = Object.assign({}, defaultSettings, settings);

    //Sync properties within merged settings, e.g. data mappings.
    mergedSettings = syncSettings(mergedSettings);

    //Sync merged settings with controls.
    const syncedControlInputs = syncControlInputs(controlInputs, mergedSettings);
    const controls = createControls(element, { location: 'top', inputs: syncedControlInputs });

    //Define chart.
    const chart = createChart(element, mergedSettings, controls);
    chart.on('init', onInit);
    chart.on('layout', onLayout);
    chart.on('preprocess', onPreprocess);
    chart.on('datatransform', onDataTransform);
    chart.on('draw', onDraw);
    chart.on('resize', onResize);

    return chart;
}
