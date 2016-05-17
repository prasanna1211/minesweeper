$(document).ready(function() {
  var gameover = 0, move = 0;
  var Minewidth = 10; Mineheight = 10, Bombcount = 25;
  var dx = [-1,-1,-1,0,0,1,1,1];
  var dy = [-1,0,1,-1,1,-1,0,1];
  var cell = function(rowno,colno) {
    this.rno = rowno;
    this.colno = colno;
    this.bomb = 0;
    this.neighbourCount = 0;
    // 0 Closed, 1 empty  
    this.leftclickstate = 0;
    //0 no flag, 1 flag
    this.rightclickstate = 0;
  }
  var Mine = function (rowsize, colsize) {
    this.row = rowsize;
    this.col = colsize;
    this.gameover=0;
    this.initializeMine();                                                       
  }
  
  Mine.prototype.initializeMine = function(){
    this.Mine = new Array(this.row);
    for(var i=0; i<this.row; i++) {
      this.Mine[i] = new Array(this.col);
      var html = '<div class = "row">'+'\n';
      for(var j=0; j<this.col; j++) {
        this.Mine[i][j] = new cell(i,j);
        html += '<div class = "cell closed" data-row='+i+' data-col='+j+'></div>\n';
      }
      $(".field").append('</div'+html); 
    }
  }; 
  
  Mine.prototype.plantBomb = function(bomb,r,c){
    for(var i=1; i<=bomb;i++) {
      var randomr = Math.floor(Math.random()*r);
      var randomc = Math.floor(Math.random()*c);
      if(this.Mine[randomr][randomc!=0]) {
        bomb++;
        continue;
      }
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
  Mine.prototype.gameOver= function(r,c,rsize,csize){
    this.gameover = 1;
    for(var i=0;i<rsize;i++) {
      for(var j=0;j<csize;j++) {
        if(this.Mine[i][j].bomb) {
          this.Mine[i][j].leftclickstate = 1;
        }
      }
    }
  };

  Mine.prototype.exposeCells= function(r,c,rsize,csize){
    if(this.Mine[r][c].neighbourCount>0) {
      this.Mine[r][c].leftclickstate=1;
      return;
    }
    this.Mine[r][c].leftclickstate=1;
    for(var i=0; i<8;i++) {
      x=r+dx[i];
      y=c+dy[i];  
      if(x>=0 && x<rsize && y>=0 && y<csize)  {
        if(this.Mine[x][y].bomb == 0 && this.Mine[x][y].leftclickstate==0 && this.Mine[x][y].rightclickstate==0) {
          this.exposeCells(x,y,rsize,csize);
        }
      }  
    } 
    return;
  };  

  Mine.prototype.leftClickUpdate= function(r,c,rsize,csize){   
      if(this.Mine[r][c].bomb) {
        alert("Game Over. You have stepped on bomb");
        gameover=1;
        this.gameOver(r,c,rsize,csize);
      } 
      else {
        this.exposeCells(r,c,rsize,csize);
      }  
  };
  Mine.prototype.rightClickUpdate= function(r,c,rsize,csize){
    if(this.Mine[r][c].rightclickstate==1) this.Mine[r][c].rightclickstate=0;
    else this.Mine[r][c].rightclickstate=1;
  };

  Mine.prototype.changeBoard= function(r,c){
    $(".field").empty();
    for(var i=0; i<r; i++) {
      var html = '<div class = "row">'+'\n';
      for(var j=0; j<c; j++) {
        html += '<div class = "cell ';
        if(this.Mine[i][j].leftclickstate==0 && this.Mine[i][j].rightclickstate) html += 'closed click-flag" ';
        else if(this.Mine[i][j].leftclickstate==1 && !this.Mine[i][j].bomb)  html += 'click-'+this.Mine[i][j].neighbourCount+'" ';
        else if(this.Mine[i][j].bomb&&this.Mine[i][j].leftclickstate==1) html += 'click-bomb" ';
        else html +='closed" '
        html += 'data-row="'+i+'" data-col="'+j+'">';
        html += '</div>';
        html += '\n';
      }
      $(".field").append('</div'+html);
    }
    for(var i=1; i<9; i++) {
      var selector = ".click-"+i;
      $(selector).append(i);
    }
    move++;
    $(".moves").html(move);
    if(!gameover) {
      $(".closed").mousedown(function(e) {
        if(e.which == 1) {
          var leftclickx = $(this).data("row");
          var leftclicky = $(this).data("col");
          board.leftClickUpdate(leftclickx,leftclicky,Minewidth,Mineheight);
          board.changeBoard(Minewidth, Mineheight);      
        }
        else if(e.which == 3) {
          var rightclickx = $(this).data("row");
          var rightclicky = $(this).data("col"); 
          board.rightClickUpdate(rightclickx,rightclicky,Minewidth,Mineheight);
          board.changeBoard(Minewidth, Mineheight);
        }  
      }); 
    }
  };

  

  $(".closed").mousedown(function(e) {
    if(e.which == 1) {
      var leftclickx = $(this).data("row");
      var leftclicky = $(this).data("col");
      board.leftClickUpdate(leftclickx,leftclicky,Minewidth,Mineheight);
      board.changeBoard(Minewidth, Mineheight);
      
    }
    else if(e.which == 3) {
      var rightclickx = $(this).data("row");
      var rightclicky = $(this).data("col"); 
      board.rightClickUpdate(rightclickx,rightclicky,Minewidth,Mineheight);
      board.changeBoard(Minewidth, Mineheight);
    }  
  }); 
    
});    
  

  


