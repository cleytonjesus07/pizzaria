let cart = [];
const item = (el) => document.querySelector(el);
const items = (el) => document.querySelectorAll(el);
let modalQt = 1;
let key = null;
pizzaJson.map((pizza, index) => {
    let pizzaItem = item(".models .pizza-item").cloneNode(true);

    pizzaItem.setAttribute("data-key", index);
    pizzaItem.querySelector(".pizza-item--img img").src = pizza.img;

    pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${pizza.price.toFixed(2)}`;
    pizzaItem.querySelector(".pizza-item--name").innerHTML = pizza.name;
    pizzaItem.querySelector(".pizza-item--desc").innerHTML = pizza.description;

    pizzaItem.querySelector("a").addEventListener('click', (e) => {
        e.preventDefault();
        key = e.target.closest(".pizza-item").getAttribute("data-key");
        modalQt = 1;
        item(".pizzaBig img").src = pizzaJson[key].img;
        item(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
        item(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
        item(".pizzaInfo--actualPrice").innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        item(".pizzaInfo--size.selected").classList.remove("selected");
        items(".pizzaInfo--size").forEach((size, sizeIndex) => {
            (sizeIndex == 2) && size.classList.add("selected")
            size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
        })
        item(".pizzaInfo--qt").innerHTML = modalQt;

        item(".pizzaWindowArea").style.opacity = 0;
        item(".pizzaWindowArea").style.display = 'flex';
        setTimeout(() => item(".pizzaWindowArea").style.opacity = 1, 200)
    })
    item(".pizza-area").append(pizzaItem);
})

items(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach((btn => btn.onclick = closeModal))

item(".pizzaInfo--qtmenos").addEventListener("click", () => {
    if (modalQt == 1) {
        return;
    }
    modalQt--;
    item(".pizzaInfo--qt").innerHTML = modalQt;
})

item(".pizzaInfo--qtmais").addEventListener("click", () => {
    modalQt++;
    item(".pizzaInfo--qt").innerHTML = modalQt;
})

items(".pizzaInfo--size").forEach((size) => {
    size.addEventListener("click", () => {
        item(".pizzaInfo--size.selected").classList.remove("selected");
        size.classList.add("selected");
    })
})

item(".pizzaInfo--addButton").addEventListener("click", () => {
    let size = item(".pizzaInfo--size.selected").getAttribute("data-key");

    let identifier = `${pizzaJson[key].id}@${size}`;

    let keyItemCart = cart.findIndex(item => item.identifier == identifier)
    console.log(keyItemCart)
    if (keyItemCart > -1) {
        cart[keyItemCart].qt += modalQt;
    } else {
        cart.push({
            identifier,
            id: pizzaJson[key].id,
            size: parseInt(size),
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
})

item(".menu-openner").addEventListener("click",()=>{
    if(cart.length > 0){
         item("aside").style.left = "0px";
    }
});

item(".menu-closer").addEventListener("click",()=>{
    item("aside").style.left = "100vw";
})

function updateCart() {
    item(".menu-openner span").innerHTML = cart.length;
    (cart.length > 0) ? openCart() : closeCart();
}

function openCart() {
    item("aside").classList.add("show");
    item(".cart").innerHTML = "";

    let subtotal = 0;
    let desconto = 0;
    let total = 0;
    cart.forEach((_, index) => {
        let pizzaItem = pizzaJson.find((item) => item.id == cart[index].id);
        
        subtotal += pizzaItem.price * cart[index].qt;

        let cartItem = item(".models .cart--item").cloneNode(true);
        let pizzaSizeName;
        switch (cart[index].size) {
            case 0:
                pizzaSizeName = "Pequena";
                break;
            case 1:
                pizzaSizeName = "Média";
                break;
            case 2:
                pizzaSizeName = "Grande";
                break;
        }
        let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
        cartItem.querySelector("img").src = pizzaItem.img;
        cartItem.querySelector(".cart--item-nome").innerHTML = pizzaName;
        cartItem.querySelector(".cart--item--qt").innerHTML = cart[index].qt;

        cartItem.querySelector(".cart--item-qtmenos").addEventListener("click", () => {
            if (cart[index].qt > 1) {
                cart[index].qt--;
            } else {
                cart.splice(index,1)
            }
            updateCart();
        })

        cartItem.querySelector(".cart--item-qtmais").addEventListener("click", () => {
            cart[index].qt++;
            updateCart();
        })
        item(".cart").append(cartItem);
    })

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    item(".subtotal span:last-child").innerHTML = `R$ ${subtotal.toFixed(2)}`
    item(".desconto span:last-child").innerHTML = `R$ ${desconto.toFixed(2)}`
    item(".total span:last-child").innerHTML = `R$ ${total.toFixed(2)}`
}

function closeCart() {
    item("aside").classList.remove("show");
    item("aside").style.left = "100vw";
}

function closeModal() {
    item(".pizzaWindowArea").style.opacity = 0;
    setTimeout(() => item(".pizzaWindowArea").style.display = 'none', 200)
}


