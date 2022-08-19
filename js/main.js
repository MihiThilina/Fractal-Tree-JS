

var hide = false,
	prog = 1,
	growing = false,
	mutating = false,
	randSeed = 80,
	paramSeed = Math.floor(Math.random()*1000),
	randBias = 0;


function setup(){	
	createCanvas(window.innerWidth, window.innerHeight);
	
	slider_size = createSlider(100, 200, /mobile/i.test(window.navigator.userAgent) ? 100 : 150, 1);
	slider_level = createSlider(1, 13, 11, 1);
	slider_rot = createSlider(0, PI/2, (PI/2) / 4, (PI/2) / (3 * 5 * 8));
	slider_lenRand = createSlider(0, 1, 1, 0.01);
	slider_branchProb = createSlider(0, 1, 0.9, 0.01);
	slider_rotRand = createSlider(0, 1, 0.1, 0.01);
	slider_leafProb = createSlider(0, 1, 0.5, 0.01);

	div_inputs = createDiv('');
	mX = mouseX;
	mY = mouseY;
	panX = 0;
	panY = 0;
	readInputs(false);
	startGrow();
}



function readInputs(updateTree)
{
	size = slider_size.value();
	maxLevel = slider_level.value();
	rot = slider_rot.value();
	lenRand = slider_lenRand.value();
	branchProb = slider_branchProb.value();
	rotRand = slider_rotRand.value();
	leafProb = slider_leafProb.value();
	
	if ( updateTree && !growing )
	{
		prog = maxLevel + 1;
		loop();
	}
}



function draw()
{
	stroke(255, 255, 255);
	background(0, 0, 0);
	translate(width / 2, height);
	scale(1, -1);
	translate(0, 20);
	
	branch(1, randSeed);
	noLoop();
}

function branch(level, seed)
{
	if ( prog < level )
		return;
	
	randomSeed(seed);
	
	var seed1 = random(1000),
		seed2 = random(1000);
		
	var growthLevel = (prog - level > 1) || (prog >= maxLevel + 1) ? 1 : (prog - level);
	
	strokeWeight(12 * Math.pow((maxLevel - level + 1) / maxLevel, 2));

	var len = growthLevel * size* (1 + rand2() * lenRand);
	
	line(0, 0, 0, len / level);
	translate(0, len / level);
	
	
	var doBranch1 = rand() < branchProb;
	var doBranch2 = rand() < branchProb;
	
	var doLeaves = rand() < leafProb;
	
	if ( level < maxLevel )
	{
		
		var r1 = rot * (1 + rrand() * rotRand);
		var r2 = -rot * (1 - rrand() * rotRand);
		
		if ( doBranch1 )
		{
			push();
			rotate(r1);
			branch(level + 1, seed1);
			pop();
		}
		if ( doBranch2 )
		{
			push();
			rotate(r2);
			branch(level + 1, seed2);
			pop();
		}
	}
	
	if ( (level >= maxLevel || (!doBranch1 && !doBranch2)) && doLeaves )
	{
		var p = Math.min(1, Math.max(0, prog - level));
		
		var flowerSize = (size / 100) * p * (1 / 6) * (len / level);

		strokeWeight(1);
		stroke(240 + 15 * rand2(), 140 + 15 * rand2(), 140 + 15 * rand2());
		
		rotate(-PI);
		for ( var i=0 ; i<=8 ; i++ )
		{
			line(0, 0, 0, flowerSize * (1 + 0.5 * rand2()));
			rotate(2 * PI/8);
		}
	}	
}

function startGrow()
{
	growing = true;
	prog = 1;
	grow();
}

function grow()
{
	if ( prog > (maxLevel + 3) )
	{
		prog = maxLevel + 3;
		loop();
		growing = false;
		return;
	}
	
	var startTime = millis();
	loop();
	var diff = millis() - startTime;

	prog += maxLevel / 8 * Math.max(diff, 20) / 1000;
	setTimeout(grow, Math.max(1, 20 - diff));
}


function rand()
{
	return random(1000) / 1000;
}

function rand2()
{
	return random(2000) / 1000 - 1;
}

function rrand()
{
	return rand2() + randBias;
}