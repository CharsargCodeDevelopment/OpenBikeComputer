function _RenderGraphPixel(x){
console.log(x);
g.lineTo(0,x);
g.flip();
}
function MaxOfArray(arr){
const max = arr.reduce((a, b) => Math.max(a, b), -Infinity);
return max;
}
function RenderGraph(Data){
g.clear();
YMultiply = 64/Data.reduce((a, b) => Math.max(a, b), -Infinity);
XMultiply = 128/Data.length;
console.log(YMultiply);
//Data.forEach(_RenderGraphPixel);
g.moveTo(0*XMultiply,Data[0]*YMultiply);
for (var i =0; i<=Data.length-1; i += 1) {
x = i;
y = Data[i];
//console.log(y*YMultiply);
g.lineTo(x*XMultiply,y*YMultiply);
//g.flip();
}
g.flip();
}
