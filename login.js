import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
const auth = getAuth(app);

// Inyectar estilos estrictos de lujo (Negro absoluto y Amarillo oro puro)
function aplicarEstilosLoginDeLujo() {
    if (document.getElementById("luxury-login-styles")) return;

    const style = document.createElement("style");
    style.id = "luxury-login-styles";
    style.innerHTML = `
        /* Fondo negro absoluto sin grises ni blancos */
        html, body {
            background-color: #050505 !important;
            background: #050505 !important;
            color: #ffffff !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow: hidden;
        }

        /* Contenedor principal de inicio de sesión */
        #login-form, .login-container, form {
            background: #0b0b0b !important;
            background-color: #0b0b0b !important;
            border: 1px solid #221c05 !important;
            border-top: 1px solid #f1c40f !important;
            border-radius: 12px !important;
            padding: 40px !important;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.95) !important;
            width: 100%;
            max-width: 400px;
            box-sizing: border-box;
        }

        /* Títulos en amarillo oro puro */
        h1, h2, .login-title {
            color: #f1c40f !important;
            text-align: center;
            margin-bottom: 25px;
            font-weight: 600;
            letter-spacing: 1.5px;
            font-size: 1.6rem;
        }

        /* Campos de texto / inputs limpios sobre fondo negro */
        input {
            background: #000000 !important;
            background-color: #000000 !important;
            color: #ffffff !important;
            border: 1px solid #262208 !important;
            padding: 14px !important;
            border-radius: 6px !important;
            width: 100% !important;
            box-sizing: border-box;
            margin-bottom: 18px !important;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }
        
        /* Corregir autocompletado del navegador para evitar fondos blancos o grises */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 30px #000000 inset !important;
            -webkit-text-fill-color: #ffffff !important;
        }

        input:focus {
            border-color: #f1c40f !important;
            outline: none !important;
            box-shadow: 0 0 5px rgba(241, 196, 15, 0.2);
        }

        /* Botón de acceso en amarillo oro */
        button[type="submit"], .btn-login {
            background: #f1c40f !important;
            background-color: #f1c40f !important;
            color: #000000 !important;
            font-weight: bold;
            border: none !important;
            padding: 14px !important;
            border-radius: 6px !important;
            cursor: pointer;
            width: 100%;
            font-size: 15px;
            letter-spacing: 0.5px;
            transition: background 0.2s, transform 0.1s;
        }
        button[type="submit"]:hover, .btn-login:hover {
            background: #d4ac0d !important;
            background-color: #d4ac0d !important;
        }
        button[type="submit"]:active {
            transform: scale(0.98);
        }

        /* Mensaje de error */
        #error-msg {
            color: #ff5252 !important;
            text-align: center;
            font-size: 13px;
            margin-top: 15px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
}

// Aplicar los estilos al cargar el script
aplicarEstilosLoginDeLujo();

const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            // Forzar que la sesión se guarde localmente en el navegador[cite: 3]
            await setPersistence(auth, browserLocalPersistence);
            await signInWithEmailAndPassword(auth, email, password);
            
            // Redirigir al panel de administración[cite: 3]
            window.location.href = "admin.html";
        } catch (error) {
            console.error("Error de autenticación:", error);
            if (errorMsg) {
                errorMsg.textContent = "Correo o contraseña incorrectos.";
            }
        }
    });
}