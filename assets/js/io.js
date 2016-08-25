CtrlIO = 
{
    init: function() {
        io.socket.on('catChanged', this.catChanged);
        io.socket.on('requiredLogin', this.requiredLogin);
    },
    destroy: function() {
        io.socket.off('catChanged', this.catChanged);
        io.socket.off('requiredLogin', this.requiredLogin);
    },
    catChanged: function(d) {
        localStorage.setItem(ICONFIG.ISTORAGE_CAT, JSON.stringify(d));
        $('[data-refcat]').refreshCat();
    },
    requiredLogin : function() {
        alert('bạn phải đăng nhập để tiếp tục.');
        location.href = '/';
    }
};

io.socket.on('disconnect', function(){
    CtrlIO.destroy();
});
io.socket.on('connect', function socketConnected() {

  io.socket.get('/user/join', function gotResponse (data) {
      console.log(data.message);
  });
  CtrlIO.init();
});