
/*This function will trigger to check whether the password are match or not*/
function checkPasswordMatch() {
    var password = $("#password").val();
    var confirm_password = $("#confirm_password").val();

    if (password != confirm_password){
    	$("#divCheckPasswordMatch").html("Passwords do not match!");
    	$("#confirm_password").addClass('error step_required');	
    }else{
    	$("#divCheckPasswordMatch").html("Passwords match.");
    	$("#confirm_password").removeClass('error step_required');	
    }
        
}
/*This function will trigger to check whether the password are match or not*/

/*Variable declaration*/
var current_step, next_step, previous_step; 
var left, opacity, scale; 
var animating; /*Flag to prevent multiclick glitches*/
/*Variable declaration*/

$(document).ready(function(){
		$("#confirm_password").keyup(checkPasswordMatch);	
		$(".step_required").focusout(function() {

			if($('.next').data('clicked')) {
				/*If user click direct Next Button without filling the required details*/
				$(".step_required").each(function( index ) {
			        if (!$(this).val())
						$(this).addClass('error').parent().find('mark').removeClass('validate').addClass('error');
					else
						$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');
				});

			}else{
				/*Individual Focus out value check*/
				if (!$(this).val())
						$(this).addClass('error').parent().find('mark').removeClass('validate').addClass('error');
					else
						$(this).removeClass('error').parent().find('mark').removeClass('error').addClass('valid');

			}
			
		});

		$(".next").click(function(e){

			/*Using this code we can check whether the Next button is clicked or not in Above Focus out code*/
			$(this).data('clicked', true);	

			/*For Validation Purpose Start Here*/	
				$(".step_required").triggerHandler("focusout");
				if ($('#multi-step-form input.error').length>0 || $('#multi-step-form textarea.error').length>0) {
					return false;
				} 	
			/*For Validation Purpose End Here*/	

			/*Next Step Functionality Start Here*/
			if(animating) return false;
			animating = true;
			
			current_step = $(this).parent();
			next_step = $(this).parent().next();
			
			//Activate Next Step of Progress Bar using the index value of Next Step
			$("#progressbar li").eq($("fieldset").index(next_step)).addClass("active");
			
			//Show Next Step
			next_step.show(); 
			//Hide Current Step with CSS
			current_step.animate({opacity: 0}, {
				step: function(now, mx) {
					//as the opacity of current_step reduces to 0 - stored in "now"
					//1. scale current_step down to 80%
					scale = 1 - (1 - now) * 0.2;
					//2. bring next_step from the right(50%)
					left = (now * 50)+"%";
					//3. increase opacity of next_step to 1 as it moves in
					opacity = 1 - now;
					current_step.css({
		        		'transform': 'scale('+scale+')',
		        		'position': 'absolute'
		     		});

					next_step.css({'left': left, 'opacity': opacity});
				}, 
				duration: 800, 
				complete: function(){
					current_step.hide();
					animating = false;
				}, 
				easing: 'easeInOutBack'
			});

			/*Next Step Functionality End Here*/
	});

	$(".previous").click(function(){
		if(animating) return false;
		animating = true;
		
		current_step = $(this).parent();
		previous_step = $(this).parent().prev();
		
		//De-Activate Current Step of Progress Bar using the index value of Current Step
		$("#progressbar li").eq($("fieldset").index(current_step)).removeClass("active");
		//Show the previous Field
		previous_step.show(); 
		//Hide Current Step with CSS
		current_step.animate({opacity: 0}, {
			step: function(now, mx) {
				/*Opacity of Current Step reduces to 0 and stored in 'now' variable*/
				/*1. Scale Previous Step from 80% to 100%*/
				scale = 0.8 + (1 - now) * 0.2;
				/*2. Take Current Step to the right(50%) - from 0%*/
				left = ((1-now) * 50)+"%";
				/*3. Increase Opacity of Previous Step to 1 as it moves in*/
				opacity = 1 - now;
				current_step.css({'left': left});
				previous_step.css({'transform': 'scale('+scale+')', 'opacity': opacity});
			}, 
			duration: 800, 
			complete: function(){
				current_step.hide();
				animating = false;
			}, 
			easing: 'easeInOutBack'
		});
	});

	/*Trigger on clicking the submit button*/
	// $(".submit").click(function(){
	// 	$(".step_required").triggerHandler("focusout");
	// 	$("#confirm_password").triggerHandler("checkPasswordMatch");
	// 		if ($('#multi-step-form input.error').length>0 || $('#multi-step-form textarea.error').length>0) {
	// 			return false;
	// 		}
	// });

	/*Trigger on submitting the form data by clicking the submit button*/
	$('#multi-step-form').submit(function(){
		
		$('#message').html('');

		if ($('#multi-step-form input.error').length>0 || $('#multi-step-form textarea.error').length>0) {
				return false;
		}else{
			$('#multi-step-form .loader').show();
		}

		var action = $(this).attr('action');

 		$('#submit').attr('disabled','disabled');

		$.post(action, $('#multi-step-form').serialize(),
			function(data){
				$('#message').html( data );
				$('#multi-step-form .loader').hide();
				$('#multi-step-form #submit').removeAttr('disabled');
				if(data.match('success') != null) $('#multi-step-form').slideUp('slow');

			}
		);
		return false;
	});

});
