const settings = {
    //Addition settings for this template
    id_col: "USUBJID",
    time_col: "VISITN",
    measure_col: "TEST",
    value_col: "STRESN",
    unit_col: "STRESU",
    normal_col_low: "STNRLO",
    normal_col_high: "STNRHI",
    group_cols:["SEX","RACE"],
    start_value: null,
    rotateX: true,
    missingValues: ["NA",""],
    boxplots: true,
    violins: false,

    //Standard webcharts settings
     x:{
        column:null, //set in syncSettings()
        type:"ordinal",
        label:null,
        sort:"alphabetical-ascending", 
        behavior:"flex",
        tickAttr: null
    },
    y:{
    	column:null, //set in syncSettings()
        stat:"mean",
        type:"linear",
        label:"Value",
        behavior:"flex",
        format:"0.2f"
    },
    marks:[
        {
            type:"line",
            per:[
                "ALL"
            ],
            attributes:{
                'stroke-width': 2, 
                'stroke-opacity': 1,
                "display":"none"
            }
        }
    ],
    legend: {
        label: ''
    },
    color_by: 'ALL',
    resizable:false,
    height:500,
    range_band:20,
    margin:{bottom:50},
    gridlines: 'xy'
};

// Replicate settings in multiple places in the settings object
export function syncSettings(settings){
	settings.x.column = settings.time_col;
	settings.y.column = settings.value_col;
	 return settings;
}

// Default Control objects
export const controlInputs = [ 
  	{
        label:"Measure", 
        value_col: null, //set in syncControlInputs()
        type: "subsetter",  
        start: null
    },
    {
        label:"Group", 
        options: ["marks.0.per.0","color_by"], 
        type: "dropdown", 
        require: true, 
        values:["ALL"], //additional options added in syncControlInputs()
        start:"ALL"
    },
    {
        label:"Hide visits with no data:", 
        option: "x.behavior", 
        type: "radio", 
        require: true, 
        values: ['flex','raw'],
        relabels:['Yes',"No"]
    },
    {type: "checkbox", option: "violins", label: "Violin Plots", inline: true},
    {type: "checkbox", option: "boxplots", label: "Box Plots", inline: true}];

// Map values from settings to control inputs
export function syncControlInputs(controlInputs, settings){
	var measureControl = controlInputs.filter(function(d){return d.label=="Measure"})[0] 
	measureControl.value_col = settings.measure_col; 
	
	var groupControl = controlInputs.filter(function(d){return d.label=="Group"})[0]  
	//groupControl.values = d3.merge([groupControl.values,settings.group_cols])
    if(settings.group_cols){
        settings.group_cols.forEach(function(d){
            if(groupControl.values.indexOf(d)==-1){
                groupControl.values.push(d);
            }   
        })
    }
    return controlInputs
}

export default settings
