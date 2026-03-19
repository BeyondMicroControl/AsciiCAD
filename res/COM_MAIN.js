//     ██████  ███████ ███    ██ ███████ ██████  ██  ██████   
//    ██       ██      ████   ██ ██      ██   ██ ██ ██        
//    ██   ███ █████   ██ ██  ██ █████   ██████  ██ ██        
//    ██    ██ ██      ██  ██ ██ ██      ██   ██ ██ ██        
//     ██████  ███████ ██   ████ ███████ ██   ██ ██  ██████   
//                                                            
//                                                            
//    ██   ██ ███████ ██      ██████  ███████ ██████  ███████ 
//    ██   ██ ██      ██      ██   ██ ██      ██   ██ ██      
//    ███████ █████   ██      ██████  █████   ██████  ███████ 
//    ██   ██ ██      ██      ██      ██      ██   ██      ██ 
//    ██   ██ ███████ ███████ ██      ███████ ██   ██ ███████ 

/////// GENERIC (APP-AGNOSTIC) HELPERS /////////////////////////////////////////////////////////////////
// NOTE: Keep these here so they can be reused from any project via oCOM.<fn>()

function COM()
{
  const hex2tab=[
    "00","01","02","03","04","05","06","07","08","09","0A","0B","0C","0D","0E","0F","10","11","12","13","14","15","16","17","18","19","1A","1B","1C","1D","1E","1F",
    "20","21","22","23","24","25","26","27","28","29","2A","2B","2C","2D","2E","2F","30","31","32","33","34","35","36","37","38","39","3A","3B","3C","3D","3E","3F",
    "40","41","42","43","44","45","46","47","48","49","4A","4B","4C","4D","4E","4F","50","51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F",
    "60","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","70","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F",
    "80","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","90","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F",
    "A0","A1","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF","B0","B1","B2","B3","B4","B5","B6","B7","B8","B9","BA","BB","BC","BD","BE","BF",
    "C0","C1","C2","C3","C4","C5","C6","C7","C8","C9","CA","CB","CC","CD","CE","CF","D0","D1","D2","D3","D4","D5","D6","D7","D8","D9","DA","DB","DC","DD","DE","DF",
    "E0","E1","E2","E3","E4","E5","E6","E7","E8","E9","EA","EB","EC","ED","EE","EF","F0","F1","F2","F3","F4","F5","F6","F7","F8","F9","FA","FB","FC","FD","FE","FF"];
  
  this.getHexByte    = function(v)     { return hex2tab[v&0xFF] }
  this.getHexWord    = function(v)     { return hex2tab[v>>8] + hex2tab[v&0xFF] }
  this.getHexMulti   = function(v,m)   { return ("0".repeat(m)+v.toString(16)).slice(-m).toUpperCase() }
  this.getBinMulti   = function(v,m)   { return ("0".repeat(m)+v.toString(2)).slice(-m).toUpperCase() }
  this.getNumByteArr = function(v)     { let y= Math.floor(v/2**32); return [(v<<24),(v<<16),(v<<8),v,(y<<24),(y<<16),(y<<8),y].map(z=> z>>>24) } // convert JS number to byte array
  this.getByteArrNum = function(arr)   { return arr.reduce((a,c,i)=> a+c*2**(56-i*8),0) } // convert byte array to JS number
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

this.interpolateColors = function(col_arr, rangeLen) 
{
  if (!Array.isArray(col_arr) || col_arr.length < 2) {
    throw new Error("col_arr must contain at least 2 colors");
  }
  if (!Number.isInteger(rangeLen) || rangeLen < 2) {
    throw new Error("rangeLen must be an integer >= 2");
  }

  var out = [];
  var lastIndex = col_arr.length - 1;

  for (var i = 0; i < rangeLen; i++) {
    // Global position from 0 to last color
    var t = i / (rangeLen - 1);
    var scaled = t * lastIndex;

    // Segment index
    var idx = Math.floor(scaled);
    if (idx >= lastIndex) idx = lastIndex - 1;

    // Local interpolation factor inside this segment
    var localT = scaled - idx;

    var c1 = this.HEX2RGB(col_arr[idx]);
    var c2 = this.HEX2RGB(col_arr[idx + 1]);

    var r = Math.round(c1[0] + (c2[0] - c1[0]) * localT);
    var g = Math.round(c1[1] + (c2[1] - c1[1]) * localT);
    var b = Math.round(c1[2] + (c2[2] - c1[2]) * localT);

    out.push("#" + this.RGB2HEX([r, g, b]).join(""));
  }

  return out;
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
      var binary = '';
      var bytes = new Uint8Array( buffer );
      var len = buffer.byteLength;
      for (var i = 0; i < len; i++) { binary += String.fromCharCode( bytes[ i ] ); }
      return window.btoa( binary );
  }

  this.b64EncodeUnicode = function(str)
  {
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

  this.ltrim = function(s) { return s.replace(/^ */,"") }
  this.rtrim = function(s) { return s.replace(/ *$/,"") }
  this.trim  = function(s) { return this.rtrim(this.ltrim(s)) }
  this.stripHTML = function(s) { s = String(s ?? ""); s = s.replace(/&nbsp;/ig, " "); return s.replace(/<[^>]*>/g, ""); }

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

  // new
  this.escapeHTML = function(str) 
  {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("&lt;b&gt;", "<b>")
      .replaceAll("&lt;/b&gt;", "</b>")
      .replaceAll("&lt;u&gt;", "<u>")
      .replaceAll("&lt;/u&gt;", "</u>")
      .replaceAll("&lt;i&gt;", "<i>")
      .replaceAll("&lt;/i&gt;", "</i>")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
      .replaceAll("\n","<br>")
      .replaceAll(" ", "&nbsp;");
  }

  this.unescapeHTML = function(str)
  {
    return String(str)
    .replace(/&nbsp;/g, " ")
    .replace(/<br>/g,   "\n")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&gt;/g,   ">")
    .replace(/&lt;/g,   "<")
    .replace(/&amp;/g,  "&");
  }

  this.normaliseQuotes = function(str) 
  {
    return String(str || "")
      .replace(/[‘’‚‛]/g, "'")
      .replace(/[“”„‟]/g, '"');
  }

  this.escapeREGEXP = function(str)
  {
    return str.replace(/([\.\^\$\*\+\-\?\(\)\[\]\{\}\\\|])/g, "\\$1")
  }

  this.uuid = function()  // UUID v4
  {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  this.toASCIIarr = function(str){for(var a=[],i=0;i<str.length;i++)a.push(str.charCodeAt(i));return a;}  // convert string into array of ascii codes (numbers)
  this.crc16 = function(r){var crc=0xFFFF;var odd; for(var i=0;i<r.length;i++) { crc = crc ^ r[i]; for (var j = 0; j < 8; j++) { odd = crc & 0x0001; crc = crc >> 1; if (odd) { crc = crc ^ 0xA001 }}} return crc };
  this.crc32 = function(r){for(var a,o=[],c=0;c<256;c++){a=c;for(var f=0;f<8;f++)a=1&a?3988292384^a>>>1:a>>>1;o[c]=a}for(var n=-1,t=0;t<r.length;t++)n=n>>>8^o[255&(n^r[t])];return(-1^n)>>>0};

  /////// GUI FUNCTIONS ////////////////////////////////////////////////////////////////////////////////////////

 
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

  this.clamp = function(n, a, b)
  {
    return Math.max(a, Math.min(b, n));
  }

  this.normalizeNewlines = function(t)
  {
    // Normalize real CRLF/CR into LF
    return String(t ?? "")
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n");
  }

  this.toLines = function(t)
  {
    return this.normalizeNewlines(t).split("\n");
  }

  this.normRect = function(a, b)
  {
    // a,b are points with {r,c}
    return {
      r0: Math.min(a.r, b.r),
      r1: Math.max(a.r, b.r),
      c0: Math.min(a.c, b.c),
      c1: Math.max(a.c, b.c),
    };
  }

  this.rangeChars = function(start, end)
  {
    // start/end are codepoints (integers)
    const out = [];
    for (let cp = start; cp <= end; cp++) out.push(String.fromCharCode(cp));
    return out;
  }

  this.PanZoomSize = function(pos, centre, scale, pan, size)
  {
    return ((pos - centre) / scale + centre - pan) / size;
  }

  this.isDoubleWidthChar = function(ch)
  {
    if (!ch) return false;
    const cp = ch.codePointAt(0);

    // Quick ASCII / Latin
    if (cp <= 0x1FFF) return false;

    // Common wide ranges (wcwidth-style; not exhaustive but good enough)
    return (
      (cp >= 0x1100 && cp <= 0x115F) || // Hangul Jamo init.
      cp === 0x2329 || cp === 0x232A ||
      (cp >= 0x2E80 && cp <= 0xA4CF) || // CJK, Yi, radicals...
      (cp >= 0xAC00 && cp <= 0xD7A3) || // Hangul syllables
      (cp >= 0xF900 && cp <= 0xFAFF) || // CJK compatibility ideographs
      (cp >= 0xFE10 && cp <= 0xFE19) ||
      (cp >= 0xFE30 && cp <= 0xFE6F) ||
      (cp >= 0xFF00 && cp <= 0xFF60) || // Fullwidth forms
      (cp >= 0xFFE0 && cp <= 0xFFE6) ||
      (cp >= 0x1F300 && cp <= 0x1FAFF) || // emoji blocks (often wide)
      (cp >= 0x20000 && cp <= 0x3FFFD) || // CJK ext
      cp === 0x2B24 // ⬤ specifically
    );
  }

  // Text/HTML downloads (used by index.html "Download" and by Save-as-text)
  this.download = function(content, filename, mimeType)
  {
    const name = filename || "download.txt";
    const type = mimeType || "text/plain;charset=utf-8";
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    downloadURL(url, name);
    setTimeout(function() { window.URL.revokeObjectURL(url); }, 2000);
  }

  this.downloadText = function(text, filename)
  {
    this.download(text, filename || "ascii-drawing.txt", "text/plain;charset=utf-8");
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
      for(_i in _uri1) _o[_i] = _uri1[_i];
      for(_i in _uri2) _o[_i] = _uri2[_i]; 
      return _o[_i];
    },
    addURI: function (_uri2)
    {
      for(_i in _uri2)
        if(_uri2[_i]) this.uri[_i] = _uri2[_i]; else delete this.uri[_i];
    },
    getURI: function ()
    {
      var _str = ""
      for(_i in this.uri)
        if(this.uri[_i]) _str += (_str?"&":"?") + _i + "=" + this.uri[_i];
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
          var a = _urlargs[_i].split(/=(.+)/);
          this.uri[ a[0] ] = a[1];
        }
      }
    }
  }

  this.JShelpCollector = function(JSContainer,param) 
  {
    const tokenlist = [];
    for (const [name, val] of Object.entries(JSContainer)) {
      if (typeof val !== "function") continue;
      if (!val.help) continue;

      for(var i in val.help) if(typeof(val.help[i])=="object") val.help[i] = val.help[i].join("\n");

      if (typeof(val.help)=="object") tokenlist.push({"name":name,"content":val.help});
      else if (typeof(val.help)=="string") tokenlist.push({"name":name,"content":{"usage":val.help}});
    }

    const filterlist = [];
    for(var i in tokenlist)
    {
      if(param?.filter===undefined) filterlist.push( JSON.stringify( tokenlist[i].content) )
      else
      {
          var filteredItems = [];
          for(var j in param.filter)
          {
              var content = tokenlist[i].content;
              if(content[ param.filter[j] ]===undefined) continue;
              filteredItems.push( content[ param.filter[j] ] );
          }
          filterlist.push(filteredItems); // extract only usage information
      }
    }
    
    if(param?.sort==true) filterlist.sort(); // sort string content alphabetically


    return filterlist;
  }




/*  AsciiTable(data2d, opts)  — drop-in version with header framing + separate header align

    Features:
    - tight cells (no leading/trailing padding)
    - correct width measurement using stripHTML() + &nbsp;->space
    - safe truncation by visible width while preserving HTML and auto-closing tags
    - multiline cells (\n) expand row height
    - optional header row (opts.header)
    - optional sorting by column (opts.sort) on visible text
    - row/col dividers (opts.rowLine/opts.colLine)
    - top+bottom borders for body when (rowLine && colLine)

    NEW:
    - opts.Hstyle: header frame/lines style (defaults to "━┃┡╇┩┗┻┛┏┳┓ ║")
      mapping is identical to body style mapping, but applied to header region:
        0 H, 1 V, 2 ML, 3 MM, 4 MR, 5 BL, 6 BM, 7 BR, 8 TL, 9 TM, 10 TR, 12 VT
      note: Hstyle[5..7] (bottom border) are only used when header exists AND body has no rows.
    - opts.Halign: alignment string for header cells, e.g. "CC"
    - opts.align: alignment string for body cells, e.g. "LCR" (string, not ["LCR"])

    Style strings:
      - You can use short styles; missing chars fall back to box defaults.
      - VT (trunc separator) prefer style[12], else style[9], else style[5], else V.

    Example expected:
      ┏━━━━━━━━┳━━━━━━━━━━━━━━━━━┓
      ┃ SYNTAX ┃    EXAMPLES     ┃
      ┡━━━━━━━━╇━━━━━━━━━━━━━━━━━┩
      │run(CMD)│oCMD.run("clear")│
      └────────┴─────────────────┘
*/

function stripHTML(s) {
  s = String(s ?? "");
  s = s.replace(/&nbsp;/ig, " ");
  return s.replace(/<[^>]*>/g, "");
}


/* DROP-IN FIX: replace ONLY truncateHTMLByVisible() with this version.

Fixes your center-align bugs:
- No more “EXEX” / mingled text when content does NOT overflow.
- No more false overflow flags on both sides for "C".
- Correct center-truncation: keeps the *middle* visible slice (not prefix+suffix concat).

Also improves HTML re-opening:
- When we need to re-open tags after slicing, we re-open using the *original opening tag*
  (preserving attributes), not just `<tagname>`.
*/

function truncateHTMLByVisible(input, maxVisible, align = "L") {
  const s = String(input ?? "");

  // no max => never truncate
  if (maxVisible === null || maxVisible === undefined) {
    const vis = stripHTML(s);
    return { html: s, visible: vis, truncL: false, truncR: false };
  }

  maxVisible = Math.max(0, maxVisible | 0);
  const fullVisible = stripHTML(s);

  // IMPORTANT: if it fits, do NOT truncate (fixes EXEX + false overflow flags)
  if (fullVisible.length <= maxVisible) {
    return { html: s, visible: fullVisible, truncL: false, truncR: false };
  }

  // trivial
  if (maxVisible === 0) {
    return { html: "", visible: "", truncL: fullVisible.length > 0, truncR: fullVisible.length > 0 };
  }

  const tokens = s.match(/<\/?[^>]+>|[^<]+/g) || [];
  const VOID_TAGS = new Set(["area","base","br","col","embed","hr","img","input","link","meta","param","source","track","wbr"]);

  function tagName(tag) {
    const m = tag.match(/^<\/?\s*([a-zA-Z0-9:-]+)/);
    return m ? m[1].toLowerCase() : null;
  }
  function isClosing(tag) { return /^<\s*\//.test(tag); }
  function isSelfClosing(tag) {
    if (/\/\s*>$/.test(tag)) return true;
    const n = tagName(tag);
    return n ? VOID_TAGS.has(n) : false;
  }
  function visibleTextOf(text) { return text.replace(/&nbsp;/ig, " "); }

  // cut a raw TEXT token by visible char count, treating &nbsp; as 1 visible char
  function cutTextByVisible(textTok, takeCount, fromStart) {
    // fromStart=true => take first takeCount visible chars
    // fromStart=false => take last takeCount visible chars (rarely used here)
    // We only need fromStart in this implementation.
    if (!fromStart) {
      // not used; keep for completeness
      const vis = visibleTextOf(textTok);
      if (vis.length <= takeCount) return textTok;
      // brute: compute start index by skipping (vis.length - takeCount)
      const skip = vis.length - takeCount;
      let startIndex = 0;
      let visSeen = 0;
      for (let i = 0; i < textTok.length && visSeen < skip; i++) {
        if (textTok.slice(i, i + 6).toLowerCase() === "&nbsp;") {
          visSeen += 1; i += 5; startIndex = i + 1;
        } else {
          visSeen += 1; startIndex = i + 1;
        }
      }
      return textTok.slice(startIndex);
    }

    const vis = visibleTextOf(textTok);
    if (vis.length <= takeCount) return textTok;

    let cutIndex = 0;
    let visSeen = 0;
    for (let i = 0; i < textTok.length && visSeen < takeCount; i++) {
      if (textTok.slice(i, i + 6).toLowerCase() === "&nbsp;") {
        visSeen += 1;
        i += 5;
        cutIndex = i + 1;
      } else {
        visSeen += 1;
        cutIndex = i + 1;
      }
    }
    return textTok.slice(0, cutIndex);
  }

  // Slice HTML by visible range [startVisible, endVisible) and auto-close.
  // Re-opens active tags using the original opening tag text (preserves attrs).
  function sliceHTMLVisibleRange(startVisible, endVisible) {
    let out = "";
    let visiblePos = 0;
    let emitting = false;

    // stack of {name, openTag}
    const active = [];

    function pushOpen(tagTok) {
      const n = tagName(tagTok);
      if (!n) return;
      active.push({ name: n, openTag: tagTok });
    }
    function popClose(tagTok) {
      const n = tagName(tagTok);
      if (!n) return;
      for (let i = active.length - 1; i >= 0; i--) {
        if (active[i].name === n) { active.splice(i, 1); break; }
      }
    }
    function reopenActive() {
      for (const it of active) out += it.openTag;
    }

    for (const tok of tokens) {
      if (tok.startsWith("<")) {
        const n = tagName(tok);
        const selfClose = isSelfClosing(tok);
        const closing = isClosing(tok);

        // update stack regardless of emitting
        if (n && !selfClose) {
          if (closing) popClose(tok);
          else pushOpen(tok);
        }

        if (emitting) out += tok;
        continue;
      }

      // text
      const vis = visibleTextOf(tok);
      const len = vis.length;

      // fully before start
      if (!emitting && visiblePos + len <= startVisible) {
        visiblePos += len;
        continue;
      }

      // start emitting (maybe mid token)
      if (!emitting) {
        emitting = true;
        out = "";
        reopenActive();

        const needSkip = startVisible - visiblePos; // 0..len-1
        if (needSkip > 0) {
          // skip needSkip visible chars inside tok
          let startIndex = 0;
          let visSeen = 0;
          for (let i = 0; i < tok.length && visSeen < needSkip; i++) {
            if (tok.slice(i, i + 6).toLowerCase() === "&nbsp;") {
              visSeen += 1; i += 5; startIndex = i + 1;
            } else {
              visSeen += 1; startIndex = i + 1;
            }
          }
          // now we are at startVisible
          const remainingInTokVisible = len - needSkip;
          const allowed = endVisible - startVisible;
          const take = Math.min(remainingInTokVisible, allowed);
          const piece = cutTextByVisible(tok.slice(startIndex), take, true);
          out += piece;
          visiblePos = startVisible + take;

          if (visiblePos >= endVisible) break;
          continue;
        }
        // needSkip==0 => fall through to normal emitting below
      }

      // emitting and not done yet
      const remaining = endVisible - visiblePos;
      if (remaining <= 0) break;

      if (len <= remaining) {
        out += tok;
        visiblePos += len;
      } else {
        out += cutTextByVisible(tok, remaining, true);
        visiblePos += remaining;
        break;
      }
    }

    // close whatever is still active in the emitted fragment
    for (let i = active.length - 1; i >= 0; i--) out += `</${active[i].name}>`;
    return out;
  }

  align = (align || "L").toUpperCase();

  if (align === "R") {
    // keep last maxVisible
    const start = fullVisible.length - maxVisible;
    const end = fullVisible.length;
    return {
      html: sliceHTMLVisibleRange(start, end),
      visible: fullVisible.slice(start, end),
      truncL: true,
      truncR: false
    };
  }

  if (align === "C") {
    // keep middle maxVisible
    const overflow = fullVisible.length - maxVisible;
    const cutLeft = Math.floor(overflow / 2);
    const start = cutLeft;
    const end = start + maxVisible;

    return {
      html: sliceHTMLVisibleRange(start, end),
      visible: fullVisible.slice(start, end),
      truncL: start > 0,
      truncR: end < fullVisible.length
    };
  }

  // default L: keep first maxVisible
  return {
    html: sliceHTMLVisibleRange(0, maxVisible),
    visible: fullVisible.slice(0, maxVisible),
    truncL: false,
    truncR: true
  };
}


this.AsciiTable = function(data2d, opts = {}) 
{
  if (!Array.isArray(data2d) || data2d.length === 0) return "";

  const o = {
    sort: (typeof opts.sort === "number" ? opts.sort : null),
    header: (opts.header !== false),

    style: (typeof opts.style === "string" ? opts.style : "─│├┼┤└┴┘┌┬┐  ┃"),
    Hstyle: (typeof opts.Hstyle === "string" ? opts.Hstyle : "━┃┡╇┩┗┻┛┏┳┓  ║"),

    max: (Array.isArray(opts.max) ? opts.max : []),
    rowLine: (opts.rowLine !== false),
    colLine: (opts.colLine !== false),

    // NEW: simplified align to string
    align: (typeof opts.align === "string" ? opts.align : ""),
    Halign: (typeof opts.Halign === "string" ? opts.Halign : ""),
  };

  function decodeStyle(styleStr, defaults) {
    const s = styleStr || "";
    const d = defaults;

    const H  = s[0]  ?? d.H;
    const V  = s[1]  ?? d.V;

    const ML = s[2]  ?? d.ML;
    const MM = s[3]  ?? d.MM;
    const MR = s[4]  ?? d.MR;

    const BL = s[5]  ?? d.BL;
    const BM = s[6]  ?? d.BM;
    const BR = s[7]  ?? d.BR;

    const TL = s[8]  ?? d.TL;
    const TM = s[9]  ?? d.TM;
    const TR = s[10] ?? d.TR;

    const VT = s[12] ?? s[9] ?? s[5] ?? d.VT ?? V;

    return { H,V,ML,MM,MR,BL,BM,BR,TL,TM,TR,VT };
  }

  const bodyStyle = decodeStyle(o.style, {
    H:"─", V:"│", ML:"├", MM:"┼", MR:"┤", BL:"└", BM:"┴", BR:"┘", TL:"┌", TM:"┬", TR:"┐", VT:"┃"
  });

  const headerStyle = decodeStyle(o.Hstyle, {
    H:"━", V:"┃", ML:"┡", MM:"╇", MR:"┩", BL:"┗", BM:"┻", BR:"┛", TL:"┏", TM:"┳", TR:"┓", VT:"║"
  });

  // normalize rows to strings
  let rows = data2d.map(r => (Array.isArray(r) ? r : [r]).map(v => String(v ?? "")));

  // Extract header row if enabled
  let headerRow = null;
  if (o.header && rows.length > 0) {
    headerRow = rows[0];
    rows = rows.slice(1);
  }

  // sort body rows (NOT the header)
  if (o.sort !== null) {
    const k = o.sort;
    rows.sort((a, b) => stripHTML(a[k] ?? "").localeCompare(stripHTML(b[k] ?? "")));
  }

  const bodyRows = rows;               // may be empty
  const allRowsForSizing = headerRow ? [headerRow, ...bodyRows] : bodyRows;

  const colCount = allRowsForSizing.reduce((m, r) => Math.max(m, r.length), 0);

  function getAlign(alignStr, ci) {
    const c = (alignStr?.[ci] ?? "L").toUpperCase();
    return (c === "L" || c === "C" || c === "R") ? c : "L";
  }

  function getMax(ci) {
    const m = o.max?.[ci];
    return (m === null || m === undefined) ? null : Math.max(0, m | 0);
  }

  function padVisibleHTML(html, visibleLen, width, align) {
    if (visibleLen >= width) return html;
    const gap = width - visibleLen;

    if (align === "R") return " ".repeat(gap) + html;
    if (align === "C") {
      const left = Math.floor(gap / 2);
      const right = gap - left;
      return " ".repeat(left) + html + " ".repeat(right);
    }
    return html + " ".repeat(gap);
  }

  // compute column widths based on visible lengths AFTER truncation (max applied)
  const colWidths = Array(colCount).fill(0);
  for (let ci = 0; ci < colCount; ci++) {
    const maxLen = getMax(ci);

    let longest = 0;
    for (const r of allRowsForSizing) {
      const cell = String(r[ci] ?? "");
      for (const line of cell.split("\n")) {
        // width depends on either header/body align for truncation side,
        // but width is capped at maxLen anyway; we can use body align as default.
        const t = truncateHTMLByVisible(line, maxLen, getAlign(o.align, ci));
        longest = Math.max(longest, t.visible.length);
      }
    }

    colWidths[ci] = (maxLen === null) ? longest : Math.min(longest, maxLen);
  }

  function makeLine(styleObj, left, mid, right) {
    const segs = colWidths.map(w => styleObj.H.repeat(w));
    if (!o.colLine) return segs.join(styleObj.H);
    return left + segs.join(mid) + right;
  }

  const makeTopLine    = (st) => makeLine(st, st.TL, st.TM, st.TR);
  const makeMidLine    = (st) => makeLine(st, st.ML, st.MM, st.MR);
  const makeBottomLine = (st) => makeLine(st, st.BL, st.BM, st.BR);

  function renderLogicalRow(row, alignStr, st) {
    const splitCells = [];
    let rowHeight = 1;

    for (let ci = 0; ci < colCount; ci++) {
      const raw = String(row[ci] ?? "");
      const lines = raw.split("\n");
      splitCells.push(lines);
      rowHeight = Math.max(rowHeight, lines.length);
    }

    const outLines = [];

    for (let li = 0; li < rowHeight; li++) {
      const renderedCells = [];
      const truncFlags = [];

      for (let ci = 0; ci < colCount; ci++) {
        const align = getAlign(alignStr, ci);
        const maxLen = getMax(ci);
        const rawLine = (splitCells[ci][li] ?? "");

        const t = truncateHTMLByVisible(rawLine, maxLen, align);
        const paddedHTML = padVisibleHTML(t.html, t.visible.length, colWidths[ci], align);

        renderedCells.push(paddedHTML);
        truncFlags.push({ L: t.truncL, R: t.truncR });
      }

      if (!o.colLine) {
        outLines.push(renderedCells.join(" "));
        continue;
      }

      // separators: trunc-style VT when truncation touches boundary, else style V
      const seps = [];
      seps.push(truncFlags[0]?.L ? st.VT : st.V);
      for (let i = 0; i < colCount - 1; i++) {
        const boundaryTrunc = truncFlags[i]?.R || truncFlags[i + 1]?.L;
        seps.push(boundaryTrunc ? st.VT : st.V);
      }
      seps.push(truncFlags[colCount - 1]?.R ? st.VT : st.V);

      let lineOut = "";
      for (let i = 0; i < colCount; i++) lineOut += seps[i] + renderedCells[i];
      lineOut += seps[colCount];
      outLines.push(lineOut);
    }

    return outLines;
  }

  // ---- assemble output ----
  const lines = [];
  const hasHeader = !!headerRow;
  const hasBody = bodyRows.length > 0;

  // If header exists, frame header region (top line always when colLine&&rowLine)
  if (hasHeader && o.colLine && o.rowLine) {
    lines.push(makeTopLine(headerStyle));
    lines.push(...renderLogicalRow(headerRow, o.Halign || o.align, headerStyle));

    // Header underline uses headerStyle mid-line
    lines.push(makeMidLine(headerStyle));

    // If no body, close header with header bottom (Hstyle[5..7]) as requested
    if (!hasBody) {
      lines.push(makeBottomLine(headerStyle));
      return lines.join("\n");
    }
  } else if (o.colLine && o.rowLine) {
    // No header: body top border
    lines.push(makeTopLine(bodyStyle));
  }

  // Render body
  for (let ri = 0; ri < bodyRows.length; ri++) {
    lines.push(...renderLogicalRow(bodyRows[ri], o.align, bodyStyle));

    if (o.rowLine && ri < bodyRows.length - 1) {
      lines.push(makeMidLine(bodyStyle));
    }
  }

  // Body bottom border when both true
  if (o.colLine && o.rowLine) {
    lines.push(makeBottomLine(bodyStyle));
  }

  return lines.join("\n");
}





}

oCOM = new COM();
