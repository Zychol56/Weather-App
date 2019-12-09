window.addEventListener("load", () => {
    let lat;
    let long

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(position => {
            lat = position.coords.latitude
            long = position.coords.longitude;
            const proxy = "https://cors-anywhere.herokuapp.com/"
            const api = `${proxy}https://api.darksky.net/forecast/a48d967f2dc6c8171632856c53cff749/${lat},${long}`
            fetch(api)
            .then(response=>{
                return response.json();
            })
            .then(data =>{
                console.log(data);
            })
        });
    }
})