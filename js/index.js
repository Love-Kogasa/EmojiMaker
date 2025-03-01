// 读取文件
function readFile( file ){
  return new Promise( ( res, rej ) => {
    var reader = new FileReader()
    reader.onload = ( e ) => {
      res( e.target.result )
    }
    reader.readAsDataURL( file )
  })
}
function dimg( ele ){
  htmlToImage.toPng( ele, {
    style: {
      left: "0px",
      overflow: "hidden"
    }
  } ).then((url) => {
    var a = document.createElement( "a" )
    a.href = url
    a.download = "emoji.png"
    a.click()
  })
}

// 组件用
var idi = 0
function addText(){
  idi += 1
  var text = new TextItem( idi, {text: "双击编辑"})
  text.show()
}
function addImage(){
  idi += 1
  var img = new ImageItem( idi, { src: "imgs/img.png" } )
  img.show()
}
function addBgText(){
  idi += 1
  var btxt = new BgTextItem( idi, { text: "双击编辑" } )
  btxt.show()
}

// 模板
function template1(){
  try {
  var btxt = new BgTextItem( idi, { text: "双击编辑", width: $("#ew").val(), y: lessch( $("#eh").val(), 2.5 ), layer: 9 } )
  // byd bug
  btxt.textset( "width", $("#ew").val() )
  $.dialog.alert( "本模板建议与emoji背景一起使用awa", "小提示" )
  btxt.show()
  return btxt
  function lessch( num, less ){
    var n = Number(num.match( /(\d+?)(ch)/ )[1])
    return (n - less) + "ch"
  }
} catch( err ){
  alert( err )
}
}

// 主代码
$( document ).ready(() => {
  $( "#ew" ).val( "10ch" )
  $( "#ew" ).on( "input", () => {
    $( "#emoji" ).css( "width", $( "#ew" ).val() )
  })
  $( "#eh" ).val( "10ch" )
  $( "#eh" ).on( "input", () => {
    $( "#emoji" ).css( "height", $( "#eh" ).val() )
  })
  $( "#ec" ).val( "#555" )
  $( "#ec" ).on( "input", () => {
    $( "#emoji" ).css( "background-color", $( "#ec" ).val() )
  })
  $( "#add" ).click(() => {
    $.dialog.load( "items.html" )
  })
  $( "#bgimg" ).change(async ( e ) => {
    var file = e.target.files[0]
    if( file ){
      $( "#emoji" ).css(
        "background-image",
        "url(" + await readFile( file ) + ")"
      )
    }
  })
})