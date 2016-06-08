
function getPriority(value){
    if(value==='+' || value==='-'){
        return 1;
    }
    else if(value==='/' ||value==='*') {
        return 2;
    }
    else{
        return 3;
    }

}



function priority_value(value,stack,result_array){
    if(stack.length===0)
    {
        stack.push(value);
    }
    else{



        if(getPriority(value)>getPriority(stack[stack.length-1])){
            stack.push(value);
        }
        else{


            var state=stack[stack.length-1];
            stack.pop();
            result_array.push(state);
           while(stack.length){
               if(getPriority(value)>getPriority(stack.length-1)){
                   stack.push(value);
                   break;
               }
               else{
                   var stamp=stack[stack.length-1];
                   stack.pop();
                   result_array.push(stamp);
                   if(stack.length===0){
                       stack.push(value);
                       break;
                   }
               }
           }
        }


    }



}



var balancing=function(value,parent){

    if(parent[parent.length-1] ==='(' && value===')'){
        return true;
    }
    else if(parent[parent.length-1] ==='{' && value==='}'){
        return true;
    }
    else if(parent[parent.length-1] ==='[' && value===']'){
        return true;
    }
    else{
        return false;
    }

}




var createPostFix=function(request,callback){
    var value=request.params.value;

    var result_array=[];
    var stack=[];
    var parent=[];
    var temp=[];
    var length=value.length;
    for(var i=0;i<length;i++){
        if(value[i]==='(' || value[i]==='{' || value[i]==='[')
        {
           parent.push(value[i]);
            temp.push(value[i]);
        }
        else if(value[i]===')' || value[i]==='}' || value[i]===']'){
          console.log(temp);
           if(balancing(value[i],parent)){
               parent.pop();
               var game=temp[temp.length-1];
               temp.pop();
               result_array.push(game);
           }
            else{


               result_array="This parenthesis is not matched";
               stack=[];
               break;
           }
        }
        else if(value[i]==='+' || value[i]==='-' || value[i]==='*' || value[i]==='/'){
            if(parent.length){



            }
            else {
                priority_value(value[i], stack, result_array, parent);
               // console.log(result_array+' '+stack);
            }
        }
        else{
            result_array.push(value[i]);
           // console.log(result_array);
        }
    }

    while(stack.length){
        var state=stack[stack.length-1];
        result_array.push(state);
        stack.pop();

    }

   var result="";
    for(var i=0;i<result_array.length;i++){
        result=result+result_array[i];
    }

return callback(result);


};

module.exports={
    createPostFix:createPostFix
}