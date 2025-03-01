class Item {
  constructor( id = "0", option = {} ){
    this.option = option
    this.id = id
    var elements = this.elements = {
      container: $( `<div id="item-${id}" class="${option.class || "item"}"></div>` ),
      toolbar: $( `<div class="box" style="color: #000;left: 1ch;"></div>` ),
      close: $( "<button>Remove</button>" )
    }
    elements.close.css( {
      "background-color": "red",
      "border": "none"
    } )
    var remove = () => this.remove()
    elements.close.click( () => {
      remove()
    })
    elements.toolbar.append( elements.close )
    elements.toolbar.append( "<br>" )
    elements.container.append( elements.toolbar )
    elements.toolbar.hide()
    elements.container.dblclick(() => elements.toolbar.fadeToggle(200))
    !option.x && (option.x = 0)
    !option.y && (option.y = 0)
    !option.layer && (option.layer = 1)
    this._addoption( "[px]x坐标", ( val ) => {
      option.x = val
      this.move( option.x )
    }, option.x)
    this._addoption( "[px]深度(对于左上角-y坐标)", ( val ) => {
      option.y = val
      this.move( option.x, option.y )
    }, option.y)
    this._addoption( "层(Z坐标)", ( val ) => {
      option.layer = Number(val)
      elements.container.css( "z-index", option.layer )
    }, option.layer )
    this.move( option.x, option.y )
  }
  _addoption( name, event, dv, type = "text" ){
    var input = $( `<input type="${type}" placeholder="${name}">` )
    input.val( dv )
    input.on( "input", () => {
      event( input.val() )
    })
    this.elements.toolbar.append( $( "<i>" + name + ":</i>" ))
    this.elements.toolbar.append( input )
    return input
  }
  show(){
    $( "#emoji" ).append( this.elements.container )
  }
  remove(){
    $( "#item-" + this.id ).fadeOut( 200 )
    $( "#emoji" ).remove( "#item-" + this.id )
  }
  move( x, y = this.option.y ){
    this.set({
      left: x, top: y
    })
  }
  set( ...css ){
    return this.elements.container.css.apply(
      this.elements.container, css
    )
  }
}

class TextItem extends Item {
  constructor( id, option ){
    super( id, option )
    this.elements.text = $( "<span></span>" )
    this.text()
    this.elements.container.prepend( this.elements.text )
    this._addoption( "文本内容", ( val ) => {
      option.text = val
      this.text()
    }, option.text)
    this._addoption( "文本颜色", ( val ) => {
      this.set( "color", val )
    }, this.set( "color" ), "color")
    this._addoption( "文本大小", ( val ) => {
      this.textset( "font-size", val )
    }, 15, "number")
  }
  text( txt = (this.option.text || "双击编辑") ){
    this.elements.text.text( txt )
  }
  textset( ...css ){
    return this.elements.text.css.apply(
      this.elements.text, css
    )
  }
}

class ImageItem extends Item {
  constructor( id, option ){
    super( id, option )
    this.elements.img = $( "<img>" )
    this.elements.container.append( this.elements.img )
    option.src && this.setsrc( option.src )
    this.elements.img.error(() => {
      elements.img.attr( "src", "imgs/img.png" )
    })
    !option.width && (option.width = 50)
    !option.height && (option.height = 50)
    this.imgset( "width", option.width )
    this.imgset( "height", option.height )
    this._addoption( "[px]图片宽度", ( val ) => {
      if( val === 0 ){
        this.imgset( "width", "auto" )
      } else {
        option.width = val
        this.imgset( "width", option.width )
      }
    }, option.width, "number")
    this._addoption( "[px]图片高度", ( val ) => {
      if( val === 0 ){
        this.imgset( "height", "auto" )
      } else {
        option.height = val
        this.imgset( "height", option.height )
      }
    }, option.height, "number")
    var url = this._addoption( "图片URL(或上传文件)", ( val ) => {
      option.src = val
      this.setsrc( option.src )
    }, option.src )
    var file = $( `<input type="file" style="display: none;" id="img${id}">` )
    file.change(async ( e ) => {
      var file = e.target.files[0]
      if( file ){
        option.src = await readFile( file )
        this.setsrc( option.src )
        url.val( option.src )
      }
    })
    this.elements.toolbar.append( file )
    this.elements.toolbar.append( `<button onclick="img${id}.click()">上传</button>` )
  }
  setsrc( src ){
    this.elements.img.attr( "src", src )
  }
  imgset( ...css ){
    return this.elements.img.css.apply(
      this.elements.img, css
    )
  }
}

class BgTextItem extends TextItem {
  constructor( id, option ){
    super( id, option )
    !option.bgc && (option.bgc = "#FFFFFF")
    this.textset( {
      display: "block",
      "background-color": option.bgc
    })
    option.width && this.textset( "width", option.width )
    option.height && this.textset( "width", option.height )
    option.bgc && this.textset( "background-color", option.bgc )
    option.pad && this.textset( "padding", option.pad )
    this._addoption( "背景颜色", ( val ) => {
      option.bgc = val
      this.textset( "background-color", option.bgc )
    }, option.bgc, "color" )
    this._addoption( "背景宽度", ( val ) => {
      option.width = val
      this.textset( "width", option.width )
    }, "auto" )
    this._addoption( "背景高度", ( val ) => {
      option.height = val
      this.textset( "width", option.height )
    }, "auto" )
    this._addoption( "边框距离", ( val ) => {
      option.pad = val
      this.textset( "padding", option.pad )
    }, "0px" )
  }
}