const svg = document.getElementById("mySVG");
            const other=document.getElementById("path-and-hours");
            var hd=document.getElementById("handHr");
            var hn=document.getElementById("handSc");
            var gHours=document.getElementById("hours");
            var gDots=document.getElementById("dots");
            var h=0;

            var cxVal=200;
            var cyVal=215;

            //change the x and y position of both circles
            circleOne=document.getElementById("inside-circle");
            var r=parseFloat(circleOne.getAttribute("r"));
            
            circleTwo=document.getElementById("outside-circle");
            circleTwo.setAttribute("fill","red");
            circleTwo.setAttribute("style","opacity:0.1;")
            circleOne.setAttribute("cx",cxVal);
            circleTwo.setAttribute("cx",cxVal);
            circleOne.setAttribute("cy",cyVal);
            circleTwo.setAttribute("cy",cyVal);

            var xVal=cxVal-r;
            var yVal=cyVal-r;

            other.setAttribute("transform","translate("+xVal+" "+yVal+")");
            xVal=cyVal-r;
            yVal=r-cxVal;
            gHours.setAttribute("transform","translate("+xVal+" "+yVal+") rotate(-90 "+cxVal+" "+cyVal+")");

            function stroke(rot) {
                let dash = document.createElementNS("http://www.w3.org/2000/svg", "path");
                dash.setAttributeNS(null, "id", "dash");
                dash.setAttributeNS(null, "d", "M 165 20 L "+r+" 25");
                dash.setAttributeNS(null, "transform", "translate("+cxVal+" "+cyVal+") rotate(+" + rot + " 0 0)");
                dash.setAttributeNS(null, "fill", "none");
                dash.setAttributeNS(null, "stroke", "black");
                dash.setAttributeNS(null, "stroke-width", "5");
                svg.appendChild(dash);
            }
 
            function numbers(num,rot) {
                var number=document.createElementNS("http://www.w3.org/2000/svg", "text");
                number.setAttribute("x",353);
                number.setAttribute("y",200);
                number.setAttribute("fill","red");
                number.setAttribute("dominant-baseline","middle");
                number.setAttribute("style","text-anchor:middle; font-family:Helvetica; font-weight: bold; font-size:20px;");
                number.setAttribute("transform","rotate("+rot+" 200 200)");
                var textNode=document.createTextNode(num);
                number.appendChild(textNode);
                gHours.appendChild(number);
            }

            function change() {
                hn.setAttribute("transform","rotate("+h+" 200 200)");
                h=h+1;
            }

            setInterval(change,1000);                    //change position of seconds hand every second 

            for (var i=1;i<=24;i++){
                var rot=i*360/24;
                stroke(rot);
                numbers(""+i,rot);
            } 

            var meteoTab = [];

            for(var i=0;i<24;i++) meteoTab[i]=weatherDot(i*360/24,"weatherDot"+i);

            function updateTime() {
                var now=new Date();
                var epoch=now.getTime()/1000;
                var h=now.getHours();
                var m=now.getMinutes();
                var s=now.getSeconds();

                document.getElementById("heureActu").innerHTML=h;
                document.getElementById("minuteActu").innerHTML=m;
            }

            function initialise() {
                //the digital time in the ellipse it updated every seconds
                setInterval(updateTime,1000);
            }

            window.onload=initialise;

            var move=document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
            //creation of the animateTransform and its attributes for the hour hand
            move.setAttribute("attributeName","transform");
            move.setAttribute("attributeType","XML");
            move.setAttribute("type","rotate");
            move.setAttribute("to","360 200 200");
            move.setAttribute("dur","36000s")
            move.setAttribute("repeatCount","indefinite");
            updateHourHand()

            function updateHourHand() {
                var now=new Date();
                var h=now.getHours();
                var m=now.getMinutes();
                var h=h+(m/60);                              //calculate the real time it is actually
                var val=(h-12)*15;                           //every hour value covers an angle of 15 degrees from 12hours
                move.setAttribute("from",""+val+" 200 200"); //position the hour hand at the right angle hence right time
            }
            hd.appendChild(move);

            function weatherDot(rot,id) {
                var dot = document.createElementNS("http://www.w3.org/2000/svg", 'circle');
                dot.setAttribute("id",id);
                dot.setAttribute("cx",cxVal+180);
                dot.setAttribute("cy",cyVal);
                dot.setAttribute("r","12");
                dot.setAttribute("transform","rotate(+"+rot+" "+cxVal+" "+cyVal+")");
                dot.setAttribute("fill","black");
                dot.setAttribute("stroke","none");

                gDots.appendChild(dot);
                return(dot);
            }

            function weatherAdjust(jmeteo) {
                var h=jmeteo.hourly;
                var tmin=9999;
                var tmax=-9999;
                for(var i=0;i<24;i++) {
                    if( h[i].temp>tmax ) tmax=h[i].temp;
                    if( h[i].temp<tmin ) tmin=h[i].temp;
                }
                for(var i=0;i<24;i++) {
                    var f=(h[i].temp-tmin)/(tmax-tmin);
                    meteoTab[i].setAttribute("fill","rgb("+(f*255)+",0,"+(255-f*255)+")");
                }
            }   

            function meteo() {
                var  url="https://api.openweathermap.org/data/2.5/onecall?lat=25.1133769&lon=121.5326731&units=metric&lang=fr&appid=be86f6f24b0cb9b8a29dd94c564c5fa7"

                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        var jmeteo=JSON.parse(this.responseText);
                        weatherAdjust(jmeteo);
                    }
                };
                request.open("GET", url, true);
                request.send();

            }