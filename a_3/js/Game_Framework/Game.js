function main(){
    var game = new Game();
    game.init();
    game.run(game);
}

var Game = (function () {
    function Game() {
        Game.prototype.world = new World();
        Game.prototype.player = new Player(10, 10);
    }
    Game.prototype.run = function () {
        var canvas = document.getElementById('webgl');
        var gl = getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
        this.init(gl);
        var tick = function () {
            //update delta
            Game.prototype.now = Date.now();
            Game.prototype.delta = Game.prototype.now - Game.prototype.time_last;
            Game.prototype.time_last = Game.prototype.now;

            Game.prototype.update(Game.prototype.delta);

            Game.prototype.render(gl);

            requestAnimationFrame(tick);
        };
        tick();
    };
    Game.prototype.init = function (gl) {
        Game.prototype.time_last = Date.now();
        Game.prototype.world.init(gl);
        Game.prototype.player.init();
    };
    Game.prototype.update = function (delta) {
        this.world.update(delta);
        this.player.update(delta);
    };
    Game.prototype.render = function (gl) {
        gl.clearColor(0, 0, 0, 1);

        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    return Game;
})();

var World = (function () {
    function World() {
        World.prototype.WORLD_SIZE_X = 10;
        World.prototype.WORLD_SIZE_Y = 10;
        World.prototype.TILE_SIZE_PX = 40;
        World.prototype.world_tile = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        World.prototype.world_buffer = 0;

        World.prototype.VSHADER_SOURCE =
            'attribute vec4 a_Position;\n' +
            'void main(){\n' +
            '   gl_Position = a_Position;\n' +
            '}\n';

        World.prototype.FSHADER_SOURCE =
            'uniform vec4 u_FragColor;\n' +
            'void main(){\n' +
            '   gl_FragColor = u_FragColor;\n' +
            '}\n';
    }
    World.prototype.init = function (gl) {
        // World.prototype.program = gl.createProgram();
    };
    World.prototype.update = function (delta) {
    };
    World.prototype.render = function (gl) {
        gl.attachShader(World.prototype.VSHADER_SOURCE);
        gl.attachShader(World.prototype.FSHADER_SOURCE);

        gl.linkProgram(World.prototype.program);
        gl.useProgram(World.prototype.program);
    };
    return World;
})();

var Player = (function () {
    function Player(x, y) {
        Player.prototype.x = x;
        Player.prototype.y = y;
    }
    Player.prototype.init = function () {
    };
    Player.prototype.update = function (delta) {
    };
    Player.prototype.render = function (gl) {
    };
    return Player;
})();

// var Game = (function () {
//
//     function World(){
//         this.world = new World();
//         this.player = new Player(10, 10);
//         this.gameObject = this;
//     }
//
//     this.init = function init(){
//         console.log("calling init");
//         this.world.init();
//         this.player.init();
//     };
//
//     this.run = function run(){
//         let canvas = document.getElementById('webgl');
//         let gl = getWebGLContext(canvas);
//         if (!gl) {
//             console.log('Failed to get the rendering context for WebGL');
//             return;
//         }
//
//         this.init();
//
//         let tick = function(gameObject, gl) {
//             gameObject.update();
//             // gameObject.render(gl);
//             requestAnimationFrame(tick);
//         };
//         tick(this.gameObject, gl);
//     };
//
//     this.update = function update(){
//         // this.world.update(delta);
//         // this.player.update(delta);
//     };
//
//     this.render = function render(gl){
//         gl.clearColor(0, 0, 0, 1);
//
//         gl.clear(gl.COLOR_BUFFER_BIT);
//
//         this.world.render(gl);
//         // this.player.render(gl);
//     };
// })();

// class Game{
//     constructor(){
//         this.world = new World();
//         this.player = new Player(10, 10);
//     }
//
//     run(){
//         let canvas = document.getElementById('webgl');
//         let gl = getWebGLContext(canvas);
//         if (!gl) {
//             console.log('Failed to get the rendering context for WebGL');
//             return;
//         }
//
//         this.init();
//
//         let tick = function() {
//             this.update();
//             this.render(gl);
//             requestAnimationFrame(tick, canvas);
//         };
//         tick();
//     }
//
//     init(){
//
//     }
//
//     update(delta){
//         this.world.update(delta);
//         this.player.update(delta);
//     }
//
//     render(gl){
//
//     }
// }
//
