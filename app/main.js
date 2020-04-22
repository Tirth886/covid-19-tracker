$(document).ready(() => {

    const GLOBAL_DATA = {}
    const GLOBAL_DATA_LIST = []

    // API'S 
    const URL = {
        geturi: function (urikey) {
            let type = typeof urikey === "object" ?
                urikey.type :
                ""
            switch (typeof urikey === "object" ? urikey.key : urikey) {
                case "global":
                    return `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${type}_global.csv`

                case "all":
                    return `https://corona.lmao.ninja/v2/all`
                
                case "country":
                    return `https://corona.lmao.ninja/v2/countries`

                case "history":
                    return `https://corona.lmao.ninja/v2/historical/${type}/`
                    
                default:
                    return false
            }
        }
    }

    // CHART OPTION SETTING REUSABLE MODULE
    const CHART_SETTING = {
        setting: function () {
            return { displayModeBar: false }
        },
        trace: function (option) {
            // console.log(option)
             
            return {
                mode: option.type,
                name: option.name,
                x: option.historicaldata 
                || option.cases 
                || option.deaths 
                || option.recovered ? PROCESS_DATA.processaxis({ data: option.historicaldata 
                    || option.cases 
                    || option.deaths 
                    || option.recovered, axis: "x"}) : option.date,
                y: option.historicaldata 
                || option.cases 
                || option.deaths 
                || option.recovered ? PROCESS_DATA.processaxis( { data: option.historicaldata 
                    || option.cases 
                    || option.deaths 
                    || option.recovered, axis:"y"}) : option.case,
                hovertemplate: '<b>Cases</b>:%{y:.2f}' +
                        '<br><b>Date</b>: %{x}<br>',
                fill:'tozeroy', 
                line: {
                    color: option.markercolor,
                    width: 4.5
                }
            }
        },
        margin: function (margin) {
            return {
                l: margin.left ? margin.left : "",
                r: margin.right ? margin.right : "",
                b: margin.bottom ? margin.bottom : "",
                t: margin.top ? margin.top : "",
            }
        },
        theme: function (setting) {
            return {
                plot_bgcolor: setting.plot_bgcolor ? setting.plot_bgcolor : "",
                paper_bgcolor: setting.paper_bgcolor ? setting.paper_bgcolor : "",
            }
        },
        axisticksetting: function (setting) {
            return {
                showticklabels: true,
                showgrid: setting.showgrid ? setting.showgrid : false,
                zeroline: false,
                showline: true,
                gridcolor: setting.showgrid ? '#bdbdbd' : "",
                gridwidth: setting.showgrid ? 0.1 : 0,
                tickangle: setting.angle ? setting.angle : "",
                tickwidth: setting.tickwidth ? setting.tickwidth : "",
                tickcolor: setting.tickcolor ? setting.tickcolor : "",
                tickfont: this.font({
                    family: setting.family,
                    size: setting.size,
                    color: setting.color
                }),
                zerolinecolor: setting.zerolinecolor ? setting.zerolinecolor : "",
                linecolor: setting.linecolor ? setting.linecolor : "",
                linewidth: setting.linewidth ? setting.linewidth : ""
            }
        },
        font: function (font) {
            return {
                family: font.family,
                size: font.size,
                color: font.color
            }
        },
    }

    // CHART PARAMETER REUSABLE MODULE
    const CHART = {
        data: function (data) {
            // console.log(data)
            let plotdata

            PROCESS_DATA.isDict(data) ? plotdata = [data] : plotdata = data 

            return plotdata.map(a => CHART_SETTING.trace(a))
        },
        layout: function (option) {
            layout =  {
                
                margin: CHART_SETTING.margin({ left: 50, right: 40, top: 59, bottom: 61.5 }),
                
                plot_bgcolor: CHART_SETTING.theme({ plot_bgcolor: "rgba(236, 236, 236, 0.15)" }).plot_bgcolor,
                
                paper_bgcolor: CHART_SETTING.theme({ paper_bgcolor: "#fff" }).
                paper_bgcolor,
                
                title : {
                    text : option.title,
                    font : CHART_SETTING.font({family: "Arial, Helvetica, sans-serif",size : "12",color: "#636669"})
                },
                
                yaxis: CHART_SETTING.axisticksetting({ showgrid: true, angle: 360, tickwidth: 2, tickcolor: "#000", zerolinecolor: '#bdbdbd', linecolor: '#000', linewidth: 3,family:'Arial, Helvetica, sans-serif',size:12,color:"black" }),

                xaxis: CHART_SETTING.axisticksetting({ showgrid: true, angle: 360, tickwidth: 2, tickcolor: "#000", zerolinecolor: '#bdbdbd', linecolor: '#000', linewidth: 3,family:'Arial, Helvetica, sans-serif',size:12,color:"black" })
            }
            return layout
        },
    }

    // HTML COMPONENT
    const COMPONENT = {
        option : function (args){
                return `<option value='${args.countryInfo._id}'>${args.country}</option>`
        },  
        tableelement: function (args) {
            // return `<div class="row-table "><div class="cell" data-title="Sr.NO"> </div><div class="cell" data-title="Country"> <img src="${args.countryInfo.flag}" width="20"> ${args.country}</div><div class="cell" data-title="Total Case"> <span> ${UTILS.numberformat(args.cases)}</span> </div><div class="cell" data-title="Active"> ${UTILS.numberformat(args.active)}</div><div class="cell" data-title="Recovered"> ${UTILS.numberformat(args.recovered)}</div><div class="cell" data-title="Death"> ${UTILS.numberformat(args.deaths)}</div><div class="cell" data-title="Critical"> ${UTILS.numberformat(args.critical)}</div><div class="cell" data-title="Today Cases"> ${UTILS.numberformat(args.todayCases)}</div><div class="cell" data-title="Today Deaths"> ${UTILS.numberformat(args.todayDeaths)}</div></div>`


           return `<div class="d-flex border-bottom-1 content-country" data-country='${args.countryInfo._id}'> 
            <div class="d-block p-4 border-right-1 w-50">
                <!-- Country Data -->
                <div class="d-flex">
                    <div>
                        <img src="${args.countryInfo.flag}" width="45">
                    </div>
                    <div class="pl-1">
                        <span class="float-right upper-case"> ${args.country}</span>
                    </div>
                </div>
                <div class="">
                    <div class="p-0 mt-5">
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Cases</strong></span>
                            <span class="float-right size-total-number dot-cases px-3" id=""> ${UTILS.numberformat(args.cases)}</span>
                        </div>
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Recover Cases</strong></span>
                            <span class="float-right size-total-number dot-recover px-3 " id="">${UTILS.numberformat(args.recovered)}</span>
                        </div>
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Fatal
                                    Cases</strong></span>
                            <span style="color: red;font-weight: 900;font-size: small;" id=""></span>
                            <span class="float-right size-total-number dot-death px-3" id="fatal-cases">${UTILS.numberformat(args.deaths)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-50">
                <div id="${args.countryInfo._id}-chart"></div>
            </div>
            <div class="w-50 border-left-1 ">
                <div class="pr-2 pl-2">
                    <div class="p-0 mt-5">
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Today Cases</strong></span>
                            <span class="float-right size-total-number dot-cases px-3">${UTILS.numberformat(args.todayCases)}</span>
                        </div>
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Active Cases</strong></span>
                            <span class="float-right size-total-number dot-death px-3" id=""> ${UTILS.numberformat(args.active)}</span>
                        </div>
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Critical Cases</strong></span>
                            <span class="float-right size-total-number dot-death px-3" id="">${UTILS.numberformat(args.critical)}</span>
                        </div>
                        <div class="mb-4">
                            <span class="ml-2 font-total-heading opacity-0-7"><strong>Today Deaths</strong></span>
                            <span class="float-right size-total-number dot-death px-3" id="">${UTILS.numberformat(args.todayDeaths)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
        },
    }

    // REUSABLE UTILITIES
    const UTILS = {
        selector: function (args) {
            return {
                "status": true,
                "statement": {
                    "selector": typeof args === "object" ?
                        "." :
                        "#",
                    "name": typeof args === "object" ?
                        args[0] :
                        args,
                }
            }
        },
        getelement: function (args) {
            let statement = this.selector(args)
            if (statement.status) {
                try {
                    let dom = $(`${statement.statement.selector}${statement.statement.name}`)
                    if (!dom.length > 0) throw TypeError("DOM Element Not Specified") 
                    return dom
                } catch (e) {
                    // console.log(e)
                }
            }
        },
        request: function (option, callback) {
            $.ajax({
                url: `${URL.geturi(option.uri) != false ? URL.geturi(option.uri) : ""}`,
                type: option.method ? option.method : "GET",
                async: true,
                success: function (res) {
                    callback({ response: res, message: `${typeof option.uri == "object" ? option.uri.type : option.uri}-Response Ok`, status: true })
                },
                error: function (err) {
                    callback({ err: err, message: "URL INVALID", status: false })
                }
            })
        },
        numberformat: function (number) {
            return new Intl.NumberFormat('en-IN', { maximumSignificantDigits: 3 }).format(number)
        },
        csvtojson: function (csv) {
            // https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.1.0/papaparse.min.js | 
            // Library for CSV to JSON CONVERTER
            return Papa.parse(csv, {
                header: true,
            }).data
        },
    }

    // DATA PROCESSING CALCULATION
    const PROCESS_DATA = {
        isDict : function(v) {
            return typeof v === 'object' && v !== null && !(v instanceof Array) && !(v instanceof Date)
        },
        dailyIncrease : function (cases) {
            worldincreasecases = {}

            dailyincrease = [...this.processaxis({ data: cases.historicaldata, axis: "y" })].map((v,i,array) => {
                return i == 0 ? v : Math.abs(array[i] - array[i-1])
            })
            date = this.processaxis({ data: cases.historicaldata, axis: "x" })

            worldincreasecases["case"]  = dailyincrease
            worldincreasecases["markercolor"] = cases.markercolor
            worldincreasecases["type"]  = cases.type
            worldincreasecases["name"]  = cases.name
            worldincreasecases["status"]= cases.status
            worldincreasecases["date"]  = date
            worldincreasecases["title"] = `World Daily Increase In ${cases.status} Cases`
            
            return worldincreasecases
        },                               
        processaxis: function (plot) {

            let plotdata = $.map(plot.data, (cases, date) => {      
                return plot.axis == "x" ? new Date(date) : cases     
            })

            return plotdata
        },
        parse: function (data) {     

            data.data.map(value => $.each(value, (key, cases) => {
                if (typeof GLOBAL_DATA[data.type] != "object") {
                    GLOBAL_DATA[data.type] = {}
                }
                GLOBAL_DATA[data.type][key] > 0 ?
                    GLOBAL_DATA[data.type][key] += parseInt(cases) :
                GLOBAL_DATA[data.type][key] = parseInt(cases)
            }))

            return this.filter({ data: GLOBAL_DATA, type: data.type })
        },
        filter: function (filter) {
            ["Province/State", "Country/Region", "Lat", "Long"].map(delkey => delete filter.data[filter.type][delkey])
            return {
                global_data: filter.data,
                status: true,
                message: `${filter.type} Cases => Ready For Chart`
            }
        }
    }

    // FEATURE PROJECT WILL GIVE
    const FEATURE = {
        type: function () {
            return [{type:"confirmed",color:"blue",name:"Confirmed Cases"}, {type:"recovered",color:"green",name:"Recovered Cases"},{type:"deaths",color:"red",name:"Deaths Cases"}]
        },
        getDailyIncrese : function (dataset) {            
            dailyincreasecases = dataset.map(a => PROCESS_DATA.dailyIncrease(a))
            dailyincreasecases.map(a => Plotly.newPlot(a.status, CHART.data(a), CHART.layout({title : `<b>${a.title}</b>`}), CHART_SETTING.setting()))
        },

        selectCountry : function(){
             
            DOM_ELEMENT.countrySelect.on("change", function(e){
                if ($(this).val() === "all") {
                    UTILS.getelement(["content-country"]).addClass("d-flex").removeClass("d-none")
                }else{
                    $(`div[data-country=${$(this).val()}]`).addClass("d-flex").removeClass("d-none")
                    UTILS.getelement(["content-country"]).not(`div[data-country=${$(this).val()}]`).removeClass("d-flex").addClass("d-none")
                }
            })
        },
        prepareCountryChart : function (a){
            UTILS.request({uri: {type: a.country, key: "history"} }, (response) => {
                            
                if (response.status) {
                    plotdata = $.map(response.response.timeline , (data,key) => {
                        let cases     = {} 
                        cases[key]    = data
                        cases["name"] = key
                        
                        return cases
                    })

                    Plotly.newPlot(`${a.countryInfo._id}-chart`, CHART.data(plotdata), CHART.layout({title : `<b>${a.country.replace(/^./, a.country[0].toUpperCase())} Historical Cases</b>`}), CHART_SETTING.setting()) 

                }else{
                    try{
                        UTILS.getelement(`${a.countryInfo._id}-chart`).html("") 
                    }catch(e){
                        new TypeError("Value not Get")
                    } 
               }
            }) 
        },
        getCountry : function(){
            UTILS.request({uri : "country"}, (response) => {
                response.status ? 
                response.response.map((a) =>{
                    if (DOM_ELEMENT.countrySelect.append(COMPONENT.option(a))){

                        DOM_ELEMENT.datatable.append(COMPONENT.tableelement(a))
                        this.prepareCountryChart(a)

                    }else{
                        new TypeError("Check Country Api")
                    }
                }) : new TypeError ("Check The API's VERSION")
            })
        },
        getTotal : function (){
            function showTotalData(response){
                DOM_ELEMENT.affectedCountries.html(response.response.affectedCountries)
                
                DOM_ELEMENT.cases.html(`${UTILS.numberformat(response.response.cases)}`)
                
                DOM_ELEMENT.active.html(UTILS.numberformat(response.response.active))
                
                DOM_ELEMENT.recovered.html(UTILS.numberformat(response.response.recovered))
                
                DOM_ELEMENT.todayDeaths.html(`+${UTILS.numberformat(response.response.todayDeaths)}`)
                
                DOM_ELEMENT.fatal.html(UTILS.numberformat(response.response.deaths))

            }

            UTILS.request({uri : "all"} , (response) => {

                response.status ? showTotalData(response) : new TypeError("Check API's Version")                      
            })
        },
        getCoronaDetail: function () {
            this.type().map(a => Plotly.d3.csv(URL.geturi({ type: a.type, key: "global" }), (err,response) => {
                if (err) throw new TypeError("Something Went Wrong With the ApI")

                GLOBAL_DATA_LIST.push({
                    historicaldata: PROCESS_DATA.parse({ data: response, type: a.type })["global_data"][a.type],
                    type: "scatter",
                    markercolor: a.color,
                    name: `<b>${a.name}</b>`,
                    message: `${a.type} Cases => Ready For Chart`,
                    status: a.type
                })

                if (GLOBAL_DATA_LIST.length === FEATURE.type().length) {
                    Plotly.newPlot('historical-data', CHART.data(GLOBAL_DATA_LIST), CHART.layout({title : "<b>Historical Cases (Confirmed / Recovered / Deaths)</b>"}), CHART_SETTING.setting()).then(() => { 
                        DOM_ELEMENT.loader.addClass("d-none")
                           
                        // Afte Preparation of Graph  
                        $.when(FEATURE.getTotal())

                        .then(FEATURE.getDailyIncrese(GLOBAL_DATA_LIST))
                        
                        .then(FEATURE.getCountry())

                        .then(FEATURE.selectCountry())
                    
                    });                     
                }
            }))
        }
    }

    // DOM ELEMENT's
    const DOM_ELEMENT = {
        affectedCountries : UTILS.getelement("affectedCountries"),
        cases             : UTILS.getelement("cases"),
        active            : UTILS.getelement("active-cases"),
        recovered         : UTILS.getelement("recovered-cases"),
        fatal             : UTILS.getelement("fatal-cases"),
        todayDeaths       : UTILS.getelement("todaydeath"),
        datatable         : UTILS.getelement("datatable"),
        countrySelect     : UTILS.getelement("country1"),
        loader            : UTILS.getelement(["plotlybars-wrapper"]),   
    }
    
    FEATURE.getCoronaDetail() 
})