import { TestBed } from '@angular/core/testing';
import { MatrixTooltipComponent } from './matrix-tooltip.component';

describe('MatrixTooltipComponent', () => {
  it('should display harness name and support count', async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixTooltipComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(MatrixTooltipComponent);
    fixture.componentRef.setInput('cell', {
      harnessId: 'h1',
      harnessName: 'Harness 1',
      harnessIcon: 'h1.svg',
      supportedCount: 2,
      totalCount: 3,
      implementations: [
        { implementationId: 'i1', implementationName: 'Impl 1', platforms: ['cli'], notes: '' },
        { implementationId: 'i2', implementationName: 'Impl 2', platforms: ['cli', 'vscode'], notes: 'A note' },
      ],
    });
    fixture.componentRef.setInput('featureName', 'Tools');
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Harness 1');
    expect(text).toContain('2 / 3');
    expect(text).toContain('Impl 1');
    expect(text).toContain('A note');
  });

  it('should show "Not supported" when supportedCount is 0', async () => {
    await TestBed.configureTestingModule({
      imports: [MatrixTooltipComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(MatrixTooltipComponent);
    fixture.componentRef.setInput('cell', {
      harnessId: 'h1',
      harnessName: 'Harness 1',
      harnessIcon: 'h1.svg',
      supportedCount: 0,
      totalCount: 3,
      implementations: [],
    });
    fixture.componentRef.setInput('featureName', 'Tools');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Not supported');
  });
});
