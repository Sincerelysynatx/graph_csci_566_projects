
function main(){

    let Game = new Game();

    Game.run();

}

class Game{
    constructor(){
        this.world = new World();
        this.player = new Player(10, 10);
    }

    run(){
        let canvas = document.getElementById('webgl');
        let gl = getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }

        this.init();

        let tick = function() {
            this.update();
            this.render(gl);
            requestAnimationFrame(tick, canvas);
        };
        tick();
    }

    init(){

    }

    update(delta){
        this.world.update(delta);
        this.player.update(delta);
    }

    render(gl){

    }
}
//
// function Game(){
//     //member variables of game
//
//
//     this.init = function(){
//         world.init();
//         player.init();
//     };
//
//     this.update = function(){
//         world.update();
//         player.update();
//     };
//
//     this.render = function(gl){
//         gl.clearColor(1, 1, 1, 1);
//
//         gl.clear(gl.COLOR_BUFFER_BIT);
//
//         world.render(gl);
//         player.render(gl);
//     };
// }