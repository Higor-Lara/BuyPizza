const qs = (el) => document.querySelector(el);
const qsa = (el) => document.querySelectorAll(el);
let modalQt = 1
let idPizza = 0
let cart = []

function changeSize () {

}

pizzasJson.map((pizza, index) => {

  let pizzaHtml = qs('.models .pizza-item').cloneNode(true);

  pizzaHtml.setAttribute('id-pizza', index);
  pizzaHtml.querySelector('.pizza-item--img img').setAttribute('src', pizza.img)
  pizzaHtml.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2)}`;
  pizzaHtml.querySelector('.pizza-item--name').innerHTML = pizza.name;
  pizzaHtml.querySelector('.pizza-item--desc').innerHTML = pizza.description;

  pizzaHtml.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault();
    idPizza = e.target.closest('.pizza-item').getAttribute('id-pizza');
    modalQt = 1

    qs('.pizzaBig img').setAttribute('src', pizzasJson[idPizza].img);
    qs('.pizzaInfo h1').innerHTML = pizzasJson[idPizza].name
    qs('.pizzaInfo--size.selected').classList.remove('selected')
    qs('.pizzaInfo--desc').innerHTML = pizzasJson[idPizza].description
    qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzasJson[idPizza].price.toFixed(2)}`
    qsa('.pizzaInfo--size').forEach((size, indexSize) => {
      if(indexSize == 2){
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzasJson[idPizza].sizes[indexSize]
    })
    qs('.pizzaInfo--qt').innerHTML = modalQt;
    qs('.pizzaWindowArea').style.opacity = 0;
    qs('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
    qs('.pizzaWindowArea').style.opacity = 1;
    }, 200);
  });
  qs('.pizza-area').append(pizzaHtml);
});

function closeModel () {
  qs('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
    qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
qsa('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) =>{
  item.addEventListener('click', closeModel)
})

qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
})

qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if(modalQt > 1) {
    modalQt--;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
  }else{
    modalQt = 1;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
  }
})

qsa('.pizzaInfo--size').forEach((size) =>{
  size.addEventListener('click', () => {
  qs('.pizzaInfo--size.selected').classList.remove('selected')
  size.classList.add('selected')
  })
})

qs('.pizzaInfo--addButton').addEventListener('click', () => {
  let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'))

  let identifier = pizzasJson[idPizza].id + '#' + size;

  let finder = cart.findIndex((item) => item.identifier == identifier)

  if(finder > -1) {
    cart[finder].qt += modalQt;
  }else{
    cart.push({
      identifier,
      id: pizzasJson[idPizza].id,
      size,
      qt: modalQt
    })
  }
  closeModel()
  updateCart()
})

qs('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
      qs('aside').style.left =  '0'
    }else{
      qs('aside').style.left =  '100vw'
    }
})
qs('.menu-closer').addEventListener('click', () => {
    qs('aside').style.left = '100vw'
})

function updateCart() {

  qs('.menu-openner span').innerHTML = cart.length;

  if(cart.length > 0){
    qs('aside').classList.add('show')
    qs('.cart'). innerHTML = ''
    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let indexOfPizza in cart) {
      let pizzaItem = pizzasJson.find((item) => item.id == cart[indexOfPizza].id)
      subtotal += pizzaItem.price * cart[indexOfPizza].qt
      let cartItem = qs('.cart--item').cloneNode(true)
      let sizeWord;
      switch(cart[indexOfPizza].size) {
        case 0:
          sizeWord = 'P'
          break
        case 1:
          sizeWord = 'M'
          break
        case 2:
          sizeWord = 'G'
          break
      }
      cartItem.querySelector('img').setAttribute('src', pizzaItem.img)
      cartItem.querySelector('.cart--item-nome').innerHTML = `${pizzaItem.name} (${sizeWord})`
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[indexOfPizza].qt
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
        if(cart[indexOfPizza].qt > 1) {
          cart[indexOfPizza].qt--
        }else{
          cart.splice(indexOfPizza, 1)
        }
        updateCart()
      })
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
        cart[indexOfPizza].qt++
        updateCart()
      })

      qs('.cart').append(cartItem)
    }
    desconto = subtotal * 0.1
    total = subtotal - desconto 

    qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
    qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
    qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`

  }else{
    qs('aside').classList.remove('show')
    qs('aside').style.left =  '100vw'
  }
}