$(function(){
    var isNewRndItem = false;//是否可以生成新的元素  
    var gameScore =0;//游戏得分
    var maxScore = localStorage.getItem('maxScore') || 0;
    maxScore = maxScore-0;//历史最高分

    init();
    // 游戏初始化
    function init(){
      // 历史最高分
      $('#maxScore').html(maxScore) 
      // 当前得分
      $("#gameScore").html(gameScore);
      // 随机生成两个数字
      newRndItem();
      newRndItem();
      // 生成颜色
      refreshColor();
    }
    // 获取当前元素旁边的元素
    function getSideItem(current,direction){
      // 获取当前,xy坐标分别是多少
      var currentX = current.attr('x')-0;//获取属性名，将字符串转换为数字
      var currentY = current.attr('y')-0;//获取属性名，将字符串转换为数字
      // 根据不同的方向,获取对应旁边的元素坐标位置
      var sideX;
      var sideY;
      switch(direction){ 
        case 'left':
          sideX = currentX;
          sideY = currentY-1;
          break;
        case 'up':
          sideX = currentX-1;
          sideY = currentY;
          break;
        case 'right':
          sideX = currentX;
          sideY = currentY+1;
          break;
        case 'down':
          sideX = currentX+1;
          sideY = currentY;
          break;
      }
      // 通过x?y?的class获取对应坐标的元素
      return $('.x'+sideX+'y'+sideY);
    }
    // 每一个元素的移动
    function itemMove(current,direction){
      var sideItem =  getSideItem(current,direction);
      // 判断几种情况
      if(sideItem.length==0){//没有获取到元素(在边框旁)
        // 不动
      }else if(sideItem.html()==''){
        // 旁边的元素中没有内容(空格子)
        // 1.将当前元素移动到傍边的格子中,同时将emptyItem类移除,并添加新类nonEmptyItem
        sideItem.html(current.html()).removeClass('emptyItem').addClass('nonEmptyItem')
        // 2.清除当前元素的内容,并同时修改对应的class
        current.html('').removeClass('nonEmptyItem').addClass('emptyItem')
        // 自调,一步移动到不能移动的位置为止
        itemMove(sideItem,direction)
        // 可以生成新元素
        isNewRndItem = true;
      }else if(current.html()!=sideItem.html()){//当前元素的内容和旁边元素的内容不一样, 则不动
        // 当前元素和旁边内容不一样
        // 不动
      }else{//当前元素和旁边内容一样
        //进行合并
        sideItem.html((sideItem.html()-0)*2)
        // 将当前元素清空
        current.html('').removeClass('nonEmptyItem').addClass('emptyItem')
        // 可以生成新元素
        isNewRndItem = true;
        // 分数 加分
        gameScore = sideItem.html()-0 + gameScore;
        $('#gameScore').html(gameScore);
        // 判断当前得分是否是最高分
        if(gameScore > maxScore){
          maxScore = gameScore;
          // 重新保存最高分
          localStorage.setItem('maxScore',maxScore)
          $('#maxScore').html(maxScore)
        }
      }
    }
   // 移动(方向)
  function move(direction){
    // 获取所有非空格子
    var nonEmptyItems = $(".nonEmptyItem");
    // console.log(nonEmptyItems);
    // 如果方向是向左或上,正向遍历,否则反过来遍历
    if(direction=="left" || direction=="up"){//正
      for(var i=0;i<nonEmptyItems.length;i++){
        var current = nonEmptyItems.eq(i); //jq对象
        // 遍历的每一个元素开始移动
        itemMove(current,direction);
      }
    }else{//反向遍历
      for(var i=nonEmptyItems.length-1;i>=0;i--){
        var current = nonEmptyItems.eq(i); //jq对象
        itemMove(current,direction);
      }
    }
    // 判断是否可以生成新元素
    if(isNewRndItem){
      // 关闭开关,等待下次判断
      isNewRndItem = false;
      newRndItem();
      refreshColor(); // 设置颜色
    }
    // 判断游戏是否结束
    isGameOver();
  }

    // 获取随机数字
    function newRndItem(){
      // 随机生成新数字
      var newRndArr = [2,2,4];
      // 获取随机数
      var r = getRndNum(0,2);
      var num = newRndArr[r]; // 得到元素数字
      console.log(num);
      // 获取所有空的格子
      var emptyItems = $(".item.emptyItem");
      // 随机取其中一个格子
      var newRndSite = getRndNum(0,emptyItems.length-1);
      // 将数字放进去同时删除其emptyItem,并添加nonEmptyItem
      emptyItems.eq(newRndSite).html(num).removeClass("emptyItem").addClass("nonEmptyItem")
    }
    // 获取随机数
    function getRndNum(min,max){//封装的一个取随机整数的方法
      var a = Math.random()*(max-min+1)+min;
      return Math.floor(a);
    }
    // 根据元素的数字刷新每个元素的背景颜色
    function refreshColor(){
      // 获取16个格子
      var items = $('.item')
      // 遍历,根据每个元素的内容设置其对应的颜色
      for(var i=0;i<items.length;i++){
        var item = items.eq(i)
        var num = item.html();
        switch(num){
          case '':
            item.css('background-color','rgb(255, 255, 255)')
            break;
          case '2':
            item.css('background-color','rgb(248, 210, 139)')
            break;
          case '4':
            item.css('background-color','rgb(253, 171, 17)')
            break;
          case '8':
            item.css('background-color','rgb(170, 111, 2)')
            break;
          case '16':
            item.css('background-color','rgb(245, 134, 82)')
            break;
          case '32':
            item.css('background-color','rgb(243, 85, 12)')
            break;
          case '64':
            item.css('background-color','rgb(124, 43, 5)')
            break;
          case '128':
            item.css('background-color','rgb(248, 37, 37)')
            break;
          case '256':
            item.css('background-color','rgb(105, 3, 3)')
            break;
          case '512':
            item.css('background-color','rgb(235, 18, 108)')
            break;
        }
      }
    }
    // 判断游戏是否结束
    function isGameOver(){
      var items = $('.item')
      // 获取所有非空元素
      var nonEmpty = $('.nonEmptyItem')
      // 判断每一个元素是否都是非空元素
      if(items.length==nonEmpty.length){
        // 遍历检测每一个元素
        for(var i=0;i<items.length;i++){
          var current = items.eq(i);
          var sideItem = getSideItem(current,'left')
          if(sideItem.length!=0 && current.html() == sideItem.html()){//可以移动
            return;
          }
          var sideItem = getSideItem(current,'up')
          if(sideItem.length!=0 && current.html() == sideItem.html()){//可以移动
            return;
          }
        }
        // 循环过程if判断都不满足,游戏结束
        $('#gameOverModal').modal('show')
      }
      
    }
    // 刷新游戏，重新开始
    $('.refreshBtn').click(function(){
      // 1.模态框消失
      $('#gameOverModal').modal('hide')
      // 2.重置得分
      gameScore = 0;
      // 3.清空所有格子
      $('.item').html('').removeClass('nonEmptyItem').addClass('emptyItem')
      init();
    })
    // 添加键盘事件
    $('body').keydown(function(e){
        switch(e.keyCode){
            case 37:move('left');break;
            case 38:move('up');break;
            case 39:move('right');break;
            case 40:move('down');break;
        }
    })
    

  });
  
  