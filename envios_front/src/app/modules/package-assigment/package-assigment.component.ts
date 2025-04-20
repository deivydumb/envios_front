import { Component, EventEmitter, Output } from '@angular/core';
import { JourneyService } from '../../core/services/journey/journey.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { PackageService } from '../../core/services/package/package.service';



@Component({
  selector: 'app-package-assigment',
  standalone: true,
  imports: [FormsModule, CommonModule, NgIf],
  templateUrl: './package-assigment.component.html',
  styleUrl: './package-assigment.component.css'
})
export class PackageAssigmentComponent {
  @Output() rutaCambiada = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  rutasDisponibles: any[] = [];
  rutaSeleccionada: any = null;
  cargandoRutas: boolean = true;
  errorCarga: boolean = false;
  paquetes: any[] = [];
  cargando: boolean = true;
  todosSeleccionados: boolean = false;
  paquetesUpdate: any[] = [];
  paquetesSeleccionados: any[] = [];
  constructor(private journeyService: JourneyService, private packageService: PackageService) { } 
  ngOnInit(): void {
    this.cargarRutasDisponibles();
    this.cargarPaquetesEnEspera();

  }


  cargarRutasDisponibles(): void {
    this.cargandoRutas = true;
    this.errorCarga = false;
    
    this.journeyService.getJourneyAll().subscribe({
      next: (rutas) => {
        this.rutasDisponibles = rutas.data;
        this.cargandoRutas = false;
        console.log('Rutas disponibles:', this.rutasDisponibles);
      },
      error: (error) => {
        console.error('Error al cargar rutas:', error);
        this.errorCarga = true;
        this.cargandoRutas = false;
      }
    });
  }

  onRutaChange(): void {
    if (this.rutaSeleccionada) {
      this.rutaCambiada.emit(this.rutaSeleccionada);
    }
  }

  reintentarCarga(): void {
    this.cargarRutasDisponibles();
  }

  cargarPaquetesEnEspera(): void {
    this.cargando = true;
    this.packageService.getPackagesOnHold().subscribe({
      next: (data) => {
        console.log('Paquete:', data);
        this.paquetesUpdate = data.data;
        this.paquetes = data.data.map((paquete: any) => ({
          
          id: paquete.id,
          guia: paquete.shipment.codigo_seguimiento,
          fecha: paquete.shipment.fecha_envio,
          tipo: paquete.tipo,
          descripcion: paquete.descripcion,
          peso : paquete.peso,
          origen: {
            nombre: paquete.shipment.ciudad_origen,
            direccion: paquete.shipment.direccion_origen,
          },
          destino: {
            nombre: paquete.shipment.ciudad_destino,
            direccion: paquete.shipment.direccion_destino,
          },
          direccion: {
            calle: paquete.shipment.direccion_destino,
            ciudad: paquete.shipment.ciudad_destino
          },
          seleccionado: false
        }));
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar paquetes:', error);
        this.cargando = false;
      }
    });
  }

  toggleSeleccionTodos(): void {
    this.paquetes.forEach(p => p.seleccionado = this.todosSeleccionados);
    this.actualizarListaSeleccionados();
  }

  actualizarSeleccion(paquete: any): void {
    this.todosSeleccionados = this.paquetes.every(p => p.seleccionado);
    this.actualizarListaSeleccionados();
  }

  actualizarListaSeleccionados(): void {
    this.paquetesSeleccionados = this.paquetes.filter(p => p.seleccionado);
  }

  estaSeleccionado(guia: string): boolean {
    return this.paquetesSeleccionados.some(p => p.guia === guia);
  }


  getClasePrioridad(prioridad: string): any {
    const clases: {[key: string]: string} = {
      'Normal': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800',
      'Alta': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800',
      'Urgente': 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    };
    return clases[prioridad] || clases['Normal'];
  }

  asignarPaquetes(): void {
    if (this.paquetesSeleccionados.length === 0) return;
    
    const packageIds = this.paquetesSeleccionados.map(p => p.id);
    const journeyId = this.rutaSeleccionada.id;
    const paquetesEncontrados = this.paquetesSeleccionados.filter(p => packageIds.includes(p.id));
    this.packageService.updateMultiplePackages(packageIds, journeyId, 'transito').subscribe({
      next: (response) => {
        console.log('Paquetes actualizados:', response);
        this.update.emit()

      },
      error: (error) => {
        console.error('Error al actualizar paquetes:', error);
      }
    });
  }

}


