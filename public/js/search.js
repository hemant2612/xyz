
const searchByFeild = () => {
    let inp1 = document.getElementById('inp1').value.toUpperCase();
    console.log(inp1);
    // let about=document.getElementsByClassName('about');
    let p = document.getElementsByTagName('p');
    for (var i = 0; i < p.length; i++) {
        // if (i*3%3 == 0) {
            // console.log('1',p[3*i].innerText);
            if(document.getElementsByTagName('p')[3*i] !== undefined){
                var val= p[3*i].innerText.toUpperCase();

            console.log(val);
            }
            
            

        if (val.indexOf(inp1) > -1) {
            console.log(val);
            document.getElementsByTagName('p')[3 * i].parentNode.parentNode.style.display = "";
        }
        else {
            document.getElementsByTagName('p')[3 * i].parentNode.parentNode.style.display= "none";
            // console.log('parent',node.parentNode);
            // console.log('parent',node.parentNode.parentNode);
            // if(document.getElementsByTagName('p')[3 * i] !== undefined){
                // node.parentNode.parentNode.style.display = "none";
            // }
            
        }
        var html=document.querySelector("html");
        html.style.display="block";
        


        



    }


}
const SearchByCosts = () => {
    let inp2 = document.getElementById('inp2').value;
    console.log(inp2);

    if (inp2 != '') {
        num = 0, count = 0;
        let p = document.getElementsByTagName('p');
        for (var i = 0; i < p.length; i++) {
            if ((i + 1) % 2 == 0) {
                var val = Number(p[i].innerText);

                if (val <= Number(inp2)) {
                    // console.log(val);
                    document.getElementsByTagName('p')[i].parentNode.parentNode.style.display = "";
                    count++;
                }
                else {
                    let node = document.getElementsByTagName('p')[i];
                    node.parentNode.parentNode.style.display = "none";
                    num++;
                }


            }



        }
        if (num != 0 && count == 0) {
            document.getElementById('display').innerHTML = 'Soory no content !!';
        }
        else {
            document.getElementById('display').innerHTML = "";
        }
    }
    else {
        //     document.getElementsByClassName('about').parentNode.style.display="";
        document.getElementById('display').innerHTML = "";
        searchByFeild()

    }



}