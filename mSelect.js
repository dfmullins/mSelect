/**
* mSelect developed by Damion Mullins
*/
(function($) {
    /*
    * Initialize
    */
    $.fn.mSelect = function(settingsObj) {
        var orignalSelect = $(this);
        settingsObj = (typeof settingsObj !== "undefined") ? settingsObj : {};
        if ("destroy" === settingsObj) {
            $.fn.destroy(orignalSelect); 
            return false;
        }
        var isMultiSelect = orignalSelect.attr('multiple');
        var placeHolder   = orignalSelect.find("option[value='']") ? orignalSelect.find("option[value='']").text() : orignalSelect.find("option[value='0']").text();
        var settingsObj   = $.fn.checkSettings(settingsObj, orignalSelect);
        var opt           = 0;
        var sel           = 1;
        $.fn.hideSelect(orignalSelect);
        $.fn.showMSelect(orignalSelect, isMultiSelect);
        $.fn.adjust(orignalSelect, settingsObj, placeHolder);     
        
        if (0 === settingsObj.readonly) {
            $("#_mSelect_" + orignalSelect.prop('id') + "_input").on('click', function(e) {
                $.fn.startedTyping(orignalSelect, settingsObj, e.target.id);
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_expContBtn").on('click', function(e) {
                $.fn.fullScreenMode(orignalSelect, settingsObj);
                $.fn.handleFocus(orignalSelect);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_input").on('keyup', function(e) {
               $.fn.searchValues(orignalSelect, e.target.id, settingsObj);
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_options_table td").not('._mSelect_optGroup').on('click', function(e) {
                $.fn.createTempListbox(orignalSelect);
                $.fn.optionChosen(orignalSelect, e.target.id, settingsObj, isMultiSelect);
                $.fn.handleFocus(orignalSelect);
                $.fn.onAfterChange(settingsObj);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_selected_table td").on('click', function(e) {
                $.fn.createTempListbox(orignalSelect);
                $.fn.selectionRemoved(orignalSelect, e.target.id, settingsObj, isMultiSelect);
                $.fn.handleFocus(orignalSelect);
                $.fn.onAfterChange(settingsObj);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_options_table td a").not('._mSelect_optGroup').on('click', function(e) {
                var id = $(this).closest('td').prop('id');
                $.fn.createTempListbox(orignalSelect);
                $.fn.optionChosen(orignalSelect, id, settingsObj, isMultiSelect);
                $.fn.handleFocus(orignalSelect);
                $.fn.onAfterChange(settingsObj);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_selected_table td a").on('click', function(e) {
                var id = $(this).closest('td').prop('id');
                $.fn.createTempListbox(orignalSelect);
                $.fn.selectionRemoved(orignalSelect, id, settingsObj, isMultiSelect);
                $.fn.handleFocus(orignalSelect);
                $.fn.onAfterChange(settingsObj);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_select").on('click', function(e) {
                if (typeof isMultiSelect === "string") {
                    $.fn.createTempListbox(orignalSelect);
                    $.fn.selectRemoveAll(orignalSelect, opt, settingsObj);
                    $.fn.handleFocus(orignalSelect);
                    $.fn.onAfterChange(settingsObj);
                    e.preventDefault();
                }
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_remove").on('click', function(e) {
                $.fn.createTempListbox(orignalSelect);
                $.fn.selectRemoveAll(orignalSelect, sel, settingsObj);
                $.fn.handleFocus(orignalSelect);
                $.fn.onAfterChange(settingsObj);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_sSortA, #_mSelect_" + orignalSelect.prop('id') + "_sSortD").on('click', function(e) {
                var sortOrder = $(e.target).data("sort");
                $.fn.createTempListbox(orignalSelect);
                $.fn.sortItems(orignalSelect, sel, settingsObj, sortOrder);
                $.fn.handleFocus(orignalSelect);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_oSortA, #_mSelect_" + orignalSelect.prop('id') + "_oSortD").on('click', function(e) {
                var sortOrder = $(e.target).data("sort");
                $.fn.createTempListbox(orignalSelect);
                $.fn.sortItems(orignalSelect, opt, settingsObj, sortOrder);
                $.fn.handleFocus(orignalSelect);
                e.preventDefault();
            });
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_sUndo, #_mSelect_" + orignalSelect.prop('id') + "_oUndo").on('click', function(e) {
                $.fn.undo(orignalSelect, settingsObj);
                $.fn.handleFocus(orignalSelect);
                e.preventDefault();
            });  
            
            $("#_mSelect_" + orignalSelect.prop('id') + "_input").keydown(function(elem) {
                $.fn.arrowUpDown(elem, orignalSelect.prop('id'));
            });  
            
            $(document).on('click touchstart', function(e) {
                if(!$(e.target).parents("._mSelect_container").is("._mSelect_container")) {
                    $.fn.prepareDone(settingsObj);
                }
            });
            
            $(document).on('keyup', function(elem){
                if(elem.key === "Escape") {
                    $.fn.prepareDone(settingsObj);
                }
            });
        } else {
            $.fn.readonlyMode(orignalSelect, settingsObj);
        }
        
        $.fn.removeDupOptGroups('_mSelect_optGroup_false');
        $.fn.removeDupOptGroups('_mSelect_optGroup_true');  
    };
    
    /**
    * Format for readonly
    * @param orignalSelect DOM obj
    * @param settingsObj obj
    */
    $.fn.readonlyMode = function(orignalSelect, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        $("#_mSelect_" + orignalSelectId + "_oCtrlCont, #_mSlect_" + orignalSelectId + "_input_container, #_mSelect_" + orignalSelectId + "_options_container").remove();
        $("#_mSelect_" + orignalSelectId + "_selected_container").css(
            {
                "top": 0//,
                //"height":0
            }
        );
        $("#_mSelect_" + orignalSelectId + "_selected_table_table").css(
            {
                "height":"auto",
                "max-height":"100px"
            }        
        );
        $("#_mSelect_" + orignalSelectId + "_container").css("min-width", settingsObj.readonlyMinWidth);
        $("#_mSelect_" + orignalSelectId + "_selected_table td").addClass("_mSelect_is_disabled");
        $("#_mSelect_" + orignalSelectId + "_selected_table td a").removeAttr("href");
    }
    
    /**
    * Remove mSelect
    * @param orignalSelect DOM obj
    */
    $.fn.destroy = function(orignalSelect) {
        orignalSelect.removeClass('_mSelect_hide_orignal_select');
        $("#_mSelect_" + orignalSelect.prop('id') + "_container").remove();
    }
    
    /**
    * Execute an event after changing a value
    * @param settingsObj obj
    */
    $.fn.onAfterChange = function(settingsObj) {
        if (settingsObj.hasOwnProperty("onAfterChange") 
            && settingsObj.onAfterChange !== undefined
        ) {           
            settingsObj.onAfterChange();          
        }
    }
    
    /**
    * Arrow down and up to focus
    * @param elem DOM obj
    * @param id int
    */
    $.fn.arrowUpDown = function(elem, id) {
        var obj = {
            38: function () {
                if (typeof $("#_mSelect_" + id + "_selected_table td a")[0] !== "undefined") {
                    $("#_mSelect_" + id + "_selected_table td a")[0].focus();
                }
            },
            40: function () {
                if (typeof $("#_mSelect_" + id + "_options_table td a")[0] !== "undefined") {
                    $("#_mSelect_" + id + "_options_table td a")[0].focus();
                }
            }
        };
        
        if (typeof obj[elem.which] === "function") {
            obj[elem.which]();
        } 
        
        return false;
    };
    
    /**
    * Get correct mSelect to close
    * settingObj obj
    */
    $.fn.prepareDone = function(settingsObj) {   
        $('._mSelect_options_container').each(function() {
            if ($(this).height() > 1) {
                var id = $(this).prop('id').split('_')[2];
                $.fn.done($('#' + id), settingsObj);
            }
        });
    };
    
    /**
    * Move focus to input
    * @param orignalSelect DOM object
    */
    $.fn.handleFocus = function(orignalSelect) {
        var orignalSelectId = orignalSelect.prop('id');
        if (1 !== $("#_mSelect_" + orignalSelectId + "_options_container").height()) {
            $("#_mSelect_" + orignalSelectId + "_input").focus();
        }
    };
    
    /**
    * Change mSelect to full screen
    * @param orignalSelectId integer
    */
    $.fn.fullScreenAttr = function(orignalSelectId) {
        var containerWidth       = $("#_mSelect_" + orignalSelectId + "_container").width();  
        $("#_mSelect_" + orignalSelectId + "_container").css(
            {
                "position": "absolute",
                "top": "25px",
                "background-color": "#fff",
                "z-index": "999999",
                "border": "solid 2px #999",
                "display": "table",
                "transform": "translateX(-50%)",
                "margin": "0 auto",
                "left": "50%",
                "transform": "translate(-50%, 0)"
            }
        );
        
        $("#_mSelect_" + orignalSelectId + "_input").css(
            {
                "width":containerWidth
            }
        );
        
        $("#_mSelect_" + orignalSelectId + "_options_container").css(
            {
                "position": "static",
                "background-color": "none",
                "border":"none",
            }
        );
        
        var selectContainerWidth = $("#_mSelect_" + orignalSelectId + "_selected_container").width();
        $("#_mSelect_" + orignalSelectId + "_selected_container, #_mSelect_" + orignalSelectId + "_options_container").css(
            {
                "height":"100%"
            }
        );
        
        $("#_mSelect_" + orignalSelectId + "_options_container").css(
            {
                "width":selectContainerWidth
            }
        );
        
        $("#_mSelect_" + orignalSelectId + "_selected_table_table, #_mSelect_" + orignalSelectId + "_options_table_table").css(
            {
                "height":"100%"
            }
        );  
        
        var newInputWidth = $("#_mSelect_" + orignalSelectId + "_input").width();
        $("#_mSelect_" + orignalSelectId + "_input").css(
            {
                "width":newInputWidth + 10
            }
        );
    };
    
    /**
    * Hide all surrounding containers that do not have selected items
    */
    $.fn.hideAll = function() {
        $("._mSelect_selected_table").each(function() {
            var selCount = $(this).find("tr").length; 
            if (0 === selCount) {
                $(this).closest("._mSelect_container").css(
                    {
                        "border": "none",
                        "border-radius": 0,
                        "padding": 0,
                    }
                );
            }
        }); 
        
        $("._mSelect_options_container").css(
            {
                "height":"1px",
                "opacity":0
            } 
        );
    };
    
    /**
    * Full screen mode toggle
    * @param orignalSelect DOM obj
    * @param settingsObj obj
    */
    $.fn.fullScreenMode = function(orignalSelect, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        $.fn.hideAll();
        if (0 === $("._mSelect_lightBoxOverlay").length) {
            $.fn.updateSelected(orignalSelect, settingsObj);
            $("#_mSelect_" + orignalSelectId + "_container").after("<div class='_mSelect_lightBoxOverlay'></div>");
            $.fn.renderOptions(orignalSelectId, settingsObj);
            $.fn.fullScreenAttr(orignalSelectId);
        } else {
            $("._mSelect_lightBoxOverlay").remove();
            settingsObj.fullScreen = 0;
            $.fn.updateSelected(orignalSelect, settingsObj);
        }
    }
    
    /**
    * Removes the duplicate option groups in order to show only one
    * @param identifier string
    */
    $.fn.removeDupOptGroups = function(identifier) {
        var eachGrp = {};
        $('.' + identifier).each(function() {
            var txt = $(this).text();
            if (eachGrp[txt]) {
                $(this).remove();
            } else {
                eachGrp[txt] = true;
            }
        });
    };
    
    /**
    * Undo last event
    * @param orignalSelect DOM object
    * @param settingsObj object
    */
    $.fn.undo = function(orignalSelect, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id'); 
        if ($('#mSelect_' + orignalSelectId + '_temp_select').length > 0) {
            orignalSelect.clone().attr('id', 'mSelect_' + orignalSelectId + '_temp_temp_select').insertAfter(orignalSelect);
            orignalSelect.remove();
            $('#mSelect_' + orignalSelectId + '_temp_select').clone().attr('id', orignalSelectId).insertBefore('#mSelect_' + orignalSelectId + '_temp_select');
            $('#mSelect_' + orignalSelectId + '_temp_select').remove();
            $('#mSelect_' + orignalSelectId + '_temp_temp_select').clone().attr('id', 'mSelect_' + orignalSelectId + '_temp_select').insertAfter(orignalSelectId);
            $('#mSelect_' + orignalSelectId + '_temp_temp_select').remove();
        }     
        $.fn.updateSelected(orignalSelect, settingsObj);
    };
    
    /**
    * Clone listbox for undo
    * @param orignalSelect DOM object
    */
    $.fn.createTempListbox = function(orignalSelect) {
        var orignalSelectId = orignalSelect.prop('id'); 
        if ($('#mSelect_' + orignalSelectId + '_temp_select').length > 0) {
            $('#mSelect_' + orignalSelectId + '_temp_select').remove();
        }
        orignalSelect.clone().attr('id', 'mSelect_' + orignalSelectId + '_temp_select').insertAfter(orignalSelect);
    };
    
    /**
    * Sort the options
    * @param orignalSelect DOM object
    * @param optionType object
    * @param sortOrder string
    */
    $.fn.sortByOption = function(orignalSelect, optionType, sortOrder) {
        if ("asc" === sortOrder) {
            orignalSelect.append(orignalSelect.find(optionType).not('optgroup > option').sort(function(b, a) {
                var aText = $(a).text().toLowerCase();
                var bText = $(b).text().toLowerCase();
                return (aText > bText) ? 1 : ((aText < bText) ? -1 : 0);
            })); 
        } else {
            orignalSelect.append(orignalSelect.find(optionType).not('optgroup > option').sort(function(a, b) {
                var aText = $(a).text().toLowerCase();
                var bText = $(b).text().toLowerCase();
                return (aText > bText) ? 1 : ((aText < bText) ? -1 : 0);
            })); 
        }
    };
    
    /**
    * Sort the options in the opt group
    * @param orignalSelect DOM object
    * @param optionType object
    * @param sortOrder string
    */
    $.fn.sortByOptGroup = function(orignalSelect, optionType, sortOrder) {
        orignalSelect.find('optgroup').each(function() {
            var optgroup = this;
            if ("asc" === sortOrder) {
                $(optionType, this).sort(function(b, a) {
                    return $(a).text().toLowerCase() > $(b).text().toLowerCase();
                }).appendTo(optgroup);
            } else {
                $(optionType, this).sort(function(a, b) {
                    return $(a).text().toLowerCase() > $(b).text().toLowerCase();
                }).appendTo(optgroup);
            }
        });   
    };
    
    /**
    * Sort the opt groups
    * @param orignalSelect DOM object
    * @param optionType object
    * @param sortOrder string
    */
    $.fn.sortOptGroup = function(orignalSelect, flag, sortOrder) {
        if ("asc" === sortOrder) {
            orignalSelect.append(orignalSelect.find('optgroup').sort(function(b, a) {
                if (flag === $(a).find('option').is(':selected')) {
                    var aText = a.label.toLowerCase();
                    var bText = b.label.toLowerCase();
                    return (aText > bText) ? 1 : ((aText < bText) ? -1 : 0);
                }
            })); 
        } else {
            orignalSelect.append(orignalSelect.find('optgroup').sort(function(a, b) {
                if (flag === $(a).find('option').is(':selected')) {
                    var aText = a.label.toLowerCase();
                    var bText = b.label.toLowerCase();
                    return (aText > bText) ? 1 : ((aText < bText) ? -1 : 0);
                }
            })); 
        }
    };
    
    /**
    * Sort was clicked
    * @param orignalSelect DOM object
    * @param type string
    * @param settingsObj object
    * @param sortOrder string
    */
    $.fn.sortItems = function(orignalSelect, type, settingsObj, sortOrder) {
         var optionType = "option:selected";
         var flag       = true;
         if (0 === type) {
            optionType = "option:not(:selected)";
            var flag   = false;
         }
         $.fn.sortByOption(orignalSelect, optionType, sortOrder);
         $.fn.sortByOptGroup(orignalSelect, optionType, sortOrder);
         $.fn.sortOptGroup(orignalSelect, flag, sortOrder);
         $.fn.updateSelected(orignalSelect, settingsObj);
    };
    
    /**
    * Remove or select all shown
    * @param orignalSelect DOM object
    * @param type string
    * @param settingsObj object
    */
    $.fn.selectRemoveAll = function(orignalSelect, type, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        if (1 === type) {
           $.fn.makeUnselected(orignalSelect, orignalSelectId);
        } else {
            $.fn.makeSelected(orignalSelect, orignalSelectId);
        }
        $.fn.updateSelected(orignalSelect, settingsObj);
    };
    
    /**
    * Select all shown
    * @param orignalSelect DOM object
    * @param orignalSelectId integer
    */
    $.fn.makeSelected = function(orignalSelect, orignalSelectId) {
        $("#_mSelect_" + orignalSelectId + "_options_table tr").each(function () {
            if ("none" !== $(this).css('display')) {
                var id = $(this).find('td').prop('id');
                if (typeof id !== "undefined") {
                    var value = id.split('value_')[1];
                    orignalSelect.find('option[value="' + value + '"]').attr("selected", "selected");
                }
            }
        });
    };
    
    /**
    * Remove all shown
    * @param orignalSelect DOM object
    * @param orignalSelectId integer
    */
    $.fn.makeUnselected = function(orignalSelect, orignalSelectId) {
        $("#_mSelect_" + orignalSelectId + "_selected_table tr").each(function () {
            if ("none" !== $(this).css('display')) {
                var id = $(this).find('td').prop('id');
                if (typeof id !== "undefined") {
                    var value = id.split('value_')[1];
                    orignalSelect.find('option[value="' + value + '"]').removeAttr("selected");
                }
            }
        });
    };
    
    /**
    * Remove selected
    * @param orignalSelect DOM object
    * @param id integer
    * @param settingsObj object
    * @param isMultiSelect string
    */
    $.fn.selectionRemoved = function(orignalSelect, id, settingsObj, isMultiSelect) {
        if (typeof isMultiSelect === "undefined") {
            $.fn.selectRemoveAll(orignalSelect, 1, settingsObj);
        } else {
            var numId = id.split('value_')[1];
            orignalSelect.find('option[value="' + numId + '"]').attr("selected", false);
        }
        $.fn.updateSelected(orignalSelect, settingsObj);
    };
    
    /**
    * Move chosen option into selected
    * @param orignalSelect DOM object
    * @param id integer
    * @param settingsObj object
    * @param isMultiSelect string
    */
    $.fn.optionChosen = function(orignalSelect, id, settingsObj, isMultiSelect) {
        if (typeof isMultiSelect === "undefined") {
            $.fn.selectRemoveAll(orignalSelect, 1, settingsObj);
        }
        var numId    = id.split('value_')[1];
        var selected = orignalSelect.find('option:selected').map(function(){ return this.value; }).get();
        selected.push(numId);
        $.each(selected, function (index, value) {
            orignalSelect.find('option[value="' + value + '"]').attr("selected", "selected");
        });
        $.fn.updateSelected(orignalSelect, settingsObj);
    };
    
    /**
    * Adjust sizing of unselected container
    * @param optCount integer
    * @param settingsObj object
    * @param orignalSelectId integer
    */
    $.fn.adjustUnselected = function(optCount, settingsObj, orignalSelectId) {
        if (parseInt(optCount) > 0 && "none" !== $("#_mSelect_" + orignalSelectId + "_options_container table").css('display')) {
            var adjustedHeight          = parseInt(settingsObj.dropDownHeight) - 40;
            var selectedTableHeight     = $("#_mSelect_" + orignalSelectId + "_options_table").height();
            var selectedContainerHeight = $("#_mSelect_" + orignalSelectId + "_options_container").height();  
            var tbltbl                  = $("#_mSelect_" + orignalSelectId + "_options_table_table").height();
            var tbl                     = $("#_mSelect_" + orignalSelectId + "_options_table").height();
          
            if (parseInt(tbl) <= parseInt(tbltbl)) {
                $("#_mSelect_" + orignalSelectId + "_options_container").css(
                    {
                        "height":tbl + 32
                    }
                );
            }
            
            if (parseInt(settingsObj.dropDownHeight) <= parseInt(selectedContainerHeight)) {
                selectedTableHeight = adjustedHeight;
            }
            
            
            $("#_mSelect_" + orignalSelectId + "_options_table_table").css(
                {
                    "height":selectedTableHeight
                }
            );
            $("#_mSelect_" + orignalSelectId + "_options_container table").css(
                {
                    "display":"table"
                }
            );
        }
    };
    
    /**
    * Adjust sizing of selected container
    * @param selCount integer
    * @param settingsObj object
    * @param orignalSelectId integer
    */
    $.fn.adjustSelected = function(selCount, settingsObj, orignalSelectId) {
        if (parseInt(selCount) > 0 && "none" !== $("#_mSelect_" + orignalSelectId + "_selected_container table").css('display')) {
            var adjustedHeight          = parseInt(settingsObj.popUpHeight) - 35;
            var selectedTableHeight     = $("#_mSelect_" + orignalSelectId + "_selected_table").height();
            var selectedContainerHeight = $("#_mSelect_" + orignalSelectId + "_selected_container").height();
            
            if (parseInt(settingsObj.popUpHeight) < parseInt(selectedContainerHeight)) {
                $("#_mSelect_" + orignalSelectId + "_selected_container").css(
                    {
                        "height":settingsObj.popUpHeight
                    }
                );
                selectedTableHeight = adjustedHeight;
            }
            
            $("#_mSelect_" + orignalSelectId + "_selected_table_table").css(
                {
                    "height":selectedTableHeight
                }
            );
            $("#_mSelect_" + orignalSelectId + "_selected_container table").css(
                {
                    "display":"table"
                }
            );
        }
    };
    
    /**
    * Determine text
    * @param settingsObj object
    * @param placeHolder string
    */
    $.fn.placeHolderText = function(settingsObj, placeHolder) {
        var placeHolderText = "Choose... ";
        if (typeof placeHolder !== "undefined" && "" !== placeHolder) {
             placeHolderText = placeHolder;
        } else if (typeof settingsObj.placeholder !== "undefined" && "" !== settingsObj.placeholder) {
            placeHolderText = settingsObj.placeholder;
        }
        
        return placeHolderText;
    };
    
    /**
    * Adjust sizing of mSelect
    * @param orignalSelect DOM object
    * @param settingsObj object
    * @param placeHolder string
    */
    $.fn.adjust = function(orignalSelect, settingsObj, placeHolder) {
        var orignalSelectId = orignalSelect.prop('id');
        var containerWidth  = $("#_mSelect_" + orignalSelectId + "_container").width(); 
        var optCount        = $("#_mSelect_" + orignalSelectId + "_options_table tr").length;
        var selCount        = $("#_mSelect_" + orignalSelectId + "_selected_table tr").length;
        var placeHolderText = $.fn.placeHolderText(settingsObj, placeHolder);
        
        $("#_mSelect_" + orignalSelectId + "_input").css(
            {
                "width":containerWidth
            }
        );
        
        if (1 === settingsObj.stayOpen) {
             $.fn.renderOptions(orignalSelect.prop('id'), settingsObj);
        }
        
        $.fn.adjustSelected(selCount, settingsObj, orignalSelectId);
        $.fn.adjustUnselected(optCount, settingsObj, orignalSelectId);
        $.fn.reformatOptGroups('_mSelect_optGroup_false');
        $.fn.reformatOptGroups('_mSelect_optGroup_true');
        $.fn.noneSelectedStyling(orignalSelect);
        
        if (1 === settingsObj.fullScreen) {
            $.fn.fullScreenAttr(orignalSelect.prop('id'));
        }
        
        $("#_mSelect_" + orignalSelectId + "_input").attr("placeholder", placeHolderText);
        $.fn.browserBasedAdjustments();
        
    };
    
    /**
    * Slight adjustments per browser
    */
    $.fn.browserBasedAdjustments = function() {
        var isChromium = window.chrome;
        if(isChromium){
            $("._mSelect_options_container").css("left", "-1px");
        }
    };
    
    /**
    * Remove duplicate opt groups
    * @param tableRow string
    */
    $.fn.reformatOptGroups = function(tableRow) {
        var optGrp  = {};
        $('.' + tableRow).each(function() {
            var text = $(this).text();
            if (optGrp[text]) {
                $(this).remove();
            } else {
                optGrp[text] = true;
            }
        });
    }
    
    /**
    * Click outside of mSelect
    * @param orignalSelect DOM object
    * @param settingsObj object
    */
    $.fn.done = function(orignalSelect, settingsObj) {
        var orignalSelectId    = orignalSelect.prop('id');
        settingsObj.fullScreen = 0;
        var optCount           = $("#_mSelect_" + orignalSelectId + "_options_table tr").length;
        var selCount           = $("#_mSelect_" + orignalSelectId + "_selected_table tr").length; 
        $("._mSelect_lightBoxOverlay").remove();
        $.fn.updateSelected(orignalSelect, settingsObj);      
        $("#_mSelect_" + orignalSelectId + "_options_container").css(
            {
                "height":"1px",
                "opacity":0
            }
        );
        $("#_mSelect_" + orignalSelectId + "_options_container table").css(
            {
                "display":"none"
            }
        );
        $.fn.hideSelect(orignalSelect);
        $.fn.hideMselectContWithCount(orignalSelectId, selCount);
    };
    
    /**
    * Hide the surrounding container
    * @param orignalSelectId integer
    * @param selCount integer
    */
    $.fn.hideMselectContWithCount = function(orignalSelectId, selCount) {
        if (0 === parseInt(selCount)) {
            $("#_mSelect_" + orignalSelectId + "_container").css(
                {
                    "border": "none",
                    "border-radius": 0,
                    "padding": 0,
                }
            );
        }
    };
    
    /**
    * Show the surrounding container
    * @param orignalSelectId integer
    * @param selCount integer
    */
    $.fn.showMselectCont = function(orignalSelectId) {
        var border = "solid 1px #999";
        if ($("._mSelect_lightBoxOverlay").length > 0) {
            border = "solid 2px #999"; 
        }
        $("#_mSelect_" + orignalSelectId + "_container").css(
            {
                "border": border,
                "border-radius": "5px",
                "display": "table",
                "padding": "5px",
            }
        );
    };
    
    /**
    * Hide the surrounding container
    * @param orignalSelectId integer
    * @param selCount integer
    */
    $.fn.hideMselectCont = function(orignalSelectId) {
        if ($("#_mSelect_" + orignalSelectId + "_options_container").height() <= 1 && 
            $("#_mSelect_" + orignalSelectId + "_selected_container").height() <= 1) {
            var selCount = $("#_mSelect_" + orignalSelectId + "_selected_table tr").length;
            if (0 === parseInt(selCount)) { 
                $("#_mSelect_" + orignalSelectId + "_container").css({"border": "none"});
            }
        }
    }; 
    
    /**
    * Restores the select all and remove all text
    * @param orignalSelectId integer
    * @param selectRemove string
    */
    $.fn.restoreCounts = function(orignalSelectId, selectRemove) {
        var strArr     = $("#_mSelect_" + orignalSelectId + "_" + selectRemove).text().split("/");
        var totalCount = strArr[1].split(")");
        $("#_mSelect_" + orignalSelectId + "_" + selectRemove).html("Select All (" + totalCount[0] + "/" + totalCount[0] + ")");
    };
    
    /**
    * Updates the select all and remove all text
    * @param orignalSelectId integer
    * @param count integer
    * @param selectRemove string
    */
    $.fn.changeCounts = function(orignalSelectId, count, selectRemove) {
        var strArr   = $("#_mSelect_" + orignalSelectId + "_" + selectRemove).text().split("/");
        var newCount = "Select All (" + count;
        if ("remove" === selectRemove) {
            newCount = "Remove All (" + count;
        }
        $("#_mSelect_" + orignalSelectId + "_" + selectRemove).html(newCount + "/" + strArr[1]);
    };
    
    /**
    * Search begins
    * @param orignalSelect DOM object
    * @param inputId integer
    */
    $.fn.searchValues = function(orignalSelect, inputId, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        $("#_mSelect_" + orignalSelectId + "_options_table tr").show();
        $("#_mSelect_" + orignalSelectId + "_selected_table tr").show();
        if ("" !== $('#' + inputId).val()) {
            $.fn.runSearch(orignalSelectId, inputId, 'options', 'select');
            $.fn.runSearch(orignalSelectId, inputId, 'selected', 'remove');
            $('#_mSelect_' + orignalSelectId + '_optionIndent').removeClass('_mSelect_optionIndent');
            $('#_mSelect_' + orignalSelectId + '_optGroup').remove();
        } else {
            //$.fn.updateSelected(orignalSelect, settingsObj)
        }
    }
    
    /**
    * Check to search or show all
    * @param orignalSelectId integer
    * @param inputId integer
    * @param table string
    * @param selectRemove string
    */
    $.fn.runSearch = function(orignalSelectId, inputId, table, selectRemove) {     
        var inputValue = $('#' + inputId).val();
        if ("" !== inputValue) {
            $.fn.searchText(orignalSelectId, inputValue, table, selectRemove);
        } else {
            $("#_mSelect_" + orignalSelectId + "_" + table + "_table tr").show();
            $.fn.restoreCounts(orignalSelectId, selectRemove);
        }    
    }
    
    /**
    * Find values and highlight matches
    * @param orignalSelectId integer
    * @param inputValue string
    * @param table string
    * @param selectRemove string
    */
    $.fn.searchText = function(orignalSelectId, inputValue, table, selectRemove) {
        var caseInsensitive = inputValue.toLowerCase();
        var obj             = $("#_mSelect_" + orignalSelectId + "_" + table + "_table tr");
        var count           = 0;
        $.each(obj, function (index, value) {
            var text = $(value).find('td a').text();
            if (typeof text !== "undefined") {
                if (text.toLowerCase().indexOf(caseInsensitive) < 0) {
                    $(value).find('td').closest('tr').hide();
                } else {
                    count++;
                    var caseInsensitiveText = text.toLowerCase();
                    text                    = caseInsensitiveText.replace(caseInsensitive, "<span class='_mSelect_text_highlight'>" + caseInsensitive + "</span>");
                    $(value).find('td a').html(text);
                } 
            }
        });       
        $.fn.changeCounts(orignalSelectId, count, selectRemove);
    };
    
    /**
    * Typing begins
    * @param orignalSelect DOM object
    * @param settingsObj object
    */
    $.fn.startedTyping = function(orignalSelect, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        $.fn.renderOptions(orignalSelectId, settingsObj);
    };
    
    /**
    * Render options and menu
    * @param optCount integer
    * @param orignalSelectId integer
    * @param settingsObj object
    */
    $.fn.renderUnselected = function(optCount, orignalSelectId, settingsObj) {
        if (parseInt(optCount) > 0 && "none" === $("#_mSelect_" + orignalSelectId + "_options_container table").css('display')) {
            var adjustedHeight = parseInt(settingsObj.dropDownHeight) - 40;
            var containerWidth = $("#_mSelect_" + orignalSelectId + "_container").width(); 
            var contHeight     = settingsObj.dropDownHeight;
           
            $("#_mSelect_" + orignalSelectId + "_options_container table").css(
                {
                    "display":"table"
                }
            );
            $("#_mSelect_" + orignalSelectId + "_options_table_table").css(
                {
                    "height":adjustedHeight
                }
            );
            
            var tbltbl = $("#_mSelect_" + orignalSelectId + "_options_table_table").height();
            var tbl = $("#_mSelect_" + orignalSelectId + "_options_table").height();
            
            if (parseInt(tbl) <= parseInt(tbltbl)) {
                contHeight = tbl + 32;
            }
            
            $("#_mSelect_" + orignalSelectId + "_options_container").css(
                {
                    "height":contHeight,
                    "width":containerWidth,
                    "opacity":1
                }
            );
        }
    }
    
    /**
    * Render options and menu
    * @param selCount integer
    * @param orignalSelectId integer
    * @param settingsObj object
    */
    $.fn.renderSelected = function(selCount, orignalSelectId, settingsObj) {
        if (parseInt(selCount) > 0 && "none" === $("#_mSelect_" + orignalSelectId + "_selected_container table").css('display')) {
            var adjustedHeight  = parseInt(settingsObj.popUpHeight) - 35;
            var containerWidth = $("#_mSelect_" + orignalSelectId + "_container").width(); 
           
            $("#_mSelect_" + orignalSelectId + "_selected_container").css(
                {
                    "height":settingsObj.popUpHeight
                }
            );
            $("#_mSelect_" + orignalSelectId + "_selected_table_table").css(
                {
                    "height":adjustedHeight
                }
            );
            $("#_mSelect_" + orignalSelectId + "_selected_container table").css(
                {
                    "display":"table"
                }
            );
        }
    }
    
    /**
    * Render options and menu
    * @param orignalSelectId integer
    * @param settingsObj object
    */
    $.fn.renderOptions = function(orignalSelectId, settingsObj) {
        var optCount = $("#_mSelect_" + orignalSelectId + "_options_table tr").length;
        var selCount = $("#_mSelect_" + orignalSelectId + "_selected_table tr").length;
        $.fn.showMselectCont(orignalSelectId);
        $.fn.renderUnselected(optCount, orignalSelectId, settingsObj);
        $.fn.renderSelected(selCount, orignalSelectId, settingsObj);
    };
    
    /**
    * Check configurations
    * @param settingsObj obj
    * @param orignalSelect DOM object
    */
    $.fn.checkSettings = function(settingsObj, orignalSelect) {
        var defaultSettings = {
            "dropDownHeight":"200px",
            "popUpHeight":"200px",
            "stayOpen":0,
            "readonly":0,
            "readonlyMinWidth":200
        };
        
        $.each(settingsObj, function(index, value) {
            defaultSettings[index] = value;
        });
        
        if (true === orignalSelect.prop("disabled")) {
            defaultSettings.readonly = 1;
        }
        
        return defaultSettings;
    };
    
    /**
    * Prepare original listbox
    * @param orignalSelect DOM object
    */
    $.fn.hideSelect = function(orignalSelect) {
        orignalSelect.addClass('_mSelect_hide_orignal_select');
    };
    
    /**
    * Render mSelect listbox
    * @param orignalSelect DOM object
    * @param isMultiSelect string
    */
    $.fn.showMSelect = function(orignalSelect, isMultiSelect) {
        if (0 !== $("#_mSelect_" + orignalSelect.prop('id') + "_container").length) {
            $("#_mSelect_" + orignalSelect.prop('id') + "_container").remove();
        }
        orignalSelect.after(function() {
            return $.fn.buildMSelect(orignalSelect, isMultiSelect);
        });
    };
    
    /**
    * Destroy, then rebuild
    * @param orignalSelect DOM object
    * @param settingsObj object
    */
    $.fn.updateSelected = function(orignalSelect, settingsObj) {
        var orignalSelectId = orignalSelect.prop('id');
        $("#_mSelect_" + orignalSelect.prop('id') + "_container").remove();
        settingsObj.stayOpen = 1;
        if ($("._mSelect_lightBoxOverlay").length > 0) {
            settingsObj.fullScreen = 1;
        }
        $("#" + orignalSelectId).mSelect(settingsObj);
    };
    
    /**
    * Create mSelect listbox
    * @param orignalSelect DOM object
    * @param isMultiSelect string
    */
    $.fn.buildMSelect = function(orignalSelect, isMultiSelect) {
        var orignalSelectId = orignalSelect.prop('id');
        var mSelectObj      = {
            "cont":"id='_mSelect_" + orignalSelectId + "_container' class='_mSelect_container'",
            "sCont":"id='_mSelect_" + orignalSelectId + "_selected_container' class='_mSelect_selected_container'",
            "sCtrl":"id='_mSelect_" + orignalSelectId + "_selected_controls' class='_mSelect_selected_controls'",
            "sTbl":"id='_mSelect_" + orignalSelectId + "_selected_table' class='_mSelect_selected_table'",
            "sTblTbl":"id='_mSelect_" + orignalSelectId + "_selected_table_table' class='_mSelect_selected_table_table'",
            "input":"type='text' id='_mSelect_" + orignalSelectId + "_input' class='_mSelect_input'  autocomplete='off'",
            "inputCont":"id='_mSlect_" + orignalSelectId + "_input_container' class='_mSlect_input_container'",
            "oCont":"id='_mSelect_" + orignalSelectId + "_options_container' class='_mSelect_options_container'",
            "oCtrl":"id='_mSelect_" + orignalSelectId + "_options_controls' class='_mSelect_options_controls'",
            "oTbl":"id='_mSelect_" + orignalSelectId + "_options_table' class='_mSelect_options_table'",
            "oTblTbl":"id='_mSelect_" + orignalSelectId + "_options_table_table' class='_mSelect_options_table_table'",
            "oOpt":"_mSelect_" + orignalSelectId + "_option_value_",
            "remove":"id='_mSelect_" + orignalSelectId + "_remove' href='javascript:void(0)' aria-label='Remove all shown'",
            "select":"id='_mSelect_" + orignalSelectId + "_select' href='javascript:void(0)' aria-label='Select all shown'",
            "sSortA":"id='_mSelect_" + orignalSelectId + "_sSortA' data-sort='asc' title='Sort DESC' class='_mSelect_sort _mSelect_icons' href='javascript:void(0)' aria-label='Sort ascending'",
            "oSortA":"id='_mSelect_" + orignalSelectId + "_oSortA' data-sort='asc' title='Sort DESC' class='_mSelect_sort _mSelect_icons' href='javascript:void(0)' aria-label='Sort ascending'",
            "sSortD":"id='_mSelect_" + orignalSelectId + "_sSortD' data-sort='desc' title='Sort ASC' class='_mSelect_sort _mSelect_icons' href='javascript:void(0)' aria-label='Sort descending'",
            "oSortD":"id='_mSelect_" + orignalSelectId + "_oSortD' data-sort='desc' title='Sort ASC' class='_mSelect_sort _mSelect_icons' href='javascript:void(0)' aria-label='Sort descending'",
            "sUndo":"id='_mSelect_" + orignalSelectId + "_sUndo' class='_mSelect_sort _mSelect_icons'  href='javascript:void(0)' aria-label='Undo last'",
            "oUndo":"id='_mSelect_" + orignalSelectId + "_oUndo' class='_mSelect_sort _mSelect_icons'  href='javascript:void(0)' aria-label='Undo last'",
            "oCtrlCont":"id='_mSelect_" + orignalSelectId + "_oCtrlCont' class='_mSelect_sort _mSelect_oCtrlCont'",
            "sCtrlCont":"id='_mSelect_" + orignalSelectId + "_sCtrlCont' class='_mSelect_sort _mSelect_sCtrlCont'",
            "expContBtnCont":"id='_mSelect_" + orignalSelectId + "_expContBtnCont' class='_mSelect_expContBtn'",
            "expContBtn":"id='_mSelect_" + orignalSelectId + "_expContBtn' href='javascript:void(0)' aria-label='Full screen on/off mode'"
        };
      
        var dataObj   = $.fn.getData(orignalSelect);
        var opt       = $.fn.createOptions(orignalSelectId, false, dataObj);
        var sel       = $.fn.createOptions(orignalSelectId, true, dataObj);
        var selectAll = "<td class='_mSelect_control_td'><a " + mSelectObj.select + ">Select all (" + opt.count + "/" + opt.total + ")</a></td>";
        if (typeof isMultiSelect === "undefined") {
            selectAll = "<td class='_mSelect_no_selectAllCtrl'></td>";
        }
        
        return "<div " + mSelectObj.cont + ">" +
                    "<div " + mSelectObj.sCont + ">" +
                        "<div " + mSelectObj.oCtrlCont + ">" +
                            "<table " + mSelectObj.sCtrl + ">" +
                                "<tr>" +
                                    "<td class='_mSelect_section_label'>Selected:</td>" +
                                    "<td class='_mSelect_control_td'>" +
                                        "<a " + mSelectObj.remove + ">Remove all (" + sel.count + "/" + sel.total + ")</a>" +
                                    "</td>" +
                                    "<td class='_mSelect_control_td'>" +
                                        "<a " + mSelectObj.sSortA + ">&#9650;</a>" +
                                        "<a " + mSelectObj.sSortD + ">&#9660;</a>" +
                                    "</td>" +
                                    "<td class='_mSelect_control_td'>" +
                                        "<a " + mSelectObj.sUndo + ">&#8635;</a>" +
                                    "</td>" +
                                "</tr>" +
                            "</table>" +
                        "</div>" +
                        "<div>" +
                            "<table>" +
                                "<tr>" +
                                    "<td>" +
                                        "<div " + mSelectObj.sTblTbl + ">" +
                                             "<table " + mSelectObj.sTbl + ">" +
                                                sel.string +
                                            "</table>" +
                                        "</div>" +
                                    "</td>" +
                                "</tr>" +
                           "</table>" +
                        "</div>" +
                    "</div>" +  
                    "<div " + mSelectObj.inputCont + ">" +     
                    "<input " + mSelectObj.input + "/><span " + mSelectObj.expContBtnCont + "><a " + mSelectObj.expContBtn + ">&#8982;</a></span>" +
                    "</div>" +
                    "<div " + mSelectObj.oCont + ">" +
                        "<div " + mSelectObj.sCtrlCont + ">" +
                            "<table " + mSelectObj.oCtrl + ">" +
                                "<tr>" +
                                    "<td class='_mSelect_section_label'>Choices:</td>" +
                                    selectAll +
                                    "<td class='_mSelect_control_td'>" +
                                        "<a " + mSelectObj.oSortA + ">&#9650;</a>" +
                                        "<a " + mSelectObj.oSortD + ">&#9660;</a>" +
                                    "</td>" +
                                    "<td class='_mSelect_control_td'>" +
                                        "<a " + mSelectObj.oUndo + ">&#8635;</a>" +
                                    "</td>" +
                                "</tr>" +
                            "</table>" +           
                        "</div>" +
                        "<div>" +
                            "<table>" +
                                "<tr>" +
                                    "<td>" +
                                        "<div " + mSelectObj.oTblTbl + ">" +
                                            "<table " + mSelectObj.oTbl + ">" +
                                                opt.string +
                                            "</table>" +
                                        "</div>" +
                                    "</td>" +
                                "</tr>" +
                           "</table>" +
                        "</div>" +
                    "</div>" +
               "</div>";
    };
    
    /**
    * Get data from original listbox
    * @param orignalSelect DOM object
    */
    $.fn.getData = function(orignalSelect) {
        var obj = {};
        orignalSelect.find('option, optgroup').each(function() {
            if (typeof this.value === "undefined" || "" === this.value) {
                var optGroupLabel = $(this).prop('label');
                obj = $.fn.processOptGroups($(this), optGroupLabel, obj);
            } else {
                if (jQuery.isEmptyObject(obj[this.text + "_" + this.value]) && 0 !== parseInt(this.value) && "" !== this.value) {
                    obj[this.text + "_" + this.value] = {
                        "id": this.value,
                        "text": this.text,
                        "isSelected": $(this).is(':selected'),
                        "optGroup": '',
                        "optGroupCount": '',
                        "isDisabled": $(this).is(':disabled')
                    };
                }
            }           
        });
        
        return obj;
    }; 
    
    /**
    * @param inOptGroupObj object
    * @param optGroupLabel string
    * @param obj object
    */
    $.fn.processOptGroups = function(inOptGroupObj, optGroupLabel, obj) {
         var count = 1;
         inOptGroupObj.find('option').each(function() {
            obj[this.text + "_" + this.value] = {
                    "id": this.value,
                    "text": this.text,
                    "isSelected": $(this).is(':selected'),
                    "optGroup": optGroupLabel,
                    "optGroupCount": count
            };
            
            count++;
         });
         
         return obj;
    },
    
    
    /**
    * Create each option row
    * @param orignalSelectId integer
    * @param type boolean
    * @param dataObj object
    */
    $.fn.createOptions = function(orignalSelectId, type, dataObj) {
        var str                = '';
        var count              = 0;
        var total              = 0;
        var optGroupCleanUpObj = {};
        $.each(dataObj, function (index, value) {
            if (type === value.isSelected) {
                var indentOption = '';
                if ("" !== value.optGroup) {
                    indentOption = 'id="_mSelect_' + orignalSelectId + '_optionIndent" class="_mSelect_optionIndent"';                   
                    str += "<tr class='_mSelect_optGroup_" + value.optGroup + " _mSelect_optGroup_" + type + "'><td id='_mSelect_" + orignalSelectId + "_optGroup' class='_mSelect_optGroup'>" + value.optGroup + "</td></tr>";                    
                }
                if (true === value.isDisabled) {
                    str += '<tr><td class="_mSelect_is_disabled"><a ' + indentOption + '>' + value.text + '</td></tr>';
                } else {
                    str += '<tr><td id="_mSelect_' + orignalSelectId + '_option_value_' + value.id + '"><a href="" ' + indentOption + '>' + value.text + '</a></td></tr>';
                }
                count++;
                total++;
            }
        });
        
        return {"string":str, "count":count, "total":total};
    };
    
    /**
    * Check styling for when none are selected
    * @param orignalSelect DOM object
    */
    $.fn.noneSelectedStyling = function(orignalSelect) {
        var orignalSelectId = orignalSelect.prop('id');
        var optCount        = $("#_mSelect_" + orignalSelectId + "_options_table tr").length;
        var selCount        = $("#_mSelect_" + orignalSelectId + "_selected_table tr").length;
        
        if (0 === parseInt(optCount)) {
            $.fn.nsStyling(orignalSelectId, 'options');
        }
        if (0 === parseInt(selCount)) {
            $.fn.nsStyling(orignalSelectId, 'selected');
            $.fn.hideMselectCont(orignalSelectId);
        }
    };
    
    /**
    * Styling for when none are selected
    * @param orignalSelectId integer
    * @param type string
    */
    $.fn.nsStyling = function(orignalSelectId, type) {
        $("#_mSelect_" + orignalSelectId + "_" + type + "_container").css(
            {
                "height":0
            }
        );
        $("#_mSelect_" + orignalSelectId + "_" + type + "_controls").hide();
    };
 
}(jQuery));
 
