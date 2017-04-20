/*
* adapt-textAnimate
* License - http://github.com/adaptlearning/adapt_framework/LICENSE
* Maintainers - Himanshu Rajotia <himanshu.rajotia@exultcorp.com>
*/
define(function(require) {
    var ComponentView = require('coreViews/componentView');
    var Adapt = require('coreJS/adapt');

    var TextAnimate = ComponentView.extend({
	
		 initialize: function() {
			this.fontSize;
            this.preRender();
            if (Adapt.device.screenSize !='large') {
                this.fontSize = "45px";
                this.render();
				this.resizeText();
				
            }
			else{
                
				this.fontSize = "45px";
				this.render();
			}
        },

        preRender: function() {
            this.model.set("latters", this.model.get("_item").text.split(""));
			this.listenTo(Adapt, 'device:changed', this.resizeText, this);
        },

        postRender: function() {
            this.setReadyStatus();
            this.listenTo(this.model, 'change:_isComplete', this.removeInviewListener);
            this.$('.component-inner').on('inview', _.bind(this.inview, this));
        },

        performAnimation: function() {
            var self = this,
                $latterContainer = this.$('.textAnimate-latters');

            _.each(this.model.get("latters").reverse(), function(item) {
                $latterContainer.prepend("<span class='textAnimate-latter'>"+item+"</span>");
            });
			
			if (Adapt.device.screenSize !='large') {
				this.$('.textAnimate-latter').addClass('small');
			}
			else{
				this.$('.textAnimate-latter').addClass('large');
			}
			
            var $selected = this.$('.textAnimate-latter').eq([this.model.get("_item").hightlightPosition]);

            $latterContainer.velocity({left: 0}, this.model.get("_item").animationTime, "ease-in", function() {
                $selected.velocity({"font-size": self.fontSize}, 600, function() {
                    self.$('.textAnimate-latter')
                        .not($selected)
                        .velocity({opacity: 0.1}, 800, function() {
                            _.delay(function() {
                                self.$('.textAnimate-latters-description').css({visibility: "visible"})
                                    .velocity({opacity: 1, filter: "inherit"}, 800, function() {
                                        self.setCompletionStatus();
                                    });
                            }, 400);
                            $(this).addClass('display-none');
                        });
                });
            });

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
                    this.performAnimation();
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
		
		resizeText:function(){

            if (Adapt.device.screenSize != 'large') {
				var $description = this.$('.textAnimate-latters-description');
                var $letter = this.$('.textAnimate-latters');
                $letter.css("font-size",this.fontSize);
                console.log($letter.children());
                console.log(this.fontSize);
                $description
                    .children('span')
					.children()
                    .css("font-size"," 31.5px");

            }
        }

    });

    Adapt.register("textAnimate", TextAnimate);

    return TextAnimate;

});
