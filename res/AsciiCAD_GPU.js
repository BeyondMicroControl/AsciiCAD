function GASC()
{
    this.serial8 = new Uint8Array();
    this.config8_map = {};
    this.config8_idx = {};
    this.ser8_ref = function(name,arr) { this.setlen(name,null); this.serial8 = new Uint8Array([...this.serial8,...arr]) }
    this.ser8_val = function(name,val,modifier) { this.setlen(name,modifier); this.serial8 = new Uint8Array([...this.serial8,...[val&255]]) } 
    this.ser8_map = function() { return "const "+JSON.stringify(this.config8_map).replace(/"|\{|\}/g,"").replace(/:/g,"=")+";" }
    this.idx8 = function(name) { return this.config8_idx[name] }
    this.setlen = function(name,modifier)
    {
        if(modifier===undefined) var modifier = ["cfg[","]"];
        else if(modifier==null)  var modifier = ["",""];
        if(this.config8_map[name]===undefined)
        {
        this.config8_map[name] = modifier[0] + this.serial8.length + modifier[1];
        this.config8_idx[name] = this.serial8.length;
        }
    }

    this.kernel = function() { console.warn("initialise first with initGPU()") }

    this.initGPU = function(GPUarg,KERNELarg,config)
    { 
        // CONFIGURE DATA SERIALISATION
        for(var i in config)
        {
            if(config[i][0].constructor === Uint8Array) this.ser8_ref(i,config[i][0])
            else this.ser8_val(i,config[i][0],config[i][1]===undefined?undefined:[config[i][1],config[i][2]])
        }

        // INSTATIATE GPU CLASS & ATTACH TO WINDOW OBJECT
        try { var gpu = new window.GPU.GPU(GPUarg) } catch (e) { var gpu = new GPU(GPUarg) }
            console.log("gpu = "+JSON.stringify(gpu));

        // TRANSPILE CHOSEN KERNEL SCRIPT
        //this.kernel = gpu.createKernel(KERNELarg.kernel,KERNELarg);
        //console.log("kernel = "+JSON.stringify(this.kernel));
    }

    this.kProcess =  function(ascii, cfg)
    { 
        const DIM_H=cfg[0], DIM_V=cfg[1];
    }
}
oGASC = new GASC();




window.addEventListener("load", () => 
{
    oGASC.initGPU(
         { canvas:  ctx,mode: 'gpu'}
        ,{ kernel: oGASC.kProcess, output: [COLS,ROWS], graphical: false }
        ,{"DIM_H":[ROWS & 0xFF]
        ,"DIM_V":[COLS & 0xFF]});



    //oGASC.kernel( ascii, oGASC.serial8 )

})
