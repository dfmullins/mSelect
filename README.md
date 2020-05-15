# mSelect

Demo mSelect here: http://www.damionmullins.com/projects/mselect

mSelect is a JQuery plugin designed to enhance the html select tag (listbox). Just inject mSelect into your select listbox $("#yourListbox").mSelect(); and then enjoy the following features:

1. Ascending and descending sort 
2. Undo last change 
3. Select and remove all 
4. Fullscreen mode (toggle) 
5. Option group compatible 
6. Single and multiselect compatible 
7. Disabled select options compatible 
8. Search as you type

Instructions:

1. Download mSelect.js and mSelect.css
2. Add both files and JQuery (3.3.1 tested) to your website as you would any other JS and CSS files
3. Inject mSelect into your listboxes by adding $("#yourSelectId").mSelect();
4. Post to a server as normal. mSelect simply manipulates the original select listbox where the actual values are located.

There are 3 styling configurations you can make to mSelect:
```
$("#yourSelectId").mSelect(
    {
        "dropDownHeight": an integer, // defualt is 200 (in pixles)
        "popUpHeight": an integer, // defualt is 200 (in pixles)
        "placeholder": "Any text" // defualt will use the option with no value or 0 value
    }
);
```
To remove (destroy) mSelect and restore the original select listbox, just add "destroy" as the parameter:
```
$("#yourSelectId").mSelect('destroy');
```
You do not have to destroy and rebuild mSelect whenever changes are made to your original select listbox. Instead, just re-inject mSelect to the select listbox at anytime:
```
// Example of modifying your original select listbox, and then updating mSelect
$("#yourSelectListbox")
    .append("<option value='newOption'>New Option</option>")
    .mSelect();
```
To execute an event after a change was made in the mSelect listbox, add the following configuration:
```
 $("#yourSelectId").mSelect(
    {
        onAfterChange: function() {
            // add your function here
        }
    }
);
```
To make mSelect readonly (disabled):
```
$("#yourSelectId").mSelect(
    {
        "readonly":1, // must be 1 in order for it to be readonly
        "readonlyMinWidth": an integer // default is 300 pixels
    }
);
```

