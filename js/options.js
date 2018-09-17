// (c) 2018 Justinas Banys

function no_warnings_set() {
	var new_paragraph = document.createElement('div');
	new_paragraph.id = 'noWarnings';
	new_paragraph.innerText = 'You currently have no warnings set.'
	document.getElementById('string').appendChild(new_paragraph);
}

function remove_handler(button) {
	var button_id = button.id.slice(0,-6);
	chrome.storage.sync.get({'booleans' : {}}, function(items) {
		var booleans = items.booleans;
		delete booleans[button_id];
		chrome.storage.sync.set({'booleans' : booleans}, function() {
			var row = button.parentNode.parentNode;
			row.parentNode.removeChild(row);
			if (!Object.keys(booleans).length) {
				no_warnings_set();
			}
		});
	});
}

function change_handler(checkbox) {
 	chrome.storage.sync.get({'booleans' : {}}, function(items) {
 		var booleans = items.booleans;
 		booleans[checkbox.id] = checkbox.checked;
 		chrome.storage.sync.set({'booleans' : booleans});
 	});
}

function empty_input(message) {
	var error_popup = document.getElementById('errorPopup');
	error_popup.innerText = message;
	error_popup.classList.toggle('show');
}

function make_row(key,booleans) {
	var new_warning = document.createElement('input');
	new_warning.type = 'checkbox';
	new_warning.id = key + 'check';
	new_warning.className = 'warningCheck';
	new_warning.checked = (booleans[key] != undefined) ? booleans[key] : true;
	new_warning.addEventListener('change', function() {
		change_handler(this);
	}, false);

	var table = document.getElementById('warningTable');
	var row = table.insertRow(0);
	row.id = key + 'row;'
	row.addEventListener('mouseover', function() {
		this.style.backgroundColor = '#E6E6E6';
	});
	row.addEventListener('mouseout', function() {
		this.style.backgroundColor = '#f5f6fa';
	});
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell2.align = 'center';
	var cell3 = row.insertCell(2);
	cell3.align = 'right';
	var label = document.createElement('label');
	label.appendChild(document.createTextNode(key));
	cell1.appendChild(new_warning);
	cell2.appendChild(label);
	var remove_button = document.createElement('span');
	remove_button.id = key + 'Remove';
	remove_button.className = 'remove';
	remove_button.addEventListener('click', function() {
	 	remove_handler(this);
	}, false);
	remove_button.innerHTML = '&times;';
	cell3.appendChild(remove_button);
}

function make_new_row(input) {
	var new_warning = document.createElement('input');
	new_warning.type = 'checkbox';
	new_warning.id = input.value + 'check';
	new_warning.className = 'warningCheck';
	new_warning.checked = input.checked;
	new_warning.addEventListener('change', function() {
		change_handler(this);
	}, false);

	var table = document.getElementById('warningTable');
	var row = table.insertRow(0);
	row.id = input.value + 'row';
	row.addEventListener('mouseover', function() {
		this.style.backgroundColor = '#E6E6E6';
	});
	row.addEventListener('mouseout', function() {
		this.style.backgroundColor = '#f5f6fa';
	});
	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	cell2.align = 'center';
	var cell3 = row.insertCell(2);
	cell3.align = 'right';
	var label = document.createElement('label');
	label.appendChild(document.createTextNode(input.value));
	cell1.appendChild(new_warning);
	cell2.appendChild(label);
	var remove_button = document.createElement('span');
	remove_button.id = input.value + 'Remove';
	remove_button.className = 'remove';
	remove_button.addEventListener('click', function() {
	 	remove_handler(this);
	}, false);
	remove_button.innerHTML = '&times;';
	cell3.appendChild(remove_button);
	return row;
}

function submit_handler() {
	var new_input = document.getElementById('newInput');
	const match = '[A-Za-z ]*';
	new_input.value = new_input.value.match(match);
	if (!new_input.value) {
		const message = "Invalid input.";
		empty_input(message);
	} else if (new_input.value.length < 1) {
		const message = 'Input is missing.';
		empty_input(message);
	} else if (new_input.value.length > 20) {
		const message = 'Input is too long.';
		empty_input(message);
	} else {
		chrome.storage.sync.get({'booleans' : {}}, function(items) {
			var booleans = items.booleans;
			if (Object.keys(booleans).length >= 15) {
				const message = "You have reached the warning limit.";
				empty_input(message);
				return;
			}

			var input_value = new_input.value;
			input_value = input_value.charAt(0).toUpperCase() + input_value.slice(1).toLowerCase();
			if (input_value in booleans) {
				const message = 'The provided warning already exists.';
				empty_input(message);
			} else {
				new_input.checked = true;
				new_input.value = input_value;
				booleans[input_value] = input_value;
				chrome.storage.sync.set({'booleans' : booleans}, function() {
					var string = document.getElementById('noWarnings');
 					if (string) {
 						string.parentNode.removeChild(string);
 					}

					var new_row = make_new_row(new_input)
					document.getElementById('warningTable').appendChild(new_row);
					new_input.value = '';
				});
			}
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.sync.get({'booleans' : {}}, function(items) {
		var booleans = items.booleans;
		if (!Object.keys(booleans).length) {
     	 	no_warnings_set();
     	 	return;
     	}

		for (var key in booleans) {
			make_row(key,booleans);
     	 }
	});

	document.getElementById('submitButton').addEventListener('click', function() {
		submit_handler();
	});

	document.getElementById('error').addEventListener('click', function() {
		empty_input('');
	});

	document.addEventListener('keydown', function(e) {
		if (e.code == "Enter") {
			submit_handler();
		}
	});
});