import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageStatusComponent } from './package-status.component';

describe('PackageStatusComponent', () => {
  let component: PackageStatusComponent;
  let fixture: ComponentFixture<PackageStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageStatusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackageStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
