var config = {
    map: {
        '*': {
            navigationJs: 'WeltPixel_NavigationLinks/js/navigation_js'
            // menu: 'WeltPixel_NavigationLinks/js/navigationlinks_menu'
        }
    },
    config: {
        mixins: {
            'mage/menu': {
                'WeltPixel_NavigationLinks/js/menu-mixin': true
            }
        }
    }
};