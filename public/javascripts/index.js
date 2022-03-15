let CarArray = [];

let CarObject = function(pCar, pPrice, pNote) {
    this.ID = Math.random().toString(16).slice(5)
    this.Car = pCar;
    this.Price = pPrice;
    this.Note = pNote;
}


CarArray.push(new CarObject("Ferrari F40", "700000", "Hopefully I get rich!"));
CarArray.push(new CarObject("1973 Toyota Landcruiser", "25000", "Great offroading vehicle!"));
CarArray.push(new CarObject("1949 Dodge Power Wagon", "75000", "Good investment piece."));
CarArray.push(new CarObject("1933 Packard 840", "150000", ""));




document.addEventListener("DOMContentLoaded", function() {

    createList();



    document.getElementById("buttonSave").addEventListener("click", function() {

        let newCarItem = new CarObject(
            document.getElementById("carName").value,
            document.getElementById("carPrice").value,
            document.getElementById("oneNote").value
        );
        addNewCarItem(newCarItem);


    });

    document.getElementById("buttonDelete").addEventListener("click", function() {
        document.getElementById("carName").value = "";
        document.getElementById("carPrice").value = "";
        document.getElementById("oneNote").value = "";
    });


    document.getElementById("buttonDelete2").addEventListener("click", function() {
        deleteCarItem(document.getElementById("IDparmHere").innerHTML);
        createList();
        document.location.href = "index.html#ListAll";
    });


    document.getElementById("buttonSortPrice").addEventListener("click", function() {
        CarArray.sort(dynamicSort("Price"));
        createList();
        document.location.href = "index.html#ListAll";
    });

    document.getElementById("buttonSortName").addEventListener("click", function() {
        CarArray.sort(dynamicSort("Car"));
        createList();
        document.location.href = "index.html#ListAll";
    });




    $(document).on("pagebeforeshow", "#ListAll", function(event) {
        FillArrayFromServer();

    });


    $(document).on("pagebeforeshow", "#ViewDetail", function(event) {
        if (document.getElementById("IDparmHere").innerHTML == "change1") {
            alert('sorry, temporary error, please try again');
            document.location.href = "index.html#ListAll";
        } else {
            let localID = document.getElementById("IDparmHere").innerHTML;

            let arrayPointer = GetArrayPointer(localID);


			console.log("populating page")

            document.getElementById("carName2").value = CarArray[arrayPointer].Car;
            document.getElementById("carPrice2").value = CarArray[arrayPointer].Price;
            document.getElementById("oneNote2").value = CarArray[arrayPointer].Note;
			
        }
    });


});


function createList() {

    var divCarList = document.getElementById("divCarList");
    while (divCarList.firstChild) {
        divCarList.removeChild(divCarList.firstChild);
    };

    var ul = document.createElement('ul');

    CarArray.forEach(function(element, ) {
        var li = document.createElement('li');

        li.classList.add('infoCarItem');


        li.setAttribute("data-parm", element.ID);
        li.innerHTML = element.Car;
        ul.appendChild(li);
    });
    divCarList.appendChild(ul)




    var liArray = document.getElementsByClassName("infoCarItem");
    Array.from(liArray).forEach(function(element) {
        element.addEventListener('click', function() {

            var parm = this.getAttribute("data-parm");
            console.log("id: " + parm);

            document.getElementById("IDparmHere").innerHTML = parm;

            document.location.href = "index.html#ViewDetail";
        });
    });

};




function saveCarItem(which) {

    let newCarItem = new CarObject(document.getElementById("carName").value, 
        document.getElementById("carPrice").value,
        document.getElementById("oneNote").value);

    modifyCarItem(newCarItem);
    document.location.href = "index.html#ListAll";
}


function GetArrayPointer(localID) {
    for (let i = 0; i < CarArray.length; i++) {
        if (localID === CarArray[i].ID) {
            return i;
        }
    }
}

function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function(a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

function FillArrayFromServer() {

    fetch('/CarList')
        .then(function(theResonsePromise) {
            return theResonsePromise.json();
        })
        .then(function(serverData) {
            console.log(serverData);
            CarArray.length = 0;
            CarArray = serverData;
            createList();
        })
        .catch(function(err) {
            console.log(err);
        });
};


function addNewCarItem(newCarItem) {



    const request = new Request('/addCarItem', {
        method: 'POST',
        body: JSON.stringify(newCarItem),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });


    fetch(request)


        .then(function(theResonsePromise) {
            return theResonsePromise.json()
        })

        .then(function(theResonsePromiseJson) {
            console.log(theResonsePromiseJson.toString()),
                document.location.href = "#ListAll"
        })

        .catch(function(err) {
            console.log(err);
        });


};

function modifyCarItem(newCarItem) {

    newCarItem.ID = document.getElementById("IDparmHere").innerHTML;




    const request = new Request('/modifyCarItem/' + newCarItem.ID, {
        method: 'PUT',
        body: JSON.stringify(newCarItem),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });


    fetch(request)

        .then(function(theResponsePromise) {
            return theResponsePromise.json()
        })

        .then(function(theResonsePromiseJson) {
            console.log(theResonsePromiseJson.toString()),
                document.location.href = "#ListAll"
        })

        .catch(function(err) {
            console.log(err);
        });
};

function deleteCarItem(which) {
    fetch('/deleteCarItem/' + which, {
            method: 'DELETE'
        })
        .then(function(theResonsePromise) {
            alert("Item successfully deleted in cloud")
        })
        .catch(function(err) {
            alert("Item NOT deleted in cloud " + err);
        });
};