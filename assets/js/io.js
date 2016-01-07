showTask = function(res) {
    if(res.status == 'OK') {
        $('#' + Config.TASK[res.created.status]).find('.task-item').addClass('sleep');
        var taskDom = $('#' + res.created.id); 
        if(taskDom.length) {
            taskDom.prepend(res.content);
        } else {
            $('#' + Config.TASK[res.created.status]).append(res.content);
        }
    }
};
removeTask = function(task) {
    var taskDom = $('#' + task.id);
    if(taskDom.length) {
        taskDom.addClass('wait-for-remove');
        setTimeout( function() {
            taskDom.remove();
        }, 300)
    }
};
changeTask = function(task) {
    var taskDom = $('#' + task.id);
    if(taskDom.length) {
        taskDom.addClass('wait-for-remove');
        var $to = $('#' + Config.TASK[task.status]);
        setTimeout( function() {
            taskDom.removeClass('wait-for-remove').appendTo($to);
        }, 300)
    }
}
io.socket.on('connect', function socketConnected() {

  io.socket.get('/user/join', function gotResponse (data) {
    // we don’t really care about the response
      console.log(data.message);
  });
  //Task create, update, delete
  io.socket.on('taskCreated', function(task) {
      showTask(task);
  });
  io.socket.on('taskDeleted', function(task) {
      removeTask(task);
  });
  io.socket.on('taskChange', function(task) {
      changeTask(task);
  });

  __d('click', '[role="cmd-remove"]', function() {
      var $task_id = $(this).attr('task-id');
      if($task_id) io.socket.get('/task/delete/'+$task_id, function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-to-do"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/1', function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-doing"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/2', function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-review-waiting"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/3', function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-review"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/4', function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-done"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/5', function gotResponse (data) { console.log(data.message); });
  });
  __d('click', '[role="cmd-sendto-suppend"]', function() {
      var $task_id = $(this).parents('.task-item').attr('id');
      if($task_id)
          io.socket.get('/task/change/'+$task_id+'/6', function gotResponse (data) { console.log(data.message); });
  });
});