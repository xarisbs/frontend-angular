import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { RoleService } from '../../core/services/roles';
import { forkJoin } from 'rxjs';
import { CompanyUserService } from '../../core/services/company-user';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css'],
})
export class Estudiantes implements OnInit {
  usuarios: any[] = [];
  rolesDisponibles: any[] = [];
  usuarioSeleccionado: any = null;
  idSeleccionado: any = null;
  rolesAsignados: number[] = [];
  usuarioForm: any = null;
  mostrarModalRoles = false;

  supervisores: any[] = [];
  supervisorSeleccionado: number | null = null;
  mostrarModalSupervisor = false;

  constructor(
    private userService: UserService,
    private companyUserService: CompanyUserService,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.companyUserService.getAll().subscribe({
      next: (data) => {
        // Llamamos a getUserById por cada registro (solo si quieres enriquecer datos)
        const peticiones = data.map(
          (cu: any) => this.userService.getUserById(cu.authUser.id) // obtiene usuario real
        );

        forkJoin(peticiones).subscribe((usuariosReales: any[]) => {
          this.usuarios = data.map((cu: any, i) => ({
            ...cu,
            authUser: usuariosReales[i], // ← Reemplaza/Completa authUser con datos reales
          }));

          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Error al cargar usuarios', err),
    });
  }

  abrirAsignacionSupervisor(companyUser: any, id: any) {
    this.usuarioSeleccionado = companyUser.authUser;
    this.idSeleccionado = id;
    this.supervisorSeleccionado = companyUser.supervisorId ?? null;

    // Aquí obtienes solo docentes / supervisores
    this.userService.getByRoleName('ROLE_DOCENTE').subscribe({
      next: (data) => {
        this.supervisores = data;
        this.mostrarModalSupervisor = true;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando supervisores', err),
    });
  }

  guardarSupervisor() {
    if (!this.idSeleccionado) return;

    const id = this.idSeleccionado;

    const peticion = this.supervisorSeleccionado
      ? this.companyUserService.assignSupervisor(id, this.supervisorSeleccionado)
      : this.companyUserService.clearSupervisor(id);

    peticion.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.mostrarModalSupervisor = false;
      },
      error: (err) => console.error('Error asignando supervisor', err),
    });
  }

  cerrarModalSupervisor() {
    this.mostrarModalSupervisor = false;
    this.supervisorSeleccionado = null;
  }

  editarUsuario(usuario: any) {
    this.usuarioForm = { ...usuario };
  }

  // Nuevo usuario
  abrirFormularioNuevoUsuario() {
    this.usuarioForm = {
      userName: '',
      nombres: '',
      apellidos: '',
      codigoUniversitario: '',
      dni: '',
      correo: '',
      password: '',
    };
  }

  guardarUsuarioForm() {
    if (!this.usuarioForm) return;

    const obs = this.usuarioForm.id
      ? this.userService.updateUser(this.usuarioForm.id, this.usuarioForm)
      : this.userService.createUser(this.usuarioForm);

    obs.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.usuarioForm = null;
      },
      error: (err) => console.error('Error al guardar usuario', err),
    });
  }

  cerrarFormularioUsuario() {
    this.usuarioForm = null;
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Desea eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => console.error('Error al eliminar usuario', err),
    });
  }
}
