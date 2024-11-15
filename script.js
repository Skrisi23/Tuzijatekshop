// Az aktív kosár elemeit tároló tömb
var cartItems = [];

// Véletlenszerű rendelésazonosító generálása
function generateOrderID() {
  return 'ORD-' + Math.floor(Math.random() * 1000000);
}

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
  var existingItem = cartItems.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name: name, price: price, quantity: 1 });
  }

  alert('A termék bekerült a kosárba!');
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
    cartItems.forEach(function(item, index) {
      var listItem = document.createElement('li');
      listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

      var itemName = document.createElement('span');
      itemName.textContent = item.name + ' - ' + item.price + ' Ft';

      var itemQuantity = document.createElement('span');
      itemQuantity.textContent = item.quantity + ' db';

      var modifyButton = document.createElement('button');
      modifyButton.classList.add('btn', 'btn-warning', 'btn-sm');
      modifyButton.textContent = 'Módosítás';
      modifyButton.onclick = function() {
        modifyQuantity(index);
      };

      listItem.appendChild(itemName);
      listItem.appendChild(itemQuantity);
      listItem.appendChild(modifyButton);

      cartItemsElement.appendChild(listItem);

      totalPrice += item.price * item.quantity;
    });
  }

  totalPriceElement.textContent = 'Összesen: ' + totalPrice + ' Ft';
}

// Mennyiség módosítása
function modifyQuantity(index) {
  var newQuantity = prompt('Adj meg egy új mennyiséget:');
  if (newQuantity !== null && newQuantity !== '') {
    newQuantity = parseInt(newQuantity);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      cartItems[index].quantity = newQuantity;
      updateCart();
    } else {
      alert('Kérlek, érvényes pozitív számot adj meg!');
    }
  }
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
  var paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  paymentModal.show();
});

// Fizetési mód választása és események
document.getElementById('bankTransfer').addEventListener('change', function() {
  document.getElementById('remarkBox').style.display = 'block';

  // Rendelésazonosító generálása és automatikus kitöltése a megjegyzés mezőben
  var orderID = generateOrderID();
  var remarksField = document.getElementById('remarks');
  remarksField.value = 'Rendelés azonosító: ' + orderID + '\nKérjük, használja ezt az azonosítót az utalás közleményében.';

  // E-mail mező megjelenítése
  document.getElementById('emailInput').style.display = 'block';
});

document.getElementById('cashOnDelivery').addEventListener('change', function() {
  document.getElementById('remarkBox').style.display = 'none';
  document.getElementById('emailInput').style.display = 'none';
});

// Fizetési mód megerősítése
document.getElementById('confirmPayment').addEventListener('click', function() {
  var selectedOption = document.querySelector('input[name="paymentOption"]:checked');
  var email = document.getElementById('emailInput').value;

  if (selectedOption) {
    if (selectedOption.value === 'Fizetés előre utalással') {
      var remarks = document.getElementById('remarks').value;
      alert(
        'Kiválasztott fizetési mód: ' + selectedOption.value +
        '.\nSzámlaszám: 12345678-12345678-12345678\nMegjegyzés: ' + remarks +
        '\nE-mail: ' + email
      );
    } else {
      alert('Kiválasztott fizetési mód: ' + selectedOption.value + '. Köszönjük a vásárlást!');
    }

    cartItems.length = 0;
    updateCart();

    var paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
    paymentModal.hide();
  } else {
    alert('Kérlek, válassz egy fizetési módot!');
  }
});
