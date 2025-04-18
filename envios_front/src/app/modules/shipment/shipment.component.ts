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

  private calculating = false
  private isCalculating = false;

  originSearchControl = new FormControl('');
  destinationSearchControl = new FormControl('');

  filteredOriginCities: {value: string, text: string}[] = [];
  filteredDestinationCities: {value: string, text: string}[] = [];
  showOriginDropdown = false;
  showDestinationDropdown = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.shipmentForm = this.fb.group({
      ciudad_origen: ['', Validators.required],
      direccion_origen: ['', Validators.required], // Nuevo campo unificado
      ciudad_destino: ['', Validators.required],
      direccion_destino: ['', Validators.required],
      costo: ['', Validators.required],
      packages: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.filteredOriginCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];

    // Escuchar cambios en los controles de búsqueda

    this.originSearchControl.valueChanges.subscribe(() => this.filterOriginCities());
/*     this.shipmentForm.valueChanges.subscribe(() => {
      if (this.shipmentForm.valid && !this.calculating) {
        this.calculateCost();
      }
    }); */
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
  calculateCost() {
    const originCity = this.shipmentForm.get('ciudad_origen')?.value;
    const destinationCity = this.shipmentForm.get('ciudad_destino')?.value;
    const packages = this.shipmentForm.get('packages') as FormArray;
    
    let baseCost = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    let totalUnits = 0;
  
    packages.controls.forEach(pkg => {
      const units = pkg.get('unidades')?.value || 1; // Si no hay unidades, asumir 1
      totalWeight += (pkg.get('peso')?.value || 0) * units;
      totalVolume += ((pkg.get('largo')?.value || 0) * 
                     (pkg.get('alto')?.value || 0) * 
                     (pkg.get('ancho')?.value || 0)) / 1000000 * units;
      totalUnits += units;
    });
  
    // 1. Misma ciudad
    if (originCity === destinationCity) {
      baseCost = 9500;
    } 
    // 2. Paquete pequeño (hasta 10kg y volumen pequeño)
    else if (totalWeight <= 10 && totalVolume <= 0.09) {
      baseCost = 9500;
    }
    // 3. Paquetes más grandes
    else {
      baseCost = 9500;
      
      // Por cada 10kg adicionales (redondeando hacia arriba)
      if (totalWeight > 10) {
        const additionalWeightBlocks = Math.ceil((totalWeight - 10) / 10);
        baseCost += additionalWeightBlocks * 10000;
      }
      
      // Por volumen grande
      if (totalVolume > 0.09) {
        baseCost += 5000;
      }
      
      // Costo adicional por múltiples unidades
      if (totalUnits > 1) {
        baseCost += (totalUnits - 1) * 2000; // 2000 adicionales por unidad extra
      }
    }
  
    // Actualizar el campo sin disparar eventos
    this.shipmentForm.get('costo')?.setValue(baseCost, {emitEvent: false});
    console.log('Costo calculado:', {
      base: baseCost,
      weight: totalWeight,
      volume: totalVolume,
      units: totalUnits
    });
  }
}