(function( $ ) {
	window.swaggerPromise = new SwaggerClient({
			url: "https://api.optimizely.com/v2/swagger.json",
			usePromise: true
	});


	var classicProjectFetch = function(){


		optly = new OptimizelyAPI( $( '#token' ).val() );

		optly.get( 'projects', function( response ) {
			$( '#project_id' ).empty();
			$.each( response, function( key, val ) {
				$option = $( '<option>' )
					.val( val.id )
					.text( val.project_name );

				$( '#project_id' ).append( $option );
			});

			// Update project code w/ the default value
			$( '#project_id' ).change();
		});
	};

	var xProjectFetch = function(){
		var token = $( '#token' ).val();
		var authentication = {
    	clientAuthorizations: {
      	token: new SwaggerClient.ApiKeyAuthorization('Token', token, 'header'),
    	}
  	};

		window.swaggerPromise.then(function(client){
			return client.Projects.list_projects( {responseContentType: 'application/json'},  authentication);
		}).then( function(result){
			$( '#project_id' ).empty();
			for( var i in result.obj ){
				var project = result.obj[i];
				$option = $( '<option>' )
					.val( project.id )
					.text( project.name );

				$( '#project_id' ).append( $option );
			}
			$( '#project_id' ).change();
		});


	};

	// Javascript for plugin settings page
	function optimizelyConfigPage() {

		/*
		AUTHENTICATION W/ OPTIMIZELY
		When the user presses the button, we call the GET projects/ endpoint to list out all the projects in their account.
		For each project, we show its name in the dropdown and store its ID in the value attribute for submission to a form.
		*/

		$( 'button#connect_optimizely' ).click(function( event ) {
			event.preventDefault();
			$loading = $( '<option>' ).text( 'Loading projects...' );
			$( '#project_id' ).html( '' );
			$( '#project_id' ).append( $loading );

			var value = $( '#platform' ).find( 'option:selected' ).attr( 'value' );
			if( value === 'optimizely_x' ){
				xProjectFetch();
			} else {
				classicProjectFetch();
			}
			/*
			CHOOSING A PROJECT
			When the user selects a project from the dropdown,
			we populate the project code box with the Optimizely snippet for that project ID.
			*/
			$( '#project_id' ).change(function() {
				var id = $( '#project_id' ).val();
				var name = $( '#project_id option:selected' ).text();

				// For display purposes only!
				var project_code = '<script src="//cdn.optimizely.com/js/' + parseInt( id ) + '.js"></script>';

				$( '#project_code' ).text( project_code );
				$( '#project_name' ).val( name );
			});
		});


	}

	$( document ).ready(function() {
		$( '#optimizely-tabs' ).tabs();
		$( document ).tooltip({
			track: true
		});

		$('#platform').change(function(){
		  var value = $( this ).find( 'option:selected' ).attr( 'value' );
			var activation_text = $( '#conditional_activation_code' ).text();
			var variation_text = $( '#variation_template' ).text();
		  if( value === 'optimizely_x' ){
				if( activation_text === OPTIMIZELY_DEFAULT_CONDITIONAL_TEMPLATE ){
					$( '#conditional_activation_code' ).text( OPTIMIZELY_X_DEFAULT_CONDITIONAL_TEMPLATE );
				}
				if( variation_text === OPTIMIZELY_DEFAULT_VARIATION_TEMPLATE ){
					$( '#variation_template' ).text( OPTIMIZELY_X_DEFAULT_VARIATION_TEMPLATE );
				}
		  } else {
				if( activation_text === OPTIMIZELY_X_DEFAULT_CONDITIONAL_TEMPLATE ){
					$('#conditional_activation_code' ).text( OPTIMIZELY_DEFAULT_CONDITIONAL_TEMPLATE );
				}
				if( variation_text === OPTIMIZELY_X_DEFAULT_VARIATION_TEMPLATE ){
					$( '#variation_template' ).text( OPTIMIZELY_DEFAULT_VARIATION_TEMPLATE );
				}
		  }
		});

		optimizelyConfigPage();

		$( 'input[name="optimizely_activation_mode"]' ).click(function(){
			if( $( this ).val() == 'conditional' ){
				$( '#optimizely_conditional_activation_code_block' ).show();
			}else{
				$( '#optimizely_conditional_activation_code_block' ).hide();
			}
		});
	});

})( jQuery );
