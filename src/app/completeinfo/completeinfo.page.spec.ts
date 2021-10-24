import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompleteinfoPage } from './completeinfo.page';

describe('CompleteinfoPage', () => {
  let component: CompleteinfoPage;
  let fixture: ComponentFixture<CompleteinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompleteinfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompleteinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
