import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user';
import { RoleService } from '../../core/services/roles';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css']
})
export class Usuarios implements OnInit {
  usuarios: any[] = [];
  rolesDisponibles: any[] = [];
  usuarioSeleccionado: any = null;
  rolesAsignados: number[] = [];
  usuarioForm: any = null;
  mostrarModalRoles = false;


  constructor(private userService: UserService, private roleService: RoleService, private cdr: ChangeDetectorRef,
    private ngZone: NgZone) { }

  ngOnInit() {
    this.cargarUsuarios();
    this.cargarRolesDisponibles();
  }

  cargarUsuarios() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.ngZone.run(() => {
          this.usuarios = data;
          this.cdr.detectChanges(); // fuerza refresco inmediato
        });
      },
      error: err => console.error('Error al cargar usuarios', err)
    });
  }

  cargarRolesDisponibles() {
    this.roleService.getRoles().subscribe({
      next: data => this.rolesDisponibles = data,
      error: err => console.error('Error al cargar roles', err)
    });
  }

  getRolesNames(roles: any[]): string {
    return roles?.map(r => r.name).join(', ') || '';
  }

  // Editar usuario
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
      password: ''
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
      error: err => console.error('Error al guardar usuario', err)
    });
  }

  cerrarFormularioUsuario() {
    this.usuarioForm = null;
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Desea eliminar este usuario?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: err => console.error('Error al eliminar usuario', err)
    });
  }

  abrirRoles(usuario: any) {
    this.usuarioSeleccionado = usuario;
    this.rolesAsignados = usuario.roles.map((r: any) => r.id);
    this.mostrarModalRoles = true;
  }

  cerrarModalRoles() {
    this.mostrarModalRoles = false;
    this.usuarioSeleccionado = null;
    this.rolesAsignados = [];
  }

  toggleRole(event: any, roleId: number) {
    if (event.target.checked) {
      // Si se marca, agregamos al array
      if (!this.rolesAsignados.includes(roleId)) {
        this.rolesAsignados.push(roleId);
      }
    } else {
      // Si se desmarca, lo quitamos del array
      this.rolesAsignados = this.rolesAsignados.filter(id => id !== roleId);
    }
  }


  guardarRoles() {
    if (!this.usuarioSeleccionado) return;

    const rolesOriginales = this.usuarioSeleccionado.roles.map((r: any) => r.id);

    const rolesAAgregar = this.rolesAsignados.filter(id => !rolesOriginales.includes(id));
    const rolesAEliminar = rolesOriginales.filter((id: number) => !this.rolesAsignados.includes(id));

    const llamadas: any[] = [];

    if (rolesAAgregar.length) llamadas.push(this.userService.assignRoles(this.usuarioSeleccionado.id, rolesAAgregar));
    if (rolesAEliminar.length) llamadas.push(this.userService.removeRoles(this.usuarioSeleccionado.id, rolesAEliminar));

    if (llamadas.length) {
      forkJoin(llamadas).subscribe({
        next: () => {
          this.cargarUsuarios();
          alert('Roles actualizados correctamente');
        },
        error: err => console.error('Error al actualizar roles', err)
      });
    } else {
      this.cerrarModalRoles();
    }
    this.cerrarModalRoles(); // cerramos modal inmediatamente
  }



}
