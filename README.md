# doping
  
[![Build status](https://travis-ci.org/ystskm/doping-js.png)](https://travis-ci.org/ystskm/doping-js)  
  
Multi-domain dope strategy.
Use browser channel port for interaction.

## Install

Install writing sources head tag.
    
## API - Doping via iframe
  
`parent.html`
Dependencies: [browser-emitter-js](https://github.com/ystskm/browser-emitter-js)  
```html
<html>
<head>
	<script type="text/javascript" src="Event.js"></script>
	<script type="text/javascript" src="doping.js"></script>
	<script type="text/javascript" src="doping-server.js"></script>
	<script type="text/javascript">
	
	    window.Doping.on('doping.port', function(mother) {
	      mother.evalJs("alert('Present for you.')");
	    });
	
	</script>
</head>
<body>
	<iframe src="children.html"/>
</body>
</html>
```
`children.html`
```html
<html>
<head>
	<script type="text/javascript" src="doping.js"></script>
	<script type="text/javascript" src="doping-client.js"></script>
</head>
<body>
</body>
</html>
```

## Methods
toHead: dope script tag to head.  
toBody: dope script tag to body.  
evalJs: dope script directly.
