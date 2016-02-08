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
        sort:"alphabetical-ascending"
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
                'stroke-opacity': 1
            }
        }
    ],
    legend: {
        label: ''
    },
    color_by: 'ALL',
    resizable:true,
    max_width: 600,
    margin:{bottom:50},
    aspect: 1.33,
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
    }
];

export const tableSettings = {
    cols: ["key","shiftx","shifty"],
    headers: ["ID","Start Value", "End Value"]
};

export default settings
