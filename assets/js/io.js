showTask = function(res) {
    if(res.status == 'OK') {
        $('#' + Config.TASK[res.created.status]).find('.task-item').addClass('sleep');
        var taskDom = $('#' + res.created.id); 
        if(taskDom.length) {
            taskDom.replaceWith(res.content);
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
            $.get('/task/show/' + task.id, function getResponse(res) {
                if(res.status == 'OK') {
                    $('#' + Config.TASK[res.updated.status]).find('.task-item').addClass('sleep');
                    var taskDom = $('#' + res.updated.id); 
                    if(taskDom.length) {
                        taskDom.replaceWith(res.content);
                    } else {
                        $('#' + Config.TASK[res.updated.status]).append(res.content);
                    }
                }
            })
        }, 300);
    }
};
getCurrentStatus = function(taskDom) {
    var $check = taskDom.parents('[id^=task-]').attr('id');
    for(var t in Config.TASK) {
        if(Config.TASK[t] == $check) break;
    }
    return t;
};
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
  io.socket.on('userLogin', function() {
      alert('bạn phải đăng nhập để tiếp tục.');
      location.href = '/';
  });

  __d('click', '[role="cmd-remove"]', function() {
      if(confirm('bạn muốn xóa task?')) {
          var $task_id = $(this).attr('task-id');
          if($task_id) io.socket.get('/task/delete/'+$task_id, function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-to-do"]', function() {
      if(getCurrentStatus($(this)) != 1) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/1', function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-doing"]', function() {
      if(getCurrentStatus($(this)) != 2) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/2', function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-review-waiting"]', function() {
      if(getCurrentStatus($(this)) != 3) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/3', function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-review"]', function() {
      if(getCurrentStatus($(this)) != 4) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/4', function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-done"]', function() {
      if(getCurrentStatus($(this)) != 5) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/5', function gotResponse (data) { console.log(data.message); });
      }
  });
  __d('click', '[role="cmd-sendto-suppend"]', function() {
      if(getCurrentStatus($(this)) != 6) {
          var $task_id = $(this).parents('.task-item').attr('id');
          if($task_id)
              io.socket.get('/task/change/'+$task_id+'/6', function gotResponse (data) { console.log(data.message); });
      }
  });
});