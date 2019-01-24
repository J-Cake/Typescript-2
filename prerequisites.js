
if (typeof start !== "undefined")
	if (start.value)
		if (process)
			start.value(process.argv);
		else if (window)
			start.value(window);
		else
			start.value();
	else
		throw new TypeError("no start method provided");
