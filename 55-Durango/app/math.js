var spareRandom = null;
 
function normalRandom()
{
	var val, u, v, s, mul;
 
	if(spareRandom !== null)
	{
		val = spareRandom;
		spareRandom = null;
	}
	else
	{
		do
		{
			u = Math.random()*2-1;
			v = Math.random()*2-1;
 
			s = u*u+v*v;
		} while(s === 0 || s >= 1);
 
		mul = Math.sqrt(-2 * Math.log(s) / s);
 
		val = u * mul;
		spareRandom = v * mul;
	}
	
	return val / 14;	// 7 standard deviations on either side
}
 
function normalRandomInRange(min, max)
{
	var val;
	do
	{
		val = normalRandom();
	} while(val < min || val > max);
	
	return val;
}
 
function normalRandomScaled(mean, stddev)
{
	var r = normalRandomInRange(-1, 1);
 
	r = r * stddev + mean;
 
	return Math.round(r);
}
 
function lnRandomScaled(gmean, gstddev)
{
	var r = normalRandomInRange(-1, 1);
 
	r = r * Math.log(gstddev) + Math.log(gmean);
 
	return Math.exp(r);
}
