let modalQt = 1;
let cart = [];
let modalKey = 0;

const c = (el)=>document.querySelector(el);
const cs = (el)=>document.querySelectorAll(el);

//LITAGEM DAS PIZZAS
pizzaJson.map((item, index)=>{

        //faz clonar os estilos na classe chamada

             let pizzaItem = c('.models .pizza-item').cloneNode(true);

        //Preencher as informações em PizzaItem

            pizzaItem.setAttribute('data-key', index); // pega a informação de cada pizza
            pizzaItem.querySelector('.pizza-item--img img').src = item.img; //requisitando a imagem do pizzaJson
            pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`; //Requisitando o preço, em seguida função para pular duas casa depois da vírgula.
            pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; //requisitando nome do pizzaJson
            pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description; //Requisitando descrição do pizzaJson
            
            pizzaItem.querySelector('a').addEventListener('click', (e)=>{ // tirando o padrão de att a tela ao clicar, add evento de modal
                e.preventDefault();
                let key = e.target.closest('.pizza-item').getAttribute('data-key'); //elemento mais proximo do a

                modalQt = 1; //resetar o modal pra 1 sempre que abrir
                modalKey = key; //indentificação de qual pizza é

                c('.pizzaBig img').src = pizzaJson[key].img;
                c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
                c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
                c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
                c('.pizzaInfo--size.selected').classList.remove('selected');            
                
                cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //para cada item, seleciona os tamanhos
                    
                    if(sizeIndex == 2) {
                        size.classList.add('selected'); // toda vez o modal abre, reseta com o 'grande' já selecionado  
                    }
                    size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
                });

                c('.pizzaInfo--qt').innerHTML = modalQt;  //resetar o modal pra 1 sempre que abrir

                c('.pizzaWindowArea').style.opacity = 0;
                c('.pizzaWindowArea').style.display = 'flex';   

                    setTimeout(()=>{ //delay de 200 seg antes de trocar pra opacidade 1, causando uma troca mais suave
                        c('.pizzaWindowArea').style.opacity = 1;
                    }, 200)

            });
            
            c('.pizza-area').append( pizzaItem );

});

//EVENTOS DO MODAL

function  closeModal() {
            c('.pizzaWindowArea').style.opacity = 0;     
            
            setTimeout(()=>{ //delay de 200 seg antes de trocar pra opacidade 1, causando uma troca mais suave
                c('.pizzaWindowArea').style.display = 'none';
            }, 500);
        }

            cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{ //clicando em ambos os botoes, fecha o modal
                item.addEventListener('click', closeModal);
            });

           c('.pizzaInfo--qtmenos').addEventListener('click', ()=> {
               if (modalQt  > 1 ) {
                modalQt--;
                c('.pizzaInfo--qt').innerHTML = modalQt
               }; 
           });             

           c('.pizzaInfo--qtmais').addEventListener('click', ()=> {
                modalQt++;
                c('.pizzaInfo--qt').innerHTML = modalQt
          });             

          //TAMANHOS MODAL

          cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{ //para cada item, seleciona os tamanhos
                size.addEventListener('click', (e)=>{
                c('.pizzaInfo--size.selected').classList.remove('selected');         
                    size.classList.add('selected');
            });
          });

          c('.pizzaInfo--addButton').addEventListener('click', ()=> {
                //qual o tamanho da pizza?
                    let size =  parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));     
                    
                    let identifier = pizzaJson[modalKey].id+'@'+size;

                    let key = cart.findIndex((item)=>item.identifier == identifier);

                    if (key > -1) { 
                        cart[key].qt += modalQt;
                    } else
                       cart.push({
                        identifier,
                        id:pizzaJson[modalKey].id,
                        size,
                        qt:modalQt
                    });

           updateCart();         
           closeModal();         
          
        });


        c('.menu-openner').addEventListener('click', ()=> {
            if (cart.length > 0) {  
            c('aside').style.left = '0';
            }  
        });

        c('.menu-closer').addEventListener('click', ()=> {
            c('aside').style.left = '100vw';
        });

function updateCart() {

    c('.menu-openner span').innerHTML = cart.length;
    
    if(cart.length > 0) {

        c('aside').classList.add('show');  
        c('.cart').innerHTML = '';

        let subtotal  = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = "P";
                    break;
                case 1:
                    pizzaSizeName = "M";
                    break;
                case 2:
                    pizzaSizeName = "G";
                    break;      
            }

            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=> {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }    

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


    } else {
        c('aside').classList.remove('show');   
        c('aside').style.left = '100vw';
    }

};    
