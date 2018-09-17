// (c) 2018 Justinas Banys

function display_no_warnings() {
	var paragraph = document.createElement('div');
	paragraph.id = 'txt';
	paragraph.innerText = 'There are currently no warnings set. Visit Modify Warnings page to add new warnings.';
	document.getElementById('warnings').appendChild(paragraph);
} 

function disable() {
	var paragraph = document.createElement('div');
	paragraph.id = 'txt';
	paragraph.innerText = 'The extension is disabled. Please click Enable button to receive content warnings.';
	document.getElementById('warnings').appendChild(paragraph);
}
 
function confirm_warnings(booleans, enable) {
	var node = document.getElementById('txt');
	if (node) {
		node.parentNode.removeChild(node);
	}

	if (!enable) {
		disable();
		return;
	}

	var paragraph = document.createElement('div');
	paragraph.id = 'txt';
	paragraph.innerText = 'Looking for content related to:';
	var newWarning;
	var key;
	for (key in booleans) {
		if (booleans[key]) {
			newWarning = document.createElement('p');
			newWarning.innerText = key;
			paragraph.appendChild(newWarning);
		}
	}

	if (!paragraph.hasChildNodes) {
		display_no_warnings();
		return;
	}

	document.getElementById('warnings').appendChild(paragraph); 
}

function change_enable_button(enable) {
	var button = document.getElementById('enable-disable-button');
	if (!enable) {
		button.innerText = 'Enable';
		button.style.background = '#ddd';
		button.style.color = 'black';
	} else {
		button.innerText = 'Disable';
		button.style.background = '#086A87';
		button.style.color = 'white';
	}
}

function enable_disable_warnings() {
	chrome.storage.sync.get({'booleans' : {}, 'enable' : true}, function(items) {
		var enable = items.enable;
		enable = !enable;
		chrome.storage.sync.set({'enable' : enable}, function() {
			change_enable_button(enable);
			confirm_warnings(items.booleans,enable);
		});
	});
	
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get({'booleans' : {}, 'enable' : true}, function(items) {
		change_enable_button(items.enable);
		confirm_warnings(items.booleans,items.enable);
	});

	document.getElementById('modify-button').addEventListener('click', function() {
    	window.open('options.html','_blank');
	});

	document.getElementById('enable-disable-button').addEventListener('click', function() {
		enable_disable_warnings();
	});
});