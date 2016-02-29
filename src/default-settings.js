const settings = {
    //Addition settings for this template
    id_col: "USUBJID",
    time_col: "VISITN",
    measure_col: "TEST",
    value_col: "STRESN",
    unit_col: "STRESU",
    normal_col_low: "STNRLO",
    normal_col_high: "STNRHI",
    start_value: null,
    rotateX: true,
    missingValues: ["NA",""],
    //Standard webcharts settings
    x:{
        column:"VISITN",
        type:"ordinal",
        label:null,
        sort:"alphabetical-ascending", 
        behavior:"flex"
    },
    y:{
        column:"STRESN",
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
  //  max_width: 600,
    height:500,
    range_band:20,
    margin:{bottom:50},
  //  aspect: 1.33,
    gridlines: 'xy'
};

export const controlInputs = [ 
    {
        label:"Measure", 
        value_col: "TEST", 
        type: "subsetter",  
        start: null
    },
    {
        label:"Group", 
        options: ["marks.0.per.0","color_by"], 
        type: "dropdown", 
        require: true, 
        values: ['ALL', 'SEX', 'RACE'],
        start:"ALL"
    },
    {
        label:"Hide visits with no data:", 
        option: "x.behavior", 
        type: "radio", 
        require: true, 
        values: ['flex','raw'],
        relabels:['Yes',"No"]
    }
];

export const tableSettings = {
    cols: ["key","shiftx","shifty"],
    headers: ["ID","Start Value", "End Value"]
};

export default settings
