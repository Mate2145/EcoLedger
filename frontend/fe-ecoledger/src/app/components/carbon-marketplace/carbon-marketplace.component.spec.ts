import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarbonMarketplaceComponent } from './carbon-marketplace.component';

describe('CarbonMarketplaceComponent', () => {
  let component: CarbonMarketplaceComponent;
  let fixture: ComponentFixture<CarbonMarketplaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarbonMarketplaceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CarbonMarketplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
