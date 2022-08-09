function sleep(seg) {
  return new Promise((resolve) => {
    setTimeout(resolve, seg*1000);
  });
}

function decodeString(string) {
    var str = string.toLocaleString().replace(/^\s{2,}/gm, ''); // elinimate blanks at the beggining
    str = str.replace(/\s{2,}$/gm, ''); // eliminate blanks at the end
    str = str.replace(/\s{2,}/gm, ' - '); // eliminate blanks in the midlle
    str = titleCase(str);
    str = decodeURIComponent(str);
    str = decodeEntities(str);
    return str;
};


const titleCase = (phrase) => {
    return phrase
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
};


function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp": " ",
        "amp": "&",
        "quot": "\"",
        "lt": "<",
        "gt": ">"
    };
    return encodedString.replace(translate_re, function (match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function (match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
};


function findKeywordInString(wordsList, str) {
    var found = false;
    wordsList.forEach(function (word) {
        if (str.toLocaleString().toLocaleLowerCase().includes(word.keyword.toLocaleString().toLocaleLowerCase())) {
            found = true;
        }
    })
    return found;
}


function findSiteInLink(siteList, link) {
    var found = false;
    siteList.forEach(function (word) {
        if (link.toLocaleString().toLocaleLowerCase().includes(word.toLocaleString().toLocaleLowerCase())) {
            found = true;
        }
    })
    return found;
}

module.exports = {decodeString, titleCase, decodeEntities, sleep, findKeywordInString, findSiteInLink};



