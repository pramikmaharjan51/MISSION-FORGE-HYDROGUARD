const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const objectives={
 earth:{name:"Water security & drought monitoring",note:"A proposed low-Earth-orbit mission combines precipitation, soil-moisture and thermal observations. The HydroGuard field lab uses NASA POWER precipitation and temperature data to demonstrate a transparent preliminary signal; it is not an official drought forecast.",instruments:["optical","spectrometer","infrared","microwave"],orbits:["leo","geo"]},
 moon:{name:"Lunar surface mapping",note:"Lunar orbiters use imaging and spectrometers to study surface morphology and composition. Orbit and illumination geometry affect observation planning.",instruments:["optical","spectrometer","radio"],orbits:["lunar"]},
 mars:{name:"Mars orbital science",note:"A Mars orbiter can study surface geology and atmospheric properties. Interplanetary transfer and long communication distances create additional mission constraints.",instruments:["optical","infrared","spectrometer"],orbits:["mars"]},
 deep:{name:"Distant galaxy observation",note:"Astronomical observatories use optical and infrared detectors to study distant objects. Pointing stability, detector sensitivity and data handling are important.",instruments:["optical","infrared","spectrometer"],orbits:["helio"]}
};
const instruments={
 microwave:{name:"L-band microwave soil-moisture radiometer",desc:"Proposed active/passive microwave payload concept for monitoring near-surface soil moisture; requires calibration and validation.",mass:28,power:95,data:18,cost:1.9,band:"L-band microwave"},
 optical:{name:"Optical imaging camera",desc:"Visible-light imaging for surface features and cloud patterns.",mass:18,power:65,data:28,cost:1.8,band:"Visible"},
 infrared:{name:"Infrared imaging instrument",desc:"Thermal and infrared observations; requires careful thermal management.",mass:24,power:115,data:38,cost:2.5,band:"Infrared"},
 spectrometer:{name:"Imaging spectrometer",desc:"Measures light across wavelengths to infer material or atmospheric properties.",mass:31,power:125,data:45,cost:3.0,band:"Visible / NIR"},
 radio:{name:"Radio science package",desc:"Uses radio measurements to investigate selected planetary or atmospheric properties.",mass:15,power:45,data:12,cost:1.4,band:"Radio"}
};
const buses={compact:{mass:80,cost:1.2},standard:{mass:120,cost:2},heavy:{mass:190,cost:3.2}};
const powers={small:{watts:250,mass:24,cost:1},medium:{watts:500,mass:42,cost:1.8},large:{watts:850,mass:68,cost:2.8}};
const comms={low:{range:1,mass:8,cost:.5},medium:{range:2,mass:16,cost:1.1},high:{range:3,mass:29,cost:2}};
const props={none:{mass:0,cost:0,delta:0},chemical:{mass:35,cost:1.3,delta:1},electric:{mass:24,cost:2,delta:2}};
const launchers={small:{capacity:300,cost:1.5},medium:{capacity:900,cost:3},heavy:{capacity:2000,cost:5}};
const state={step:0,objective:"earth",instruments:["infrared","microwave"],review:null,launched:false};

const money=n=>n.toFixed(1)+" cr";

function calc(){
 const selected=state.instruments.map(k=>instruments[k]);
 const bus=buses[$("#busSelect").value],power=powers[$("#powerSelect").value],comm=comms[$("#commSelect").value],prop=props[$("#propSelect").value];
 const payloadMass=selected.reduce((a,x)=>a+x.mass,0),payloadPower=selected.reduce((a,x)=>a+x.power,0),data=selected.reduce((a,x)=>a+x.data,0),payloadCost=selected.reduce((a,x)=>a+x.cost,0);
 const mass=bus.mass+power.mass+comm.mass+prop.mass+payloadMass;
 const availablePower=power.watts,usedPower=payloadPower+75+(comm.range*18)+(prop.delta?35:0);
 const capacity=launchers[$('input[name="launch"]:checked').value].capacity;
 const launchCost=launchers[$('input[name="launch"]:checked').value].cost;
 const budget=Number($("#budgetSelect").value);
 const totalCost=bus.cost+power.cost+comm.cost+prop.cost+payloadCost+launchCost;
 const duration=Number($("#durationSelect").value);
 const orbit=$("#orbitSelect").value;
 const orbitOK=objectives[state.objective].orbits.includes(orbit);
 const commOK=(["mars","helio"].includes(orbit)?comm.range>=3:comm.range>=1);
 const powerMargin=availablePower-usedPower;
 const dataMargin=(comm.range*30)-data;
 return {mass,payloadMass,payloadPower,data,availablePower,usedPower,powerMargin,capacity,budget,totalCost,duration,orbit,orbitOK,commOK,dataMargin,selected,launch: $('input[name="launch"]:checked').value};
}

function renderInstruments(){
 $("#instrumentList").innerHTML=Object.entries(instruments).map(([k,x])=>`<div class="instrument-row ${state.instruments.includes(k)?"selected":""}"><div><strong>${x.name}</strong><small>${x.desc}</small><div class="instrument-meta">${x.band.toUpperCase()} · ${x.mass} KG · ${x.power} W · ${x.data} DATA UNITS</div></div><label class="toggle"><input type="checkbox" data-instrument="${k}" ${state.instruments.includes(k)?"checked":""}><span></span></label></div>`).join("");
 $$("[data-instrument]").forEach(el=>el.addEventListener("change",()=>{const k=el.dataset.instrument;if(el.checked)state.instruments.push(k);else state.instruments=state.instruments.filter(x=>x!==k);if(!state.instruments.length){state.instruments=[k];toast("Select at least one instrument.");}renderInstruments();renderAll();}));
}

function renderPayload(){
 const c=calc();$("#payloadStats").innerHTML=`<div class="stat"><b>${c.payloadMass} kg</b><small>PAYLOAD MASS</small></div><div class="stat"><b>${c.payloadPower} W</b><small>PAYLOAD POWER</small></div><div class="stat"><b>${c.data}</b><small>DATA UNITS / DAY</small></div><div class="stat"><b>${money(c.selected.reduce((a,x)=>a+x.cost,0))}</b><small>PAYLOAD COST</small></div>`;
 $("#payloadVisual").style.background=`radial-gradient(circle,#1b3d56 0,transparent ${55+Math.min(30,c.selected.length*7)}%)`;
}

function renderCraft(){
 const c=calc(),issues=[];
 if(c.powerMargin<0)issues.push(`Power shortfall of ${Math.abs(c.powerMargin)} W.`);
 if(c.mass>c.capacity)issues.push(`Mass exceeds launch capacity by ${c.mass-c.capacity} kg.`);
 if(c.totalCost>c.budget)issues.push(`Budget overrun of ${money(c.totalCost-c.budget)}.`);
 if(!c.orbitOK)issues.push("Selected orbit is not a good match for the objective in this simplified model.");
 if(!c.commOK)issues.push("Communications selection is below the modeled range requirement.");
 if(c.dataMargin<0)issues.push("Data generation exceeds the modeled communications throughput.");
 $("#constraintBox").innerHTML=`<strong>LIVE ENGINEERING CHECK</strong><br>${issues.length?issues.map(x=>"⚠ "+x).join("<br>"):"✓ Current modeled constraints are within limits."}<br><br>Mass: ${c.mass} / ${c.capacity} kg · Power margin: ${c.powerMargin} W`;
}

function renderOrbitWarning(){const c=calc();$("#orbitWarning").textContent=c.orbitOK?"✓ Orbit choice is compatible with the selected objective in this simplified educational model.":"⚠ This orbit is not recommended for the selected objective. Reconsider target geometry and mission architecture.";}

function renderReviewMetrics(){const c=calc();$("#reviewMetrics").innerHTML=[["TOTAL SPACECRAFT MASS",`${c.mass} kg / ${c.capacity} kg`],["POWER MARGIN",`${c.powerMargin} W`],["PAYLOAD DATA RATE",`${c.data} units/day`],["COMMUNICATION MARGIN",`${c.dataMargin} units`],["ESTIMATED COST",`${money(c.totalCost)} / ${money(c.budget)}`],["MISSION DURATION",`${c.duration} years`],["SELECTED ORBIT",c.orbit.toUpperCase()]].map(x=>`<div class="metric-line"><span>${x[0]}</span><b>${x[1]}</b></div>`).join("");}

function review(){
 const c=calc(),issues=[];
 if(c.instruments.length===0)issues.push(["fail","No scientific instruments selected."]);
 if(c.powerMargin<0)issues.push(["fail",`Power budget exceeded by ${Math.abs(c.powerMargin)} W. Increase generation or reduce instrument load.`]);
 if(c.mass>c.capacity)issues.push(["fail",`Launch capacity exceeded by ${c.mass-c.capacity} kg. Reduce mass or select a higher-capacity launcher.`]);
 if(c.totalCost>c.budget)issues.push(["fail",`Budget exceeded by ${money(c.totalCost-c.budget)}. Reconsider subsystem and launch choices.`]);
 if(!c.orbitOK)issues.push(["warn","Orbit and objective mismatch. Review target geometry and select a more suitable orbit."]);
 if(!c.commOK)issues.push(["fail","Communications range is insufficient for the selected mission distance in this model."]);
 if(c.dataMargin<0)issues.push(["warn","Modeled data throughput is below the generated data volume. Reduce data rate or improve communications."]);
 
 if(!issues.length)issues.push(["ok","No critical constraints detected in this simplified model. Mission is ready for launch."]);
 
 let score=100;
 issues.forEach(([t])=>score-=t==="fail"?23:t==="warn"?8:0);
 score=Math.max(0,score);
 const critical=issues.some(x=>x[0]==="fail");
 state.review={score,issues,c,critical};
 
 $("#readinessScore").textContent=score;
 $("#readinessTitle").textContent=critical?"Design needs revision":issues.some(x=>x[0]==="warn")?"Conditionally ready":"Mission design looks feasible";
 $("#readinessDesc").textContent=critical?"Resolve the critical constraints before attempting the simulated launch.": "This educational model found no critical constraint violations. Review assumptions before interpreting the result.";
 $("#readiness .readiness-ring").style.borderColor=critical?"var(--red)":issues.some(x=>x[0]==="warn")?"var(--orange)":"var(--green)";
 $("#issueList").innerHTML=issues.map(([t,msg])=>`<div class="issue ${t==="fail"?"fail":t==="warn"?"warn":""}">${t==="fail"?"✕":t==="warn"?"⚠":"✓"} ${msg}</div>`).join("");
 
 // ALWAYS UNLOCK THE LAUNCH BUTTON
 $("#launchMission").disabled=false;
 $("#launchMission").style.opacity="1";
 $("#launchMission").style.cursor="pointer";
 $("#launchMission").style.borderColor="var(--cyan)";
 $("#launchMission").style.color="var(--cyan)";
 
 $("#missionOutput").textContent=critical?"Launch simulated unlocked, but critical constraints found. The spacecraft will likely fail.":`Review complete. ${c.selected.length} instruments selected for ${objectives[state.objective].name.toLowerCase()}. Estimated cost ${money(c.totalCost)}. Ready for launch.`;
 toast(critical?"Review complete — critical constraints found. Launch at your own risk.":"Review complete. Launch simulation unlocked.");
}

function launch(){
 // If they didn't run the review yet, force one
 if(!state.review) review();
 
 const c=calc(),name=$("#missionName").value||"UNTITLED MISSION";
 const score = state.review.score;
 const isSuccess = score >= 100;
 
 const btn = $("#launchMission");
 btn.textContent = "INITIATING LAUNCH SEQUENCE...";
 btn.style.background = "var(--orange)";
 btn.style.color = "#000";
 btn.disabled = true;
 
 $("#readinessTitle").textContent = "LAUNCH IN PROGRESS";
 $("#readinessDesc").textContent = "Telemetry nominal. Spacecraft separating from launch vehicle.";
 
 setTimeout(() => {
   if (isSuccess) {
     // SUCCESS
     $("#missionOutput").innerHTML=`<strong style="color:var(--cyan)">${name.toUpperCase()}</strong><br><br>
     <strong style="color:var(--green)">MISSION SUCCESSFUL</strong><br>
     Orbit insertion confirmed.<br>
     Objective: ${objectives[state.objective].name}<br>
     Instruments: ${c.selected.map(x=>x.name).join(", ")}<br>
     Modeled readiness: ${score}/100<br><br>
     <span style="font-size:10px;color:#91a3b9">Learning outcome: Your design demonstrates how payload choices, power, mass, communications and budget interact to determine mission success.</span>`;
     
     $("#readinessTitle").textContent = "SIMULATION COMPLETE";
     $("#readinessTitle").style.color = "var(--green)";
     $("#readinessDesc").textContent = "The mission has completed its educational simulation sequence.";
     
     btn.textContent = "✓ MISSION LAUNCHED";
     btn.style.background = "var(--green)";
     btn.style.borderColor = "var(--green)";
     btn.style.color = "#000";
     toast("Mission launch simulated successfully.");
   } else {
     // FAILURE
     $("#missionOutput").innerHTML=`<strong style="color:var(--red)">${name.toUpperCase()}</strong><br><br>
     <strong style="color:var(--red)">CATASTROPHIC FAILURE</strong><br>
     The spacecraft crashed during launch/orbit insertion.<br>
     Final readiness score: ${score}/100 (Requires 100).<br><br>
     <span style="font-size:10px;color:#91a3b9">Review the critical failures in the engineering envelope and adjust your mass, power, budget, or communications.</span>`;
     
     $("#readinessTitle").textContent = "MISSION FAILED";
     $("#readinessTitle").style.color = "var(--red)";
     $("#readinessDesc").textContent = "The spacecraft crashed. You must revise your design to reach 100% readiness.";
     $("#readiness .readiness-ring").style.borderColor = "var(--red)";
     
     btn.textContent = "✕ MISSION CRASHED";
     btn.style.background = "var(--red)";
     btn.style.borderColor = "var(--red)";
     btn.style.color = "#fff";
     toast("Launch failed. Review constraints and try again.");
   }
 }, 2500);
}

function renderAll(){
 renderPayload();
 renderCraft();
 renderOrbitWarning();
 renderReviewMetrics();
 if(state.review){
  state.review=null;
  $("#readinessScore").textContent="--";
  $("#readinessTitle").textContent="Awaiting analysis";
  $("#readinessTitle").style.color="";
  $("#readinessDesc").textContent="Design changed. Run the review again.";
  $("#issueList").innerHTML="";
  $("#launchMission").disabled=true;
  $("#launchMission").textContent="SIMULATE MISSION LAUNCH";
  $("#launchMission").style.background="";
  $("#launchMission").style.borderColor="";
  $("#launchMission").style.color="";
  $("#launchMission").style.opacity="";
  $("#launchMission").style.cursor="";
  $("#missionOutput").textContent="Run the engineering review to generate an updated report.";
 }
}

// Bind UI Events
$("#runReview").onclick=review;
$("#launchMission").onclick=launch;

const steps=[["PHASE 01 / DEFINE THE SCIENCE","MISSION BRIEF"],["PHASE 02 / SELECT THE PAYLOAD","SCIENCE PAYLOAD"],["PHASE 03 / ENGINEER THE BUS","SPACECRAFT"],["PHASE 04 / PLAN THE FLIGHT","ORBIT & LAUNCH"],["PHASE 05 / VALIDATE THE DESIGN","MISSION REVIEW"]];

function setStep(n){
 state.step=Math.max(0,Math.min(4,n));
 $$(".step-panel").forEach((p,i)=>p.classList.toggle("active",i===state.step));
 $$(".nav-step").forEach((b,i)=>{b.classList.toggle("active",i===state.step);b.classList.toggle("done",i<state.step)});
 $("#stepEyebrow").textContent=steps[state.step][0];
 $("#stepTitle").textContent=steps[state.step][1];
 $("#backBtn").disabled=state.step===0;
 $("#nextBtn").style.display=state.step===4?"none":"inline-block";
 $("#footerHint").textContent=["SELECT A SCIENTIFIC OBJECTIVE TO BEGIN","SELECT INSTRUMENTS THAT MATCH YOUR SCIENCE","BALANCE THE SPACECRAFT SUBSYSTEMS","CHECK ORBIT, LAUNCH CAPACITY AND BUDGET","RUN REVIEW BEFORE SIMULATING THE MISSION"][state.step];
 $("#progressFill").style.width=(state.step/4*100)+"%";
 $("#progressText").textContent=state.step+" / 5 SYSTEMS REVIEWED";
 $("#statusChip").textContent=state.step===4?"● AWAITING VALIDATION":"● DESIGN IN PROGRESS";
 if(state.step===4)renderReviewMetrics();
 $("#workspace").scrollIntoView({behavior:"smooth",block:"start"});
}

$$(".nav-step").forEach(b=>b.addEventListener("click",()=>setStep(Number(b.dataset.step))));
$("#nextBtn").onclick=()=>{if(state.step===0){const o=objectives[state.objective];$("#objectiveNote").textContent=o.note;}setStep(state.step+1);};
$("#backBtn").onclick=()=>setStep(state.step-1);

$$(".objective-card").forEach(b=>b.addEventListener("click",()=>{$$(".objective-card").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.objective=b.dataset.objective;$("#objectiveNote").textContent=objectives[state.objective].note;$("#orbitSelect").value=objectives[state.objective].orbits[0];renderAll();}));
["busSelect","powerSelect","commSelect","propSelect","orbitSelect","durationSelect","budgetSelect"].forEach(id=>$("#"+id).addEventListener("change",renderAll));
$$('input[name="launch"]').forEach(x=>x.addEventListener("change",()=>{$$(".select-card").forEach(c=>c.classList.remove("selected"));x.closest(".select-card").classList.add("selected");renderAll();}));
$("#missionClass").onchange=()=>toast("Difficulty profile updated for your next design iteration.");
$("#beginBtn").onclick=()=>$("#workspace").scrollIntoView({behavior:"smooth"});

function exportReport(){
 const c=calc(),report={project:"MISSION FORGE",version:"1.0",createdAt:new Date().toISOString(),notice:"Educational simulation only. Not flight software, a validated spacecraft design, or NASA-endorsed.",mission:{name:$("#missionName").value,objective:objectives[state.objective].name,difficulty:$("#missionClass").value,orbit:c.orbit,durationYears:c.duration},payload:state.instruments.map(k=>instruments[k]),engineering:{spacecraftMassKg:c.mass,launchCapacityKg:c.capacity,availablePowerW:c.availablePower,modeledPowerUseW:c.usedPower,powerMarginW:c.powerMargin,dataUnitsPerDay:c.data,modeledDataMargin:c.dataMargin,estimatedCostCredits:c.totalCost,budgetCredits:c.budget},launchVehicleClass:c.launch,review:state.review?{score:state.review.score,issues:state.review.issues,criticalConstraints:state.review.critical}:null,hydroGuardData:window.hydroGuardLatest||null,sourceNotes:["NASA Open Data Portal: https://data.nasa.gov/","NASA Planetary Data System: https://pds.nasa.gov/","NASA JPL Horizons: https://ssd.jpl.nasa.gov/horizons/","NASA NSSDCA: https://nssdc.gsfc.nasa.gov/"],assumptions:"All subsystem values and launch class capacities in this prototype are illustrative teaching parameters, not manufacturer specifications."};
 const blob=new Blob([JSON.stringify(report,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mission-forge-report.json";a.click();URL.revokeObjectURL(url);toast("Mission report exported.");
}
$("#exportBtn").onclick=exportReport;
$("#resetBtn").onclick=()=>{if(confirm("Reset your current mission design?"))location.reload();};

function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2600);}

renderInstruments();renderAll();

// HydroGuard: live NASA POWER data
const hydroPlaces={kathmandu:{name:"Kathmandu Valley, Nepal",lat:27.7172,lon:85.3240},dhaka:{name:"Dhaka, Bangladesh",lat:23.8103,lon:90.4125},nairobi:{name:"Nairobi, Kenya",lat:-1.2921,lon:36.8219},phoenix:{name:"Phoenix, USA",lat:33.4484,lon:-112.0740}};
function utcDate(d){return d.toISOString().slice(0,10).replaceAll("-","");}
function validVals(obj){return Object.entries(obj||{}).map(([date,value])=>({date,value:Number(value)})).filter(x=>Number.isFinite(x.value)&&x.value>-900).sort((a,b)=>a.date.localeCompare(b.date));}
function avg(a){return a.length?a.reduce((s,x)=>s+x.value,0)/a.length:null;}
function sum(a){return a.length?a.reduce((s,x)=>s+x.value,0):null;}
function showHydroError(message){$("#dataStatus").textContent=message;toast("NASA data could not be loaded. Check your connection and try again.");}

async function loadHydroGuard(){
 const key=$("#studyArea").value,place=hydroPlaces[key],btn=$("#loadEarthData"),status=$("#dataStatus");btn.disabled=true;btn.textContent="REQUESTING DATA…";status.textContent="Requesting NASA POWER daily precipitation and temperature…";
 try{
  const end=new Date();end.setUTCDate(end.getUTCDate()-3);const start=new Date(end);start.setUTCDate(start.getUTCDate()-59);
  const url=new URL("https://power.larc.nasa.gov/api/temporal/daily/point");url.search=new URLSearchParams({parameters:"PRECTOTCORR,T2M",community:"AG",longitude:String(place.lon),latitude:String(place.lat),start:utcDate(start),end:utcDate(end),format:"JSON","time-standard":"UTC"}).toString();
  const response=await fetch(url.toString());if(!response.ok)throw new Error("NASA POWER returned HTTP "+response.status);
  const json=await response.json();const params=json?.properties?.parameter;if(!params?.PRECTOTCORR||!params?.T2M)throw new Error("The returned dataset did not contain the expected parameters.");
  const rain=validVals(params.PRECTOTCORR),temp=validVals(params.T2M);if(rain.length<35||temp.length<35)throw new Error("Not enough valid daily observations were returned for a 30-day comparison.");
  const recentRain=rain.slice(-30),priorRain=rain.slice(-60,-30),recentTemp=temp.slice(-30),priorTemp=temp.slice(-60,-30);
  const rainNow=sum(recentRain),rainBefore=sum(priorRain),tempNow=avg(recentTemp),tempBefore=avg(priorTemp);
  const rainChange=rainBefore>0?((rainNow-rainBefore)/rainBefore)*100:null,tempChange=tempNow-tempBefore;
  const rainDecline=rainChange===null?0:Math.max(0,-rainChange),heatRise=Math.max(0,tempChange);
  const score=Math.min(100,Math.round(Math.min(65,rainDecline*0.9)+Math.min(35,heatRise*9)));
  const level=score>=65?"Elevated prototype signal":score>=35?"Watch prototype signal":"Lower prototype signal";
  const weights=[1+Math.min(4,rainDecline/20),1+Math.min(3,heatRise/1.5),1+Math.min(4,rainDecline/25+heatRise/2)];const total=weights.reduce((a,b)=>a+b,0);const credits=weights.map(x=>Math.round(x/total*100));credits[2]=100-credits[0]-credits[1];
  const data={source:"NASA POWER Daily API",location:place.name,latitude:place.lat,longitude:place.lon,periodStart:recentRain[0].date,periodEnd:recentRain.at(-1).date,rainfallLast30DaysMm:Number(rainNow.toFixed(1)),rainfallPrevious30DaysMm:Number(rainBefore.toFixed(1)),meanTemperatureLast30DaysC:Number(tempNow.toFixed(1)),prototypeSignalScore:score,observationCredits:{precipitation:credits[0],thermal:credits[1],soilMoistureConfirmation:credits[2]}};
  window.hydroGuardLatest=data;
  $("#labMetrics").innerHTML=`<article><small>30-DAY RAINFALL</small><strong>${rainNow.toFixed(1)} mm</strong><span>Previous 30 days: ${rainBefore.toFixed(1)} mm</span></article><article><small>30-DAY MEAN TEMP</small><strong>${tempNow.toFixed(1)}°C</strong><span>Change: ${tempChange>=0?"+":""}${tempChange.toFixed(1)}°C</span></article><article><small>RAIN CHANGE</small><strong>${rainChange===null?"N/A":`${rainChange>=0?"+":""}${rainChange.toFixed(1)}%`}</strong><span>Recent vs preceding 30 days</span></article><article><small>WATER-STRESS SIGNAL</small><strong>${score}/100</strong><span>${level} · not an official warning</span></article>`;
  $("#observationPlan").innerHTML=`<div class="plan-row"><span>Precipitation change / rainfall mapping</span><b>${credits[0]} credits</b></div><div class="plan-row"><span>Thermal observation / heat pattern</span><b>${credits[1]} credits</b></div><div class="plan-row"><span>Soil-moisture confirmation request</span><b>${credits[2]} credits</b></div><p class="lab-copy">Credits sum to 100. Soil-moisture credits represent a follow-up observation request.</p>`;
  status.textContent=`Loaded ${rain.length} daily rainfall and ${temp.length} temperature records for ${place.name}.`;toast("NASA POWER data loaded.");
 }catch(error){console.error(error);showHydroError(error.message||"Unknown network or data error.");}
 finally{btn.disabled=false;btn.textContent="LOAD NASA EARTH DATA ↗";}
}
$("#loadEarthData").addEventListener("click",loadHydroGuard);

let start=performance.now();
const canvas=$("#orbitCanvas"),ctx=canvas.getContext("2d");
let stars=Array.from({length:90},()=>({x:Math.random(),y:Math.random(),r:Math.random()*1.3+.2,a:Math.random()*.6+.2}));

function draw(t){
 const dpr=window.devicePixelRatio||1,w=canvas.clientWidth,h=canvas.clientHeight;
 if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=w*dpr;canvas.height=h*dpr;}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 stars.forEach(s=>{ctx.globalAlpha=s.a*(.75+.25*Math.sin(t/900+s.x*20));ctx.fillStyle="#d7eaff";ctx.beginPath();ctx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);ctx.fill();});
 ctx.globalAlpha=1;
 const cx=w*.48,cy=h*.54,rx=Math.min(w*.32,145),ry=rx*.48;ctx.strokeStyle="#35526b";ctx.setLineDash([4,6]);ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,-.16,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
 const earthR=Math.max(25,Math.min(39,h*.15));let g=ctx.createRadialGradient(cx-earthR*.3,cy-earthR*.3,2,cx,cy,earthR);g.addColorStop(0,"#83d6ed");g.addColorStop(.55,"#2866a4");g.addColorStop(1,"#0c2447");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,earthR,0,Math.PI*2);ctx.fill();
 ctx.strokeStyle="#6ee7ed";ctx.globalAlpha=.22;ctx.beginPath();ctx.ellipse(cx,cy,earthR*1.35,earthR*.45,-.3,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;
 const a=t/2400;const sx=cx+Math.cos(a)*rx,sy=cy+Math.sin(a-.16)*ry;ctx.save();ctx.translate(sx,sy);ctx.rotate(a+.5);ctx.fillStyle="#ffb86b";ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(6,7);ctx.lineTo(0,4);ctx.lineTo(-6,7);ctx.closePath();ctx.fill();ctx.fillStyle="#d9f4ff";ctx.fillRect(-13,-2,8,4);ctx.fillRect(5,-2,8,4);ctx.restore();
 ctx.fillStyle="#a8c3dd";ctx.font="9px monospace";ctx.fillText("EARTH",cx-earthR,cy+earthR+16);ctx.fillStyle="#ffb86b";ctx.fillText("SPACECRAFT",sx+10,sy-10);$("#missionClock").textContent="T+ "+String(Math.floor(t/1000/3600)).padStart(3,"0")+":"+String(Math.floor(t/1000/60)%60).padStart(2,"0")+":"+String(Math.floor(t/1000)%60).padStart(2,"0");requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
