var Slider = function () {

    return {
        //main function to initiate the module
        init: function () {

			$('.multiple-items').slick({
				dots: false,
				infinite: false,
				arrows: true,
				speed: 300,
				slidesToShow: 2,
				slidesToScroll: 1,
				variableWidth: true,
			});	
  
            $('.add-new-model').on('click', function(){

                var divStr='';
                divStr+='';                
                divStr+='<div class="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">';
                divStr+='<h4 class="widget-thumb-heading">M-888888</h4>';
                divStr+='<div class="widget-thumb-wrap">';
                divStr+='<i class="widget-thumb-icon bg-green icon-layers"></i>';
                divStr+='<div class="widget-thumb-body">';
                divStr+='<span class="widget-thumb-subtitle">电机</span>';
                divStr+='<span class="widget-thumb-body-stat" data-counter="counterup" data-value="7,644">5</span>';
                divStr+='</div>';
                divStr+='</div>';
                divStr+='</div>';                

                $('.multiple-items').slick('slickAdd',divStr);

            });    

            $('.remove-new-model').on('click', function(){

                $('.multiple-items').slick('slickRemove',false);
                //   $('.multiple-items').slick('slickRemove','2');
            });            
            
            
        }
    };

}();

jQuery(document).ready(function() {    
   Slider.init(); 
});

