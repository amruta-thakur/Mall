/*
* adapt-navigate
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Himanshu Rajotia <himanshu.rajotia@exultcorp.com>
*/
define(function(require) {
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var Navigate = ComponentView.extend({

        events: {
            'click .navigation-button': 'onClickNavigationButton'
        },

        postRender: function() {
            this.setReadyStatus();
            this.listenTo(this.model, 'change:_isComplete', this.removeInviewListener);
            this.$('.component-inner').on('inview', _.bind(this.inview, this));
        },

        inview: function(event, visible, visiblePartX, visiblePartY) {
            if (visible) {
                if (visiblePartY === 'top') {
                    this._isVisibleTop = true;
                } else if (visiblePartY === 'bottom') {
                    this._isVisibleBottom = true;
                } else {
                    this._isVisibleTop = true;
                    this._isVisibleBottom = true;
                }

                if (this._isVisibleTop && this._isVisibleBottom) {
                    this.$('.component-inner').off('inview');
                    this.setCompletionStatus();
                }

            }
        },

        removeInviewListener: function(model, changeAttribute) {
            if (changeAttribute) {
                this.$('.component-inner').off('inview');
            }
        },

        remove: function() {
            this.$('.component-inner').off('inview');
            Backbone.View.prototype.remove.apply(this, arguments);
        },

        onClickNavigationButton: function (event) {
            if(event && event.preventDefault) event.preventDefault();
            var id = $(event.currentTarget).attr("data-id");
            Backbone.history.navigate('#/id/' + id, true);
        }

    });

    Adapt.register("navigate", Navigate);

    return Navigate;

});
