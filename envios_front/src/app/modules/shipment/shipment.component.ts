import { Component,  Output, EventEmitter, OnInit,  ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import cities from '../../../assets/data/cities.json';
import { ShipmentService } from '../../core/services/shipment/shipment.service';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notifications/notifications.service';


@Component({
  selector: 'app-shipment',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shipment.component.html',
  styleUrls: ['./shipment.component.css']
})
export class ShipmentComponent implements OnInit {

  @Output() notify = new EventEmitter<void>();
  @ViewChild('termsModal') termsModal!: ElementRef;
  shipmentForm: FormGroup;
  cities: {value: string, text: string}[] = cities;
  showLoading: boolean = false;
  originSearchControl = new FormControl('');
  destinationSearchControl = new FormControl('');

  filteredOriginCities: {value: string, text: string}[] = [];
  filteredDestinationCities: {value: string, text: string}[] = [];
  showOriginDropdown = false;
  showDestinationDropdown = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private readonly shipmentService: ShipmentService, private cd: ChangeDetectorRef, 
    private router: Router, private notificationService: NotificationService) {

    this.shipmentForm = this.fb.group({
      ciudad_origen: ['', Validators.required],
      direccion_origen: ['', [Validators.required, Validators.minLength(3)]],
      ciudad_destino: ['', Validators.required],
      direccion_destino: ['', [Validators.required, Validators.minLength(3)]],
      costo: [0],
      packages: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.filteredOriginCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];

    this.originSearchControl.valueChanges.subscribe(() => this.filterOriginCities());
  
  }
  updateFormState() {
    this.shipmentForm.updateValueAndValidity();
    this.cd.detectChanges();
    this.cd.markForCheck();
  }

  get packages(): FormArray {
    return this.shipmentForm.get('packages') as FormArray;
  }

  addPackage() {
    const packageGroup = this.fb.group({
      tipo: ['', Validators.required],
      descripcion: [''],
      peso: [0, [Validators.required, Validators.min(0.1)]],
      largo: [0, [Validators.required, Validators.min(1)]],
      alto: [0, [Validators.required, Validators.min(1)]],
      ancho: [0, [Validators.required, Validators.min(1)]],
      unidades: [1, [Validators.required, Validators.min(1)]]
    });
    
    this.packages.push(packageGroup);
    this.updateFormState();
  }

  removePackage(index: number): void {
    this.updateFormState();
  }

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
    this.showLoading = true;
    if (this.shipmentForm.invalid) {
      this.shipmentForm.markAllAsTouched(); 
      return;
    }
    if (this.shipmentForm.valid) {
      this.shipmentService.createShipment(this.shipmentForm.value).then((response: any) => {
        sessionStorage.setItem('bandera', "true");
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 4000);
      }).catch((error: any) => {
        console.error("Error al crear envío", error);
      });
    } else {
      this.shipmentForm.markAllAsTouched();
    }
  }
  calculateCost() {
    this.updateFormState();
    const originCity = this.shipmentForm.get('ciudad_origen')?.value;
    const destinationCity = this.shipmentForm.get('ciudad_destino')?.value;
    const packages = this.shipmentForm.get('packages') as FormArray;
    
    let baseCost = 0;
    let totalWeight = 0;
    let totalVolume = 0;
    let totalUnits = 0;
  
    packages.controls.forEach(pkg => {
      const units = pkg.get('unidades')?.value || 1;
      totalWeight += (pkg.get('peso')?.value || 0) * units;
      totalVolume += ((pkg.get('largo')?.value || 0) * 
                     (pkg.get('alto')?.value || 0) * 
                     (pkg.get('ancho')?.value || 0)) / 1000000 * units;
      totalUnits += units;
    });
    if (originCity === destinationCity) {
      baseCost = 9500;
    } 
    else if (totalWeight <= 10 && totalVolume <= 0.09) {
      baseCost = 9500;
    }
    else {
      baseCost = 9500;
      if (totalWeight > 10) {
        const additionalWeightBlocks = Math.ceil((totalWeight - 10) / 10);
        baseCost += additionalWeightBlocks * 10000;
      }
      if (totalVolume > 0.09) {
        baseCost += 5000;
      }
      
      if (totalUnits > 1) {
        baseCost += (totalUnits - 1) * 2000;
      }
    }
  
    this.shipmentForm.get('costo')?.setValue(baseCost, {emitEvent: false});
    this.updateFormState();
  }
}