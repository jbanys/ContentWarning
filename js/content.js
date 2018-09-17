// (c) 2018 Justinas Banys

function find_keywords(booleans) {
    var paragraphs = document.getElementsByTagName('p');
    var display_text = '';
    for(var i = 0; i < paragraphs.length; i++) {
        var text = paragraphs[i].innerText.toLowerCase();
        for (var key in booleans) {
            var split_keywords = key.toLowerCase().split(' ');
            var string_match = '';
            for (var k = 0; k < split_keywords.length; k++) {
                string_match += '\\b' + split_keywords[k] + '[a-z]*\\b';
            }

            if (text.match(string_match)) {
                display_text += key.toLowerCase() + ', ';
                delete booleans[key];
                break;
            }
        }
    }

    if (display_text != '') {
        display_text = display_text.slice(0,-2);
        var popup_cw = document.createElement('div');
        popup_cw.className = 'popupCw';
        var container_cw = document.createElement('div');
        container_cw.className = 'containerCw';
        var text_div = document.createElement('p');
        text_div.className = 'textDiv';
        text_div.innerHTML = 'This website may contain content related to ';
        var strong = document.createElement('strong');
        strong.innerHTML = display_text;
        text_div.appendChild(strong);
        text_div.innerHTML += '. Do you want to proceed?';
        container_cw.appendChild(text_div);
        var ok_button_cw = document.createElement('button');
        ok_button_cw.type = 'button';
        ok_button_cw.className = 'okButtonCw';
        ok_button_cw.innerText = 'YES';
        ok_button_cw.addEventListener('click', function() {
            popup_cw.style.display = 'none';
        });

        var no_button_cw = document.createElement('button');
        no_button_cw.type = 'button';
        no_button_cw.className = 'noButtonCw';
        no_button_cw.innerText = 'NO';
        no_button_cw.addEventListener('click', function() {
            window.history.back();
        });

        container_cw.appendChild(ok_button_cw);
        container_cw.appendChild(no_button_cw);
        popup_cw.appendChild(container_cw);
        document.body.appendChild(popup_cw);
    }
}

chrome.storage.sync.get({'booleans' : {}, 'enable' : true}, function(items) {
    if (!items.enable) {
        return;
    }

    find_keywords(items.booleans);
});