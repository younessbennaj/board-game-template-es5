/*/
    *** DOM ***

        Tous les navigateurs (web app) propose d'intéragir avec le document qui est rendu
        (rendering) dans la fenêtre du navigateur. On appelle cette cette interface de 
        programmation (ou API: application programming interface) le Document Object
        Model API (ou DOM API).

        Le DOM est une abastraction. C'est à dire qu'on reduit toute la compléxité
        de la représentation des caractéristiques du document (Sa structure, son 
        style et son contenu) en un ensemble d'objet et de noeud. L'interface (API), 
        nous permets de manipuler ces caractéristiques via notre language de programmation:
        JS. 

     *** Document ***

    Document = L'interface document représente la page web chargé dans le navigateur.
      =>  point d'entrée dans le contenu de la page Web (DOM)

    Element = C'est la classe de base la plus générale à partir de laquelle tous 
    les objets d'un Document héritent

/*/

/*/

    *** document.getElementById(id) ***

    => retourne un objet Element décrivant l'objet élément du DOM correspondant 
    à l'ID spécifié.

/*/

/*/ 

    Chaine de prototype d'un élément: 

    let element = document.getElementById('Id');

    element.__proto__ => HTMLHeadingElement Object
    element.__proto__.__proto__ => HTMLElement Object
    element.__proto__.__proto__.__proto__ => Element

    and so on... (Node, EventTarget)

    Hérite des propriétés et méthodes de son interface parent Node et, par extension, du parent de 
    cette interface EventTarget. (e.g: addEventListener())

/*/

/*/

    *** addEventListener(type, gestionnaire) ***

    type => type de l'évenement (string)

    gestionnaire => fonction de callback() appelé 

    title.addEventListener('click', function titleClicked(event) {

        //event => l'évènement qui est passée au gestionnaire (hérite de Event())
    
        //this => lié à event.currentTarget à l'intérieur dans le gestionnaire

    });

/*/


let canvas = document.getElementById('myCanvas');

//We get height and width of the canvas element
//canvas.height;
//canvas.width;

//Return a drawing context (object CanvasRenderingContext2D)
let context = canvas.getContext("2d");

//We draw our first reactangle (from point (0,0), w = 300, h = 300);
//This is the shape of our board
context.strokeRect(0, 0, canvas.width, canvas.width);

/*/

    *** THE BOARD ***

    We know that our board's dimensions are 300 by 300, and he's composed by 3
    lines and 3 column. Accordingly, a tile's dimensions are 300/3 px.

/*/



/*/

    *** BOARD CONSTRUCTOR ***

    var board = new Board(); => return new instance of a board

    params => ctx (Drawing context) and dim (Board dimensions)

    methods: 

        - drawTiles => Draw the tiles in the board 
        

/*/

//Pseudo Class ES5
function Board(ctx, dim) {
    //Drawing context (object CanvasRenderingContext2D)
    this.ctx = ctx;
    //Board dimensions
    this.dim = dim;
    //tile height
    this.tileH = this.ctx.canvas.height / this.dim;
    //tile width
    this.tileW = this.ctx.canvas.width / this.dim;
    //Board's tiles
    this.tiles = [];
    //Current clicked tile
    this.currentTile = {};
    //Style
    this.tileColor = "orangered";

}

//Private methods

Board.prototype.init = function () {

    this.ctx.fillStyle = this.tileColor;

    //Process to draw tiles board in Canvas
    this.drawTiles();

    //Process to build tiles board data structure in memory
    this.buildTiles();

    //Init Events

    //Reference to the instance
    var that = this;

    //Click event on the board game
    function clickOnBoard(event) {
        var cursorPosition = {
            x: event.offsetX,
            y: event.offsetY
        };

        /*/
            This and that

            In event handler, 'this' => bind to event.currentTarget
            However, 'this' in the wrapping context in bind to the new instance
            So, we pass this instance to the 'that' variable.
            In conclusion, in this function => this = event.currentTarget 
            and that = new instance of Board.
        /*/


        //Which tile is clicked?
        //console.log('Tile coordinate: ', 'x : ' + Math.ceil(position.x / tileW), 'y : ' + Math.ceil(position.y / tileH));

        //Tile coordinate in the board
        let tileX = Math.ceil(cursorPosition.x / that.tileW) - 1; // from 0
        let tileY = Math.ceil(cursorPosition.y / that.tileH) - 1; // from 0

        //Find that tile in the tiles data structure
        // tileX === position.x && tileX === position.y
        //Array.find()
        that.currentTile = that.tiles.find(function (element) {
            return element.coord.x === tileX && element.coord.y === tileY;
        });
        //=> We get the current clicked tile (accessible in board.currentTile)
        that.currentTile.color = that.tileColor;
        //Color the selected tile
        that.fillTile(that.currentTile);
    }

    this.ctx.canvas.addEventListener('click', clickOnBoard);
}

//Prototype method => new instance inherite from it (public method)
Board.prototype.drawTiles = function () {

    /*/
        *** drawTiles *** 

        Process to draw tiles board in Canvas

        e.g: drawTile(context, 3) => draw a board with 3*3 tile dimension
        in the given drawing context.

    /*/

    for (var i = 0; i < this.dim; i++) {
        for (var j = 0; j < this.dim; j++) {
            context.strokeRect(
                i * this.tileW,
                j * this.tileH,
                this.tileW,
                this.tileH);
        }
    }

};

Board.prototype.fillTile = function (tile) {
    console.log(tile);
    //x-axis and y-axis coordinates of the rectangle's starting point
    var rectX = this.tileW * tile.coord.x;
    var rectY = this.tileH * tile.coord.y;
    //Draw a fill rect
    this.ctx.fillRect(rectX, rectY, (this.tileW), (this.tileH));
}

Board.prototype.buildTiles = function () {

    // => return an array of Tile Object representing the tiles in Board
    //e.g: [Tile{x: 1, 1}, Tile{x: 1, 2}, ...]

    for (var i = 1; i < this.dim + 1; i++) {

        for (var j = 1; j < this.dim + 1; j++) {
            //tiles data structure => array of Tile() object
            this.tiles.push(new Tile({
                x: (((this.tileW * i) / this.ctx.canvas.width) * this.dim) - 1,
                y: (((this.tileH * j) / this.ctx.canvas.height) * this.dim) - 1
            }));
        }

    }

}

/*/

    *** TILE CONSTRUCTOR

/*/

function Tile(coord) {
    this.coord = coord;
    this.color = "white";
}

/*/ MAIN CODE /*/

var board = new Board(context, 4);
board.init();
