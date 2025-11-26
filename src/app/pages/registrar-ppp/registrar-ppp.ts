import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CompanyService } from '../../core/services/company';
import { UserService } from '../../core/services/user';
import { CompanyUserService } from '../../core/services/company-user';
import { RequestService } from '../../core/services/request';
import { StudentService } from '../../core/services/student';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-ppp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrar-ppp.html',
  styleUrl: './registrar-ppp.css',
})
export class RegistrarPpp {
  paso = 1;

  codigoEstudiante: string = '';

  estudiante: any = null;

  // Empresa a registrar
  empresa: any = {
    razonSocial: '',
    ruc: '',
    direccionFiscal: '',
    responsable: '',
  };

  vistaPreviaPdf: any = null;

  constructor(
    private companyService: CompanyService,
    private companyUserService: CompanyUserService,
    private requestService: RequestService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    if (user.roles.includes('ROLE_ESTUDIANTE')) {
      this.codigoEstudiante = user.codigoUniversitario ?? '';

      // Espera a que Angular termine de pintar la vista
      setTimeout(() => {
        this.buscarEstudiante(); // esto cambia paso = 2 internamente
      });
    }
  }

  // =============================
  // 1️⃣ Buscar estudiante
  // =============================
  buscarEstudiante() {
    this.userService.getStudents().subscribe({
      next: (lista) => {
        const encontrado = lista.find((x) => x.codigoUniversitario == this.codigoEstudiante);

        if (!encontrado) {
          alert('Estudiante no encontrado');
          return;
        }

        this.estudiante = encontrado;
        this.paso = 2;
      },
      error: (err) => console.error(err),
    });
  }

  // =============================
  // 3️⃣ Generar vista previa
  // =============================
  generarVistaPrevia() {
    this.vistaPreviaPdf = {
      estudiante: this.estudiante,
      empresa: this.empresa,
    };

    this.paso = 3;
  }

  private generarExpediente(id: number): string {
    const year = new Date().getFullYear();
    const paddedId = id.toString().padStart(4, '0');
    return `${year}${paddedId}`;
  }

  // =============================
  // 4️⃣ Guardar registro final
  // =============================
  guardar() {
    // DTO correcto para el backend
    const dto = {
      company: {
        razonSocial: this.empresa.razonSocial,
        ruc: this.empresa.ruc,
        direccionFiscal: this.empresa.direccionFiscal,
        responsable: this.empresa.responsable,
      },
      users: [
        {
          authUserId: this.estudiante.id, // el id del usuario-estudiante
          supervisorId: '', // si no tienes supervisor aún
        },
      ],
    };

    this.companyService.registerUserAndCompany(dto).subscribe({
      next: (respuesta) => {
        const requestDto = {
          companyUserId: respuesta.companyUser.id,
          expediente: this.generarExpediente(respuesta.companyUser.id),
          paso: '1',
          linea: 'Desarrollo de Software',
          descripcion: 'Solicitud de PPP',
          estado: false,
        };

        this.requestService.create(requestDto).subscribe({
          next: () => {
            alert('Registro completado correctamente');
            this.router.navigate(['/dashboard/register-ppp']);
          },
          error: (e) => console.error('Error creando solicitud', e),
        });
      },
      error: (e) => console.error('Error en registerUserAndCompany', e),
    });
  }

  anterior() {
    this.paso--;
  }
}
