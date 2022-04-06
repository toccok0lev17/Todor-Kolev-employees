# Todor-Kolev-employees
App identifies the pair of employees who have worked together on common projects. Sorted by longest period of time

Hello,
The app accept only .CSV files. For validation used accept=".csv" inside the html element, and also if that been dismised, validate by type of input file in JS.
Made simple error notification for wrong-loaded file by displaying red-color text and also red border color on input button.

The app accept csv in format:
EmpID, ProjectID, DateFrom, DateTo

DateTo can be NULL which is todays Date;
Made Date format function where supported many types of date with different delimeter (/ . - );
When calculate days between dates, if in CSV got 2 employees worked in same project but in different dates period. on Days Worked section will recieve text: 
'Employees have worked in different dates!'.

Can be loaded multiple files, incase we want to compare.Also if we want to remove there is a button Remove Table which removes current.

Thanks :)




