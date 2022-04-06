window.addEventListener('load', () => {
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");
    



    function csvToArray(str, delimiter = ",") {

        let headers = str.slice(0, str.indexOf("\n")).split(delimiter);
        headers = headers[0].replace('\r', '').split(';');
        let correctHeaders = ['EmpID', 'ProjectID', 'DateFrom', 'DateTo']

        let allHeadersExist = true;
        for (let word = 0; word < correctHeaders.length; word++) {
            if(headers.length === correctHeaders.length){
                if(headers[word] !== correctHeaders[word]){

                    allHeadersExist = false;
                }
            } else {
                allHeadersExist = false;
            }
        }
        if (allHeadersExist) {
            document.getElementById('wrongCSV').innerHTML = '';
        } else {
            return wrongCSV();
        }


        let rows = str.slice(str.indexOf("\n") + 1).split("\n");
        rows = rows.map(row => row.replace('\r', '').split(';'));


        getData(rows);

    }

    myForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const input = csvFile.files[0];
        if (input.type !== 'application/vnd.ms-excel') {     //need to Validate More
            document.getElementById('wrongFile').style.display = 'block';
            document.getElementById('csvFile').style.border = '5px solid red'
        } else {
            document.getElementById('wrongFile').style.display = 'none';
            document.getElementById('csvFile').style.border = 'none'


            const reader = new FileReader();

            reader.onload = function (e) {
                const text = e.target.result;
                const data = csvToArray(text);

            };

            reader.readAsText(input);
        }
    });

    function getData(data) {

        let arrayWithAllProjects = [];
        for (let i = 0; i < data.length; i++) {
            let currentId = data[i][1];
            for (let j = i + 1; j < data.length; j++) {
                if (currentId === data[j][1]) {
                    arrayWithAllProjects.push({
                        'Employee ID#1': data[i][0],
                        'Employee ID#2': data[j][0],
                        'Project ID': data[i][1],
                        'Days worked': calcDaysWorkedTogether([data[i][2], data[i][3], data[j][2], data[j][3]]),
                    })
                }
            }
        }
        renderData(arrayWithAllProjects);
    }

    function calcDaysWorkedTogether(dates) {
        let datesToMileseconds = dateFormat(dates).map(date => date.getTime());
        let [emp1StartDate, emp1EndDate, emp2StartDate, emp2EndDate] = datesToMileseconds;


        let startWorkTogether = Math.max(emp1StartDate, emp2StartDate);
        let endWorkTogether = Math.min(emp1EndDate, emp2EndDate);

        let totalDaysWorkTogether = endWorkTogether - startWorkTogether;
        totalDaysWorkTogether = Math.ceil(totalDaysWorkTogether / (1000 * 3600 * 24));

        if (totalDaysWorkTogether < 0) {
            totalDaysWorkTogether = 'Employees have worked in different dates!'
        }
        return totalDaysWorkTogether;



    }

    function dateFormat(dates) {

        let regex1 = /^(0[1-9]|1\d|2\d|3[01]|[0-9])(\/|-|.)(0[1-9]|1[0-2]|[0-9])(\/|-|.)(19|20)\d{2}$/
        //regex1 match dateFormat mm/dd/yyyy or mm-dd-yyyy or mm.dd.yyyy
        let regex2 = /^(0[1-9]|1\d|2\d|3[01]|[0-9])(\/|-|.)(0[1-9]|1[0-2]|[0-9])(\/|-|.)(19|20)\d{2}$/
        //regex2 match dateFormat dd/mm/yyyy or dd-mm-yyyy or dd.mm.yyyy
        let regex3 = /^((19|20)\d{2})(\/|-|.)(0[1-9]|1[0-2]|[0-9])(\/|-|.)(0[1-9]|1\d|2\d|3[01]|[0-9])$/
        //regex3 match dateFormat yyyy/mm/dd or yyyy-mm-dd or yyyy.mm.dd
        let regex4 = /^((19|20)\d{2})(\/|-|.)(0[1-9]|1\d|2\d|3[01]|[0-9])(\/|-|.)(0[1-9]|1[0-2]|[0-9])$/
        //regex4 match dateFormat yyyy/dd/mm or yyyy-dd-mm or yyyy.dd.mm
        let matchRegex1 = dates.filter(value => regex1.test(value));
        let matchRegex2 = dates.filter(value => regex2.test(value));
        let matchRegex3 = dates.filter(value => regex3.test(value));
        let matchRegex4 = dates.filter(value => regex4.test(value));


        if (matchRegex1.length >= 2) {                       //length should be >= 2 in case of NULL
            let formatedDates = [];
            dates.forEach(date => {

                if (date !== 'NULL') {
                    let delimeter = date.match(/\.|\/|\-/g)[0];

                    date = date.split(delimeter);
                    date = new Date(date[2], date[0] - 1, date[1]);
                    formatedDates.push(date);
                } else {
                    let today = new Date()
                    date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                    date = date.split('-');
                    date = new Date(date[0], date[1] - 1, date[2]);
                    formatedDates.push(date);
                }

            });
            return formatedDates;

        } else {

            if (matchRegex2.length >= 2) {
                let formatedDates = [];
                dates.forEach(date => {

                    if (date !== 'NULL') {
                        let delimeter = date.match(/\.|\/|\-/g)[0];

                        date = date.split(delimeter);
                        date = new Date(date[2], date[1] - 1, date[0]);
                        formatedDates.push(date);
                    } else {
                        let today = new Date()
                        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        date = date.split('-');
                        date = new Date(date[0], date[1] - 1, date[2]);
                        formatedDates.push(date);
                    }

                });
                return formatedDates;

            } else if (matchRegex3.length >= 2) {
                let formatedDates = [];
                dates.forEach(date => {

                    if (date !== 'NULL') {
                        let delimeter = date.match(/\.|\/|\-/g)[0];

                        date = date.split(delimeter);
                        date = new Date(date[0], date[1] - 1, date[2]);
                        formatedDates.push(date);
                    } else {
                        let today = new Date()
                        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        date = date.split('-');
                        date = new Date(date[0], date[1] - 1, date[2]);
                        formatedDates.push(date);
                    }

                });
                return formatedDates;

            }
            else if (matchRegex4.length >= 2) {
                let formatedDates = [];
                dates.forEach(date => {

                    if (date !== 'NULL') {
                        let delimeter = date.match(/\.|\/|\-/g)[0];

                        date = date.split(delimeter);
                        date = new Date(date[0], date[2] - 1, date[1]);
                        formatedDates.push(date);
                    } else {
                        let today = new Date()
                        date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        date = date.split('-');
                        date = new Date(date[0], date[1] - 1, date[2]);
                        formatedDates.push(date);
                    }

                });
                return formatedDates;

            }

        }



    }
    function renderData(array) {
        let mainDivElement = document.getElementById('container');

        let divParentElement = document.createElement('div');
        divParentElement.style.textAlign = 'center';
        array = array.sort((a, b) => (b['Days worked'] > a['Days worked']) ? 1 : ((a['Days worked'] > b['Days worked']) ? -1 : 0))

        let h1Element = document.createElement('h1')
        h1Element.textContent = 'Pair of employees who have worked together';
        h1Element.style.textAlign = 'center';
        divParentElement.appendChild(h1Element);

        let tbl = document.createElement('table');
        tbl.style.margin = 'auto';
        tbl.style.width = '75%';
        tbl.style.border = '1px solid black';

        var header = tbl.createTHead();
        var row = header.insertRow(0);
        for (let k = 3; k >= 0; k--) {
            var cell = row.insertCell(0);
            cell.appendChild(document.createTextNode(`${Object.keys(array[0])[k]}`));
            cell.style.fontWeight = 'bold';
        }

        for (let i = 0; i < array.length; i++) {
            const tr = tbl.insertRow();
            for (let j = 0; j < 4; j++) {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(`${Object.values(array[i])[j]}`));
                td.style.border = '1px solid black';
            }

        }
        let removeTableBtn = document.createElement('button');
        removeTableBtn.textContent = 'Remove Table';
        divParentElement.appendChild(tbl);

        divParentElement.appendChild(removeTableBtn)
        mainDivElement.appendChild(divParentElement)

        document.querySelectorAll('button').forEach(button => button.addEventListener('click', onClickRemoveTable));

    }


    function onClickRemoveTable(e) {
        e.preventDefault();
        e.target.parentElement.remove()
    }

    function wrongCSV() {
        let wrongCsvMessage = document.createElement('h1');
        wrongCsvMessage.textContent = 'Wrong CSV File!'
        wrongCsvMessage.style.color = 'red';
        let h3 = document.createElement('h3')
        h3.textContent = 'You need to use CSV with headers: [ EmpID, ProjectID, DateFrom, DateTo ]. Please check if headers of the CSV file correspond to the sequence and are the same!';


        let divWrongSection = document.getElementById('wrongCSV');
        divWrongSection.appendChild(wrongCsvMessage);
        divWrongSection.appendChild(h3);
    }

})