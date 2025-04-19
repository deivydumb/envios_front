import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import cities from '../../../assets/data/cities.json';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.css'
})
export class JourneyComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient, 
    private cd: ChangeDetectorRef,
    private router: Router
  ) {
    this.shipmentForm = this.fb.group({
      transportista: this.fb.group({
        nombre: ['', Validators.required],
        identificacion: ['', Validators.required],
        telefono: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        empresa: ['', Validators.required],
        licencia_transporte: ['', Validators.required]
      }),
      vehiculo: this.fb.group({
        placa: ['', Validators.required],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        capacidad: ['', [Validators.required, Validators.min(1)]]
      }),
      journey: this.fb.group({
        fecha_fin_estimada: ['', Validators.required],
        origen: ['', Validators.required],
        destino: ['', Validators.required]
      })
    });

    this.filteredOriginCities = [...this.cities];
    this.filteredDestinationCities = [...this.cities];
  }

  ngOnInit(): void {
    this.originSearchControl.valueChanges.subscribe(() => this.filterOriginCities());
    this.destinationSearchControl.valueChanges.subscribe(() => this.filterDestinationCities());
  }

  updateFormState() {
    this.shipmentForm.updateValueAndValidity();
    this.cd.detectChanges();
  }

  filterOriginCities() {
    const searchText = this.originSearchControl.value?.toLowerCase() || '';
    this.filteredOriginCities = this.cities.filter(city => 
      city.text.toLowerCase().includes(searchText)
    );
  }

  selectOriginCity(city: {value: string, text: string}) {
    this.shipmentForm.get('journey.origen')?.setValue(city.value);
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
      const originValue = this.shipmentForm.get('journey.origen')?.value;
      if (originValue && !this.cities.some(c => c.value === originValue)) {
        this.shipmentForm.get('journey.origen')?.setValue('');
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
    this.shipmentForm.get('journey.destino')?.setValue(city.value);
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
      const destinationValue = this.shipmentForm.get('journey.destino')?.value;
      if (destinationValue && !this.cities.some(c => c.value === destinationValue)) {
        this.shipmentForm.get('journey.destino')?.setValue('');
        this.destinationSearchControl.setValue('');
      }
    }, 200);
  }
}