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

function roman2decimal(string:string){
    var result = 0

    var numbers = string.split('').map(c => symbolmap[c])
    var r = findPeakIndices(numbers)
    var peakIndices = r.peakIndices
    var valleys = r.valleyIndices

    var values = []
    for(var i = 0; i < peakIndices.length; i++){
        var peaki = peakIndices[i]
        var left = valleys[i]
        var right = valleys[i] - 1
        values.push(calcMountain(left,peaki,right,numbers))
    }

    return result
}

function calcMountain(starti:number,peaki:number,endi:number,arr:number[]){
    var sum = 0;
    for(var i = starti; i < peaki; i++){
        sum = arr[i] - sum
    }

    for(var i = peaki; i <= endi; i++){
        sum += arr[i]
    }

    return sum
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

function decimal2roman(number){

}

roman2decimal('MCMXIV')//1914
var a = null;
a = findPeakIndices([1,2,3,2,1,7,7,7,1])
a = findPeakIndices([1,2,1])
a = findPeakIndices([2,1,2])
a = findPeakIndices([1,2,3])
a = findPeakIndices([3,2,1])
// a = scantopeak([5,4,3,7,8,8,8],0)
// a = scantopeak([0,1,2,3,3,3,2,1],0)
// a = scantopeak([3,8],0)
// a = scantopeak([3,8,3],0)