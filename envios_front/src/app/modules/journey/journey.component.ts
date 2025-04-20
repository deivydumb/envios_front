import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators,FormArray } from '@angular/forms';
import cities from '../../../assets/data/cities.json';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { JourneyService } from '../../core/services/journey/journey.service';

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
  @Output() element = new EventEmitter<void>();

  journeyForm: FormGroup;
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
    private router: Router,
    private journeyService: JourneyService
  ) {
    this.journeyForm = this.fb.group({
      transportista: this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        identificacion: ['', [Validators.required, Validators.pattern(/^[0-9]{10,13}$/)]],
        telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ['', [Validators.required, Validators.email]],
        empresa: ['', Validators.required],
        licencia_transporte: ['', [Validators.required, Validators.minLength(5)]]
      }),
      vehiculo: this.fb.group({
        placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}-[0-9]{3,4}$/)]],
        marca: ['', Validators.required],
        modelo: ['', Validators.required],
        capacidad: ['', [Validators.required, Validators.min(100), Validators.max(50000)]]
      }),
      envio: this.fb.group({
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
    this.journeyForm.updateValueAndValidity();
    this.cd.detectChanges();
  }

  filterOriginCities() {
    const searchText = this.originSearchControl.value?.toLowerCase() || '';
    this.filteredOriginCities = this.cities.filter(city => 
      city.text.toLowerCase().includes(searchText)
    );
  }

  selectOriginCity(city: {value: string, text: string}) {
    this.journeyForm.get('envio.origen')?.setValue(city.value);
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
      const originValue = this.journeyForm.get('envio.origen')?.value;
      if (originValue && !this.cities.some(c => c.value === originValue)) {
        this.journeyForm.get('envio.origen')?.setValue('');
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
    this.journeyForm.get('envio.destino')?.setValue(city.value);
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
      const destinationValue = this.journeyForm.get('envio.destino')?.value;
      if (destinationValue && !this.cities.some(c => c.value === destinationValue)) {
        this.journeyForm.get('envio.destino')?.setValue('');
        this.destinationSearchControl.setValue('');
      }
    }, 200);
  }
  private getCityName(cityValue: string): string {
    const city = this.cities.find(c => c.value === cityValue);
    return city ? city.text : '';
  }

  private markAllAsTouched(formGroup: FormGroup | FormGroup[]) {
    const groups = Array.isArray(formGroup) ? formGroup : [formGroup];
    
    groups.forEach(group => {
      Object.values(group.controls).forEach(control => {
        if (control instanceof FormControl) {
          control.markAsTouched({ onlySelf: true });
        } else if (control instanceof FormGroup) {
          this.markAllAsTouched(control);
        } else if (control instanceof FormArray) {
          control.controls.forEach(subGroup => {
            if (subGroup instanceof FormGroup) {
              this.markAllAsTouched(subGroup);
            }
          });
        }
      });
    });
  }

  onSubmit() {
    this.showLoading = true
    this.markAllAsTouched(this.journeyForm);
    console.log(this.journeyForm.value);
    if (this.journeyForm.valid) {
      const formData = {
        transportista: this.journeyForm.value.transportista,
        vehiculo: this.journeyForm.value.vehiculo,
        envio: {
          ...this.journeyForm.value.envio,
          origen_nombre: this.getCityName(this.journeyForm.value.envio.origen),
          destino_nombre: this.getCityName(this.journeyForm.value.envio.destino)
        }
      };

      this.journeyService.createCompleteJourney(formData).subscribe({
        next: (response) => {
          this.journeyForm.reset();
          setTimeout(() => {
            sessionStorage.setItem('bandera', "true");
            this.element.emit()
            console.log("Hecho", response);
            this.showLoading = false;
          }, 3000);
        }, 
        error: (error) => {
          console.error('Error al enviar el formulario:', error);
        }
      });
    } else {
      console.log('Formulario inválido, corrija los errores');
    }
    setTimeout(() => {

    this.element.emit();
    }, 5000);
  }
}