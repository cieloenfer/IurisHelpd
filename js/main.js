let servicios = [];

fetch("./js/servicios.json")
    .then(response => response.json())
    .then(data => {
        servicios = data;
        cargarServicios(servicios);
    })


const contenedorServicios = document.querySelector("#contenedor-servicios");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".servicio-agregar");
const numerito = document.querySelector("#numerito");

botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
}))


function cargarServicios(serviciosElegidos) {
    contenedorServicios.innerHTML = "";

    serviciosElegidos.forEach(servicio => {

        const div = document.createElement("div");
        div.classList.add("servicio");
        div.innerHTML = `
            <img class="servicio-imagen" src="${servicio.imagen}" alt="${servicio.titulo}">
            <div class="servicio-detalles">
                <h3 class="servicio-titulo">${servicio.titulo}</h3>
                <p class="servicio-precio">$${servicio.precio}</p>
                <button class="servicio-agregar" id="${servicio.id}">Agregar</button>
            </div>
        `;

        contenedorServicios.append(div);

    })
    
    actualizarBotonesAgregar();

}

cargarServicios(servicios);

botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {

        botonesCategorias.forEach(boton => boton.classList.remove("active"));
       e.currentTarget.classList.add("active");

         if (e.currentTarget.id != "todos") {
            const servicioCategoria = servicios.find(servicio => servicio.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = servicioCategoria.categoria.nombre;
            const serviciosBoton = servicios.filter(servicio => servicio.categoria.id === e.currentTarget.id);
            cargarServicios(serviciosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los servicios";
            cargarServicios(servicios);
        }

    })
       
})

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".servicio-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let serviciosEnCarrito;

let serviciosEnCarritoLS = localStorage.getItem("servicios-en-carrito");


if (serviciosEnCarritoLS) {
    serviciosEnCarrito = JSON.parse(serviciosEnCarritoLS);
    actualizarNumerito();
} else {
    serviciosEnCarrito = [];
}

function agregarAlCarrito(e) {
    
    Toastify({
        text: "Servicio agregado",
        duration: 3000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #4b33a8, #785ce9)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        onClick: function(){} // Callback after click
      }).showToast();

    const idBoton = e.currentTarget.id;
    const servicioAgregado = servicios.find(servicio => servicio.id === idBoton);

    if(serviciosEnCarrito.some(servicio => servicio.id === idBoton)) {
        const index = serviciosEnCarrito.findIndex(servicio => servicio.id === idBoton);
        serviciosEnCarrito[index].cantidad++;
    } else {
        servicioAgregado.cantidad = 1;
        serviciosEnCarrito.push(servicioAgregado);
    }

}

 actualizarNumerito();
    
 localStorage.setItem("servicios-en-carrito", JSON.stringify(serviciosEnCarrito));

function actualizarNumerito() {
let nuevoNumerito = serviciosEnCarrito.reduce((acc, servicio) => acc + servicio.cantidad, 0);
 numerito.innerText = nuevoNumerito;
    
      }