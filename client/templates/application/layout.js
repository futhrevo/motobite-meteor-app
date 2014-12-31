Template.layout.created = function(){
    $('body').attr('fullbleed', '');
    $('body').attr('vertical', '');
    $('body').attr('layout', '');
    $('body').attr('unresolved', '');
};

document.addEventListener('polymer-ready', function() {
    var navicon = document.getElementById('navicon');
    var drawerPanel = document.getElementById('drawerPanel');
    navicon.addEventListener('click', function() {
        drawerPanel.togglePanel();
    });
});
