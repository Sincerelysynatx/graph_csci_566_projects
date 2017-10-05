

// function World(){
//     this.WORLD_SIZE_X = 10;
//     this.WORLD_SIZE_Y = 10;
//     this.TILE_SIZE_PX = 40;
//     this.world_tile = 0;
//
//     this.VSHADER_SOURCE =
//         'attribute vec4 a_Position;\n' +
//         'void main(){\n' +
//         '   gl_Position = a_Position;\n' +
//         '}\n';
//
//     this.FSHADER_SOURCE =
//         'uniform vec4 u_FragColor;\n' +
//         'void main(){\n' +
//         '   gl_FragColor = u_FragColor;\n' +
//         '}\n';
//
//     this.init = function(){
//         this.world_tile = [
//             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//         ];
//
//
//     };
//
//     this.update = function(delta){
//
//     };
//
//     this.render = function(gl){
//         // console.log(gl);
//     };
// }
//
// class World{
//     constructor(){
//         this.WORLD_SIZE_X = 10;
//         this.WORLD_SIZE_Y = 10;
//         this.TILE_SIZE_PX = 40;
//
//         this.world_tile = [
//             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
//             [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
//         ];
//
//         this.world_buffer = 0;
//     }
//
//     init(){
//
//     }
//
//     update(delta){
//
//     }
//
//     render(gl){
//
//     }
//
// }