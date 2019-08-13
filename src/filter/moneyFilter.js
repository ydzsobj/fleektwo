export function toMoney(money = 0){
   
    return money.toFixed(2)

}
export function toDivide(money = 0){
    var value=money/100;
    var s=value.toString().split(".");
	if(s.length==1){
		value=value.toString()+".00";
		return value;
	}
	if(s.length>1){
		if(s[1].length<2){
			value=value.toString()+"0";
		}
		return value
      }
}