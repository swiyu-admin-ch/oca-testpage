import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VcPreviewComponent } from './vc-preview.component';

describe('VcPreviewComponent', () => {
  let component: VcPreviewComponent;
  let fixture: ComponentFixture<VcPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VcPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VcPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
