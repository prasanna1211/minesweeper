$(document).ready(function() {
  var Minewidth = 10; Mineheight = 10, Bombcount = 10;
  var dx = [-1,-1,-1,0,0,1,1,1];
  var dy = [-1,0,1,-1,1,-1,0,1];
  var cell = function(rowno,colno) {
    this.rno = rowno;
    this.colno = colno;
    this.bomb = 0;
    this.neighbourCount = 0;
    //-1 Closed, 0 empty  
    this.leftclickstate = -1;
    //0 no flag, 1 flag
    this.rightclickstate = 0;
  }
  var Mine = function (rowsize, colsize) {
    this.row = rowsize;
    this.col = colsize;
    this.initializeMine();
    //this.displayField();                                                         
  }

  //----------------------------------------------------------------------------------
  Mine.prototype.displayField = function(rowsize,colsize){
    for(var i=0; i<rowsize;i++) {
      for(var j=0;j<colsize;j++) {
      console.log(this.Mine[i][j]);
    }
   }
  }; 
  Mine.prototype.displayMine = function(rowsize,colsize){

    for(var i=0; i<rowsize;i++) {
      html = "";
      for(var j=0;j<colsize;j++) {
        html += this.Mine[i][j].rno+','+this.Mine[i][j].colno+' ';
      }
      console.log(html);
    }
  };
  Mine.prototype.displayBomb = function(rowsize,colsize){

    for(var i=0; i<rowsize;i++) {
      html = "";
      for(var j=0;j<colsize;j++) {
        html += this.Mine[i][j].bomb+','+this.Mine[i][j].neighbourCount+' ';
      }
      console.log(html);
    }
  };
  //----------------------------------------------------------------------------------
  
  Mine.prototype.initializeMine = function(){
    this.Mine = new Array(this.row);
    for(var i=0; i<this.row; i++) {
      this.Mine[i] = new Array(this.col);
      var html = '<div class = "row">'+'\n';
      for(var j=0; j<this.col; j++) {
        this.Mine[i][j] = new cell(i,j);
        html += '<div class = "cell closed" data-row='+i+' data-col='+j+'></div>\n';
      }
      //console.log(html1);
      $(".field").append('</div'+html);

      
    }
    console.log($(".field").html());

    //$(".field").append('<div class = "cell closed" data-row='+0+' data-col='+0+'\n');   
    //console.log($(".field").html());
  }; 
  
  Mine.prototype.plantBomb = function(bomb,r,c){
    for(var i=0; i<bomb;i++) {
      var randomr = Math.floor(Math.random()*r);
      var randomc = Math.floor(Math.random()*c);
      this.Mine[randomr][randomc].bomb = 1;
    }     
  };
  Mine.prototype.countNeighbour= function(r,c){
    for(var i=0; i<r; i++) {
      for(var j=0; j<c; j++) {
        for(var k=0;k<dx.length;k++) {
          var nx = i+dx[k], ny = j+dy[k];
          if(nx>=0 && nx<r && ny>=0 && ny<c && this.Mine[i][j].bomb!=1) {
            this.Mine[i][j].neighbourCount += (this.Mine[nx][ny].bomb==1);  
          }
        }
      }
    }
  };
  var board = new Mine(Minewidth,Mineheight);
  
  board.plantBomb(Bombcount,Minewidth,Mineheight);
  board.countNeighbour(Minewidth,Mineheight);
  //board.displayMine(Minewidth,Mineheight);
  //board.displayField(Minewidth,Mineheight);
  //board.displayBomb(Minewidth,Mineheight);
  //field.initializeBoard();
  
  //------------------------------------------------------------------------------------------------------
  Mine.prototype.leftClickUpdate= function(r,c){
       
  };
  $(".closed").mousedown(function(e) {
    if(e.which == 1) {
      //alert("1");
      var leftclickx = $(this).data("row");
      var leftclicky = $(this).data("col");
      board.leftClickUpdate(leftclickx,leftclicky);
    }
    
    else if(e.which == 3) {
      //alert("3");
      var rightclickx = $(this).data("row");
      var rightclicky = $(this).data("col"); 
      alert(rightclickx);
      alert(rightclicky);
      board.RighCtlickUpdate(leftclickx,leftclicky);
    }
  });
  


});
