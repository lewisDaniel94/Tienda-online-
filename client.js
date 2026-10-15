// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAr-obYOwwguE0ozC14Rc_N63nJpBFCnz4",
    authDomain: "barberia-brother-barber-shop.firebaseapp.com",
    projectId: "barberia-brother-barber-shop",
    storageBucket: "barberia-brother-barber-shop.firebasestorage.app",
    messagingSenderId: "397748184756",
    appId: "1:397748184756:web:8797e5fe2736ade0d559e1",
    measurementId: "G-TQXE37W4FK"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables del carrito
let cart = [];

// Aplicar estilos globales de lujo uniforme a toda la página
function aplicarEstilosDeLujo() {
    if (document.getElementById("luxury-styles")) return;

    const style = document.createElement("style");
    style.id = "luxury-styles";
    style.innerHTML = `
        /* Fondo general y tipografía gourmet */
        body {
            background-color: #050505 !important;
            color: #f5f5f5 !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            margin: 0;
            padding: 0;
        }
        
        /* Navbar / Barra de navegación de lujo */
        nav, header, .navbar, .header-container {
            background-color: #0b0b0b !important;
            border-bottom: 1px solid #221c05 !important;
            color: #f1c40f !important;
        }
        nav a, header a, .navbar a {
            color: #f5f5f5 !important;
            transition: color 0.2s;
        }
        nav a:hover, header a:hover {
            color: #f1c40f !important;
        }

        /* Contenedor del menú principal */
        #menu-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 25px;
            padding: 20px 0;
        }

        /* Tarjetas de productos oscuras y elegantes */
        .product-card {
            background: #0b0b0b !important;
            border: 1px solid #221c05 !important;
            border-top: 1px solid #f1c40f !important;
            border-radius: 12px !important;
            padding: 20px !important;
            text-align: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.9) !important;
            transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .product-card:hover {
            transform: translateY(-5px);
            border-color: #f1c40f !important;
        }
        .product-card img {
            width: 100%;
            height: 180px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 12px;
        }
        .product-card h3 {
            color: #ffffff !important;
            font-size: 1.2rem;
            margin-bottom: 8px;
        }
        .product-card p {
            color: #aaa !important;
        }
        .product-card .price {
            color: #f1c40f !important;
            font-size: 1.25rem;
            font-weight: bold;
            margin: 10px 0;
        }

        /* Botón de agregar en tarjeta */
        .product-card button.btn-agregar {
            background: #f1c40f !important;
            color: #000000 !important;
            border: none !important;
            font-weight: bold;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
        }
        .product-card button.btn-agregar:hover {
            background: #d4ac0d !important;
        }

        /* Controles de cantidad (+ / -) en tarjetas */
        .product-qty-selector button {
            background: #000 !important;
            color: #f1c40f !important;
            border: 1px solid #262208 !important;
            border-radius: 4px;
            font-weight: bold;
            width: 30px;
            height: 30px;
            cursor: pointer;
        }
        .product-qty-selector input {
            background: #000 !important;
            color: #fff !important;
            border: 1px solid #262208 !important;
            height: 30px;
            border-radius: 4px;
            text-align: center;
        }

        /* Ventana "Tu pedido" (Carrito) y Formularios completamente oscuros */
        .cart-container, .order-sidebar, aside, form, .checkout-box {
            background: #0b0b0b !important;
            border: 1px solid #221c05 !important;
            border-radius: 12px !important;
            padding: 20px !important;
            color: #f5f5f5 !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.9) !important;
        }

        /* Elementos individuales dentro del carrito */
        .cart-item {
            border-bottom: 1px solid #222 !important;
            padding-bottom: 8px !important;
            margin-bottom: 10px !important;
        }

        /* Campos de texto, inputs y formularios */
        input, select, textarea {
            background: #000000 !important;
            color: #fff !important;
            border: 1px solid #262208 !important;
            padding: 12px !important;
            border-radius: 6px !important;
            width: 100% !important;
            box-sizing: border-box;
            margin-bottom: 12px !important;
        }
        input:focus, select:focus, textarea:focus {
            border-color: #f1c40f !important;
            outline: none !important;
        }

        /* Botón de enviar pedido */
        button[type="submit"], .btn-submit {
            background: #f1c40f !important;
            color: #000000 !important;
            font-weight: bold;
            border: none !important;
            padding: 12px !important;
            border-radius: 6px !important;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s;
        }
        button[type="submit"]:hover, .btn-submit:hover {
            background: #d4ac0d !important;
        }
    `;
    document.head.appendChild(style);
}

// Función para reproducir tono de alerta
function reproducirAlertaSonora() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); 
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); 

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
        console.log("Audio no permitido por el navegador hasta una interacción previa.");
    }
}

// Control de cantidad en tarjeta
window.cambiarCantidadCard = (productId, cambio) => {
    const inputQty = document.getElementById(`qty-${productId}`);
    if (!inputQty) return;
    let actual = parseInt(inputQty.value) || 1;
    actual += cambio;
    if (actual < 1) actual = 1;
    inputQty.value = actual;
};

// 1. Cargar menú desde Firestore con diseño de lujo
async function loadMenu() {
    aplicarEstilosDeLujo();
    const menuContainer = document.getElementById("menu-container");
    if (!menuContainer) return;

    menuContainer.innerHTML = "<p style='color: #f1c40f; text-align: center;'>Cargando alta cocina...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        
        let comidas = [];
        let bebidas = [];
        let postres = [];

        querySnapshot.forEach((docSnap) => {
            const product = docSnap.data();
            const productId = docSnap.id;
            const categoria = (product.category || "").toLowerCase().trim();

            const item = { id: productId, ...product };

            if (categoria === "bebida" || categoria === "bebidas") {
                bebidas.push(item);
            } else if (categoria === "postre" || categoria === "postres") {
                postres.push(item);
            } else {
                comidas.push(item);
            }
        });

        menuContainer.innerHTML = "";

        const crearTarjetaNode = (product, tipoCategoria) => {
            // Definir el texto de ejemplo (placeholder) según la categoría del producto
            let placeholderNota = "Nota (Ej: Sin papas, extra salsa...)"; // Por defecto para platos/hamburguesas

            if (tipoCategoria === "bebidas") {
                placeholderNota = "Ej: Pepsi, Coca-Cola, Sprite, Piña, Durazno, Fresa...";
            } else if (tipoCategoria === "postres") {
                placeholderNota = "Ej: Torta de piña, Torta tres leches...";
            }

            const card = document.createElement("div");
            card.classList.add("product-card");
            card.innerHTML = `
                <img src="${product.image || 'https://via.placeholder.com/150'}" alt="${product.name || 'Producto'}">
                <h3>${product.name || 'Sin nombre'}</h3>
                <p style="font-size: 13px; color: #aaa; margin: 5px 0; min-height: 35px;">${product.ingredients || ''}</p>
                <div class="price">$${Number(product.price || 0).toFixed(2)}</div>
                
                <div class="product-qty-selector" style="display: flex; align-items: center; justify-content: center; gap: 8px; margin: 10px 0;">
                    <button type="button" onclick="window.cambiarCantidadCard('${product.id}', -1)">-</button>
                    <input type="text" id="qty-${product.id}" value="1" readonly style="width: 35px; text-align: center;">
                    <button type="button" onclick="window.cambiarCantidadCard('${product.id}', 1)">+</button>
                </div>

                <!-- Campo de nota personalizada con ejemplo dinámico -->
                <input type="text" id="nota-${product.id}" placeholder="${placeholderNota}" style="margin-bottom: 10px; font-size: 11px; padding: 8px;">

                <button class="btn-agregar" onclick="window.agregarAlCarritoConNota('${product.id}', '${product.name}', ${product.price || 0})">Agregar a la Orden</button>
            `;
            return card;
        };

        // Renderizar Hamburguesas y Platos
        if (comidas.length > 0) {
            const tituloComidas = document.createElement("h2");
            tituloComidas.style.cssText = "grid-column: 1 / -1; width: 100%; margin: 25px 0 15px; border-bottom: 2px solid #f1c40f; padding-bottom: 8px; color: #f1c40f; font-weight: 600; letter-spacing: 1px;";
            tituloComidas.textContent = "🍔 Hamburguesas y Platos Gourmets";
            menuContainer.appendChild(tituloComidas);

            comidas.forEach(product => menuContainer.appendChild(crearTarjetaNode(product, "comidas")));
        }

        // Renderizar Bebidas
        if (bebidas.length > 0) {
            const tituloBebidas = document.createElement("h2");
            tituloBebidas.style.cssText = "grid-column: 1 / -1; width: 100%; margin: 35px 0 15px; border-bottom: 2px solid #f1c40f; padding-bottom: 8px; color: #f1c40f; font-weight: 600; letter-spacing: 1px;";
            tituloBebidas.textContent = "🥤 Bebidas & Coctelería";
            menuContainer.appendChild(tituloBebidas);

            bebidas.forEach(product => menuContainer.appendChild(crearTarjetaNode(product, "bebidas")));
        }

        // Renderizar Postres
        if (postres.length > 0) {
            const tituloPostres = document.createElement("h2");
            tituloPostres.style.cssText = "grid-column: 1 / -1; width: 100%; margin: 35px 0 15px; border-bottom: 2px solid #f1c40f; padding-bottom: 8px; color: #f1c40f; font-weight: 600; letter-spacing: 1px;";
            tituloPostres.textContent = "🍰 Postres Exclusivos";
            menuContainer.appendChild(tituloPostres);

            postres.forEach(product => menuContainer.appendChild(crearTarjetaNode(product, "postres")));
        }

        if (comidas.length === 0 && bebidas.length === 0 && postres.length === 0) {
            menuContainer.innerHTML = "<p style='color: #aaa; text-align: center;'>No hay creaciones disponibles en este momento.</p>";
        }

    } catch (error) {
        console.error("Error cargando el menú: ", error);
        menuContainer.innerHTML = "<p style='color: #e74c3c; text-align: center;'>Hubo un error al conectar con la alta cocina.</p>";
    }
}

// 2. Agregar al carrito considerando cantidad y nota personalizada
window.agregarAlCarritoConNota = (id, name, price) => {
    const inputQty = document.getElementById(`qty-${id}`);
    const inputNota = document.getElementById(`nota-${id}`);
    
    const cantidadSeleccionada = inputQty ? parseInt(inputQty.value) || 1 : 1;
    const notaPersonalizada = inputNota ? inputNota.value.trim() : "";

    const existingItem = cart.find(item => item.id === id && item.note === notaPersonalizada);
    if (existingItem) {
        existingItem.quantity += cantidadSeleccionada;
    } else {
        cart.push({ 
            id, 
            name, 
            price: Number(price), 
            quantity: cantidadSeleccionada, 
            note: notaPersonalizada 
        });
    }

    if (inputQty) inputQty.value = 1;
    if (inputNota) inputNota.value = "";
    
    updateCartUI();
};

// 3. Eliminar del carrito
window.eliminarDelCarrito = (id) => {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
        } else {
            cart.splice(index, 1);
        }
    }
    updateCartUI();
};

// 4. Actualizar interfaz del carrito mostrando notas y precios
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    if (!cartCount || !cartItemsContainer || !cartTotal) return;

    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalCount;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement("div");
        div.classList.add("cart-item");
        div.style.cssText = "display: flex; flex-direction: column; align-items: flex-start; margin-bottom: 10px; font-size: 14px; border-bottom: 1px solid #222; padding-bottom: 8px;";
        
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                <span style="color: #ddd;">${item.name} (x${item.quantity}) - <strong style="color: #f1c40f;">$${(item.price * item.quantity).toFixed(2)}</strong></span>
                <button type="button" onclick="window.eliminarDelCarrito('${item.id}')" style="background: #2a1215; color: #ff5252; border: 1px solid #551a1a; padding: 3px 8px; border-radius: 4px; cursor: pointer; font-size: 11px;" title="Quitar">✖</button>
            </div>
            ${item.note ? `<span style="color: #f1c40f; font-size: 12px; margin-top: 4px; font-style: italic;">Nota: ${item.note}</span>` : ''}
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
}

// 5. Enviar pedido con notas incluidas a Firestore
const orderForm = document.getElementById("order-form");
if (orderForm) {
    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Su orden está vacía.");
            return;
        }

        const nameInput = document.getElementById("client-name");
        const phoneInput = document.getElementById("client-phone");
        const addressInput = document.getElementById("client-address");

        const name = nameInput ? nameInput.value : "";
        const phone = phoneInput ? phoneInput.value : "";
        const address = addressInput ? addressInput.value : "";

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const itemsParaGuardar = [...cart];

        try {
            await addDoc(collection(db, "orders"), {
                clientName: name,
                clientPhone: phone,
                clientAddress: address,
                items: itemsParaGuardar,
                total: total,
                status: "pendiente",
                createdAt: serverTimestamp()
            });

            reproducirAlertaSonora();

            alert("¡Orden enviada con éxito! Su plato en camino.");
            
            cart = [];
            updateCartUI();
            orderForm.reset();

        } catch (error) {
            console.error("Error al enviar el pedido: ", error);
            alert("Hubo un error al procesar su orden.");
        }
    });
}

// Inicializar al cargar
loadMenu();