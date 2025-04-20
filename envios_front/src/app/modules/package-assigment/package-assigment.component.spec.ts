import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageAssigmentComponent } from './package-assigment.component';

describe('PackageAssigmentComponent', () => {
  let component: PackageAssigmentComponent;
  let fixture: ComponentFixture<PackageAssigmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageAssigmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageAssigmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
