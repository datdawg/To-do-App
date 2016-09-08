$(document).ready(function () {

    $("#frm-create-category").validate();

    function validateThis() {
        bGo = false;
        $("#frm-create-category").validate({            
            invalidHandler: function (event, validator) {
                // 'this' refers to the form
                var errors = validator.numberOfInvalids();
                if (errors) {
                    bGo = false;
                } else {
                    bGo = true;
                }
            }
        });
        if (!bGo) {
            alert('not valid');
            return false;
        } else {
            alert('good to go');
        }
    }

    LoadCategoriesAndTasks();

    $(document)
    //remove task
    .delegate('.removeTask', 'click', function () {
        oThis = $(this);
        var result = confirm('Vil du slette denne blok?');
        if (result == true) {
            var id = $(this).closest('.task').data('id');
            $.ajax({
                url: "api/tasks/" + id,
                method: "DELETE"
            }).done(function () {
                oThis.closest('.task-container').remove();
                $.notify('Opgave slettet', 'info');
            });
        }
    })
    //complete task
    .delegate('.finishTask', 'click', function () {
        var result = confirm('Opgave fuldført?');
        if (result == true) {
            oThisTask = $(this).closest('.task');
            oThis = $(this);
            var id = $(this).closest('.task').data('id');
            sText = $('.task[data-id="' + id + '"] .title').text();

            $.ajax({
                url: "api/tasks/" + id,
                method: "PUT"
            }).done(function () {
                oThisTask.addClass('finished');
                $.notify('Opgaven "' + sText + '" fuldført!', 'success');
            });
        }
    })
    //delete category and the tasks it contains
    .delegate('.deleteCategory', 'click', function () {
        var result = confirm('Vil du slette denne kategori og de evt. tilhørende opgaver?');
        if (result == true) {
            var id = $(this).data('catid');

            $.ajax({
                url: "api/categories/" + id,
                method: "DELETE"
            }).done(function () {
                LoadCategoriesAndTasks();
                $.notify("Kategori slettet", 'info');
            });
        }
    });

    //create task
    $('#btn-create-task').on('click', function () {
        var data = $('#frm-create-task').serialize();
        $.ajax({
            url: "api/tasks",
            method: "POST",
            data: data
        }).done(function (data) {
            $('#createTask').modal('hide');
            $('.modal-backdrop').hide();
            $('#Name').val('');
            LoadCategoriesAndTasks();
            $.notify("Ny opgave tilføjet", 'success');
        })
    });
    //create category
    $('#btn-create-category').on('click', function (e) {

        validateThis();
        
        var data = $('#frm-create-category').serialize();
        $.ajax({
            url: "api/categories",
            method: "POST",
            data: data
        }).done(function (data) {
            $('#createCategory').modal('hide');
            $('.modal-backdrop').hide();
            $('#categoryName').val('');
            LoadCategoriesAndTasks();
            $.notify("Ny kategori oprettet", 'success');
        })
    });
});

function LoadCategoriesAndTasks() {
    $('.columns-container').html('');
    $.ajax({
        url: "api/categories"
    }).done(function (data) {
        $.each(data, function (key, item) {
            iCatId = item.Id;
            sCatName = item.Name;

            var sAppendString = '';

            //column
            sAppendString += '<section data-catid="' + iCatId + '">';
            //category
            sAppendString += '<div class="header-column">';
            sAppendString += '<header>';
            sAppendString += '<div class="category" data-time="Today">';
            sAppendString += '<div class="icon delete-category">';
            sAppendString += '<span class="deleteCategory glyphicon glyphicon-trash" data-catid="' + iCatId + '"></span>';
            sAppendString += '</div>';
            sAppendString += '<h2>' + sCatName + '</h2>';
            sAppendString += '</div>';
            sAppendString += '<a class="add-inline" data-catid="' + iCatId + '" data-toggle="modal" data-target="#createTask">';
            sAppendString += '<span class="glyphicon glyphicon-plus"></span>';
            sAppendString += '</a>';
            sAppendString += '</header>';
            sAppendString += '</div>';
            //task
            sAppendString += '<div class="items-column">';

            $.each(item.Tasks, function (key, task) {
                iTaskId = task.Id;
                sTaskName = task.Name;
                dTaskDateCreated = task.DateCreated;
                iTaskCatId = task.CategoryId;
                bTaskCompleted = task.Completed;

                sAppendString += '<div class="task-container">';

                if (bTaskCompleted) { sAppendString += '<div class="task finished" data-id="' + iTaskId + '">'; }
                else { sAppendString += '<div class="task" data-id="' + iTaskId + '">'; }

                sAppendString += '<p class="title">' + sTaskName + '</p>';
                sAppendString += '<div class="icon finishTask">';
                sAppendString += '<span class="glyphicon glyphicon-ok"></span>';
                sAppendString += '</div>';
                sAppendString += '<div class="icon removeTask">';
                sAppendString += '<span class="glyphicon glyphicon-remove"></span>';
                sAppendString += '</div>';

                sAppendString += '</div></div>';
            });

            sAppendString += '</div>';
            sAppendString += '</section>';

            $('.columns-container').append(sAppendString);


        });
        $('.add-inline').on('click', function () {
            $('#categoryId').attr('value', ($(this).data("catid")));
        });
        $(".items-column").sortable({
            connectWith: ".items-column",
            placeholder: "ui-state-highlight",

            receive: function (event, ui) {
                iTaskId = ui.item.find('.task').data('id');
                oTarget = event.target;
                iCatId = $(oTarget).closest('section').data('catid');

                ChangeTaskCategory(iTaskId, iCatId);
            }
        }).disableSelection();
    });
}

function ChangeTaskCategory(taskId, catId) {
    //var data = $('#frm-update-product').serialize();
    //alert(taskId + ' ' + catId);
    $.ajax({
        url: 'api/tasks/changecategory/' + taskId + '/' + catId,
        method: "PUT"
    }).done(function (data) {

    })
}