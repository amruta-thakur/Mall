define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');
    var MenuView = require('coreViews/menuView');

    var BoxMenuView = MenuView.extend({


        postRender: function() {
            var nthChild = 0,
                locked = false,
                incompleteCount = 0;

            this.model.getChildren().each(function(item) {

                if(item.get('_isAvailable')) {
                    nthChild ++;
                    item.set('_isMenuItemLocked', locked);
                    var menuItem = new BoxMenuItemView({model:item, nthChild:nthChild});

                    this.$('.menu-container-inner').append(menuItem.$el);
                   // console.log(!menuItem.isCompleted()+" "+locked+" "+!menuItem.isCompleted() || locked);
                    locked = !menuItem.isCompleted() || locked;
                    if(locked) {

                        if(incompleteCount == 0) {
                            menuItem.$el.removeClass("disabled");
                        } else {
                            menuItem.$el.addClass("disabled");
                        }
                        incompleteCount++;
                    } else {
                        console.log(menuItem.$el.index);
                        menuItem.$el.removeClass("disabled");
                    }
                }
            });

            _.delay(function () {
                var $menuItem = this.$('.unlocked.menu-item:not(.nth-child-1)').last(),
                    navigationHeight = $('.location-menu .navigation').height();

                if($menuItem.length) {
                    $.scrollTo($menuItem, 300, { offset: -(navigationHeight + 4)});
                }
            }, 300);
        }
    }, {
        template:'boxmenu'
    });

    var BoxMenuItemView = MenuView.extend({

        events: {
            'click .menu-item-button-link': 'onClickMenuItemButton'
        },

        className: function() {
            return [
                'menu-item',
                'menu-item-' + this.model.get('_id') ,
                this.model.get('_classes'),
                'nth-child-' + this.options.nthChild,
                this.options.nthChild % 2 === 0  ? 'nth-child-even' : 'nth-child-odd',
                'disabled'
            ].join(' ');
        },

        preRender: function() {
            this.model.set('_isComplete', this.isCompleted());

        },

        postRender: function() {
            this.$el.imageready(_.bind(function() {
                this.showCompletionTick();
                this.setReadyStatus();
            }, this));
        },

        isCompleted: function() {
            return this.model.findDescendants('components').every(function (item) {
                return item.get('_isComplete');
            });
        },

        onClickMenuItemButton: function(event) {
            if(this.model.get('_isMenuItemLocked')) {
                event.preventDefault();
            }
        },
        showCompletionTick:function(){
            if(this.model.get('_isComplete')){
                this.$(".icon-tick").addClass("completed");
            }
        }


    }, {
        template:'boxmenu-item'
    });

    Adapt.on('router:menu', function(model) {

        var redirectContentObjectId = model.get("redirectContentObjectId");

        if(redirectContentObjectId) {
            var contentObjects = Adapt.contentObjects.where({"_id": redirectContentObjectId});
            if(contentObjects && contentObjects.length == 1) {
                contentObjects[0].set("_isThisRedirected", true);
                Backbone.history.navigate('#/id/' + redirectContentObjectId, true);
            }
        } else {
            $('.navigation-drawer-gohome-button').removeClass('display-none');
            $('#wrapper').append(new BoxMenuView({model:model}).$el);
        }

        if(model.get('_id') == 'co-15') {
            _.defer(function () {
                $('.navigation-back-button').addClass('display-none');
            });
        } else {
            $('.navigation-back-button').removeClass('display-none');
        }

        if(model.get("_isThisRedirected") || model.get("_isInitialView")) {
            _.defer(function () {
                $('.navigation-back-button').addClass('display-none');
                $('.navigation-drawer-gohome-button').addClass('display-none');
            });
        } else {
            $('.navigation-drawer-gohome-button').removeClass('display-none');
        }

    });

    Adapt.on('router:page', function (model) {
        if(model.get("_isThisRedirected") || model.get("_isInitialView")) {
            _.defer(function () {
                $('.navigation-back-button').addClass('display-none');
                $('.navigation-drawer-gohome-button').addClass('display-none');
            });
        } else {
            $('.navigation-drawer-gohome-button').removeClass('display-none');
        }

    });

});
