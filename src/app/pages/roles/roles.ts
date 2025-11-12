import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../core/services/roles';
import { forkJoin } from 'rxjs';
import { Permission } from '../../core/services/permission';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roles.html',
  styleUrls: ['./roles.css']
})
export class Roles implements OnInit {
  roles: any[] = [];
  rolNombre = '';
  editar = false;
  rolEditarId: number | null = null;

  // Permisos
  permisosDisponibles: any[] = [];
  permisosAsignados: number[] = [];
  mostrarModalPermisos = false;
  rolSeleccionado: any = null;

  constructor(
    private roleService: RoleService,
    private permissionService: Permission,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.cargarRoles();
    this.cargarPermisosDisponibles();
  }

  // Cargar todos los roles
  cargarRoles() {
    this.roleService.getRoles().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.roles = data;
          this.cdr.detectChanges();
        });
      },
      error: (err) => console.error('Error al cargar roles', err)
    });
  }

  // Cargar permisos disponibles
  cargarPermisosDisponibles() {
    this.permissionService.getPermissions().subscribe({
      next: data => this.permisosDisponibles = data,
      error: err => console.error('Error al cargar permisos', err)
    });
  }

  // Crear o actualizar rol
  guardarRol() {
    if (!this.rolNombre.trim()) {
      alert('El nombre del rol no puede estar vacío');
      return;
    }
    if (this.editar && this.rolEditarId) {
      this.roleService.updateRole(this.rolEditarId, { name: this.rolNombre }).subscribe({
        next: () => this.cargarRoles(),
      });
    } else {
      this.roleService.createRole({ name: this.rolNombre }).subscribe({
        next: () => this.cargarRoles(),
      });
    }
    this.limpiarFormulario();
  }

  // Preparar formulario para editar
  editarRol(rol: any) {
    this.editar = true;
    this.rolEditarId = rol.id;
    this.rolNombre = rol.name;
  }

  // Eliminar rol
  eliminarRol(id: number) {
    if (confirm('¿Desea eliminar este rol?')) {
      this.roleService.deleteRole(id).subscribe({
        next: () => this.cargarRoles(),
      });
    }
  }

  limpiarFormulario() {
    this.editar = false;
    this.rolEditarId = null;
    this.rolNombre = '';
  }

  // Abrir modal de permisos para un rol
  abrirModalPermisos(rol: any) {
    this.rolSeleccionado = rol;
    this.permisosAsignados = rol.permissions?.map((p: any) => p.id) || [];
    this.mostrarModalPermisos = true;
  }

  cerrarModalPermisos() {
    this.mostrarModalPermisos = false;
    this.rolSeleccionado = null;
    this.permisosAsignados = [];
  }

  togglePermiso(event: any, permisoId: number) {
    if (event.target.checked) {
      if (!this.permisosAsignados.includes(permisoId)) this.permisosAsignados.push(permisoId);
    } else {
      this.permisosAsignados = this.permisosAsignados.filter(id => id !== permisoId);
    }
  }

  // Guardar permisos asignados
  guardarPermisos() {
    if (!this.rolSeleccionado) return;

    const permisosOriginales = this.rolSeleccionado.permissions?.map((p: any) => p.id) || [];
    const permisosAAgregar = this.permisosAsignados.filter(id => !permisosOriginales.includes(id));
    const permisosAEliminar = permisosOriginales.filter((id: number) => !this.permisosAsignados.includes(id));

    const llamadas: any[] = [];
    if (permisosAAgregar.length) llamadas.push(this.roleService.assignPermissions(this.rolSeleccionado.id, permisosAAgregar));
    if (permisosAEliminar.length) llamadas.push(this.roleService.removePermissions(this.rolSeleccionado.id, permisosAEliminar));

    if (llamadas.length) {
      forkJoin(llamadas).subscribe({
        next: () => {
          this.cargarRoles();
          alert('Permisos actualizados correctamente');
          this.cerrarModalPermisos();
        },
        error: err => console.error('Error al actualizar permisos', err)
      });
    } else {
      this.cerrarModalPermisos();
    }
  }
}
