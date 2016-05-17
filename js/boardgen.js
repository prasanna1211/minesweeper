$(document).ready(function() {
  var gameover = 0;
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
  //board.displayMine(Minewidth,Mineheight);
  //board.displayField(Minewidth,Mineheight);
  board.displayBomb(Minewidth,Mineheight);
  //field.initializeBoard();
  
  //------------------------------------------------------------------------------------------------------
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
      //console.log("outside"+x+" "+y+" "+rsize+" "+csize); 
      if(x>=0 && x<rsize && y>=0 && y<csize)  {
        //console.log("came");
        //console.log("inside "+x+" "+y);  
        //console.log(this.Mine[x][y].bomb);
        //console.log(this.Mine[x][y].leftclickstate);
        //console.log(this.Mine[x][y].rightclickstate);
        if(this.Mine[x][y].bomb == 0 && this.Mine[x][y].leftclickstate==0 && this.Mine[x][y].rightclickstate==0) {
          this.exposeCells(x,y,rsize,csize);
        }
      }  
    } 
    return;
  };  
  Mine.prototype.leftClickUpdate= function(r,c,rsize,csize){
      //display all bombds and disable touching
      //if not bomb open it, expose all fields, change state, change html accordingly   
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

      //display all bombds and disable touching
      //if not bomb open it, expose all fields, change state, change html accordingly   

  };
  Mine.prototype.changeBoard= function(r,c){
      //display all bombds and disable touching
      //if not bomb open it, expose all fields, change state, change html accordingly   

    $(".field").empty();
    for(var i=0; i<r; i++) {
      var html = '<div class = "row">'+'\n';
      for(var j=0; j<c; j++) {
        html += '<div class = "cell ';
        //console.log("debug "+this.Mine[i][j].neighbourCount);
        //console.log("state: "+this.Mine[i][j].rightclickstate);
        if(this.Mine[i][j].leftclickstate==0 && this.Mine[i][j].rightclickstate) html += 'closed click-flag" ';
        else if(this.Mine[i][j].leftclickstate==1 && !this.Mine[i][j].bomb)  html += 'click-'+this.Mine[i][j].neighbourCount+'" ';
        else if(this.Mine[i][j].bomb&&this.Mine[i][j].leftclickstate==1) html += 'click-bomb" ';
        else html +='closed" '
        html += 'data-row="'+i+'" data-col="'+j+'">';
        html += '</div>';
        html += '\n';

      }
      //console.log(html1);
      $(".field").append('</div'+html);
    }
    //console.log($(".field").html());
    //$(".field").append('<div class = "cell closed" data-row='+0+' data-col='+0+'\n');   
    //console.log($(".field").html()); 
    for(var i=0; i<9; i++) {
      var selector = ".click-"+i;
      $(selector).append(i);
    }
    if(!gameover) {
      $(".closed").mousedown(function(e) {
      //alert("clicked");  
        if(e.which == 1) {
          //alert("1");
          var leftclickx = $(this).data("row");
          var leftclicky = $(this).data("col");
          board.leftClickUpdate(leftclickx,leftclicky,Minewidth,Mineheight);
          board.changeBoard(Minewidth, Mineheight);      
        }
        else if(e.which == 3) {
          //alert("3");
          var rightclickx = $(this).data("row");
          var rightclicky = $(this).data("col"); 
          //alert(rightclickx);
          //alert(rightclicky);
          board.rightClickUpdate(rightclickx,rightclicky,Minewidth,Mineheight);
          board.changeBoard(Minewidth, Mineheight);
        }  
      }); 
    }
  };
  
  
  $(".closed").mousedown(function(e) {
    //alert("clicked");  
    if(e.which == 1) {
      //alert("1");
      var leftclickx = $(this).data("row");
      var leftclicky = $(this).data("col");
      board.leftClickUpdate(leftclickx,leftclicky,Minewidth,Mineheight);
      board.changeBoard(Minewidth, Mineheight);
      
    }
    
    else if(e.which == 3) {
      //alert("3");
      var rightclickx = $(this).data("row");
      var rightclicky = $(this).data("col"); 
      //alert(rightclickx);
      //alert(rightclicky);
      board.rightClickUpdate(rightclickx,rightclicky,Minewidth,Mineheight);
      board.changeBoard(Minewidth, Mineheight);
    }  
  }); 
    
});    
  

  


