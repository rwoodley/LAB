window.onload = function() {
    var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    //var paper = Raphael(0,0,400,440);
    
    var mapPathStraight = function (path, matrix) {
        if (!matrix) {
            return path;
        }
        var x, y, i, j, ii, jj, pathi;
        //path = path2curve(path);
        path = Raphael.parsePathString(path);
        for (i = 0, ii = path.length; i < ii; i++) {
            pathi = path[i];
            for (j = 1, jj = pathi.length; j < jj; j += 2) {
                x = matrix.x(pathi[j], pathi[j + 1]);
                y = matrix.y(pathi[j], pathi[j + 1]);
                pathi[j] = x;
                pathi[j + 1] = y;
            }
        }
        return path;
    };
    
    //var path = "M10,20L30,40";
    //paper.path(path).attr({stroke: "red", "stroke-width": 3});
    //var trans = "t100,100s2,2";
    var ps = document.getElementById('Layer_1').getElementById('path2398').getAttribute('d');
    var points = Raphael.parsePathString(ps);
    console.log(points);
     
}
