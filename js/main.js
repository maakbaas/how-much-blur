$(document).ready(function() {

$( "#slider" ).slider({
	range: true,
	min: 0,
	step: 1,
	max:54,
	values: [ 9, 28 ],
	slide: function(event, ui) {
		$(this).slider('values', ui.values);
		if(ui.values[1] - ui.values[0] < 1){
                return false;
        } else {
				plot_update(true);
		}
    }
});

var succes;
succes=true;

var ticks = [[0.01, '1&nbsp;cm'], [0.02, '2&nbsp;cm'], [0.03, '3&nbsp;cm'], [0.04, '4&nbsp;cm'], [0.05, '5&nbsp;cm'], [0.06, '6&nbsp;cm'], [0.07, '7&nbsp;cm'], [0.08, '8&nbsp;cm'], [0.09, '9&nbsp;cm'], [0.1,'10&nbsp;cm'], [0.2, '20&nbsp;cm'], [0.3, '30&nbsp;cm'], [0.4, '40&nbsp;cm'], [0.5, '50&nbsp;cm'], [0.6, '60&nbsp;cm'], [0.7, '70&nbsp;cm'], [0.8, '80&nbsp;cm'], [0.9, '90&nbsp;cm'], [1, '1&nbsp;m'], [2, '2&nbsp;m'], [3, '3&nbsp;m'], [4, '4&nbsp;m'], [5, '5&nbsp;m'], [6, '6&nbsp;m'], [7, '7&nbsp;m'], [8, '8&nbsp;m'], [9, '9&nbsp;m'], [10, '10&nbsp;m'], [20,'20&nbsp;m'], [30,'30&nbsp;m'], [40,'40&nbsp;m'], [50,'50&nbsp;m'], [60,'60&nbsp;m'], [70,'70&nbsp;m'], [80,'80&nbsp;m'], [90,'90&nbsp;m'], [100,'100&nbsp;m'], [200,'200&nbsp;m'], [300,'300&nbsp;m'], [400,'400&nbsp;m'], [500,'500&nbsp;m'], [600,'600&nbsp;m'], [700,'700&nbsp;m'], [800,'800&nbsp;m'], [900,'900&nbsp;m'], [1000,'1&nbsp;km'], [2000,'2&nbsp;km'], [3000,'3&nbsp;km'], [4000,'4&nbsp;km'], [5000,'5&nbsp;km'], [6000,'6&nbsp;km'], [7000,'7&nbsp;km'], [8000,'8&nbsp;km'], [9000,'9&nbsp;km'], [10000,'10&nbsp;km']];		

//#compare-1x-50mm-f1.4-and-1x-85mm-f1.8-on-a-4.34-by-2.89m-subject
if (window.location.hash.length>1)
{
	var urlparts;
	urlparts=window.location.hash.split('-');

	if (urlparts[0]=='#compare' && urlparts[urlparts.length-1]=='subject') {	
	for (var i=1; i<urlparts.length-1; i=i+4)
	{	
			if (urlparts[i+3]=='and' || urlparts[i+3]=='on') {
				add_line(urlparts[i].match(/[0-9]*\.{0,1}[0-9]{0,2}/,''),urlparts[i+1].match(/[0-9]*\.{0,1}[0-9]{0,2}/,''),urlparts[i+2].substr(1));
			} else {			
				if (urlparts[i+1].match(/[0-9]*\.{0,1}[0-9]{0,2}/,'')==0.9)
				{$("#radio1").attr("checked","checked");}
				else if (urlparts[i+1].match(/[0-9]*\.{0,1}[0-9]{0,2}/,'')==3)
				{$("#radio2").attr("checked","checked");}
				else
				{$("#radio3").attr("checked","checked");
				$("#img_width").val(urlparts[i+1].match(/[0-9]*\.{0,1}[0-9]{0,2}/,''));}}
			
	}} else {
		succes=false;
	}
} else {succes=false;}

if (succes==false)
{
	//initialize
	$("#radio1").attr("checked","checked");
	add_line("1.0","50","1.4");
	add_line("1.0","85","1.8");
}

plot_update();

//events
$("body").on("click","#add",function(){add_line("","","");
							if ($(".input_line").length==10) {
							$("#after_inputs").html('10 will be enough don\'t you think? ;)');
							}
							});
$("body").on("click",".remove",function(){
							$(this).parent().remove();
							if ($(".input_line").length<10) {
							$("#after_inputs").html('<a id="add">Add some more</a>');
							}
							});
$("#update").click(function(){						
									plot_update();
							});

$("body").on("keyup",".mm",function(e){var code = e.keyCode || e.which;if (code != '9') {this.value = this.value.match(/[0-9]*/,'');}});
$("body").on("keyup",".f, .crop, #img_width",function(e){var code = e.keyCode || e.which;if (code != '9') {this.value = this.value.match(/[0-9]*\.{0,1}[0-9]{0,2}/,'');}});

//display the emailadress
emailhelper='@how';
$("#mail").html('support'+emailhelper+'muchblur.com');

function plot_update(is_slider)
{
	var plot_options = {colors: ["#77DE11","#16ACDE","#165B80","#FF66CC","#FFCC00","#990000","#FF6600","#006633","#663300","#000000"],
						legend: {position:"nw"},
						grid: {color:"#000000"},
						series: {shadowSize:0},					
						xaxis: {transform: function (v) { return Math.log(v)/Math.log(10); },
								ticks:get_ticks()}};

	var plot_handle = $.plot($("#graph"), read_form(is_slider),plot_options);	
}

function get_ticks()
{		
		var tick_values = new Array();
		
		var limits = $( "#slider" ).slider( "option", "values" );
		
		for (var i=limits[0]; i<=limits[1]; i++)
		{				
			if (i != limits[0]  && i != limits[1]  && 
			ticks[i][0] != 0.1 && ticks[i][0] != 1 && ticks[i][0] != 10 && ticks[i][0] != 100 && ticks[i][0] != 1000)
			{			
				tick_values.push([ticks[i][0],'']);				
			} else {
				if (i == limits[0] && (i==6 || i==7 || i==8 || i==15 || i==16 || i==17 || i==25 || i==26 || i==35))
				{
					tick_values.push([ticks[i][0],'']);				
				} else {
					tick_values.push(ticks[i]);
				}
			}			
		}
		
		return tick_values;
}

function add_line(crop,mm,f)
{
			$("#after_inputs").before('<div class="input_line">Crop Factor: <input type="text" class="crop" value="'+crop+'" style="width:40px;" /> with a lens set at: <input class="mm" type="text" value="'+mm+'" style="width:60px;" /> mm @ F/ <input type="text" value="'+f+'" class="f" style="width:40px;" /><a class="remove" style="float:right">Remove</a></div>');
}

function read_form(is_slider)
{
	var results = new Array();
	var l;
	
	$('#img_width').val(Math.round(100*Math.max($('#img_width').val(),0.01))/100);		
	
	switch($("*[name='size']:checked").val())
		{
		case "head":
		  l=0.6;	  
		  break;
		case "person":
		  l=2;		  
		  break;
		default:			  
		  l=Math.round(parseFloat($('#img_width').val())/3*2*100)/100;		  
	}
	
	var url;
	var hash;
	url="http://howmuchblur.com/#";
	hash="compare-";
	
	$(".input_line").each(function(index, value){
	
		$(this).children('.crop').val(Math.round(100*Math.max($(this).children('.crop').val().match(/[0-9]*\.{0,1}[0-9]{0,2}/,''),0.01))/100);
		$(this).children('.mm').val(Math.round(Math.max($(this).children('.mm').val().match(/[0-9]*\.{0,1}[0-9]{0,2}/,''),1)));
		$(this).children('.f').val(Math.round(100*Math.max($(this).children('.f').val().match(/[0-9]*\.{0,1}[0-9]{0,2}/,''),0.01))/100);
		
		var crop = $(this).children('.crop').val();
		var mm = $(this).children('.mm').val();
		var f = $(this).children('.f').val();
		
		hash=hash+crop+"x-"+mm+'mm-f'+f;
		
		if (index<$(".input_line").length-1)
		{
			hash=hash+"-and-";
		}
		
		results.push({label:crop.toString()+"x crop, "+mm.toString()+"mm @ F/"+f.toString(),data:dof(crop, mm, f, l)})
	});
	
	
	switch($("*[name='size']:checked").val())
		{
		case "head":
		 hash = hash+"-on-a-0.9m-wide-subject";
	    break;
		case "person":
		 hash = hash+"-on-a-3m-wide-subject";
		break;
		default:			  
		  hash = hash+"-on-a-"+$('#img_width').val()+'m-wide-subject';
	
	}
	
	$("#url_box").val(url+hash);
	window.location.hash=hash;
       	
	return results;
}

function dof(C, f, N, L)
{

	var Sy=24/1000;
	var Sx=36/1000;
	var f=f*C/1000;
	var N=N*C;

	var ms=Sy/L; 
	var s=f/ms; 
	
	var blur = new Array();
	
	var limits = $( "#slider" ).slider( "option", "values" );
	
	var i=ticks[limits[0]][0]-0.00000001;
	blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);
	
	for (var i=0.01; i<=0.1; i=i+0.00025)
	{		
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	for (var i=0.1; i<=1; i=i+0.0025)
	{		
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	for (var i=1; i<=10; i=i+0.025)
	{	
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	for (var i=10; i<=100; i=i+0.25)
	{		
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	for (var i=100; i<=1000; i=i+2.5)
	{		
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	for (var i=1000; i<=10000; i=i+25)
	{		
		if (i>=ticks[limits[0]][0] && i<=ticks[limits[1]][0]) {blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);}
	}
	
	var i=ticks[limits[1]][0]+0.00000001;
	blur.push([i, 100*((f*ms)/N)*((i)/(s+i))/Sx]);
	
	return blur;
}

});
