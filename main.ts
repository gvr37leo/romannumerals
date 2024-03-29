//DM XLVII(=47), CXVI(=116), MCXX(=1120), MCMXIV(=1914)

var symbolmap = {
    'I':1,
    'V':5,
    'X':10,
    'L':50,
    'C':100,
    'D':500,
    'M':1000,
}

function filterroman(string:string){
    return string.toUpperCase().split('').filter(v => symbolmap[v] != undefined).join('')
}

function roman2decimal(string:string){
    string = filterroman(string)

    var numbers = string.split('').map(c => symbolmap[c])
    // while(numbers.length > 1){
    numbers = downscale(numbers)
    // }
    

    return sum(numbers)
}

function downscale(numbers:number[]):number[]{
    var values = []
    var r = findPeakIndices(numbers)
    var peakIndices = r.peakIndices
    var valleyIndices = r.valleyIndices

    var values = []
    
    if(numbers.length == 0){
        return [0]
    }
    if(numbers.length == 1){
        return [numbers[0]]
    }
    
    //trim end
    var endtrim = 0
    if(peakIndices.length == 1 && valleyIndices.length == 0){
        endtrim = sum(numbers.splice(1))
    }else{
        var lastindex = Math.max(last(peakIndices),last(valleyIndices))
    
        if(lastindex < numbers.length - 1){
            endtrim = sum(numbers.splice(lastindex + 1))
        }
    }
    

    var temp
    function custart(){
        values.push(calcMountain(0,0,valleyIndices[0] - 1,numbers))
        peakIndices.shift()
    }
    function cutend(){
        temp = calcMountain(last(valleyIndices), numbers.length - 1, numbers.length - 1,numbers)
        peakIndices.pop()
        numbers.splice(last(valleyIndices))
    }
    var lastval = 0
    if(peakIndices.length > valleyIndices.length){
        // V
        //cut end and start
        custart()
        cutend()
        
    }else if(peakIndices.length == valleyIndices.length){ 
        if(r.peakFirst){
            // V| cut start
            custart()
            lastval = numbers[last(valleyIndices)]
        }else{
            //N cut end
            cutend()
        }
    }else{//peakIndices.length < valleyIndices.length    
        // ^
        lastval = numbers[last(valleyIndices)]
    }
    
    for(var i = 0; i < peakIndices.length; i++){
        var lefti = valleyIndices[i]
        var peaki = peakIndices[i]
        var righti = valleyIndices[i + 1] - 1
        values.push(calcMountain(lefti,peaki,righti,numbers))
    }
    values[values.length - 1] += lastval
    if(temp != null){
        values.push(temp)
    }
    values[values.length - 1] += endtrim
    return values
}

function sum(arr:number[]){
    return arr.reduce((acc,c) => acc + c, 0)
}

function last<T>(arr:T[]){
    return arr[arr.length - 1]
}

// start and end are inclusive
function calcMountain(starti:number,peaki:number,endi:number,arr:number[]){
    var sum = 0;
    //upslope
    var flatsums = []
    var flatsum = 0
    for(var i = starti; i < peaki; i++){
        if(arr[i] == arr[i + 1]){
            flatsum += arr[i]
        }else{
            flatsum += arr[i]
            flatsums.push(flatsum)
            flatsum = 0
        }
        
    }
    var upslopesum = flatsums.reduce((acc,c) => c - acc,0)

    //downslope
    for(var i = peaki; i <= endi; i++){
        sum += arr[i]
    }

    return sum - upslopesum
}

function findPeakIndices(arr:number[]):{peakFirst:number,peakIndices:number[],valleyIndices:number[]}{
    if(arr.length == 0){
        return {peakFirst:1, peakIndices:[],valleyIndices:[]}
    }else{
        var peakIndices:number[] = []
        var valleyIndices:number[] = []
        var evaluators = [(a,b) => b - a,(a,b) => a - b]
        var arrs = [valleyIndices,peakIndices]
        var ipf = isPeakFirst(arr)
        arrs[ipf.isPeak].push(0)
        var scanning2peak = 1 - ipf.isPeak
        
        var i = ipf.firstChangeIndex
        while(i < arr.length){
            let res = scan2extreme(arr,i,evaluators[scanning2peak])
            arrs[scanning2peak].push(res.peaki)
            i = res.trailingEdgeIndex
            scanning2peak = 1 - scanning2peak
        }
    
        return {
            peakFirst:ipf.isPeak,
            peakIndices,
            valleyIndices,
        }
    }
}

function isPeakFirst(arr:number[]):{isPeak:number,firstChangeIndex:number}{
    for(var i = 1; i < arr.length; i++){
        if(arr[i] < arr[i - 1]){
            return {
                isPeak:1,
                firstChangeIndex: i,
            }
        }else if(arr[i] > arr[i - 1]){
            return {
                isPeak:0,
                firstChangeIndex: i,
            }
        }else{
            continue
        }
    }
    return {
        isPeak:1,
        firstChangeIndex:arr.length
    }
}

function scan2extreme(arr:number[],starti:number,evaluator:(a:number,b:number) => number):{peaki:number,trailingEdgeIndex:number}{
    var besti = starti
    var i = starti + 1
    for(; i < arr.length; i++){
        var current = arr[i - 1]
        var leadingedge = arr[i]

        var score = evaluator(leadingedge,current)
        if(score > 0){
            besti = i
        }

        if(score < 0){
            return {
                peaki:besti,
                trailingEdgeIndex:i
            }
        }
    }
    return {
        peaki:besti,
        trailingEdgeIndex:i
    }
}

var romaninput = document.querySelector('#romaninput') as HTMLInputElement
var output = document.querySelector('#output') as HTMLElement
romaninput.addEventListener('input',() => {
    output.innerText = roman2decimal(romaninput.value) as any
})

