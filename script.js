document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    // 1. Lógica do Cardápio: Adicionar ao Carrinho
    const productsContainer = document.querySelector('.products');
    if (productsContainer) {
        productsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-auth') || e.target.classList.contains('btn-cta')) {
                const item = e.target.closest('.product-item');
                const name = item.querySelector('h3').innerText;
                const priceText = item.querySelector('valor').innerText;
                const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
                
                addToCart(name, price);
            }
        });
    }

    // 2. Lógica do Carrinho: Renderizar Itens
    const orderActions = document.querySelector('.order-actions');
    if (orderActions) {
        renderCart();
    }

    // 3. Barra de Busca: Filtro em tempo real
    const searchInput = document.querySelector('.search input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const products = document.querySelectorAll('.product-item');
            
            products.forEach(product => {
                const title = product.querySelector('h3').innerText.toLowerCase();
                product.style.display = title.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // 4. Formulários: Simulação de Envio
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Ação realizada com sucesso! (Simulação de sistema)');
            form.reset();
        });
    });
});

// Funções de apoio
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();

    // Gatilho da animação no ícone do carrinho
    const cartLink = document.querySelector('a[href="carrinho.html"]');
    if (cartLink) {
        cartLink.classList.add('cart-shake');
        cartLink.addEventListener('animationend', () => {
            cartLink.classList.remove('cart-shake');
        }, { once: true });
    }

    alert(`${name} foi adicionado ao seu carrinho!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.querySelector('a[href="carrinho.html"]');
    if (cartLink) {
        cartLink.innerText = `Carrinho (${cart.length})`;
    }
}

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.querySelector('.content div'); 
    const whatsappBtn = document.querySelector('.btn-whatsapp');

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>Seu carrinho está vazio. Vá até o cardápio e escolha seu açaí!</p>';
        if (whatsappBtn) whatsappBtn.style.display = 'none';
        return;
    }

    let html = '<div style="text-align: left; max-width: 600px; margin: 0 auto;">';
    let total = 0;
    let messageText = "Olá Boutique Açaí! Gostaria de fazer o seguinte pedido:\n\n";

    cart.forEach((item, index) => {
        html += `
            <div style="display:flex; justify-content:space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${item.name}</span>
                <span>R$ ${item.price.toFixed(2).replace('.', ',')} 
                <button onclick="removeFromCart(${index})" style="background:none; border:none; color: #ff4d4d; cursor:pointer; margin-left: 10px;">[X]</button></span>
            </div>`;
        total += item.price;
        messageText += `- ${item.name}: R$ ${item.price.toFixed(2).replace('.', ',')}\n`;
    });

    html += `<h3 style="margin-top: 20px; text-align: right;">Total: R$ ${total.toFixed(2).replace('.', ',')}</h3></div>`;
    cartContainer.innerHTML = html;

    messageText += `\n*Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*`;
    
    if (whatsappBtn) {
        whatsappBtn.href = `https://wa.me/5511999999999?text=${encodeURIComponent(messageText)}`;
        whatsappBtn.style.display = 'inline-flex';
    }
}

window.removeFromCart = function(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Re-renderiza a página se houver os elementos necessários
    const orderActions = document.querySelector('.order-actions');
    if (orderActions) renderCart();
    updateCartCount();
}