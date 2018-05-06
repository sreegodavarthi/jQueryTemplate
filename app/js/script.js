$(function () {

    var aptData,
        displayData,
        sortBy,
        sortDirection;

    sortBy = "aptDate";
    sortDirection = "desc";

    function removeApt(aptId) {
        var whichApt = _.find(aptData, function (item) {
            return item.id == aptId;
        });
        aptData = _.without(aptData, whichApt);
        displayData =  _.without(displayData, whichApt);
    }

    function listAppointments(info) {

        if (sortDirection == "asc") {
            info = _.sortBy(info, sortBy)
        } else {
            info = _
                .sortBy(info, sortBy)
                .reverse();
        }

        $.addTemplateFormatter("formatDate", function(value){
            return $.format.date(new Date(value), "MM/dd hh:mm p");
        }); //dateFormatter

        $("#petList").loadTemplate("appointment-list.html", info, {
            complete: function () {
                $(".pet-delete")
                    .on("click", function () {
                        $(this)
                            .parents(".pet-item")
                            .hide(300, function () {
                                var whichItem = $(this).attr("id");
                                removeApt(whichItem);
                                $(this).remove();
                            });
                    });//delete apt

                    $("[contenteditable]").on("blur", function(){
                        var whichID, fieldName, fieldData;
                        whichID = Number($(this).parents(".pet-item").attr("id"));
                        fieldName = $(this).data("field");
                        fieldData = $(this).text();
                        aptData[whichID][fieldName] = fieldData;
                    })//contentEditable
            }

        });
    }

    $
        .ajax({url: ("js/data.json")})
        .done(function (data) {
            aptData = displayData = data;
            listAppointments(displayData);
        });

     //Events   

    $(".apt-addheading").on("click", function () {
        $(".card-body").toggle(300);
    });

    //sort    
    $(".sort-menu .dropdown-item").on("click", function () {
        var sortDropdown = $(this).attr("id");

        switch (sortDropdown) {
            case "sort-petName":
                $(".sort-by").removeClass("active");
                sortBy = "petName";
                break;
            case "sort-ownerName":
                $(".sort-by").removeClass("active");
                sortBy = "ownerName";
                break;
            case "sort-aptDate":
                $(".sort-by").removeClass("active");
                sortBy = "aptDate";
                break;
            case "sort-asc":
                $(".sort-dir").removeClass("active");
                sortDirection = "asc";
                break;
            case "sort-desc":
                $(".sort-dir").removeClass("active");
                sortDirection = "desc";
                break;
        }

        $(this).addClass("active");
        listAppointments(displayData);
    });

    //search

    $("#SearchApts").keyup(function(){
        var searchText = $(this).val();

        displayData = _.filter(aptData, function(item){
            return (
                item.petName.toLowerCase().match(searchText.toLowerCase()) ||
                item.ownerName.toLowerCase().match(searchText.toLowerCase()) ||
                item.aptNotes.toLowerCase().match(searchText.toLowerCase())
            )
        });
        listAppointments(displayData);
    });

    $("#aptForm").submit(function(e){
        var newItem = {};
        e.preventDefault();

        newItem.petName = $("#petName").val();
        newItem.ownerName = $("#ownerName").val();
        newItem.aptDate = $("#aptDate").val();
        newItem.aptNotes = $("#aptNotes").val();

        aptData.push(newItem);
        listAppointments(displayData);
        $("#aptForm")[0].reset();
        $(".card-body").hide(300);
    });

});
