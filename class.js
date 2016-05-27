function PolygonsByPath (count, centerX, centerY, offset) {
    this.count   = count;
    this.centerX = centerX;
    this.centerY = centerY;
    this.offset  = offset;
    this.mainHexPointsArray = [];
    this.littleHexPointsArray = [];
    this.hexContainer = document.getElementById('polygons');

    //Метод вычисления точек для одиночного шестиуголника
    //Возвращает двумерный массив [[x,y],[x,y],...]
    this.createOneHexPoints = function(centerX, centerY, radius) {
        var hexPoints = [];
        for (var i = 0; i <= 5; i++) {
            var pointX = centerX+radius*Math.sin(i*Math.PI/3);
            var pointY = centerY+radius*Math.cos(i*Math.PI/3);
            hexPoints.push([pointX, pointY]);
        }
        return hexPoints;
    };

    //Метод, создающий массив точек всех больших многоугольников.
    //Из полученного массива берутся значения позиций для маленьких
    //многоугльников, и углов полей.
    this.createBigHexPointsArray = function() {
        var oneHexPoints = [],
            radius = 0;
        for (var j = 1; j <= this.count; j++) {
            radius += this.offset;
            oneHexPoints = this.createOneHexPoints(this.centerX, this.centerY, radius);
            this.mainHexPointsArray.push(oneHexPoints);
            oneHexPoints = [];
        }
    };

    //Метод построения и отрисовки маленьких многоугольников
    //по углам самого большого (крайнего) многоугольника
    this.buildLittleHex = function(radius) {
        var lastBigHexPoints = this.mainHexPointsArray[this.mainHexPointsArray.length - 1],
            oneHexPoints = [],
            points = '',
            self = this;
        lastBigHexPoints.forEach(function(item) {
            var centerX = item[0];
            var centerY = item[1];
            oneHexPoints = self.createOneHexPoints(centerX, centerY, radius);
            //console.log(oneHexPoints);
            points += 'M';
            oneHexPoints.forEach(function(item) {
                points += item + ',';
            });
            points += 'Z';
            var path = document.createElementNS("http://www.w3.org/2000/svg","path");
            path.setAttributeNS(null,'d',points);
            path.setAttributeNS(null,'stroke-width','1');
            path.setAttributeNS(null,'stroke','#fff');
            path.setAttributeNS(null,'fill','transparent');
            path.setAttributeNS(null,'fill-opacity','1');
            //path.setAttributeNS(null,'filter','url(#f1)');
            self.hexContainer.appendChild(path);
            points = '';
        });
    };

    //Метод построения и отрисовки больших многоугольников
    this.buildHexagons = function() {
        var points = '';
        this.mainHexPointsArray.forEach(function(item, i) {
            points += 'M' + item + 'Z';
        });
        var path = document.createElementNS("http://www.w3.org/2000/svg","path");
        path.setAttributeNS(null,'d',points);
        path.setAttributeNS(null,'stroke-width','1');
        path.setAttributeNS(null,'stroke','#cccccc');
        path.setAttributeNS(null,'fill','#ebebeb');
        path.setAttributeNS(null,'fill-opacity','.1');
        path.setAttributeNS(null,'fill-rule','evenodd');
        this.hexContainer.appendChild(path);
    };

    this.buildLines = function() {
        var first = this.mainHexPointsArray[0];
        var last = this.mainHexPointsArray[this.mainHexPointsArray.length - 1];
        var self = this;
        // console.log(first, last);
        first.forEach(function(itemFirst, i){
            last.forEach(function(itemLast, j){
                if ( j == i ) {
                    // console.log(itemFirst+' '+itemLast);
                    var path = document.createElementNS("http://www.w3.org/2000/svg","path");
                    path.setAttributeNS(null,'d','M'+itemFirst+','+itemLast+'Z');
                    path.setAttributeNS(null,'stroke-width','1');
                    path.setAttributeNS(null,'stroke','#cccccc');
                    path.setAttributeNS(null,'fill','#ebebeb');
                    path.setAttributeNS(null,'fill-opacity','.1');
                    self.hexContainer.appendChild(path);
                }
            });
        });
    };

    this.writeNumbers = function() {
        var self = this;
        var linePoints;
        this.mainHexPointsArray.forEach(function(item, i) {
            console.log(item[1], item[2]);
            var x = item[2][0]-16;
            var y = item[1][1]-(item[1][1]-item[2][1])/2;
            var text = document.createElementNS("http://www.w3.org/2000/svg","text");
            text.setAttributeNS(null,'x',x);
            text.setAttributeNS(null,'y',y);
            text.setAttributeNS(null,'fill','#cccccc');
            text.setAttributeNS(null,'font-size','15px');
            text.setAttributeNS(null,'text-anchor','middle');
            text.setAttributeNS(null,'transform','rotate(90 '+x+' '+y+')');
            text.innerHTML = (i+1)*10;
            self.hexContainer.appendChild(text);
        });
    };

    //Общий метод построения
    this.commonBuilder = function() {
        this.createBigHexPointsArray();
        this.buildHexagons();
        this.buildLittleHex(10);
        this.buildLines();
        this.writeNumbers();
    };
}

var newPath = new PolygonsByPath (10, 275, 275, 25);
newPath.commonBuilder();
