import { createChart, createControls } from 'webcharts';
import {  controlInputs } from './default-settings'
import config from './default-settings';
import onInit from './onInit';
import onLayout from './onLayout';
import onDataTransform from './onDataTransform';
import onDraw from './onDraw';
import onResize from './onResize';
import './object-assign';

export default function outlierExplorer(element, settings){
	//merge user's settings with defaults
	let mergedSettings = Object.assign({}, config, settings);
	// nested objects must be copied explicitly
	mergedSettings.x = Object.assign({}, config.x, settings.x);
	mergedSettings.y = Object.assign({}, config.y, settings.y);
	mergedSettings.margin = Object.assign({}, config.margin, settings.margin);
	//make sure settings are kept in sync
	mergedSettings.x.column = mergedSettings.time_col;
	mergedSettings.y.column = mergedSettings.value_col;
	controlInputs[0].value_col = mergedSettings.measure_col;

	//create controls now
	let controls = createControls(element, {location: 'top', inputs: controlInputs});
	//create chart
	let chart = createChart(element, mergedSettings, controls);
	chart.on('init', onInit);
	chart.on('layout', onLayout);
	chart.on('datatransform', onDataTransform);
	chart.on('draw', onDraw);
	chart.on('resize', onResize);

	return chart;
}