Template.navItems.helpers({
    activeIfTemplateIs: function (template) {
        var currentRoute = Router.current();
        var route = currentRoute.lookupTemplate();
        return  (currentRoute && template) === currentRoute.lookupTemplate() ? 'active' : '';
    }
});
