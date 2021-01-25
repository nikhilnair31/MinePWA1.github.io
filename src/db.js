


if(window.navigator.onLine){
    $.getJSON('https://minedb31.firebaseio.com/.json', function(data) {
        dbObj = data;
        localStorage.setItem('dbObj', JSON.stringify(dbObj));
        debugLogPrint(['db', dbObj]);
    });
}

//find stuff
console.log('retrievedObject: ', JSON.parse(localStorage.getItem('dbObj')));
var path = "Threshold Levels/Fire Levels/Graham's Ratio";
console.log('dbObj: ', deepFind(dbObj, path));