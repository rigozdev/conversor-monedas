const formulario = document.querySelector("#formulario");
const monto = document.querySelector("#monto");
const moneda = document.querySelector("#moneda");
const resultado = document.querySelector("#resultado");
const ctx = document.querySelector("#myChart");
const loading = document.querySelector("#loading")




formulario.addEventListener('submit', async (eve) => {
    eve.preventDefault(); //Previene el comportamiento usual del submit


    /* Se evalua que ingrese un monto */
    if (isNaN(monto.value) || monto.value === "") {
        alert('Por favor, verifíque haber ingresado un número');
    } else {

        /* Se evalua que seleccione una divisa */
        if (moneda.value == "") {
            alert('Por favor, seleccione una divisa');
        } else {

            /* En caso de pasar las evaluaciones ejecutar */
            try {
                loading.classList.remove("d-none");
                const res = await fetch(`https://mindicador.cl/api`);

                /* validación de respuesta */
                if (!res.ok) {
                    throw "Falló la solicitud";
                }
                /* se asigna la respuesta a la variable data */
                const data = await res.json();

                /* se pinta el calculo realizado */
                resultado.innerHTML = `<p>Valor actual: $${data[moneda.value].valor}</p><br><p>Valor: ${monto.value / data[moneda.value].valor}</p>`
                pintaChart(moneda.value);
            } catch (error) {
                /* Mensaje en caso de fallar la solicitud */
                resultado.innerHTML = `<p>Error en la solicitud</p>`;
            } finally {
                /* Se ejecuta spinner de carga */
                loading.classList.add("d-none");
            }
        }

    }
});

/* Se define variable como let */
let grafica;

/* Función que pinta gráfico de la moneda indicada */
const pintaChart = async (moneda) => {


    /* Se obtiene la respuesta a la promesa con la busqueda del fecth al endpoint, se asigna el valor a data */
    const res = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await res.json();

    /* Array de 10 elementos que contiene la fecha y el valor de cada moneda, se agrega reverse para
    que la fecha sea ascendente y avance de izquierda a derecha*/
    const arrayResultados = data.serie.slice(0, 10).reverse();


    /* Se crean 2 arreglos con la misma cantidad de elementos pero uno para fecha y otro para valor de moneda */
    const labelsFechas = arrayResultados.map(item => item.fecha.split("T")[0].split("-").reverse().join("-")); // Formato: 13-12-2022
    const dataMoneda = arrayResultados.map(item => item.valor);// Formato: 800.60

    /* Se destruye la grafica en caso de existir */
    if (grafica) {
        grafica.destroy();
    }

    grafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labelsFechas,
            datasets: [{
                label: 'Historial de últimos 10 días',
                data: dataMoneda,
                borderWidth: 1
            }]
        },
    })
}
