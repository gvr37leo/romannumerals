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

function roman2decimal(string){
    var result = 0
    var biggestchar
    for(var char of string){
        var value = symbolmap[char]
    }

    return result
}

function findpeaks(arr:number[]):number[]{
    if(arr.length == 0){
        return []
    }else if(arr.length == 1 || arr.length == 2){
        return [arr[0]]
    }else{
        var peakIndices = []
        var valleys = []
        var scanning2peak = 1
        var evaluators = [(a,b) => b - a,(a,b) => a - b]
        var arrs = [valleys,peakIndices]
        var i = 0
        while(i < arr.length){
            let res = scan2extreme(arr,i,evaluators[scanning2peak])
            arrs[scanning2peak].push(res.peaki)
            i = res.trailingEdgeIndex
            scanning2peak = 1 - scanning2peak
        }
    
        return peakIndices
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
a = findpeaks([1,2,3,2,1,7,7,7,1])
a = findpeaks([1,2,1])
a = findpeaks([2,1,2])
a = findpeaks([1,2,3])
a = findpeaks([3,2,1])
// a = scantopeak([5,4,3,7,8,8,8],0)
// a = scantopeak([0,1,2,3,3,3,2,1],0)
// a = scantopeak([3,8],0)
// a = scantopeak([3,8,3],0)