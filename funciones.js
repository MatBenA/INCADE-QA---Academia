// "BASE DE DATOS" SIMULADA
    let bdNotas = [
        { alumno: "alumno1", materia: "Matemáticas", nota: 8.5, condicion: "Promocionado" },
        { alumno: "alumno1", materia: "Historia", nota: 5.0, condicion: "Recuperatorio" }
    ];

    let usuarioActivo = "";

    // CORE LOGIC (Validación)
    function validarYProcesarDatos(nombre, materia, nota) {
        if (!nombre || nombre.trim().length < 3 || /\d/.test(nombre)) {
            throw new Error("Nombre inválido: Debe tener mínimo 3 letras y no contener números");
        }
        const n = parseFloat(nota);
        if (isNaN(n) || n < 1.0 || n > 10.0) {
            throw new Error("Nota fuera de rango: Debe estar entre 1.0 y 10.0");
        }
        return n >= 7.0 ? "Promocionado" : "Recuperatorio";
    }

    // CONTROL DE PESTAÑAS PARA EL PROFESOR
    function cambiarVistaProfesor(vista) {
        const seccionCarga = document.getElementById('seccionCargaProfesor');
        const seccionTabla = document.getElementById('actionPanel');
        const btnCarga = document.getElementById('btnTabCarga');
        const btnVisor = document.getElementById('btnTabVisor');

        if (vista === 'carga') {
            seccionCarga.style.display = "block";
            seccionTabla.style.display = "none";
            btnCarga.classList.add('active');
            btnVisor.classList.remove('active');
        } else if (vista === 'visor') {
            seccionCarga.style.display = "none";
            seccionTabla.style.display = "block";
            btnCarga.classList.remove('active');
            btnVisor.classList.add('active');
            actualizarTablaUI(); // Renderiza los datos actualizados
        }
    }

    // RENDERIZAR TABLA SEGÚN EL ROL LOGUEADO
    function actualizarTablaUI() {
        const tbody = document.getElementById('tablaNotas').getElementsByTagName('tbody')[0];
        tbody.innerHTML = ""; 
        let mostrarAlertaRiesgo = false;

        let notasFiltradas = [];
        if (usuarioActivo === "profesor") {
            notasFiltradas = bdNotas;
        } else {
            notasFiltradas = bdNotas.filter(n => n.alumno.toLowerCase() === usuarioActivo.toLowerCase());
        }

        notasFiltradas.forEach(item => {
            const row = tbody.insertRow();
            const cellClass = item.condicion === "Promocionado" ? "badge-green" : "badge-red";
            row.innerHTML = `<td>${item.alumno}</td><td>${item.materia}</td><td>${item.nota}</td><td><span class="${cellClass}">${item.condicion}</span></td>`;
            
            if (item.condicion === "Recuperatorio") {
                mostrarAlertaRiesgo = true;
            }
        });

        // La alerta de riesgo sólo tiene sentido real para la vista del alumno o el visor del profe
        const recSection = document.getElementById('recuperatorioSection');
        recSection.style.display = mostrarAlertaRiesgo ? "block" : "none";
    }

    // CONTROLADORES DE INTERFAZ
    function controladorLogin() {
        const u = document.getElementById('userInput').value;
        const p = document.getElementById('passInput').value;
        const error = document.getElementById('loginError');
        const load = document.getElementById('loading');
        
        error.innerText = "";
        load.style.display = "block";

        setTimeout(() => {
            load.style.display = "none";
            if (u === "profesor1" && p === "secure567") {
                usuarioActivo = "profesor";
                document.getElementById('loginSection').style.display = "none";
                document.getElementById('panelProfesor').style.display = "block";
                
                // Al entrar, el profesor ve por defecto la pestaña de carga
                cambiarVistaProfesor('carga');
                
            } else if (u === "alumno1" && p === "read123") {
                usuarioActivo = "alumno1";
                document.getElementById('loginSection').style.display = "none";
                document.getElementById('panelAlumno').style.display = "block";
                document.getElementById('actionPanel').style.display = "block"; // Alumno ve la tabla directo
                actualizarTablaUI();
            } else {
                error.innerText = "Credenciales Inválidas";
            }
        }, 2000);
    }

    function controladorCarga() {
        const alInput = document.getElementById('alumnoInput');
        const matInput = document.getElementById('materiaInput');
        const ntInput = document.getElementById('notaInput');
        const err = document.getElementById('cargaError');

        const al = alInput.value;
        const mat = matInput.value;
        const nt = ntInput.value;

        err.innerText = "";

        try {
            const condicion = validarYProcesarDatos(al, mat, nt);
            
            setTimeout(() => {
                bdNotas.push({
                    alumno: al,
                    materia: mat,
                    nota: parseFloat(nt),
                    condicion: condicion
                });

                alert("¡Nota registrada con éxito!");

                // Limpiar campos
                alInput.value = "";
                matInput.value = "";
                ntInput.value = "";
                
            }, 1000);

        } catch (e) {
            err.innerText = e.message;
        }
    }

    function logout() {
        usuarioActivo = "";
        document.getElementById('userInput').value = "";
        document.getElementById('passInput').value = "";
        document.getElementById('panelProfesor').style.display = "none";
        document.getElementById('panelAlumno').style.display = "none";
        document.getElementById('actionPanel').style.display = "none";
        document.getElementById('seccionCargaProfesor').style.display = "none";
        document.getElementById('loginSection').style.display = "block";
    }