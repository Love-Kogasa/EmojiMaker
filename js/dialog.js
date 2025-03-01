$.dialog = {
  alert( html, title = "Message", load ){
    var dialog = $( `<div class="dialog">
      <nav>${title}</nav>
    </div>` )
    var text = $( `<text>${html}</text>` )
    var close = $( `<center>
      <button>Close</button>
    </center>`)
    var mask = $( "<mask></mask>" )
    close.click(() => {
      dialog.fadeOut( 200 )
      mask.fadeOut( 200 )
      $( "body" ).remove( dialog )
      $( "body" ).remove( mask )
    })
    dialog.hide()
    dialog.append( text )
    dialog.append( close )
    $( "body" ).append( dialog )
    $( "body" ).append( mask )
    dialog.fadeIn( 200 )
    if( typeof load === "string" ){
      text.load( load )
    }
  },
  load( filepath, title = "Window", msg = "Loading..." ){
    this.alert( msg, title, filepath )
  }
}