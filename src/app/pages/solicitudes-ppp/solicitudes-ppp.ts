import { ChangeDetectorRef, Component } from '@angular/core';
import { RequestService } from '../../core/services/request';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CompanyUserService } from '../../core/services/company-user';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-solicitudes-ppp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitudes-ppp.html',
  styleUrl: './solicitudes-ppp.css',
})
export class SolicitudesPpp {
  registros: any[] = [];
  userId: number | null = null;
  isEstudiante: boolean = false;
  mostrarModalEstado: boolean = false;
  registroSeleccionado: any = null;
  isUpdating: boolean = false; // ← evitar doble clic

  constructor(
    private router: Router,
    private pppService: RequestService,
    private companyUserService: CompanyUserService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.userId = user.id;
    this.isEstudiante = user.roles.includes('ROLE_ESTUDIANTE');

    this.cargarRegistros();
  }

  abrirModalEstado(registro: any) {
    console.log("🟦 abrirModalEstado() → registro:", registro);

    this.registroSeleccionado = { ...registro };
    console.log("🟩 Copia inicial en registroSeleccionado:", this.registroSeleccionado);

    this.mostrarModalEstado = true;

    this.pppService.getById(registro.id).subscribe({
      next: (data) => {
        console.log("🟨 Datos reales recibidos en getById():", data);

        Object.assign(this.registroSeleccionado, data);

        console.log("🟧 registroSeleccionado FINAL después del merge:", this.registroSeleccionado);
      },
      error: (err) => console.error("❌ Error al cargar getById:", err),
    });
  }

  cerrarModalEstado() {
    this.mostrarModalEstado = false;
    this.registroSeleccionado = null;

    // asegurar que la UI reaccione
    this.cd.detectChanges();
  }

  cargarRegistros() {
    this.pppService.getAll().subscribe({
      next: (requests) => {
        const peticiones = requests.map(req =>
          this.companyUserService.getByCompany(req.companyUserId)
        );

        forkJoin(peticiones).subscribe(respuestas => {

          this.registros = requests.map((req, index) => {
            const datos = respuestas[index][0];
            if (!datos) return null;

            const estudianteId = datos.authUser?.id;

            if (this.isEstudiante && estudianteId !== this.userId) {
              return null;
            }

            return {
              id: req.id,
              expediente: req.expediente,
              estudiante: datos?.authUser
                ? `${datos.authUser.nombres} ${datos.authUser.apellidos}`
                : 'Sin estudiante',
              empresa: datos?.company?.razonSocial ?? 'Sin empresa',
              descripcion: req.descripcion,
              linea: req.linea,
              estado: req.estado ? 'Aprobado' : 'Pendiente',
              createdAt: req.createdAt,
            };
          }).filter(r => r !== null);
        });
      }
    });
  }

  confirmarCambioEstado() {
    if (this.isUpdating) {
      console.warn("⛔ Evitando doble clic en Confirmar");
      return;
    }
    this.isUpdating = true;

    if (!this.registroSeleccionado) {
      console.error("❌ registroSeleccionado es NULL");
      this.isUpdating = false;
      return;
    }

    const updated = {
      companyUserId: this.registroSeleccionado.companyUserId,
      expediente: this.registroSeleccionado.expediente,
      paso: this.registroSeleccionado.paso,
      linea: this.registroSeleccionado.linea,
      estado: true,
      descripcion: this.registroSeleccionado.descripcion,
    };

    this.pppService.update(this.registroSeleccionado.id, updated).subscribe({
      next: () => {
        console.log("✅ PUT exitoso → cerrando modal...");

        // 1️⃣ Actualización inmediata de la tabla (sin esperar backend)
        const index = this.registros.findIndex(r => r.id === this.registroSeleccionado.id);
        if (index !== -1) {
          this.registros[index].estado = "Aprobado";
        }

        // 2️⃣ Cerrar modal
        this.cerrarModalEstado();

        // 3️⃣ Recarga backend REAL (opcional pero recomendado)
        this.cargarRegistros();

        this.isUpdating = false;
      },
      error: (err) => {
        console.error("❌ Error en PUT:", err);
        this.isUpdating = false;
      },
    });
  }

  nuevoRegistro() {
    this.router.navigate(['/dashboard/formulario-ppp']);
  }

  eliminarRegistro(registro: any) {
    if (!confirm(`¿Estás seguro de eliminar el registro ${registro.expediente}?`)) {
      return;
    }

    // Evitar doble clic
    if (this.isUpdating) {
      console.warn("⛔ Evitando doble clic en eliminar");
      return;
    }
    this.isUpdating = true;

    this.pppService.delete(registro.id).subscribe({
      next: () => {
        console.log(`✅ Registro ${registro.expediente} eliminado con éxito`);


        // 1️⃣ Actualizar tabla en memoria sin recargar backend
        this.registros = this.registros.filter(r => r.id !== registro.id);

        // 2️⃣ Opción: recargar datos reales desde backend
        // this.cargarRegistros();

        // 2️⃣ Cerrar modal
        this.cerrarModalEstado();

        this.isUpdating = false;
      },
      error: (err) => {
        console.error("❌ Error al eliminar registro:", err);
        this.isUpdating = false;
      }

    });
  }

}
