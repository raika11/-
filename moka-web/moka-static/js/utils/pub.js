$(document).ready(function() {

    $('.select2').select2();


    //li형 select box
    $(function(){
        var select = new CustomSelectBox('.select_box');
    });

    function CustomSelectBox(selector){
        this.$selectBox = null,
        this.$select = null,
        this.$list = null,
        this.$listLi = null;
        
        CustomSelectBox.prototype.init = function(selector){
            this.$selectBox = $(selector);
            this.$select = this.$selectBox.find('.box .select');
            this.$list = this.$selectBox.find('.box .list');
            this.$listLi = this.$list.children('li');
        }
        CustomSelectBox.prototype.initEvent = function(e){
            var that = this;
            this.$select.on('click', function(e){
                that.listOn();
            });
            this.$listLi.on('click', function(e){
                that.listSelect($(this));
            });
            $(document).on('click', function(e){
                that.listOff($(e.target));
            });
        }
        CustomSelectBox.prototype.listOn = function(){
            this.$selectBox.toggleClass('on');
            if(this.$selectBox.hasClass('on')){
                this.$list.css('display', 'block');
            }else{
                this.$list.css('display', 'none');
            };
        }
        CustomSelectBox.prototype.listSelect = function($target){
            $target.addClass('selected').siblings('li').removeClass('selected');
            this.$selectBox.removeClass('on');
            this.$select.text($target.text());
            this.$list.css('display', 'none');
        }
        CustomSelectBox.prototype.listOff = function($target){
            if(!$target.is(this.$select) && this.$selectBox.hasClass('on')){
                this.$selectBox.removeClass('on');
                this.$list.css('display', 'none');
            };
        }
        this.init(selector);
        this.initEvent();
    }
});