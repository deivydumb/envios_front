import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import cities from '../../../assets/data/cities.json';

@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {
  shipmentForm: FormGroup;
  cities: {value: string, text: string}[] = cities;

  // Controles para los autocompletes
  originSearchControl = new FormControl('');
  destinationSearchControl = new FormControl('');

  filteredOriginCities: {value: string, text: string}[] = [];
  filteredDestinationCities: {value: string, text: string}[] = [];
  showOriginDropdown = false;
  showDestinationDropdown = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.shipmentForm = this.fb.group({
      codigo_seguimiento: ['', Validators.required],
      fecha_entrega_estimada: ['', Validators.required],
      estado: ['preparacion', Validators.required],
      costo: [0, Validators.required],
      ciudad_origen: ['', Validators.required],
      direccion_origen: ['', Validators.required],
      ciudad_destino: ['', Validators.required],
      direccion_destino: ['', Validators.required],
      userId: [null, Validators.required],
      packages: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.filteredOriginCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];

    // Escuchar cambios en los controles de búsqueda
    this.originSearchControl.valueChanges.subscribe(() => this.filterOriginCities());
    this.destinationSearchControl.valueChanges.subscribe(() => this.filterDestinationCities());
  }

  get packages(): FormArray {
    return this.shipmentForm.get('packages') as FormArray;
  }

  addPackage(): void {
    const pkg = this.fb.group({
      tipo: [''],
      descripcion: [''],
      peso: [0, Validators.required],
      largo: [0, Validators.required],
      alto: [0],
      ancho: [0],
      unidades: [1, Validators.required],
    });
    this.packages.push(pkg);
  }

  removePackage(index: number): void {
    this.packages.removeAt(index);
  }

  // Métodos para el autocomplete de origen
  filterOriginCities() {
    const searchText = this.originSearchControl.value?.toLowerCase() || '';
    this.filteredOriginCities = this.cities.filter(city => 
      city.text.toLowerCase().includes(searchText)
    );
  }

  selectOriginCity(city: {value: string, text: string}) {
    this.shipmentForm.patchValue({
      ciudad_origen: city.value
    });
    this.originSearchControl.setValue(city.text);
    this.showOriginDropdown = false;
  }

  toggleOriginDropdown() {
    this.showOriginDropdown = !this.showOriginDropdown;
    if (this.showOriginDropdown) {
      this.filterOriginCities();
    }
  }

  handleOriginFocus() {
    this.showOriginDropdown = true;
    this.filterOriginCities();
  }

  handleOriginBlur() {
    setTimeout(() => {
      this.showOriginDropdown = false;
      const originValue = this.shipmentForm.get('ciudad_origen')?.value;
      if (originValue && !this.cities.some(c => c.value === originValue)) {
        this.shipmentForm.get('ciudad_origen')?.setValue('');
        this.originSearchControl.setValue('');
      }
    }, 200);
  }

  // Métodos para el autocomplete de destino
  filterDestinationCities() {
    const searchText = this.destinationSearchControl.value?.toLowerCase() || '';
    this.filteredDestinationCities = this.cities.filter(city => 
      city.text.toLowerCase().includes(searchText)
    );
  }

  selectDestinationCity(city: {value: string, text: string}) {
    this.shipmentForm.patchValue({
      ciudad_destino: city.value
    });
    this.destinationSearchControl.setValue(city.text);
    this.showDestinationDropdown = false;
  }

  toggleDestinationDropdown() {
    this.showDestinationDropdown = !this.showDestinationDropdown;
    if (this.showDestinationDropdown) {
      this.filterDestinationCities();
    }
  }

  handleDestinationFocus() {
    this.showDestinationDropdown = true;
    this.filterDestinationCities();
  }

  handleDestinationBlur() {
    setTimeout(() => {
      this.showDestinationDropdown = false;
      const destinationValue = this.shipmentForm.get('ciudad_destino')?.value;
      if (destinationValue && !this.cities.some(c => c.value === destinationValue)) {
        this.shipmentForm.get('ciudad_destino')?.setValue('');
        this.destinationSearchControl.setValue('');
      }
    }, 200);
  }

  onSubmit(): void {
    if (this.shipmentForm.valid) {
      console.log('Formulario válido:', this.shipmentForm.value);
      // Aquí iría la llamada HTTP para guardar el envío
    } else {
      this.shipmentForm.markAllAsTouched();
    }
  }
}