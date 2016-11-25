function loadXMLDoc() 
{
	  var xmlhttp;
	  if (window.XMLHttpRequest) 
		  {
			xmlhttp = new XMLHttpRequest();
		  } 
	  else 
	  {
		// code for older browsers
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	  }
	  xmlhttp.onreadystatechange = function() 
	  {
			if (this.readyState == 4 && this.status == 200) 
			{
			  console.log(this.responseText);
			}
  };
  
  xmlhttp.open("GET", "test.txt", true);
  xmlhttp.send();
}
loadXMLDoc();