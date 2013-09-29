jQuery(document).ready(function($) {

	// Load the modal window
	$('a.login-window').click(function() {

		// Get the value in the href of our button.
		var login_id = $(this).attr('href');

		// Add our overlay to the body and fade it in.
		$('body').append('<div id="overlay"></div>');
		$('#overlay').fadeIn(300);

		// Fade in the modal window.
		$(login_id).fadeIn(300);

		// center our modal window with the browsers.
		var margin_left = ($(login_id).width() + 24) / 2;
		var margin_top = ($(login_id).height() + 24) / 2;

		$(login_id).css({
			'margin-left' : -margin_left,
			'margin-top' : -margin_top
		});

		return false;
	});


	// Close the modal window and overlay when we click the close button or on the overlay
	$('.close-btn').click(function() {
		$('#overlay, .login-popup').fadeOut('300m', function() {
			$('#overlay').remove();
		});

		return false;
	});


	// Display our different form fields when buttons are clicked
	$('.wpml-content:not(:first)').hide();
	$('.wpml-nav').click(function(e) {

		// Remove any messages that currently exist.
		$('.wpml-content > p.message').remove();

		// Get the link set in the href attribute for the currently clicked element.
		var form_field = $(this).attr('href');

		// fade-out, then fade-in (need to re-center the box)
		var login_id = $('#login-box');
		$(login_id).fadeOut('fast', function() {
			// Animation complete
			$('.wpml-content').hide();
			$('.section-container ' + form_field).show();
			var margin_left = ($(login_id).width() + 24) / 2;
			var margin_top = ($(login_id).height() + 24) / 2;
			$(login_id).fadeIn(300);
			$(login_id).css({
				'margin-left' : -margin_left,
				'margin-top' : -margin_top
			});
		});
		
		e.preventDefault();

		if(form_field === '#login') {
			$(this).parent().fadeOut().removeClass().addClass('hide-login');
		} else {
			$('a[href="#login"]').parent().removeClass().addClass('inline').fadeIn();
		}
	});


	// Run our login ajax
	var form_submit = function(e) {

		// Stop the form from submitting so we can use ajax.
		e.preventDefault();

		// Check what form is currently being submitted so we can return the right values for the ajax request.
		var form_id = $(this).parent().attr('id');

		// Remove any messages that currently exist.
		$('.wpml-content > p.message').remove();

		// Display our loading message while we check the credentials.
		$('.wpml-content > h2').after('<p class="message notice">' + wpml_script.loadingmessage + '</p>');
		$('.wpml-content > p.message').show();

		// Check if we are trying to login. If so, process all the needed form fields and return a faild or success message.
		if ( form_id === 'login' ) {
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: wpml_script.ajax,
				data: {
					'action'     : 'ajaxlogin', // Calls our wp_ajax_nopriv_ajaxlogin
					'username'   : $('#login #login_user').val(),
					'password'   : $('#login #login_pass').val(),
					'rememberme' : $('#login #rememberme').val(),
					'login'      : $('#login input[name="login"]').val(),
					'security'   : $('#login #security').val()
				},
				success: function(results) {

					// Check the returned data message. If we logged in successfully, then let our users know and remove the modal window.
					if(results.loggedin === true) {
						$('.wpml-content > p.message').removeClass('notice').addClass('success').text(results.message).show();
						$('#overlay, .login-popup').delay(5000).fadeOut('300m', function() {
							$('#overlay').remove();
						});
						window.location.href = wpml_script.redirecturl;
					} else {
						$('.wpml-content > p.message').removeClass('notice').addClass('error').text(results.message).show();
					}
				}
			});
		} else if ( form_id === 'register' ) {
		    var reg_data = {}, form_fields;
			reg_data.action = 'ajaxlogin'; // Calls our wp_ajax_nopriv_ajaxlogin
			form_fields = $('#register form').serializeArray();
			var length = form_fields.length, field_parts;
			for (var i = 0; i < length; i++) {
				field_parts = form_fields[i];
				reg_data[field_parts.name] = field_parts.value;
			}
			
			$.ajax({
				type: 'POST',
				dataType: 'json',
				url: wpml_script.ajax,
				data: reg_data,
				success: function(results) {
					if(results.registerd === true) {
						$('.wpml-content > p.message').removeClass('notice').addClass('success').text(results.message).show();
						$('#register input:not(#user-submit)').val('');
					} else {
						$('.wpml-content > p.message').removeClass('notice').addClass('error').text(results.message).show();
					}
				}
			});
		} else if ( form_id === 'forgotten' ) {
			$.ajax({
				type: 'GET',
				dataType: 'json',
				url: wpml_script.ajax,
				data: {
					'action'    : 'ajaxlogin', // Calls our wp_ajax_nopriv_ajaxlogin
					'username'  : $('#forgotten #forgot_login').val(),
					'forgotten' : $('#forgotten input[name="forgotten"]').val(),
					'security'  : $('#forgotten #security').val()
				},
				success: function(results) {
					if(results.reset === true) {
						$('.wpml-content > p.message').removeClass('notice').addClass('success').text(results.message).show();
						$('#forgotten input:not(#user-submit)').val('');
					} else {
						$('.wpml-content > p.message').removeClass('notice').addClass('error').text(results.message).show();
					}
				}
			});
		} else {
			// if all else fails and we've hit here... something strange happen and notify the user.
			$('.wpml-content > p.message').text('Something went wrong. Please refresh your window and try again.');
		}
	};
	$('#login-box form').on('submit', form_submit);
});
