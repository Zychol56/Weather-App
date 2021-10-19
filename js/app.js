let lat;
let long;
let latInput = document.querySelector(".lat_input");
let noLatSubmit = document.querySelector(".lat_submit");
let noLat = document.querySelector(".no_lat");
let LatVal;
let apicity;
let latcont = document.querySelector(".lat_container");
let latOpt = document.querySelectorAll(".lat_opt");
let iter;
let citydesc = document.querySelector(".city_desc");
let city = document.querySelector(".city");
let changeLoc = document.querySelector(".change_loc");
let mainCont = document.querySelector(".main");
let proxy = "https://api.codetabs.com/v1/proxy?quest=";

changeLoc.addEventListener("click", errors);

navigator.geolocation.getCurrentPosition(succes,errors);

    function succes(position){
        console.log(position);
        lat = (position.coords.latitude);
        long = (position.coords.longitude);
        main();
    }

    function errors(error) {
        mainCont.style.display = "none";
        noLat.style.display = "flex";

        noLatSubmit.addEventListener("click",function(e){
            e.preventDefault();
            for (i = 0; i < latOpt.length; i++) {
                latOpt[i].style.display = "none";
              }
            latVal = latInput.value;
            apicity = `${proxy}https://api.opencagedata.com/geocode/v1/json?q=${latVal}&key=3dd1dfb916bb45f38bd7a8a9f5ad1a6f`;
            fetch(apicity)
            .then((response) => response.json())
            .then((data) =>{
                    for(i=0; i < data.results.length; i++){
                        console.log(data.results)
                        if(data.results.length != 0){
                    latOpt[i].innerHTML = data.results[i].formatted;
                    latOpt[i].style.display = "block";
                    latOpt[i].addEventListener("click", ((j) => {
                        return function() {
                            lat = data.results[j].geometry.lat
                            long = data.results[j].geometry.lng
                            noLat.style.display = "none";
                            citydesc.style.display = "none";
                            mainCont.style.display = "block";
                            main();
                        }
                      })(i))
                    }
                    else{
                        latOpt[i].style.display = "none";
                    }
                } 
            })
        })
    }

function main(){
    let oneday = document.querySelectorAll(".oneday_day")
    let ico = document.querySelectorAll(".icon");
    let tempDailyMax = document.querySelectorAll(".max");
    let tempDailyMin = document.querySelectorAll(".min");
    let cel = document.querySelector(".Cel");
    let far = document.querySelector(".Far");
    let description = document.querySelector(".description");
    let temperature = document.querySelector(".temperature");
    let Charts = document.querySelector(".weather_chart").getContext("2d");
    let temp12 = [];
    let hours12 = [];
    let api = `${proxy}https://api.darksky.net/forecast/a48d967f2dc6c8171632856c53cff749/${lat},${long}`
    fetch(api)
    .then(response=> response.json())

    .then(datas =>{
        // Time Hourly + Icon Hourly
            for(i=1; i<=6; i++){
                console.log(datas)
                const skycons = new Skycons({color: "white"});
                let icon = datas.daily.data[i].icon
                const curIcon = icon.replace(/-/g, "_").toUpperCase();
                skycons.play();
                skycons.set(ico[i-1], Skycons[curIcon]);
            }

            function myDay() {

                let date = new Date();
                let weekdays = new Array(7);
                weekdays[0] = "Sunday";
                weekdays[1] = "Monday";
                weekdays[2] = "Tuesday";
                weekdays[3] = "Wednesday";
                weekdays[4] = "Thursday";
                weekdays[5] = "Friday";
                weekdays[6] = "Saturday";
                for(i=0; i<=4; i++){
                oneday[i].textContent = weekdays[date.getDay() + i + 1];
                }
            }
            myDay()

    far.onchange = tempHourly
    cel.onchange = tempHourly

        // Description currently
        description.textContent = datas.currently.summary

        // Today
        function myDate(ID) {
            let date = new Date();
            let weekdays = new Array(7);
            weekdays[0] = "Sunday";
            weekdays[1] = "Monday";
            weekdays[2] = "Tuesday";
            weekdays[3] = "Wednesday";
            weekdays[4] = "Thursday";
            weekdays[5] = "Friday";
            weekdays[6] = "Saturday";
            let days = weekdays[date.getDay()];
            document.querySelector(ID).textContent = days;
        }
        myDate(".today")
        let WeatherChart = new Chart(Charts, {
            type:"line",
            data:{
                labels: hours12,
                datasets:[{
                    data: temp12,
                    fill: false,
                    backgroundColor: 'rgba(255, 255, 255,  1)',
                    borderColor: "rgba(255, 255, 255,  1)",
                    fontColor: '#fff',
                }]
            },
            options:{
                legend: {
                    display: false,
                },
                events: [],
                scales: {
                    yAxes: [{
                      ticks: {
                        fontColor: "white",
                        stepSize: 1,
                        fixedStepSize: 1,
                        callback: function(value){
                            if(far.checked == true){
                                return value + " °F"
                            } else if(cel.checked == true){
                                return value + " °C"
                            }
                        }
                      }
                    }],
                    xAxes: [{
                        ticks: {
                          fontColor: "white",
                        }
                      }]
                }
            }
        })
                            // Temperature Hourly + Currently
                            function tempHourly(){
                                for(i=1; i<=5; i++){
                                    if(far.checked == true){
                                    tempDailyMin[i-1].textContent = Math.floor(datas.daily.data[i].temperatureLow) + "°F"
                                    tempDailyMax[i-1].textContent = Math.floor(datas.daily.data[i].temperatureHigh) + "°F"
                                    temperature.textContent = Math.floor(datas.currently.temperature) + "°F"
                                    } else if(cel.checked == true){
                                        tempDailyMin[i-1].textContent = Math.floor((datas.daily.data[i].temperatureLow - 32)/1.8) + "°C"
                                        tempDailyMax[i-1].textContent = Math.floor((datas.daily.data[i].temperatureHigh - 32)/1.8) + "°C"
                                        temperature.textContent = Math.floor((datas.currently.temperature - 32)/1.8) + "°C"
                                    }
                                }
                                // temp12 and hours12 push
                                hours12= [];
                                for(i=1; i<=12; i++){
                                    let date = new Date(datas.hourly.data[i].time*1000);
                                    let hours = date.getHours();
                                    let minutes = "0" + date.getMinutes();
                                    let formattedTime = hours + ':' + minutes.substr(-2);
                                    hours12.push(formattedTime);
                                }
                            temp12 = [];
                            for(i=1; i<=12; i++){
                                if(far.checked == true){
                                    temp12.push(Math.floor(datas.hourly.data[i].temperature))
                                } else if(cel.checked == true){
                                    temp12.push(Math.floor((datas.hourly.data[i].temperature - 32)/1.8))
                                }
                            }
                                // new Data in chart.js
                                WeatherChart.data.datasets[0].data = temp12;
                                WeatherChart.data.labels = hours12;
                                WeatherChart.update();
            
                            }
                            tempHourly()

    })            
    .catch( (s) => {
        console.log(s)
    })
    const OpenCageData = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=3dd1dfb916bb45f38bd7a8a9f5ad1a6f`
    fetch(OpenCageData)

    .then(response => response.json())
    
    .then(datass =>{
        city.textContent = datass.results[0].formatted
    })
};