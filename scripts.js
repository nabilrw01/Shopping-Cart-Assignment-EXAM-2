const products = [
    { id: 1, name: 'FUJI Camera', description: '43.8mm x 32.9mm GFX 102MP CMOS II HS with primary color filter', price: 230.55, image: 'FUJI Camera.jpg' },
    { id: 2, name: 'Canon Camera', description: '128.8 x 97.3 x 62 mm 18.0MP TTL-CT-SIR AF-dedicated with a CMOS sensor', price: 202.12, image: 'Canon Camera.jpg' },
    // More products can be added here
];

const cart = [];
let promoCodeApplied = false;

const productContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const clearCartButton = document.getElementById('clear-cart');

const displayProducts = () => {
    productContainer.innerHTML = '';
    products.forEach((product) => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
};

const addToCart = (productId) => {
    console.log(`Adding product with ID: ${productId}`); // Debug log
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.product.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ product, quantity: 1 });
    }

    updateCart();
};

const updateCart = () => {
    cartContainer.innerHTML = '';
    let total = 0;

    cart.forEach(({ product, quantity }) => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <input type="number" value="${quantity}" min="1" onchange="updateQuantity(${product.id}, this.value)">
            <button onclick="removeFromCart(${product.id})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
        total += product.price * quantity;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
    displayFinalTotal(total); // Update the final total
    console.log(cart); // Debug: log cart contents
};

const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
        alert("Quantity must be at least 1");
        return;
    }

    const cartItem = cart.find(item => item.product.id === productId);
    cartItem.quantity = Number(quantity);
    updateCart();
};

const removeFromCart = (productId) => {
    const index = cart.findIndex(item => item.product.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        updateCart();
    }
};

const clearCart = () => {
    cart.length = 0;
    updateCart();
    promoCodeApplied = false; // Allow promo code to be applied again
    displayDiscount(0);
    displayMessage("");
};

const promoCodes = {
    ostad10: 0.10,
    ostad5: 0.05,
};

function getSubtotal() {
    return cart.reduce((total, { product, quantity }) => total + product.price * quantity, 0);
}

function applyPromoCode() {
    if (promoCodeApplied) {
        displayMessage("Promo code has already been applied.");
        return;
    }

    const promoCodeInput = document.getElementById("promo-code").value;
    const discount = promoCodes[promoCodeInput];

    if (discount) {
        const subtotal = getSubtotal();
        const discountAmount = subtotal * discount;
        const finalTotal = subtotal - discountAmount;

        displayDiscount(discountAmount);
        displayFinalTotal(finalTotal);
        displayMessage("Promo code applied successfully!");
        promoCodeApplied = true;
    } else {
        displayMessage("Invalid promo code. Please try again.");
    }
}

function displayDiscount(amount) {
    document.getElementById("discount-amount").textContent = `Discount: $${amount.toFixed(2)}`;
}

function displayFinalTotal(amount) {
    document.getElementById("final-total").textContent = `Total: $${amount.toFixed(2)}`;
    document.getElementById("subtotal").textContent = `Subtotal: $${getSubtotal().toFixed(2)}`;
}

function displayMessage(message) {
    document.getElementById("promo-code-message").textContent = message;
}

document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    clearCartButton.addEventListener('click', clearCart);
    document.getElementById('apply-promo-code-button').addEventListener('click', applyPromoCode);
});
