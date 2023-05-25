// Az aktív kosár elemeit tároló tömb
var cartItems = [];

// Kosárba helyezés gombra kattintás eseménykezelője
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart')) {
    var product = event.target.closest('.product');
    var productName = product.querySelector('.product-name').textContent;
    var productPrice = parseInt(product.dataset.price);

    addToCart(productName, productPrice);
  }
});

// Kosárba helyezés függvény
function addToCart(name, price) {
  cartItems.push({ name: name, price: price });

  updateCart();
}

// Kosár frissítése
function updateCart() {
  var cartItemsElement = document.getElementById('cart-items');
  var totalPriceElement = document.getElementById('total-price');
  var totalPrice = 0;

  cartItemsElement.innerHTML = '';

  if (cartItems.length === 0) {
    cartItemsElement.innerHTML = '<li class="list-group-item">A kosár üres</li>';
  } else {
    cartItems.forEach(function(item) {
      var listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.textContent = item.name + ' - ' + item.price + ' Ft';
      cartItemsElement.appendChild(listItem);

      totalPrice += item.price;
    });
  }

  totalPriceElement.textContent = 'Összesen: ' + totalPrice + ' Ft';
}

// Betöltéskor frissítsd a kosarat, ha szükséges
document.addEventListener('DOMContentLoaded', function() {
  var savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    cartItems = JSON.parse(savedCart);
    updateCart();
  }
});

// Kilépéskor mentsd el a kosarat
window.addEventListener('beforeunload', function() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
});

// Fizetés gombra kattintás eseménykezelője
var checkoutButton = document.getElementById('checkout');
checkoutButton.addEventListener('click', function() {
  checkout();
});

// Fizetés
function checkout() {
  var totalPrice = document.getElementById('total-price').textContent;
  var confirmationMessage = 'Fizetés megerősítve. Fizetendő összeg: ' + totalPrice + ' Ft. Köszönjük a vásárlást!';

  alert(confirmationMessage);

  cartItems.length = 0; // Kosár kiürítése
  updateCart();
}
