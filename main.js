var userStr = localStorage.getItem("userLogin");
var userLogin = JSON.parse(userStr);
var nav_login = document.getElementById('login')
var dropDown = document.getElementById('dropDown')
var storeProducts = JSON.parse(localStorage.getItem("products"));
var list = document.getElementById('list_product')
var pagination = document.getElementById('pagination')
var nav = document.getElementById('nav')


window.onscroll = function () { 
  if ($(window).scrollTop() >= 50) {
    nav.classList.add('scrolled')
  } else {
    nav.classList.remove('scrolled')
  }
};


const getUsers = async () => {
  const res = await fetch("http://localhost:3000/users")
  const users = await res.json();
  localStorage.setItem("users", JSON.stringify(users));
}

const getProduct = async () => {
  const res = await fetch("http://localhost:3000/products")
  const products = await res.json();
  localStorage.setItem("products", JSON.stringify(products));
}

const getCategories = async () => {
  const res = await fetch("http://localhost:3000/categories")
  const categories = await res.json();
  localStorage.setItem("categories", JSON.stringify(categories));
}

getUsers();
getProduct();
getCategories();
// var storeUsers = JSON.parse(localStorage.getItem("users")) || [];
if(userLogin != null){
  nav_login.remove()
  document.getElementById('dropDown_link').innerHTML = userLogin.email;
} else{
  dropDown.remove()
}


function logout() {
  localStorage.removeItem("userLogin");
  window.location.pathname = '../'
}


let current_page = 1;
let columns = 8;

function DisplayList(items,wrapper,columns_per_page, page){
  wrapper.innerHTML ="";
  page--;
  let start = columns_per_page * page;
  let end = start + columns_per_page;
  let paginationItems = items.slice(start, end);
  let product =''
  for(let i = 0; i < paginationItems.length;i++){
    let item = paginationItems[i];

    product = "<div class='col-lg-3 col-sm-4'>";
    product += "<div class='card box_card'>";
    product += "<div class='box_imges' >";
    product += "<div style='background-image: url("+ item.image +")' class='box_image_item'>";
    product += "</div>";
    product += "<div class='card-body card_body'>";
    product += "<a href='' class='card-title title_item'>"+item.name+"</a>";
    product += "<p class='card-text text_item'>"+item.price+"₫</p>";
    product += "<button id='item" + item.id + "' class='btn btn_button'>Order</button>";                       
    product += "</div>";
    product += "</div>";
    product += "</div>";
    product += "</div>";
    wrapper.innerHTML += product;
    document.getElementById("item" + item.id).setAttribute("onclick", `clickOrder("${item.id}")`)
  }
}

function setupPagination(items, wrapper, columns_per_page){
  wrapper.innerHTML ="";

  let page_count = Math.ceil(items.length/columns_per_page)

  for(let i = 1; i < page_count + 1; i++){
    let btn = PaginationBtn(i, items)
    wrapper.appendChild(btn);
  }

}

function PaginationBtn(page, items){
  let btn = document.createElement('button')
  btn.innerText = page
  if(current_page == page){
    btn.classList.add('active');
  }
  btn.addEventListener('click',() =>{
    current_page = page
    DisplayList(items,list,columns,current_page);
  })
  return btn
}


function onLoadCartNumber(){
  let productNumber = localStorage.getItem('cartNumber')
  if(productNumber){
    document.querySelector('.numberCircle').textContent = productNumber;
  }
}

function clickOrder (item) {
  // fetch(`http://localhost:3000/products?id=${item}`,{
  //   method: "GET",
  // }).then(r => r.json())
  // .then(item => {
  //   if (cart.length) {
  //     cartItem = {

  //     }
  //     // var existCart = false;
  //     // for (var i = 0; i < cart.length; i++) {
  //     //   if (cart[i].id == item[0].id) existCart = true;
  //     //   else existCart = false;
  //     // }

  //     // if (existCart) {
  //     //   cart = [..]
  //     // }
  //     // var newCart = [];
  //     cart.map(prod => {
  //       if(prod.id == item[0].id){
  //         [...cart, {...prod, quantity: prod.quantity + 1} ]
  //       } else{

  //       }
  //     });
  //     // console.log(newCart)
  //     // cart = newCart;
  //     // var cartItem = cart.filter(prod => prod.id == item[0].id)[0];
  //     // cart.map(prod => prod.id )
  //     // if (cartItem) {
  //     //   cartItem = {...cartItem, quantity: cartItem.quantity + 1}
  //     // } else {
  //     //   cartItem = {...item[0], quantity: 1}
  //     // }
  //     // cart = [...cart, cartItem]
  //   }else {
  //     cart = [{...item[0], quantity: 1}];
  //   }
  //   console.clear();
  //  console.log(cart);
  //   // localStorage.setItem("cart",JSON.stringify(cart))   
  // })

  let productNumber = localStorage.getItem('cartNumber')

  productNumber = parseInt(productNumber)

  if(productNumber){
    localStorage.setItem('cartNumber', productNumber + 1)
    document.querySelector('.numberCircle').textContent = productNumber + 1;
  }else{
    localStorage.setItem('cartNumber', 1)
    document.querySelector('.numberCircle').textContent = 1;
  }
  setItem(item);
}


function setItem(item){
  let cartItems = localStorage.getItem("cart");
   cartItems = JSON.parse(cartItems);

  fetch(`http://localhost:3000/products?id=${item}`,{
  method: "GET",
  }).then(r => r.json())
  .then(item => {
    if(cartItems != null){
      if(cartItems[item[0].id] == undefined){
        cartItems = {
          ...cartItems,
          [item[0].id]: item[0] 
         }
      }
      cartItems[item[0].id].quantity += 1
    }else {
      item[0].quantity = 1
     cartItems = {
       [item[0].id]: item[0] 
      }
    }   
    localStorage.setItem('cart' ,JSON.stringify(cartItems))
  }) 
}

onLoadCartNumber();
DisplayList(storeProducts,list,columns,current_page);
setupPagination(storeProducts,pagination,columns)









