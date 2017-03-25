$(function() {



  function taskHtml(task){
    var checkedStatus = task.done ? "checked" : "";
    var liClass = task.done ? "completed" : "";
    var destroyButton = '<button id="'+task.id+
    '"class="destroy"></button>';
    var liElement =
    '<li id="listItem-' + task.id +
    '" class=" '+ liClass +'">'+
    '<div class="view"><input class="toggle" type="checkbox" '+
    "data-id='"+
    task.id +
    "'" +
    checkedStatus +
    '><label>' +
    task.title +
    '</label>'+
    destroyButton +
    '</div></li>';

    return liElement;
  }



  function toggleTask(e) {
    var itemId = $(e.target).data("id");
    var doneValue = Boolean($(e.target).is(':checked'));
    $.post("/tasks/" + itemId, {
      _method: "PUT",
      task: {
        done: doneValue
      }
    }).success(function(data){
      var liHtml = taskHtml(data);
      var $li = $("#listItem-" + data.id);
      $li.replaceWith(liHtml);
      $('.toggle').change(toggleTask);
    });
  }


  function addTaskWithStatus(string){
    var ulToDos = $('.todo-list');
    ulToDos.append(string);
    $('.toggle').change(toggleTask);
  }


  $.get("/tasks").success(function(data){
    var htmlString = ""
    $.each(data, function(index, task){
      htmlString += taskHtml(task);
    });
    addTaskWithStatus(htmlString);
  });

  $('#new-form').submit(function(event){
    event.preventDefault();
    var textbox = $('.new-todo');
    var payload = {
      task: {
        title: textbox.val()
      }
    };
    $.post("/tasks", payload).success(function(data){
      var htmlString = taskHtml(data);
      addTaskWithStatus(htmlString);
      $('.new-todo').val('');
    });
  });


  $(".todo-list").on("click", "button.destroy", function(e){
    var buttonId = $(e.target).attr("id");
    $.post("/tasks/" + buttonId, {
      _method: "DELETE"
    }).success(function(data){
      $('li#listItem-'+buttonId).fadeOut(100);
    });
});




});
