The most straightforward way to customize the Safety Results Over Time is by using a configuration object whose properties describe the behavior and appearance of the chart. Since the Safety Results Over Time is a Webcharts `chart` object, many default Webcharts settings are set in the [defaultSettings.js file](https://github.com/RhoInc/safety-results-over-time/blob/master/src/defaultSettings.js) as [described below](#webcharts-settings). Refer to the [Webcharts documentation](https://github.com/RhoInc/Webcharts/wiki/Chart-Configuration) for more details on these settings.

In addition to the standard Webcharts settings several custom settings not available in the base Webcharts library have been added to the Safety Results Over Time to facilitate data mapping and other custom functionality. These custom settings are described in detail below. All defaults can be overwritten by users.

# Renderer-specific settings
The sections below describe each safety-results-over-time setting as of version 2.2.0.

## settings.id_col
`string`

unique identifier variable name

**default:** `"USUBJID"`



## settings.time_settings
`object`

visit metadata

### settings.time_settings.value_col
`string`

undefined

**default:** `"VISIT"`

### settings.time_settings.label
`string`

undefined

**default:** `"Visit"`

### settings.time_settings.order_col
`string`

undefined

**default:** `"VISITNUM"`

### settings.time_settings.order
`array`

undefined

**default:** none

### settings.time_settings.rotate_tick_labels
`boolean`

undefined

**default:** `true`

### settings.time_settings.vertical_space
`number`

undefined

**default:** `100`



## settings.measure_col
`string`

measure variable name

**default:** `"TEST"`



## settings.unit_col
`string`

measure unit variable name

**default:** `"STRESU"`



## settings.value_col
`string`

result variable name

**default:** `"STRESN"`



## settings.normal_col_low
`string`

LLN variable name

**default:** `"STNRLO"`



## settings.normal_col_high
`string`

ULN variable name

**default:** `"STNRHI"`



## settings.start_value
`string`

value of measure to display initially

**default:** none



## settings.filters
`array`

an array of filter variables and associated metadata

**default:** none

### settings.filters[].value_col
`string`

undefined

**default:** none

### settings.filters[].label
`string`

undefined

**default:** none



## settings.groups
`array`

an array of grouping variables and associated metadata

**default:** none

### settings.groups[].value_col
`string`

undefined

**default:** none

### settings.groups[].label
`string`

undefined

**default:** none



## settings.boxplots
`boolean`

controls initial display of box plots

**default:** `true`



## settings.violins
`boolean`

controls initial display of violin plots

**default:** `false`



## settings.missingValues
`array`

an array of strings that identify missing values in both the measure and result variables

**default:** none



## settings.visits_without_data
`boolean`

controls display of visits without data for the current measure

**default:** `false`



## settings.unscheduled_visits
`boolean`

controls display of unscheduled visits

**default:** `false`



## settings.unscheduled_visit_pattern
`string`

a regular expression that identifies unscheduled visits

**default:** `"/unscheduled|early termination/i"`



## settings.unscheduled_visits_values
`array`

an array of strings that identify unscheduled visits; overrides unscheduled_visit_pattern

**default:** none

# Webcharts settings
The object below contains each Webcharts setting as of version 2.2.0.

```
{    x: {        column: null, // set in syncSettings()        type: 'ordinal',        label: null,        behavior: 'flex',        sort: 'alphabetical-ascending',        tickAttr: null    },    y: {        column: null, // set in syncSettings()        type: 'linear',        label: null,        behavior: 'flex',        stat: 'mean',        format: '0.2f'    },    marks: [        {            type: 'line',            per: null, // set in syncSettings()            attributes: {                'stroke-width': 2,                'stroke-opacity': 1,                display: 'none'            }        }    ],    legend: {        mark: 'square'    },    color_by: null, // set in syncSettings()    resizable: true,    gridlines: 'y',    aspect: 3}
```