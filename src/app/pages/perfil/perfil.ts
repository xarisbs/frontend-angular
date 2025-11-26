import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
import { UserService } from '../../core/services/user';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrls: ['./perfil.css'],
})
export class Perfil implements OnInit {
  usuario: any = {};
  editar = false;
  nuevaPassword: string = ''; // 👉 campo temporal para cambio de contraseña

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.cargarUsuario();
  }

  cargarUsuario() {
    const user = this.authService.getUser();

    if (!user) {
      // Si aún no se cargó el usuario del localStorage, reintenta
      setTimeout(() => this.cargarUsuario(), 200);
      return;
    }

    // Carga los datos completos desde backend
    this.userService.getUserById(+user.id).subscribe({
      next: (data) => {
        this.usuario = {
          ...data,
          rol: data.roles?.[0]?.name?.replace('ROLE_', '') || 'Usuario',
        };
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al obtener usuario:', err),
    });
  }

  guardarCambios() {
    const user = this.authService.getUser();
    console.log('Usuario actual antes de actualizar:', user);

    if (!user) return;

    // Clonamos usuario para no tocar el original directamente
    const datosActualizados = { ...this.usuario };

    // 🔒 Solo enviamos password si el usuario ingresó una nueva
    if (this.nuevaPassword && this.nuevaPassword.trim() !== '') {
      datosActualizados.password = this.nuevaPassword; // texto plano
    } else {
      delete datosActualizados.password; // evita enviar hash al backend
    }

    console.log('Datos que se envían al backend:', datosActualizados);

    this.userService.updateUser(+user.id, datosActualizados).subscribe({
      next: (updatedUser) => {
        console.log('Respuesta del backend al actualizar:', updatedUser);

        this.ngZone.run(() => {
          const userActual = this.authService.getUser();

          const nuevoUser = {
            ...userActual, // 🧠 mantenemos token y permisos
            ...updatedUser,
            roles: updatedUser.roles?.map((r: any) => r.name),
          };

          console.log(
            'Nuevo usuario que se guarda en AuthService (manteniendo permisos):',
            nuevoUser
          );
          this.authService.setUser(nuevoUser);
        });

        alert('Datos actualizados correctamente');
        this.editar = false;
        this.nuevaPassword = ''; // limpia el campo de password
      },
      error: (err) => console.error('Error al actualizar usuario:', err),
    });
  }
}
