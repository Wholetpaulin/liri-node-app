//functionFun!

function example(input, callback) {
	console.log('blah blah blah');
    callback();
}

example('ham', function() {
	console.log(input + "Should be printed last because it's a callback.");
});

