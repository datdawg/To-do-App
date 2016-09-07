$(document).ready(function () {
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
                $.notify('Opgave slettet', 'warn');
            });
        }
    })
    //complete task
    .delegate('.finishTask', 'click', function () {
        oThis = $(this);
        sHTML = $(oThis).closest('.title').html();
        var id = $(this).closest('.task').data('id');

        console.log($(oThis).closest('.title').html());
        alert('fix this');
        return false;

        $.ajax({
            url: "api/tasks/" + id,
            method: "PUT"
        }).done(function () {
            $(oThis).closest('.task').addClass("finished");
            $.notify(sHTML + ": Check :)", 'success');
        });
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
            LoadCategoriesAndTasks();
            $.notify("Ny opgave tilføjet"), 'success';
        })
    });

    //create category
    $('#btn-create-category').on('click', function () {
        var data = $('#frm-create-category').serialize();
        $.ajax({
            url: "api/categories",
            method: "POST",
            data: data
        }).done(function (data) {
            $('#createCategory').modal('hide');
            $('.modal-backdrop').hide();
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

            $('.add-inline').on('click', function () {
                $('#categoryId').attr('value', ($(this).data("catid")));
            });

            sAppendString += '</div>';
            sAppendString += '</section>';

            $('.columns-container').append(sAppendString);

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