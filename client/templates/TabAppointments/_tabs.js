/**
 * Created by rakeshkalyankar on 30/07/15.
 */

Template._tabs.onRendered(function () {
    $('body').addClass('tinker-tabs');
});

Template._tabs.onDestroyed(function () {
    $('body').removeClass('tinker-tabs');
});