/*
 * AdaptCollection
 * License - https://github.com/adaptlearning/adapt_framework/blob/master/LICENSE
 * Maintainers - Amruta Thakur <amruta.thakur@exultcorp.com>
 */
define(function (require) {
    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');

    var pageCompletionView = Backbone.View.extend({
        className: "extension-pageCompletion",

        events: {
            'click .pageCompletion-done': 'closePageCompletion',
            'click .pageCompletion-icon': 'closePageCompletion',
            'click .pageCompletion-menu-link': 'goToMenuPageCompletion'
        },
        initialize: function () {
            this.listenTo(this.collection, 'change:_isComplete', this.showPageCompletion);
            this.render();
            this.listenTo(Adapt, 'remove', this.closePageCompletion, this);
            this.listenTo(Adapt, 'device:resize', this.resetPageCompletionSize);
        },

        render: function () {
            var data = this.model.toJSON();
            var template = Handlebars.templates["pageCompletionPlugin"];
            this.$el.html(template(data)).appendTo('#wrapper');
            //this.$('.pageCompletion').css({display: 'none'});
        },
        resetPageCompletionSize: function () {
            this.$('.pageCompletion').removeAttr('style');
            this.resizePageCompletion(true);
        },
        resizePageCompletion: function (noAnimation) {
            var windowHeight = $(window).height();
            var popupHeight = this.$('.pageCompletion').height();
            var animationSpeed = 400;

            if(this.canShowPageCompletion() == true){
                this.$('.pageCompletion').css("display", "block");
            }
            //this.$('.pageCompletion').css("display", "block");
            if (popupHeight > windowHeight && this.canShowPageCompletion()) {

                this.$('.pageCompletion').css({
                    'height': '100%',
                    'top': 0,
                    'overflow-y': 'scroll',
                    '-webkit-overflow-scrolling': 'touch',
                    'opacity': 1

                });
            } else {

                if (noAnimation) {
                    var animationSpeed = 0;
                }

                this.$('.pageCompletion').css({
                    'margin-top': -(popupHeight / 2) - 50, 'opacity': 0
                }).velocity({
                        'margin-top': -(popupHeight / 2), 'opacity': 1
                    }, animationSpeed);
            }
        },
        showPageCompletion: function () {

            if (this.model.get("_pageCompletion") != undefined) {
                if (this.collection.where({_isComplete: true}).length == this.collection.length) {
                    var delayInMs = this.model.get("_pageCompletion")._duration * 1000;

                    _.delay(_.bind(function () {

                        this.resizePageCompletion();
                        this.$('.pageCompletion').css({'display': 'block'});
                        this.$('.PageCompletion-shadow').fadeIn('slow');


                    }, this), delayInMs);
                }
            }
            return this;
        },
        canShowPageCompletion: function(){
            return this.collection.where({_isComplete: true}).length == this.collection.length;
        },
        closePageCompletion: function (event) {
            if (event && event.preventDefault) event.preventDefault();
            this.$el.fadeOut('fast', _.bind(function () {
                this.remove();
                Adapt.trigger('pageCompletion:closed');
            }, this));
            Adapt.trigger('popup:closed');
        },
        goToMenuPageCompletion: function (event) {
            var id = this.model.get("_pageCompletion")._backLink.url;
            this.closePageCompletion(event);
            Backbone.history.navigate(id, true);
        }
    });

    Adapt.on('pageView:postRender', function (view) {

        var currentPageComponents = view.model.findDescendants('components').where({'_isAvailable': true});

        var enabledProgressComponents = _.filter(currentPageComponents, function (component) {
            if (component.attributes._pageLevelProgress) {
                return component.attributes._pageLevelProgress._isEnabled;
            }
        });
        var componentsCollection = new Backbone.Collection(enabledProgressComponents);
        if (enabledProgressComponents.length > 0) {
            new pageCompletionView({
                model: view.model,
                collection: componentsCollection
            });

        }
        Adapt.trigger('popup:opened');

    });

});

