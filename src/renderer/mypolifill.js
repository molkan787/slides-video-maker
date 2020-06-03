String.prototype.replaceAll = function (search, replacement){
    return this.replace(new RegExp(search, 'g'), replacement);
}

Object.clone = obj => JSON.parse(JSON.stringify(obj));

Object.patch = function(obj, patch){
    for(let prop in patch){
        obj[prop] = patch[prop];
    }
    return obj;
}