function COM()
{
  const hexLookupTable = new Array(256);
  for (let i = 0; i < 256; i++) hexLookupTable[i] = i.toString(16).padStart(2, '0');

  const hex2tab=[
    "00","01","02","03","04","05","06","07","08","09","0A","0B","0C","0D","0E","0F","10","11","12","13","14","15","16","17","18","19","1A","1B","1C","1D","1E","1F",
    "20","21","22","23","24","25","26","27","28","29","2A","2B","2C","2D","2E","2F","30","31","32","33","34","35","36","37","38","39","3A","3B","3C","3D","3E","3F",
    "40","41","42","43","44","45","46","47","48","49","4A","4B","4C","4D","4E","4F","50","51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F",
    "60","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","70","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F",
    "80","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","90","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F",
    "A0","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF","B0","B1","B2","B3","B4","B5","B6","B7","B8","B9","BA","BB","BC","BD","BE","BF",
    "C0","C1","C2","C3","C4","C5","C6","C7","C8","C9","CA","CB","CC","CD","CE","CF","D0","D1","D2","D3","D4","D5","D6","D7","D8","D9","DA","DB","DC","DD","DE","DF",
    "E0","E1","E2","E3","E4","E5","E6","E7","E8","E9","EA","EB","EC","ED","EE","EF","F0","F1","F2","F3","F4","F5","F6","F7","F8","F9","FA","FB","FC","FD","FE","FF"];
  
  this.hextab= ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F']; // TODO: remove from entire codebase
  this.getHexByte    = function(v)   { return hex2tab[v&0xFF] }
  this.getHexWord    = function(v)   { return hex2tab[v>>8] + hex2tab[v&0xFF] }
  this.getHexMulti   = function(v,m) { return ("0".repeat(m)+v.toString(16)).slice(-m).toUpperCase() }
  this.getBinMulti   = function(v,m) { return ("0".repeat(m)+v.toString(2)).slice(-m).toUpperCase() }
  this.getNumByteArr = function(v)   { let y= Math.floor(v/2**32); return [(v<<24),(v<<16),(v<<8),v,(y<<24),(y<<16),(y<<8),y].map(z=> z>>>24) } // convert JS number to byte array
  this.getByteArrNum = function(arr) { return arr.reduce((a,c,i)=> a+c*2**(56-i*8),0) } // convert byte array to JS number

  this.HEX2RGB       = function(hex)   { var n=parseInt(hex.slice(1),16); return [(n>>16)&0xFF,(n>>8)&0xFF,n&0xFF] }
  this.RGB2HEX       = function(color) { return [hex2tab[color[0]&0xFF],hex2tab[color[1]&0xFF],hex2tab[color[2]&0xFF]] }

  this.RGB2IDX       = function(color,sig_bits)
  {
      const msk = (1<<sig_bits)-1, scl = (8-sig_bits);
      return (((color[2]>>scl)&msk)<<sig_bits<<sig_bits) | (((color[1]>>scl)&msk)<<sig_bits) | ((color[0]>>scl)&msk)
  }

  this.IDX2RGB       = function(idx,sig_bits)
  {
      const msk = (1<<sig_bits)-1, scl = (8-sig_bits);
      return [(idx & msk)<<scl,((idx>>sig_bits) & msk)<<scl,((idx>>sig_bits>>sig_bits) & msk)<<scl];
  }

  this.base64ToArrayBuffer = function(base64)
  {
      try{ var binary_string = window.atob(base64); } catch(e) { return null }
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (var i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes;
  }

  this.ArrayBufferTobase64 = function(buffer) 
  {
      //return btoa(String.fromCharCode.apply(null, new Uint8Array(bytes)));

      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = buffer.byteLength;
      for (var i = 0; i < len; i++) {
          binary += String.fromCharCode( bytes[ i ] );
      }
      return window.btoa( binary );
  }

  this.b64EncodeUnicode = function(str)
  {
    // first we use encodeURIComponent to get percent-encoded Unicode,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }))
  }

  this.b64DecodeUnicode = function(str)
  {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''))
  }

  this.Uint8ArrayFromBase64 = function(base64)
  {
    return Uint8Array.from(window.atob(base64), (v) => v.charCodeAt(0));
  }

  this.Uint8ArrayToBase64 = function(a)
  {
    // 1. Preprocess Uint8Array into String
    // (TODO: fix RAM usage from intermediate array creation)
    var a_s = Array.prototype.map.call(a, c => String.fromCharCode(c)).join(String());
    // 2. Call btoa()
    return btoa(a_s);
  }

  this.DumpBase64 = function(b64body,maxlen,lf)
  {
    var lf = lf===undefined ? "\n" : lf;
    var maxlen = maxlen===undefined ? 1024 : maxlen;
    var re = RegExp(".{1,"+maxlen+"}","g");
    return "var b64 ="+lf+" \""+b64body.match(re).join('"'+lf+'+"')+"\";"+lf
  }

  this.base_convert = function (str, fromBase, toBase)
  {
    if(typeof(fromBase)=='object') { this.fromSymbols = fromBase[0] }
    if(typeof(toBase)  =='object') { this.toSymbols = toBase[0] }
    fromBase = this.fromSymbols.length; toBase = this.toSymbols.length;

    // PARSE INPUT DIGITS ARRAY
    for(var _a = [0], str = str.split(''); str.length > 0 && _a[_a.push(this.fromSymbols.indexOf(str.pop())) - 1] >= 0;);
    var _d = _a.shift() + _a[_a.length-1]>=0 ? _a : null; if (_d === null) return null;

    // BASE CONVERSION
    for (var _n = 0,_a = [],_p = [1]; _n < _d.length; _n++) { _a = add(_a, mul(_d[_n], _p, toBase), toBase); _p = mul(fromBase, _p, toBase) }

    // PARSE OUTPUT DIGITS ARRAY
    for (var _n = _a.length - 1, _o = ''; _n >= 0; _o += this.toSymbols[_a[_n--]]);

    function add(x, y, base) {
        var _m = Math.max(x.length, y.length);
        for(var _c = 0,_n = 0,_r = [],_z; _n < _m || _c; _c = Math.floor(_z / base)) {
          var _z = _c + (_n < x.length ? x[_n] : 0) + (_n < y.length ? y[_n] : 0);
          var _n =  _r.push(_z % base);
        }
        return _r;
    }

    function mul (x, pow, base) {
        for(var _r = x < 0 ? null : []; x > 0; x = x >> 1) {
          if(x & 1) _r = add(_r, pow, base);
          pow = add(pow, pow, base);
        }
        return _r;
    }

    return _o.length==0?this.toSymbols[0]:_o;
  }

  this.symbols = 
  {
    32:function(){return this.base32hex},
    45:function(){return this["qr-alnum"]},
    58:function(){return this.Bitcoin},
    60:function(){return this.appleII},
  "low hex":   ["[0-9][a-f]"],															 // base 16
  "qr-alnum":  ["[0-9][A-Z] $%*+-./:"],                      // base 45
  "Bitcoin":   ["[1-9][A-H]JKLMN[P-Z][a-k][m-z]"],           // base 58
  "appleII":   ["[0-9][A-Z]![#-/][:-@]]^ "],                 // base 60
  "Base64":    ["[A-Z][a-z][0-9]+/"],												 // base 64
  "GUID64":    ["[A-Z][a-z][0-9]-_"]                        // base 64
  }

  this.getsymbols = function(base) {
    if(typeof(base)=="undefined") return "";
    if(typeof(this.symbols[base])=="undefined")
      this.symbols[base] = base<95?
        (this.rng(base<64?"[0-9][A-Z][a-z]+":"[A-Z][a-z][0-9][!-/][:-@][[-`][{-~]").substring(0,base))
      :(this.symbols[base] = base<216?
        this.rng("[\x20-\x7e]\x80[\x82-\x8c]\x8e[\x91-\x9c]\x9e\x9f[\xa1-\xac][\xae-\xff]").substring(0,base)
        :this.rng("[\x00-\xff]").substring(256-base,256));
    if(typeof(this.symbols[base])=="function")  this.symbols[base] = this.symbols[base]();             // process references
    if(typeof(this.symbols[base])=="object")    this.symbols[base] = this.rng(this.symbols[base][0]);  // process range_replace
    return this.symbols[base];
  }

  this.rng = function(recipe) {
    var _a = recipe.match(/\[.-.\]/); if(_a==null) return recipe; else { _a=[_a[0].charCodeAt(1),_a[0].charCodeAt(3)];
    return this.rng(recipe.replace(RegExp("\\[(\\x"+("0"+_a[0].toString(16)).slice(-2)+"-\\x"+_a[1].toString(16)+")\\]","g"),
    String.fromCharCode(..." ".repeat(_a[1]-_a[0]+1).split("").map((_e,_i)=>_i+_a[0])) )) }
  }

  this.ltrim = function(s) { return s.replace(/^ */,"") }
  this.rtrim = function(s) { return s.replace(/ *$/,"") }
  this.trim  = function(s) { return this.rtrim(this.ltrim(s)) }
  this.stripHTML = function(s) { return s.replace(/(&nbsp;|<([^>]+)>)/ig,"") }
 
  this.padding = function(word_arr, padding_arr) 
  {
    let result = [], lim_word;
    for (let i = 0; i < word_arr.length; i++)
    {
      word_arr[i] = this.unescapeHTML(word_arr[i]);
      lim_word = word_arr[i].length > padding_arr[i] ? word_arr[i].substring(0, padding_arr[i]) : word_arr[i];  // Limit the word to its padding width if it exceeds the available space
      if (i > 0) result.push('&nbsp;'.repeat(Math.max(0, padding_arr[i-1] - result[result.length-1].length ))); // Calculate padding and ensure it's non-negative (no negative space)
      result.push(lim_word);                                                                                    // Add the word to the result array
    }
    return result.join('');                                                                                     // Join the array into a single string
  }


  this.MathParser = function()
  {
      p = this.operator = {};
      p["+"] = function(n, m){return n + m}
      p["-"] = function(n, m){return n - m}
      p["*"] = function(n, m){return n * m}
      p["/"] = function(m, n){return n / m}
      p["%"] = function(m, n){return n % m}
      p["^"] = function(m, n){return Math.pow(n, m)}
      p["~"] = function(m, n){return Math.sqrt(n, m)}
      p["&"] = function(m, n){return n & m}
      p["|"] = function(m, n){return n | m}
      p["x"] = function(m, n){return Number("0x"+m)}
      this.custom = {}
    p.f = function(s, n)
    {
      if(Math[s]) return Math[s](n);
      else if(this.custom[s]) return this.custom[s].apply(this, n);
      else throw new Error("Function \"" + s + "\" not defined.");
    }
    this.add = function(n, f){this.custom[n] = f;}

    this.eval = function(e, ig)
    {
      var v = [], p = [], i, _, a, c = 0, s = 0, x, t = !ig ? e.indexOf("^") : -1, d = null;
      var cp = e, e = e.split(""), n = "0123456789ABCDEF.", o = "+-/*^%~&|x", f = this.operator;
      if(t + 1)
        do
        {
          for(a = "", _ = t - 1;  _ && o.indexOf(e[_]) < 0; a += e[_], e[_--] = ""); a += "^";
          for(_ = t + 1, i = e.length; _ < i && o.indexOf(e[_]) < 0; a += e[_], e[_++] = "");
          e = e.slice(0, t).concat((this.eval(a, 1) + "").split("")).concat(e.slice(t + 1));
        }
        while(t = cp.indexOf("^", ++t) + 1);
      for(i = 0, l = e.length; i < l; i++)
      {
        if(o.indexOf(e[i]) > -1)
          e[i] == "-" && (s > 1 || d === null) && ++s, !s && d !== null && (p.push(e[i]), s = 2), "+-".indexOf(e[i]) < (d = null) && (c = 1);
        else if(a = n.indexOf(e[i]) + 1 ? e[i++] : "")
        {
          while(n.indexOf(e[i]) + 1) a += e[i++];
          v.push(d = (s & 1 ? -1 : 1) * a), c && v.push(f[p.pop()](v.pop(), v.pop())) && (c = 0), --i, s = 0;
        }
      }
      for(c = v[0], i = 0, l = p.length; l--; c = f[p[i]](c, v[++i]));
      return c;
    }

    this.parse = function(e)
    {
      var p = [], f = [], ag, n, c, a, o = this, v = "0123456789ABCDEF.+-*/^%~&|x(, )";
      for(var x, i = 0, l = e.length; i < l; i++)
      {
        if(v.indexOf(c = e.charAt(i)) < 0) { for(a = c; v.indexOf(c = e.charAt(++i)) < 0; a += c); f.push((--i, a)) }
        else if(!(c == "(" && p.push(i)) && c == ")")
        {
          if(a = e.slice(0, (n = p.pop()) - (x = v.indexOf(e.charAt(n - 1)) < 0 ? y = (c = f.pop()).length : 0)), x)
            for(var j = (ag = e.slice(n, ++i).split(",")).length; j--; ag[j] = this.eval(ag[j]));
          l = (e = a + (x ? o.operator.f(c, ag) : this.eval(e.slice(n, ++i))) + e.slice(i)).length, i -= i - n + c.length;
        }
      }
      return this.eval(e);
    }

    // C++ style string formatting
    this.format = function(str,substitutes)
    {
      var pos = str.lastIndexOf(",");
      var out = str.substring(pos+1,str.length);
      var str2 = str.substring(0,pos);

      if(substitutes)
        for(var ii in substitutes)
          out = out.replace(RegExp(ii,"g"),substitutes[ii]);      // substitute all variables

      var arr = String(this.parse(out)).split();
      var i = -1;
      function callback(exp, p0, p1, p2, p3, p4)
      {
        if (exp=='%%') return '%';
        if (arr[++i]===undefined) return undefined;
        exp  = p2 ? parseInt(p2.substr(1)) : undefined;
        var base = p3 ? parseInt(p3.substr(1)) : undefined;
        var val;
        switch (p4)
        {
          case 's': val = arr[i]; break;
          case 'c': val = arr[i][0]; break;
          case 'f': val = parseFloat(arr[i]).toFixed(exp); break;
          case 'p': val = parseFloat(arr[i]).toPrecision(exp); break;
          case 'e': val = parseFloat(arr[i]).toExponential(exp); break;
          case 'x': val = parseInt(arr[i]).toString(base?base:16); break;
          case 'X': val = parseInt(arr[i]).toString(base?base:16).toUpperCase(); break;
          case 'd': val = parseFloat(parseInt(arr[i], base?base:10).toPrecision(exp)).toFixed(0); break;
        }
        val = typeof(val)=='object' ? JSON.stringify(val) : val.toString(base);
        var sz = parseInt(p1);                                          // padding size
        var ch = p1 && p1[0]=='0' ? '0' : ' ';                          // isnull? 
        while (val.length<sz) val = p0 !== undefined ? val+ch : ch+val; // isminus?
        return val;
      }
      var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexXd%])/g;
      return str2.replace(regex, callback);
    }
  }

  // https://stackoverflow.com/questions/1293147/how-to-parse-csv-data
  this.CSVParser =
  {
    parse:
    function(csv)
    {
      var arr = csv.match( /\s*(\"[^"]*\"|'[^']*'|[^,]*)\s*(,|$)/g ).map( 
        function (csv)
        {
          let m;
          if (m = csv.match(/^\s*,?$/)) return null; // null value
          if (m = csv.match(/^\s*\"([^"]*)\"\s*,?$/)) return "\""+m[1]+"\""; // Double Quoted Text
          if (m = csv.match(/^\s*'([^']*)'\s*,?$/)) return "'"+m[1]+"'"; // Single Quoted Text
          if (m = csv.match(/^\s*(true|false)\s*,?$/)) return m[1] === "true"; // Boolean
          if (m = csv.match(/^\s*((?:\+|\-)?\d+)\s*,?$/)) return parseInt(m[1]); // Integer Number
          if (m = csv.match(/^\s*((?:\+|\-)?\d*\.\d*)\s*,?$/)) return parseFloat(m[1]); // Floating Number
          if (m = csv.match(/^\s*(.*?)\s*,?$/)) return m[1]; // Unquoted Text
        }
      )
      if(arr[arr.length-1]==null) arr.pop();
      return arr;
    }
    ,
    stringify:
    function(table, replacer)
    {
        replacer = replacer || function(r, c, v) { return v; };
        var csv = '', c, cc, r, rr = table.length, cell;
        for (r = 0; r < rr; ++r)
        {
            if (r) csv += '\r\n';
            for (c = 0, cc = table[r].length; c < cc; ++c)
            {
              if (c) csv += ',';
              cell = replacer(r, c, table[r][c]);
              if (/[,\r\n"]/.test(cell))
                cell = '"' + cell.replace(/"/g, '""') + '"';
              csv += (cell || 0 === cell) ? cell : '';
            }
        }
        return csv;
    }
  }

  this.unescapeHTML = function(str)
  {
    return str
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&amp;/g, '&');
  }

  this.escapeREGEXP = function(str)
  {
    return str
    .replace(/([\.\^\$\*\+\-\?\(\)\[\]\{\}\\\|])/g, "\\$1")
  }

  this.uuid = function()  // UUID v4
  {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  this.default = function(src_obj,default_obj,message)  // create default object when main object is missing
  {
    try
    {
      var cn = this.default.caller.name;
      //if(cn!="EMU_init")
      //oCOM.POPUP.html("default["+cn+"] typeof(src_obj)="+typeof(src_obj)+" Object.keys(src_obj).length="+Object.keys(src_obj).length+" = "+(typeof(src_obj)=="undefined" || Object.keys(src_obj).length==0 ? "default override" : "main"));

      if(typeof(src_obj)=="undefined" || Object.keys(src_obj).length==0) { console.warn(cn+" : proceeding without "+message); return default_obj }
      return src_obj;
    }
    catch({ name, message })
    {
        //oCOM.POPUP.html("error in oCOM.default ["+cn+"]: "+name+" "+message);
    }
  }

  this.toASCIIarr = function(str){for(var a=[],i=0;i<str.length;i++)a.push(str.charCodeAt(i));return a;}  // convert string into array of ascii codes (numbers)
  this.crc16 = function(r){var crc=0xFFFF;var odd; for(var i=0;i<r.length;i++) { crc = crc ^ r[i]; for (var j = 0; j < 8; j++) { odd = crc & 0x0001; crc = crc >> 1; if (odd) { crc = crc ^ 0xA001 }}} return crc };
  this.crc32 = function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r[t])];return(-1^n)>>>0};


  /////// GUI FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////

  this.POPUP = {
    create: function(target_id) 
    { 
      var obj = Object.create(this);
      obj.target_id = target_id;
      obj.id="";
      obj.states={};
      obj.rules={};
      this.el(obj.target_id.dest).innerHTML += obj.target_html();
      return obj 
    },
    id:"",
    states:{},
    rules:{},
    target_id:{"html":"COM_popup","html_txt":"COM_popup_text","class":"appbut","float":false},
    target_html:function(){return "<div class=appbox id=\""+this.target_id.html+"\" style=\""+(this.target_id.float?"position: absolute; z-index: 3; left: 0px; top: 120px;":"")+"\" hidden=\"\"><div id=\""+this.target_id.html_txt+"\"></div></div>"},
    target_btn:function(arg){return "<div class=\"appbut\" onclick=\"oCOM.POPUP.toggle('"+this.target_id.html+"');document.getElementById('"+this.target_id.html_txt+"').innerHTML='';"+(arg===undefined?"":arg.onclick)+"\" style=\"text-align:center;float:right;\">x</div>"},
    el: function(id) { return document.getElementById(id) },
    addRule: function(id,function_obj) { this.rules[id] = function_obj },
    runRule: function(id) { this.id = id; this.rules[id](this) },
    set_state: function(id,val){ this.states[id] = val },
    get_state: function(id){ return this.states[id]===undefined?this.el(id).classList.item(1):this.states[id]},
    update_state: function(id,el){ this.states[id] = el.hidden },
    on: function(id) { this.states[id] = this.el(id).hidden = false },
    off: function(id) { this.states[id] = this.el(id).hidden = true },
    toggle: function(id) { var el=this.el(id); if(el===undefined && el.hidden==null) return null; this.states[id] = el.hidden = !el.hidden ;return el },
    //get_class: function(el,idx) { el.classList.item(idx===undefined?0:idx) },
    set_class: function(el,class1,class2,bool)
    {
      el.hidden = bool;
      if(bool) {el.classList.replace(class2,class1);this.states[el.id]=class1}
      else {el.classList.replace(class1,class2);this.states[el.id]=class2}
      //if(bool) {el.classList.remove(class2);el.classList.add(class1);this.states[el.id]=class1}
      //else {el.classList.remove(class1);el.classList.add(class2);this.states[el.id]=class2}
    },
    toggle_class: function(el,class1,class2)
    {
      this.toggle(el.id);
      this.set_class(el,class1,class2,el.hidden);
    },
    html: function(html,ttl)
    {
      var e = oCOM.POPUP.toggle(this.target_id.html);
      if(e==null) return null;
      if(html==null) e.hidden = true;
      if(ttl) { setTimeout( COM_PopupHTML,ttl*1000 ); e.hidden = false };
      document.getElementById(this.target_id.html_txt).innerHTML += !e.hidden?(html+"<br>"):"";
    }
  }
 
  this.GetHTTP = function(url,responsetype,callback_function,arg)
  {
    // random value (workaround to avoid caching)
    var r = ""; //"?"+btoa(Math.round(Math.random(1)*6*6*6)+"").replace(new RegExp("=","g"),"");
    const xhttp = new XMLHttpRequest();
    xhttp.responseType = responsetype;    // check: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
    xhttp["arg"] = arg;
    xhttp.onload = callback_function;
    xhttp.open("GET", url+r);
    xhttp.send();
  }

  this.Download = function(fileName, data)
  {
    if(data.length===undefined) return;

    var ui8 = new Uint8Array(data.length);
    for(var i=0;i<data.length;i++)
      ui8[i] = data[i];
    var url, mimeType = 'application/octet-stream';
    var blob = new Blob([ui8], {type: mimeType});
    var url = window.URL.createObjectURL(blob);

    console.log("downloadURL('"+url+"', '"+fileName+"')")
    downloadURL(url, fileName);
    setTimeout(function() {
      return window.URL.revokeObjectURL(url);
    }, 2000);
  }

  function downloadURL(data, fileName) {
    var a;
    a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  };

  this.UploadData = new Array();
  this.Upload = function(elementId,callback)
  {
      this.UploadData = [];
      var file = document.getElementById(elementId).files[0];
      if (!file) return;
      oCOM.UploadName = file.name;

      this.fread = new FileReader();
      this.fread.readAsArrayBuffer(file);
      if(typeof(callback)!="function") callback = function() { alert("test") }; // override if needed
      else this.callback = callback;

      function handleEvent(obj)
      {
          return function(levent)
          {
            var data = new DataView(levent.target.result);
            var size = levent.target.result.byteLength;
            this.UploadData = Array(size);
            for (var i = 0; i < size; i++)
              obj.UploadData[i] = data.getUint8(i);
            obj.callback(obj.UploadData);
          }
      }
      this.fread.addEventListener('load',handleEvent(this));
  }
    /////////////////////
    // URL PARSER      //
    /////////////////////

  this.URL =
  {
    url:"",
    uri:{},
    hash:"",
    merge: function (_uri1,_uri2)
    {
      var _o = new Array();
      for(_i in _uri1)
        _o[_i] = _uri1[_i];
      for(_i in _uri2)
        _o[_i] = _uri2[_i]; 
      return _o[_i];
    },
    addURI: function (_uri2)
    {
      for(_i in _uri2)
        if(_uri2[_i])
          this.uri[_i] = _uri2[_i]; // add or override
        else
          delete this.uri[_i];
    },
    getURI: function ()
    {
      var _str = ""
      for(_i in this.uri)
      {
        if(this.uri[_i])
          _str += (_str?"&":"?") + _i + "=" + this.uri[_i];
      }
      return _str;
    },
    parse: function (_url)
    {
      var _ppos = _url.lastIndexOf("#");
      if(_ppos>0) { _url = _url.substring(0,_ppos); this.hash = _url.hash }
      var _urlarr = _url?_url.split("?"):new Array("","");
      var _urlargs = _urlarr[1]?_urlarr[1].split("&"):new Array(_urlarr[0],"");
      this.url = _urlarr[0];
      this.filename = this.url.substring(this.url.lastIndexOf("/")+1,this.url.length);
  
      this.uri = {};
      for(var _i=0;_i<_urlargs.length;_i++)
      {
        if(!(_urlargs[_i]===undefined))
        {
          var a = _urlargs[_i].split("=");
          this.uri[ a[0] ] = a[1];
        }
      }
    }
  }

  /////////////////////
  // EVENT SEQUENCER //
  /////////////////////

  this.addToEventStack = function(event,func)
  {
    console.log("addToEventStack("+event+" "+func.name+")");
    if(o_event==null) var o_event = {};
    o_event[event] = window[event];
    if (typeof window[event] != "function") window[event] = func;
    else { window[event] = function() { if (o_event[event]) o_event[event](); func() } };
  }

    
  /////////////////////////////////
  // DASHBOARD REFRESH SEQUENCER //
  /////////////////////////////////

  // array of functions is called at the pace of EMU_DashboardRefresh_s = Dashboard updates per second   
  this.RefreshEvent_arr = {};
  this.bRefreshEvent = false;

  this.addRefreshEvent = function(func,name,active)
  {
    console.log("addRefreshEvent("+name+")");
    this.RefreshEvent_arr[ name ] = {"func":func,"active":active}
    this.checkActiveEvents();
  }

  this.toggleRefreshEvent = function(name)
  {
    this.RefreshEvent_arr[ name ].active = !this.RefreshEvent_arr[ name ].active;
    this.checkActiveEvents();
    return this.RefreshEvent_arr[ name ].active;
  }

  this.checkActiveEvents = function()
  {
    var bActive = false;
    for(var _o in this.RefreshEvent_arr)
      if(this.RefreshEvent_arr[_o].active) bActive = true;
    this.bRefreshEvent = bActive;
  }
}

oCOM = new COM();
