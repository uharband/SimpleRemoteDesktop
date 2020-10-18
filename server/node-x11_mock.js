function init(){
    console.log('in x11 mock init');
}

function getImageSync(){
    return {width: 100, height:100};
}

function mouseMove(x,y){

}

module.exports.init = init;
module.exports.getImageSync = getImageSync;
module.exports.mouseMove = mouseMove;