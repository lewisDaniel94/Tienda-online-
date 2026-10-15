import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAr-oBYOwwguEOOzC14Rc_N63nJpBFCnz4",
  authDomain: "barberia-brother-barber-shop.firebaseapp.com",
  projectId: "barberia-brother-barber-shop",
  storageBucket: "barberia-brother-barber-shop.firebasestorage.app",
  messagingSenderId: "397748184756",
  appId: "1:397748184756:web:8797e5fe2736ade0d559e1",
  measurementId: "G-TQXE37W4FK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const ordersContainer = document.getElementById("orders-container");
let cachePedidos = [];
let filtroActual = "todos";
let primerCarga = true;

// Inyectar estilos estrictos de lujo (Negro absoluto y Amarillo oro, sin grises ni blancos)
function aplicarEstilosAdminDeLujo() {
    if (document.getElementById("luxury-admin-styles")) return;

    const style = document.createElement("style");
    style.id = "luxury-admin-styles";
    style.innerHTML = `
        /* Fondo negro absoluto sin grises ni blancos */
        body {
            background-color: #050505 !important;
            background: #050505 !important;
            color: #ffffff !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            margin: 0;
            padding: 0;
        }

        /* Navbar / Cabecera de administración */
        nav, header, .admin-header, .navbar {
            background-color: #0b0b0b !important;
            border-bottom: 1px solid #221c05 !important;
            color: #f1c40f !important;
        }
        nav a, header a, .navbar a {
            color: #ffffff !important;
        }

        /* Contenedor principal de pedidos */
        #orders-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 25px;
            padding: 20px;
        }

        /* Tarjetas de pedidos gourmet */
        .order-card {
            background: #0b0b0b !important;
            border: 1px solid #221c05 !important;
            border-top: 1px solid #f1c40f !important;
            border-radius: 12px !important;
            padding: 20px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.95) !important;
            color: #ffffff !important;
            transition: border-color 0.3s ease;
        }
        .order-card:hover {
            border-color: #f1c40f !important;
        }
        .order-card.completado {
            border-left: 4px solid #2ecc71 !important;
            opacity: 0.85;
        }
        .order-card h3 {
            color: #f1c40f !important;
            margin-top: 0;
            font-size: 1.2rem;
            border-bottom: 1px solid #221c05;
            padding-bottom: 8px;
        }
        .order-card p {
            color: #cccccc !important;
            margin: 8px 0;
            font-size: 0.95rem;
        }

        /* Lista de items dentro de la orden */
        .order-items {
            list-style: none;
            padding: 0;
            margin: 12px 0;
            border-top: 1px dashed #221c05;
            border-bottom: 1px dashed #221c05;
            max-height: 180px;
            overflow-y: auto;
        }
        .order-items li {
            display: flex;
            flex-direction: column;
            padding: 8px 0;
            font-size: 13px;
            color: #dddddd;
            border-bottom: 1px solid #111111;
        }

        /* Total de la orden */
        .order-total {
            font-size: 1.1rem;
            font-weight: bold;
            color: #f1c40f !important;
            margin: 12px 0;
            text-align: right;
        }

        /* Botón de cambiar estado en tarjeta */
        .btn-status {
            background: #000000 !important;
            color: #f1c40f !important;
            border: 1px solid #262208 !important;
            padding: 10px !important;
            border-radius: 6px !important;
            font-weight: bold;
            cursor: pointer;
            width: 100%;
            transition: background 0.2s, border-color 0.2s;
        }
        .btn-status:hover {
            background: #f1c40f !important;
            color: #000000 !important;
            border-color: #f1c40f !important;
        }

        /* Botones de filtros y acciones superiores */
        .btn-filter, button:not(.btn-status):not([onclick*="vaciarComandas"]) {
            background: #0b0b0b;
            color: #ffffff;
            border: 1px solid #262208;
            padding: 8px 14px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.2s;
        }
        .btn-filter.active, .btn-filter:hover {
            background: #f1c40f !important;
            color: #000000 !important;
            border-color: #f1c40f !important;
            font-weight: bold;
        }

        /* Modales de cierre diario completamente negros */
        #modal-cierre, .modal {
            background: rgba(0, 0, 0, 0.9) !important;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
        }
        #modal-cierre > div, .modal-content {
            background: #0b0b0b !important;
            border: 1px solid #221c05 !important;
            border-radius: 12px !important;
            color: #ffffff !important;
            padding: 25px !important;
            box-shadow: 0 15px 30px rgba(0,0,0,0.95) !important;
        }

        /* Tablas dentro del reporte de cierre diario */
        table {
            background: #000000 !important;
            color: #ffffff !important;
            border-radius: 6px;
            overflow: hidden;
        }
        th {
            background: #111111 !important;
            color: #f1c40f !important;
            border-bottom: 2px solid #221c05 !important;
        }
        td {
            border-bottom: 1px solid #1a1a1a !important;
            color: #cccccc !important;
        }
    `;
    document.head.appendChild(style);
}

// Aplicar estilos de lujo al iniciar
aplicarEstilosAdminDeLujo();

// Proteger la ruta esperando a que Firebase confirme la sesión
onAuthStateChanged(auth, (user) => {
    setTimeout(() => {
        if (!user) {
            window.location.href = "login.html";
        } else {
            inicializarPanelAdmin();
        }
    }, 500);
});

// Función para reproducir tono de alerta
function reproducirAlertaSonora() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
        console.log("Audio bloqueado por el navegador.");
    }
}

function inicializarPanelAdmin() {
    onSnapshot(collection(db, "orders"), (snapshot) => {
        let nuevosPedidos = [];
        let hayNuevosPendientes = false;

        snapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();
            nuevosPedidos.push({ id: docSnapshot.id, ...data });
        });

        if (!primerCarga) {
            const idsAnteriores = new Set(cachePedidos.map(p => p.id));
            const pendientesNuevos = nuevosPedidos.filter(p => !idsAnteriores.has(p.id) && (!p.status || p.status === "pendiente"));
            if (pendientesNuevos.length > 0) {
                hayNuevosPendientes = true;
            }
        }

        cachePedidos = nuevosPedidos;
        primerCarga = false;

        if (hayNuevosPendientes) {
            reproducirAlertaSonora();
        }

        renderizarPedidos();
    }, (error) => {
        console.error("Error al escuchar los pedidos: ", error);
        ordersContainer.innerHTML = "<p style='color: #ff5252;'>Hubo un error al cargar los pedidos en tiempo real.</p>";
    });
}

function renderizarPedidos() {
    ordersContainer.innerHTML = "";

    const pedidosFiltrados = cachePedidos.filter(order => {
        const estado = order.status || "pendiente";
        if (filtroActual === "todos") return true;
        return estado === filtroActual;
    });

    if (pedidosFiltrados.length === 0) {
        ordersContainer.innerHTML = `<p style="color: #aaaaaa; text-align: center; grid-column: 1 / -1;">No hay pedidos ${filtroActual === 'todos' ? 'registrados' : filtroActual + 's'}.</p>`;
        return;
    }

    pedidosFiltrados.forEach((order) => {
        const orderId = order.id;
        const estado = order.status || "pendiente";

        let itemsHTML = "";
        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                itemsHTML += `
                    <li>
                        <div style="display: flex; justify-content: space-between; width: 100%;">
                            <span>${item.name} (x${item.quantity})</span> 
                            <strong style="color: #f1c40f;">$${(item.price * item.quantity).toFixed(2)}</strong>
                        </div>
                        ${item.note ? `<span style="color: #f1c40f; font-size: 11px; font-style: italic; margin-top: 3px;">⚠️ Nota: ${item.note}</span>` : ''}
                    </li>`;
            });
        }

        const card = document.createElement("div");
        card.classList.add("order-card");
        if (estado === "completado") {
            card.classList.add("completado");
        }

        card.innerHTML = `
            <h3>Cliente: ${order.clientName || 'Sin nombre'}</h3>
            <p><strong>Teléfono:</strong> ${order.clientPhone || 'N/A'}</p>
            <p><strong>Dirección / Mesa:</strong> ${order.clientAddress || 'N/A'}</p>
            <p><strong>Estado:</strong> <span style="text-transform: uppercase; color: ${estado === 'completado' ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">${estado}</span></p>
            <ul class="order-items">
                ${itemsHTML}
            </ul>
            <div class="order-total">Total: $${order.total ? order.total.toFixed(2) : '0.00'}</div>
            <button class="btn-status" onclick="window.cambiarEstado('${orderId}', '${estado}')">
                ${estado === 'completado' ? 'Marcar como Pendiente' : 'Marcar como Completado'}
            </button>
        `;

        ordersContainer.appendChild(card);
    });
}

window.filtrarPedidos = (tipo, boton) => {
    filtroActual = tipo;
    document.querySelectorAll('.btn-filter').forEach(btn => btn.classList.remove('active'));
    boton.classList.add('active');
    renderizarPedidos();
};

window.cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "completado" ? "pendiente" : "completado";
    try {
        const orderRef = doc(db, "orders", id);
        await updateDoc(orderRef, {
            status: nuevoEstado
        });
    } catch (error) {
        console.error("Error al actualizar el estado: ", error);
        alert("No se pudo actualizar el estado del pedido.");
    }
};

window.cerrarSesion = async () => {
    try {
        await signOut(auth);
        window.location.href = "login.html";
    } catch (error) {
        console.error("Error al cerrar sesión", error);
    }
};

// Extraer fecha en formato YYYY-MM-DD soportando createdAt y timestamp
function obtenerFechaPedido(order) {
    const ts = order.createdAt || order.timestamp;
    if (!ts) return "";

    if (typeof ts.toDate === 'function') {
        return ts.toDate().toISOString().slice(0, 10);
    } else if (ts.seconds) {
        return new Date(ts.seconds * 1000).toISOString().slice(0, 10);
    } else {
        return String(ts).slice(0, 10);
    }
}

// Función de Cierre Diario estilizada
window.generarCierreDiario = () => {
    const hoy = new Date().toISOString().slice(0, 10);

    const pedidosDelDia = cachePedidos.filter(order => {
        const fechaPedido = obtenerFechaPedido(order);
        const esHoy = fechaPedido === hoy;
        const estaCompletado = (order.status || "pendiente") === "completado";

        return esHoy && estaCompletado;
    });

    if (pedidosDelDia.length === 0) {
        alert(`No hay pedidos completados para hoy (${hoy}). Revisa si el pedido está marcado como 'completado'.`);
        return;
    }

    let productosAgrupados = {};
    let granTotalGeneral = 0;

    pedidosDelDia.forEach(order => {
        granTotalGeneral += Number(order.total || 0);

        if (order.items && Array.isArray(order.items)) {
            order.items.forEach(item => {
                const nombre = item.name;
                const cantidad = Number(item.quantity || 1);
                const precio = Number(item.price || 0);

                if (!productosAgrupados[nombre]) {
                    productosAgrupados[nombre] = { cantidad: 0, totalVendido: 0 };
                }

                productosAgrupados[nombre].cantidad += cantidad;
                productosAgrupados[nombre].totalVendido += (cantidad * precio);
            });
        }
    });

    let htmlDetalle = `<p style="color: #cccccc;"><strong>Fecha del reporte:</strong> ${hoy}</p>`;
    htmlDetalle += `<p style="color: #cccccc;"><strong>Total de pedidos completados hoy:</strong> ${pedidosDelDia.length}</p>`;
    htmlDetalle += `<table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
        <thead>
            <tr>
                <th style="padding: 10px; text-align: left;">Plato / Producto</th>
                <th style="padding: 10px; text-align: center;">Cant.</th>
                <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>`;

    for (let [nombre, datos] of Object.entries(productosAgrupados)) {
        htmlDetalle += `
            <tr>
                <td style="padding: 10px;">${nombre}</td>
                <td style="padding: 10px; text-align: center;">${datos.cantidad}</td>
                <td style="padding: 10px; text-align: right; color: #f1c40f;">$${datos.totalVendido.toFixed(2)}</td>
            </tr>`;
    }

    htmlDetalle += `</tbody></table>`;
    htmlDetalle += `<h3 style="text-align: right; margin-top: 20px; color: #f1c40f;">Gran Total del Día: $${granTotalGeneral.toFixed(2)}</h3>`;

    htmlDetalle += `
        <div style="margin-top: 25px; border-top: 1px dashed #221c05; padding-top: 15px; text-align: center;">
            <p style="font-size: 13px; color: #aaaaaa; margin-bottom: 10px;">¿Ya revisaste el cierre? Puedes limpiar las comandas completadas de hoy.</p>
            <button onclick="window.vaciarComandasDelCierre()" style="background-color: #2a1215 !important; color: #ff5252 !important; border: 1px solid #551a1a !important; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; width: 100%;">
                🗑️ Vaciar Comandas Completadas de Hoy
            </button>
        </div>
    `;

    document.getElementById("contenido-cierre").innerHTML = htmlDetalle;
    document.getElementById("modal-cierre").style.display = "flex";
};

// Función para vaciar las comandas completadas del día
window.vaciarComandasDelCierre = async () => {
    if (!confirm("⚠️ ¿Estás seguro de vaciar las comandas completadas de hoy? Esta acción borrará esos registros de la base de datos.")) {
        return;
    }

    const hoy = new Date().toISOString().slice(0, 10);

    const pedidosABorrar = cachePedidos.filter(order => {
        const fechaPedido = obtenerFechaPedido(order);
        return fechaPedido === hoy && (order.status || "pendiente") === "completado";
    });

    if (pedidosABorrar.length === 0) {
        alert("No hay pedidos para vaciar.");
        return;
    }

    try {
        const promesasBorrado = pedidosABorrar.map(order => deleteDoc(doc(db, "orders", order.id)));
        await Promise.all(promesasBorrado);

        alert("¡Comandas del día vaciadas con éxito!");
        document.getElementById("modal-cierre").style.display = "none";
    } catch (error) {
        console.error("Error al vaciar las comandas: ", error);
        alert("Hubo un error al intentar vaciar las comandas.");
    }
};